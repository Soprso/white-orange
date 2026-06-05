import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ParticleExperience from "./ParticleExperience";
import Contact from "./Contact";
import skills from "../data/skills";

gsap.registerPlugin(ScrollTrigger);

export default function AboutAndSkills() {
  const sectionRef = useRef(null);
  const scrollProgress = useRef(0);

  useGSAP(
    () => {
      // -----------------------------------------------------------------------
      // 1. Initial DOM States
      // -----------------------------------------------------------------------

      // About Text
      gsap.set(".about-statement-0, .about-statement-1, .about-statement-2", {
        opacity: 0,
        yPercent: 30,
      });
      gsap.set(".about-closing-line-1, .about-closing-line-2", {
        yPercent: 110,
      });
      gsap.set(".about-section-label", { opacity: 0, y: 12 });

      // Skills Text
      gsap.set(".skills-title-line-1, .skills-title-line-2", {
        yPercent: 110,
      });
      skills.forEach((_, i) => {
        gsap.set(`.skill-card-${i}`, { opacity: 0, yPercent: 20 });
      });
      gsap.set(".skills-chapter-label", { opacity: 0, y: 12 });

      // Contact Text
      gsap.set(".contact-overlay", { autoAlpha: 0 });
      gsap.set(".contact-line", { yPercent: 110 });
      gsap.set(".contact-link", { opacity: 0, y: 20 });
      gsap.set(".contact-closing", { opacity: 0 });

      // -----------------------------------------------------------------------
      // 2. Pin the unified section for 2500vh
      //    (600vh About + 1400vh Skills + 500vh Contact)
      // -----------------------------------------------------------------------
      const totalScroll = "+=2500%";

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: totalScroll,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      // -----------------------------------------------------------------------
      // 3. Master unified timeline (0.0 to 1.0)
      // -----------------------------------------------------------------------
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: totalScroll,
          scrub: 0.8,
        },
      });

      // === ABOUT SEQUENCE (0.0 to 0.3) ===
      
      const pAboutStart = 0.05; // Wait for project card to scale down

      // Statement 0 (Noise)
      masterTl.to(".about-statement-0", { yPercent: 0, opacity: 1, ease: "power3.out", duration: 0.02 }, 0.10)
              .to(".about-statement-0", { yPercent: -30, opacity: 0, ease: "power2.in", duration: 0.02 }, 0.135);

      // Statement 1 (Sine)
      masterTl.to(".about-statement-1", { yPercent: 0, opacity: 1, ease: "power3.out", duration: 0.02 }, 0.15)
              .to(".about-statement-1", { yPercent: -30, opacity: 0, ease: "power2.in", duration: 0.02 }, 0.185);

      // Statement 2 (Grid)
      masterTl.to(".about-statement-2", { yPercent: 0, opacity: 1, ease: "power3.out", duration: 0.02 }, 0.20)
              .to(".about-statement-2", { yPercent: -30, opacity: 0, ease: "power2.in", duration: 0.02 }, 0.23);

      // Closing headline
      masterTl.to(".about-closing-line-1", { yPercent: 0, ease: "power4.out", duration: 0.015 }, 0.235)
              .to(".about-closing-line-2", { yPercent: 0, ease: "power4.out", duration: 0.015 }, 0.24);

      // About section label
      masterTl.to(".about-section-label", { opacity: 1, y: 0, ease: "power2.out", duration: 0.02 }, 0.10)
              .to(".about-section-label", { opacity: 0, duration: 0.01 }, 0.23);

      // About state indicator dots
      masterTl.to(".about-state-dot--noise", { background: "#e4e4e7", duration: 0.005 }, 0.10)
              .to(".about-state-dot--noise", { background: "#3f3f46", duration: 0.01 }, 0.145)
              .to(".about-state-dot--sine", { background: "#e4e4e7", duration: 0.005 }, 0.15)
              .to(".about-state-dot--sine", { background: "#3f3f46", duration: 0.01 }, 0.195)
              .to(".about-state-dot--grid", { background: "#e4e4e7", duration: 0.005 }, 0.20);

      // Fade out About closing text completely before Skills starts
      masterTl.to(".about-closing-line-1, .about-closing-line-2", {
        opacity: 0,
        yPercent: -20,
        ease: "power2.in",
        duration: 0.02,
      }, 0.27);


      // === SKILLS SEQUENCE (0.3 to 1.0) ===

      // Phase 1: Skills Title Reveal
      masterTl.to(".skills-title-line-1", { yPercent: 0, ease: "power4.out", duration: 0.01 }, 0.30)
              .to(".skills-title-line-2", { yPercent: 0, ease: "power4.out", duration: 0.01 }, 0.305)
              .to(".skills-title-line-1", { yPercent: -30, opacity: 0, ease: "power2.in", duration: 0.01 }, 0.32)
              .to(".skills-title-line-2", { yPercent: -30, opacity: 0, ease: "power2.in", duration: 0.01 }, 0.32);

      // Phase 2: Skills Chapter Label
      masterTl.to(".skills-chapter-label", { opacity: 1, y: 0, ease: "power2.out", duration: 0.01 }, 0.32);

      // Phase 3: Skill Chapters loop
      const skillStart = 0.33;
      const skillEnd = 0.85;
      const perSkill = (skillEnd - skillStart) / skills.length;

      skills.forEach((skill, i) => {
        const start = skillStart + i * perSkill;
        const holdEnd = start + perSkill * 0.75;

        masterTl.to(`.skill-card-${i}`, { opacity: 1, yPercent: 0, ease: "power3.out", duration: perSkill * 0.15 }, start)
                .to(`.skill-card-${i}`, { opacity: 0, yPercent: -15, ease: "power2.in", duration: perSkill * 0.2 }, holdEnd);
      });

      // Update chapter text via onUpdate
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: totalScroll,
        onUpdate: (self) => {
          const p = self.progress;
          if (p >= skillStart && p < skillEnd) {
            const idx = Math.min(
              Math.floor(((p - skillStart) / (skillEnd - skillStart)) * skills.length),
              skills.length - 1
            );
            const labelEl = document.querySelector(".skills-chapter-label");
            if (labelEl) {
              labelEl.textContent = `Chapter ${skills[idx].chapter}`;
            }
          }
        },
      });

      // Phase 4: Skills Exit
      masterTl.to(".skills-chapter-label", { opacity: 0, duration: 0.01 }, 0.85);

      // === CONTACT SEQUENCE (0.88 to 1.0) ===
      
      const pContactStart = 0.88;
      
      // Fade in contact overlay
      masterTl.to(".contact-overlay", { autoAlpha: 1, ease: "power2.inOut", duration: 0.03 }, pContactStart);
      
      // Main typography staggered reveal
      masterTl.to(".contact-line", {
        yPercent: 0,
        stagger: 0.01,
        ease: "power4.out",
        duration: 0.04
      }, pContactStart + 0.02);
      
      // Action links reveal
      masterTl.to(".contact-link", {
        opacity: 1,
        y: 0,
        stagger: 0.01,
        ease: "power3.out",
        duration: 0.03
      }, pContactStart + 0.05);
      
      // Closing copyright
      masterTl.to(".contact-closing", {
        opacity: 1,
        ease: "power2.out",
        duration: 0.02
      }, pContactStart + 0.08);

    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="about-skills" className="about-skills-section">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Unified R3F Canvas                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="canvas-wrapper">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 55 }}
          dpr={Math.min(window.devicePixelRatio, 1.5)}
          gl={{ antialias: true, alpha: true }}
        >
          <ParticleExperience progress={scrollProgress} />
        </Canvas>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. About DOM Layer                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="about-text-overlay">
        {/* Section Label */}
        <div className="about-section-label">
          <span>01</span>
          <span className="about-section-label-slash"> / </span>
          <span>PHILOSOPHY</span>
        </div>

        {/* State Indicators */}
        <div className="about-state-indicators">
          <div className="about-state-dot about-state-dot--noise" />
          <div className="about-state-dot about-state-dot--sine" />
          <div className="about-state-dot about-state-dot--grid" />
        </div>

        {/* Central Statements */}
        <div className="about-statements-container">
          <div className="about-statement about-statement-0">
            <h3>I WRITE CODE</h3>
            <h3 className="about-statement-bold">THAT THINKS</h3>
            <h3 className="about-statement-italic">in motion.</h3>
          </div>
          <div className="about-statement about-statement-1">
            <h3>INTERFACES</h3>
            <h3 className="about-statement-bold">SHOULD FEEL</h3>
            <h3 className="about-statement-italic">like logic.</h3>
          </div>
          <div className="about-statement about-statement-2">
            <h3>DESIGN</h3>
            <h3 className="about-statement-bold">IS JUST</h3>
            <h3 className="about-statement-italic">systems.</h3>
          </div>
        </div>

        {/* Closing Headline */}
        <div className="about-closing-wrap">
          <div className="about-closing-mask">
            <div className="about-closing-line about-closing-line-1">BUILT WITH</div>
          </div>
          <div className="about-closing-mask">
            <div className="about-closing-line about-closing-line-2 about-closing-italic">
              intention.
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Skills DOM Layer                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="skills-text-overlay">
        {/* Chapter label — top left, below section label space */}
        <div className="skills-chapter-label">Chapter 01</div>

        {/* "TOOLS OF THE CRAFT" heading */}
        <div className="skills-title-wrap">
          <div className="skills-title-mask">
            <div className="skills-title skills-title-line-1">TOOLS OF</div>
          </div>
          <div className="skills-title-mask">
            <div className="skills-title skills-title--italic skills-title-line-2">
              the Craft
            </div>
          </div>
        </div>

        {/* Skill cards — absolutely stacked */}
        <div className="skills-cards-container">
          {skills.map((skill) => (
            <div key={skill.id} className={`skill-card skill-card-${skill.id}`}>
              <p className="skill-chapter-number">{skill.chapter}</p>
              <h2 className="skill-name">{skill.name}</h2>
              <p className="skill-purpose">{skill.purpose}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* ------------------------------------------------------------------ */}
      {/* 4. Contact DOM Layer                                                */}
      {/* ------------------------------------------------------------------ */}
      <Contact />
      
    </section>
  );
}
