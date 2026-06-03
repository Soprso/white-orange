import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import textToPoints from "../utils/textToPoints";
import skills from "../data/skills";

// ---------------------------------------------------------------------------
// Position generators
// ---------------------------------------------------------------------------

/** Random sphere cloud — the "noise" initial state */
function generateNoise(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2.0 + Math.random() * 1.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = radius * Math.cos(phi);
  }
  return arr;
}

/** Sine wave — the "code" midpoint state */
function generateSine(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) * 2 - 1; // -1 → 1
    const x = t * 3.2;
    const y = Math.sin(t * Math.PI * 2.5) * 1.0;
    const z = Math.sin(t * Math.PI * 5.0) * 0.25; // Lissajous-style depth
    arr[i * 3 + 0] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

/** Uniform grid — the "interface" final state */
function generateGrid(count) {
  const arr = new Float32Array(count * 3);
  const cols = Math.ceil(Math.sqrt(count * (16 / 9))); // widescreen aspect ratio
  const rows = Math.ceil(count / cols);
  const spacingX = 5.6 / (cols - 1);
  const spacingY = 3.2 / (rows - 1);
  const offsetX = -2.8;
  const offsetY = -1.6;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    arr[i * 3 + 0] = offsetX + col * spacingX;
    arr[i * 3 + 1] = offsetY + row * spacingY;
    arr[i * 3 + 2] = 0;
  }
  return arr;
}

/** Soft scatter — gentle drift state between text formations */
function generateScatter(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 1.5 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = radius * Math.cos(phi) * 0.4;
  }
  return arr;
}

function smoothstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PARTICLE_COUNT = 5000;

// Progress ranges (0.0 to 1.0 mapping to 2000vh total pinned scroll)
// 0.00 - 0.30 : About Sequence (600vh)
// 0.30 - 1.00 : Skills Sequence (1400vh)

const P_INTRO_END = 0.08;
const P_SINE_START = 0.15;
const P_GRID_START = 0.22;
const P_SCATTER_START = 0.30;
const P_SKILLS_START = 0.33;
const P_SKILLS_END = 0.85;
const P_CONTACT_START = 0.88;
const P_CONTACT_END = 1.0;

const MORPH_DURATION = 0.05; // Duration for Noise -> Sine -> Grid morphs

// Within each skill's duration:
const MORPH_IN_FRAC = 0.25;
const HOLD_FRAC = 0.50;
const MORPH_OUT_FRAC = 0.25;

