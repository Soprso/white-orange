// ---------------------------------------------------------------------------
// textToPoints — converts a text string into a Float32Array of 3D positions
//
// Uses an offscreen <canvas> to rasterize the text, then samples filled pixels
// to produce target positions for particle morphing.
// ---------------------------------------------------------------------------

/**
 * @param {string}  text           The text to rasterize (e.g. "REACT")
 * @param {number}  particleCount  How many points to sample
 * @param {Object}  [opts]
 * @param {number}  [opts.canvasWidth=800]   Rasterization resolution
 * @param {number}  [opts.canvasHeight=200]  Rasterization resolution
 * @param {string}  [opts.font]              CSS font string
 * @param {number}  [opts.worldWidth=5.0]    Width in Three.js units
 * @param {number}  [opts.depthSpread=0.08]  Random Z offset range
 * @returns {Float32Array}  length = particleCount * 3
 */
export default function textToPoints(text, particleCount, opts = {}) {
  const {
    canvasWidth = 800,
    canvasHeight = 200,
    font: fontOverride,
    worldWidth = 5.0,
    depthSpread = 0.08,
  } = opts;

  // --- Auto-scale font size based on text length ---
  // Short names (<=4 chars) get full 140px, longer names scale down
  // to ensure they fit within the canvas without clipping
  let fontSize;
  if (text.length <= 3) {
    fontSize = 140;
  } else if (text.length <= 5) {
    fontSize = 120;
  } else if (text.length <= 7) {
    fontSize = 100;
  } else if (text.length <= 9) {
    fontSize = 80;
  } else {
    fontSize = 64;
  }

  const font = fontOverride || `900 ${fontSize}px "GeneralSans", Arial, sans-serif`;

  // --- 1. Rasterize text onto an offscreen canvas ---
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#fff";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  // --- 2. Extract filled pixel coordinates ---
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const pixels = imageData.data;
  const candidates = [];

  // Sample every pixel for maximum density and sharp text
  for (let y = 0; y < canvasHeight; y += 1) {
    for (let x = 0; x < canvasWidth; x += 1) {
      const idx = (y * canvasWidth + x) * 4;
      // Check red channel — white text on black background
      if (pixels[idx] > 128) {
        candidates.push([x, y]);
      }
    }
  }

  // --- 3. Sample particleCount points from candidates ---
  const positions = new Float32Array(particleCount * 3);

  if (candidates.length === 0) {
    // Fallback: if text produced no pixels (shouldn't happen), scatter randomly
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * worldWidth;
      positions[i * 3 + 1] = (Math.random() - 0.5) * worldWidth * 0.25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * depthSpread;
    }
    return positions;
  }

  // Aspect ratio of the rasterized text area
  const aspect = canvasWidth / canvasHeight;
  const worldHeight = worldWidth / aspect;

  // Shuffle candidates first so distribution is even when count > candidates
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (let i = 0; i < particleCount; i++) {
    const [px, py] = candidates[i % candidates.length];

    // Tiny sub-pixel jitter for particles that re-use the same candidate
    // This prevents z-fighting and gives a subtle density variation
    const jitterX = i < candidates.length ? 0 : (Math.random() - 0.5) * 0.003;
    const jitterY = i < candidates.length ? 0 : (Math.random() - 0.5) * 0.003;

    // Normalize pixel coords to [-0.5, 0.5], then scale to world units
    const nx = (px / canvasWidth - 0.5) * worldWidth + jitterX;
    const ny = -(py / canvasHeight - 0.5) * worldHeight + jitterY;

    // Very small random Z for depth
    const nz = (Math.random() - 0.5) * depthSpread * 2;

    positions[i * 3]     = nx;
    positions[i * 3 + 1] = ny;
    positions[i * 3 + 2] = nz;
  }

  // --- 4. Shuffle the array so particles don't morph in scanline order ---
  // Fisher-Yates on groups of 3
  for (let i = particleCount - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap positions[i] and positions[j] (each is 3 floats)
    for (let k = 0; k < 3; k++) {
      const temp = positions[i * 3 + k];
      positions[i * 3 + k] = positions[j * 3 + k];
      positions[j * 3 + k] = temp;
    }
  }

  return positions;
}