export default function ParticleExperience({ progress }) {
  const attrRef = useRef(null);
  const groupRef = useRef(null);
  const materialRef = useRef(null);

  // Smoothed progress — lerps toward raw scroll to match GSAP scrub timing
  const smoothedProgress = useRef(0);
  const SCRUB_TIME = 0.8; // must match masterTl scrub value in AboutAndSkills

  // Pre-compute all states
  const noisePts = useMemo(() => generateNoise(PARTICLE_COUNT), []);
  const sinePts = useMemo(() => generateSine(PARTICLE_COUNT), []);
  const gridPts = useMemo(() => generateGrid(PARTICLE_COUNT), []);
  const scatterPts = useMemo(() => generateScatter(PARTICLE_COUNT), []);
  
  const contactPts = useMemo(() => {
    return textToPoints("YOUR NEXT PROJECT", PARTICLE_COUNT, {
      canvasWidth: 1000,
      canvasHeight: 200,
      worldWidth: 6.5,
      depthSpread: 0.05,
    });
  }, []);

  const textTargets = useMemo(() => {
    return skills.map((skill) =>
      textToPoints(skill.name, PARTICLE_COUNT, {
        canvasWidth: 800,
        canvasHeight: 200,
        worldWidth: 5.0,
        depthSpread: 0.05,
      })
    );
  }, []);

  // Live mutable buffer
  const positions = useMemo(() => new Float32Array(noisePts), [noisePts]);

  useFrame((state, delta) => {
    if (!attrRef.current || !groupRef.current) return;

    // Frame-rate-independent lerp toward raw progress — matches GSAP scrub
    const rawP = progress.current ?? 0;
    const lerpFactor = 1 - Math.exp(-delta / SCRUB_TIME);
    smoothedProgress.current += (rawP - smoothedProgress.current) * lerpFactor;
    const p = smoothedProgress.current;

    const time = state.clock.elapsedTime * 0.4;

    // Global rotation: transitions from About's turn to Skills' subtle turn
    if (p < P_SCATTER_START) {
      groupRef.current.rotation.y = time * 0.1 + p * Math.PI * 1.5;
      groupRef.current.rotation.x = p * Math.PI * 0.6;
    } else {
      const skillsP = (p - P_SCATTER_START) / (1 - P_SCATTER_START);
      // Smoothly carry over rotation and switch to slower movement
      groupRef.current.rotation.y = time * 0.05 + P_SCATTER_START * Math.PI * 1.5 + skillsP * Math.PI * 0.3;
      groupRef.current.rotation.x = P_SCATTER_START * Math.PI * 0.6 + Math.sin(time * 0.1) * 0.05;
    }

    // Intro transition
    const introProgress = THREE.MathUtils.clamp(p / P_INTRO_END, 0, 1);
    const introEase = smoothstep(introProgress);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const driftX = Math.sin(time + i * 0.7) * 0.04;
      const driftY = Math.cos(time + i * 1.3) * 0.04;
      const driftZ = Math.sin(time + i * 2.1) * 0.02;

      let finalX = noisePts[i3];
      let finalY = noisePts[i3 + 1];
      let finalZ = noisePts[i3 + 2];

      if (p < P_SINE_START) {
        // Noise phase (with strong initial drift)
        const organicDriftX = Math.sin(time + i) * 0.15;
        const organicDriftY = Math.cos(time + i * 2) * 0.15;
        const organicDriftZ = Math.sin(time + i * 3) * 0.15;
        finalX += organicDriftX;
        finalY += organicDriftY;
        finalZ += organicDriftZ;
      } else if (p < P_GRID_START) {
        // Noise -> Sine
        const organicDriftX = Math.sin(time + i) * 0.15;
        const organicDriftY = Math.cos(time + i * 2) * 0.15;
        const organicDriftZ = Math.sin(time + i * 3) * 0.15;
        const t = smoothstep((p - P_SINE_START) / MORPH_DURATION);
        finalX = (noisePts[i3] + organicDriftX) + (sinePts[i3] - (noisePts[i3] + organicDriftX)) * t;
        finalY = (noisePts[i3 + 1] + organicDriftY) + (sinePts[i3 + 1] - (noisePts[i3 + 1] + organicDriftY)) * t;
        finalZ = (noisePts[i3 + 2] + organicDriftZ) + (sinePts[i3 + 2] - (noisePts[i3 + 2] + organicDriftZ)) * t;
      } else if (p < P_SCATTER_START) {
        // Sine -> Grid
        const t = smoothstep((p - P_GRID_START) / MORPH_DURATION);
        finalX = sinePts[i3] + (gridPts[i3] - sinePts[i3]) * t;
        finalY = sinePts[i3 + 1] + (gridPts[i3 + 1] - sinePts[i3 + 1]) * t;
        finalZ = sinePts[i3 + 2] + (gridPts[i3 + 2] - sinePts[i3 + 2]) * t;
      } else if (p < P_SKILLS_START) {
        // Grid -> Scatter
        const t = smoothstep((p - P_SCATTER_START) / (P_SKILLS_START - P_SCATTER_START));
        finalX = gridPts[i3] + (scatterPts[i3] - gridPts[i3]) * t + driftX * t;
        finalY = gridPts[i3 + 1] + (scatterPts[i3 + 1] - gridPts[i3 + 1]) * t + driftY * t;
        finalZ = gridPts[i3 + 2] + (scatterPts[i3 + 2] - gridPts[i3 + 2]) * t + driftZ * t;
      } else if (p < P_SKILLS_END) {
        // Skills Text sequence
        const skillProgress = (p - P_SKILLS_START) / (P_SKILLS_END - P_SKILLS_START);
        const skillIndex = Math.min(
          Math.floor(skillProgress * skills.length),
          skills.length - 1
        );
        const skillLocalProgress = (skillProgress - (skillIndex / skills.length)) * skills.length;
        const textPts = textTargets[skillIndex];

        if (skillLocalProgress < MORPH_IN_FRAC) {
          // Scatter -> Text
          const t = smoothstep(skillLocalProgress / MORPH_IN_FRAC);
          finalX = scatterPts[i3] + (textPts[i3] - scatterPts[i3]) * t;
          finalY = scatterPts[i3 + 1] + (textPts[i3 + 1] - scatterPts[i3 + 1]) * t;
          finalZ = scatterPts[i3 + 2] + (textPts[i3 + 2] - scatterPts[i3 + 2]) * t;
        } else if (skillLocalProgress < MORPH_IN_FRAC + HOLD_FRAC) {
          // Text Hold — very tight, minimal drift
          const breathe = Math.sin(time * 2 + i * 0.5) * 0.002;
          finalX = textPts[i3] + breathe;
          finalY = textPts[i3 + 1] + driftY * 0.01;
          finalZ = textPts[i3 + 2] + driftZ * 0.03;
        } else {
          // Text -> Scatter
          const outProgress = (skillLocalProgress - MORPH_IN_FRAC - HOLD_FRAC) / MORPH_OUT_FRAC;
          const t = smoothstep(outProgress);
          finalX = textPts[i3] + (scatterPts[i3] - textPts[i3]) * t;
          finalY = textPts[i3 + 1] + (scatterPts[i3 + 1] - textPts[i3 + 1]) * t;
          finalZ = textPts[i3 + 2] + (scatterPts[i3 + 2] - textPts[i3 + 2]) * t;
        }
      } else if (p < P_CONTACT_START) {
        // Exit Scatter before Contact
        const exitT = smoothstep((p - P_SKILLS_END) / (P_CONTACT_START - P_SKILLS_END));
        const expand = 1 + exitT * 0.5;
        finalX = (scatterPts[i3] + driftX) * expand;
        finalY = (scatterPts[i3 + 1] + driftY) * expand;
        finalZ = (scatterPts[i3 + 2] + driftZ) * expand;
      } else {
        // Contact Sequence (Morph into YOUR NEXT PROJECT and hold)
        const contactProgress = (p - P_CONTACT_START) / (P_CONTACT_END - P_CONTACT_START);
        
        if (contactProgress < 0.3) {
          // Morph in
          const t = smoothstep(contactProgress / 0.3);
          finalX = scatterPts[i3] + (contactPts[i3] - scatterPts[i3]) * t;
          finalY = scatterPts[i3 + 1] + (contactPts[i3 + 1] - scatterPts[i3 + 1]) * t;
          finalZ = scatterPts[i3 + 2] + (contactPts[i3 + 2] - scatterPts[i3 + 2]) * t;
        } else {
          // Hold final state
          const breathe = Math.sin(time * 2 + i * 0.5) * 0.002;
          finalX = contactPts[i3] + breathe;
          finalY = contactPts[i3 + 1] + driftY * 0.01;
          finalZ = contactPts[i3 + 2] + driftZ * 0.03;
        }
      }

      // Initial zoom-in effect during About section intro
      if (introEase < 1 && p < P_SINE_START) {
        const spreadMultiplier = 1 + (1 - introEase) * 2.5;
        const zPush = (1 - introEase) * (3.0 + (i % 7) * 0.5);
        finalX *= spreadMultiplier;
        finalY *= spreadMultiplier;
        finalZ += zPush;
      }

      positions[i3] = finalX;
      positions[i3 + 1] = finalY;
      positions[i3 + 2] = finalZ;
    }

    attrRef.current.needsUpdate = true;
  });

  // Fade out at very end (optional, keeping visible for contact)
  useFrame(() => {
    if (!materialRef.current) return;
    materialRef.current.opacity = 0.85;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            ref={attrRef}
            attach="attributes-position"
            array={positions}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.018}
          color="#e4e4e7"
          sizeAttenuation={true}
          transparent={true}
          opacity={0.85}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
