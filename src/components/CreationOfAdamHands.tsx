import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code, 
  FileText, 
  Briefcase, 
  Sparkles, 
  Terminal, 
  Layers, 
  Cpu, 
  Network, 
  Bookmark, 
  CheckCircle2, 
  Building2 
} from "lucide-react";

interface CreationOfAdamHandsProps {
  mousePos: { x: number; y: number };
}

// Normalized skeleton points for hands (range: 0 to 100)
// Points are mapped sequentially from wrist to fingertip/base
const leftHandSkeleton = {
  wrist: [
    { x: 3, y: 70 },
    { x: 7, y: 67 },
    { x: 12, y: 64 },
    { x: 16, y: 62 }
  ],
  thumb: [
    { x: 16, y: 62 },
    { x: 21, y: 55 },
    { x: 26, y: 51 },
    { x: 29, y: 47 }
  ],
  index: [
    { x: 16, y: 62 },
    { x: 23, y: 60 },
    { x: 29, y: 59 },
    { x: 36, y: 60 },
    { x: 42, y: 61 } // Fingertip almost touching center
  ],
  middle: [
    { x: 16, y: 62 },
    { x: 23, y: 63 },
    { x: 28, y: 65 },
    { x: 32, y: 67 },
    { x: 31, y: 70 } // Curled in
  ],
  ring: [
    { x: 16, y: 62 },
    { x: 21, y: 65 },
    { x: 26, y: 68 },
    { x: 29, y: 71 },
    { x: 27, y: 74 } // Curled in
  ],
  pinky: [
    { x: 16, y: 62 },
    { x: 19, y: 67 },
    { x: 23, y: 71 },
    { x: 26, y: 74 },
    { x: 24, y: 76 } // Curled in
  ],
  palmBase: [
    { x: 3, y: 70 },
    { x: 8, y: 74 },
    { x: 13, y: 76 },
    { x: 18, y: 75 },
    { x: 23, y: 71 }
  ]
};

// Mirroring helper for Right Hand
function getRightHandSkeleton() {
  const mirror = (points: { x: number; y: number }[]) => 
    points.map(p => ({ x: 100 - p.x, y: p.y }));

  return {
    wrist: mirror(leftHandSkeleton.wrist),
    thumb: mirror(leftHandSkeleton.thumb),
    index: mirror(leftHandSkeleton.index),
    middle: mirror(leftHandSkeleton.middle),
    ring: mirror(leftHandSkeleton.ring),
    pinky: mirror(leftHandSkeleton.pinky),
    palmBase: mirror(leftHandSkeleton.palmBase)
  };
}

const rightHandSkeleton = getRightHandSkeleton();

// Particle interface
interface Particle {
  id: number;
  hand: "left" | "right";
  pathName: string;
  progress: number;
  speed: number;
  size: number;
  baseSize: number;
  alpha: number;
  noiseOffset: number;
  noiseRange: number;
  glow: number;
  pulseSpeed: number;
}

export default function CreationOfAdamHands({ mousePos }: CreationOfAdamHandsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCore, setHoveredCore] = useState(false);
  const [pulseWave, setPulseWave] = useState(0);

  // Core coordinates in terms of %
  const coreX = 50;
  const coreY = 61;

  // Track the custom high-fidelity energy pulse
  // Loops from left index tip -> core -> right index tip -> right wrist
  const energyProgressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 140 : 260; // Responsive density

    // Initialize particles for left and right hands
    const paths = ["wrist", "thumb", "index", "middle", "ring", "pinky", "palmBase"];
    
    for (let i = 0; i < particleCount; i++) {
      const isLeft = i < particleCount / 2;
      const hand = isLeft ? "left" : "right";
      const pathName = paths[Math.floor(Math.random() * paths.length)];
      
      particles.push({
        id: i,
        hand,
        pathName,
        progress: Math.random(),
        speed: 0.001 + Math.random() * 0.004,
        size: 1 + Math.random() * 2.2,
        baseSize: 1 + Math.random() * 2.2,
        alpha: 0.25 + Math.random() * 0.65,
        noiseOffset: Math.random() * Math.PI * 2,
        noiseRange: 1.5 + Math.random() * 4,
        glow: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }

    // Helper to interpolate points on a skeletal path
    const getPointOnPath = (
      skeleton: typeof leftHandSkeleton,
      pathName: string,
      t: number
    ) => {
      const pathPoints = skeleton[pathName as keyof typeof leftHandSkeleton];
      if (!pathPoints || pathPoints.length === 0) return { x: 0, y: 0 };
      
      const count = pathPoints.length;
      if (t <= 0) return pathPoints[0];
      if (t >= 1) return pathPoints[count - 1];

      const floatIndex = t * (count - 1);
      const index = Math.floor(floatIndex);
      const segmentT = floatIndex - index;

      const p0 = pathPoints[index];
      const p1 = pathPoints[index + 1] || p0;

      return {
        x: p0.x + (p1.x - p0.x) * segmentT,
        y: p0.y + (p1.y - p0.y) * segmentT
      };
    };

    // Main animation loop
    let lastTime = 0;
    const render = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Update canvas dimensions with high DPI support
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Parallax mouse variables
      const parallaxX = mousePos.x * 16;
      const parallaxY = mousePos.y * 12;

      // Update energy charge loop
      energyProgressRef.current = (energyProgressRef.current + 0.003) % 1.0;

      // Draw faint connection guidelines (like constellations) between neighboring points
      const drawConnections = (handType: "left" | "right") => {
        const list = particles.filter(p => p.hand === handType);
        const connectionLimit = window.innerWidth < 768 ? 26 : 38;

        for (let i = 0; i < list.length; i++) {
          const p1 = list[i];
          const coord1 = getParticleCoords(p1, rect.width, rect.height, time, parallaxX, parallaxY);

          // Connect to other close particles
          let connectionsCount = 0;
          for (let j = i + 1; j < list.length; j++) {
            if (connectionsCount > 3) break; // Keep wireframes lightweight
            
            const p2 = list[j];
            const coord2 = getParticleCoords(p2, rect.width, rect.height, time, parallaxX, parallaxY);

            const dx = coord1.x - coord2.x;
            const dy = coord1.y - coord2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionLimit) {
              const alpha = (1 - dist / connectionLimit) * 0.15;
              ctx.beginPath();
              ctx.strokeStyle = handType === "left" 
                ? `rgba(168, 85, 247, ${alpha})` // Fuchsia
                : `rgba(59, 130, 246, ${alpha})`; // Electric Blue
              ctx.lineWidth = 0.55;
              ctx.moveTo(coord1.x, coord1.y);
              ctx.lineTo(coord2.x, coord2.y);
              ctx.stroke();
              connectionsCount++;
            }
          }
        }
      };

      // Draw left hand wireframe connections
      drawConnections("left");
      // Draw right hand wireframe connections
      drawConnections("right");

      // Render individual particles
      particles.forEach((p) => {
        // Increment flow progress
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
        }

        // Get actual pixel coordinates
        const coords = getParticleCoords(p, rect.width, rect.height, time, parallaxX, parallaxY);

        // Render particle
        ctx.beginPath();
        
        // Subtle glow effect
        p.glow += p.pulseSpeed;
        const currentAlpha = p.alpha * (0.6 + Math.sin(p.glow) * 0.4);
        
        ctx.fillStyle = p.hand === "left"
          ? `rgba(192, 132, 252, ${currentAlpha})` // Fuchsia/Indigo
          : `rgba(96, 165, 250, ${currentAlpha})`; // Blue/Cyan
          
        ctx.arc(coords.x, coords.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra outer glow for larger focal particles
        if (p.size > 2.0) {
          ctx.beginPath();
          ctx.fillStyle = p.hand === "left"
            ? `rgba(168, 85, 247, ${currentAlpha * 0.25})`
            : `rgba(59, 130, 246, ${currentAlpha * 0.25})`;
          ctx.arc(coords.x, coords.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Get precise fingertip targets for energy beam render
      const leftIndexTipRaw = getPointOnPath(leftHandSkeleton, "index", 1.0);
      const rightIndexTipRaw = getPointOnPath(rightHandSkeleton, "index", 1.0);

      const leftIndexTip = {
        x: (leftIndexTipRaw.x / 100) * rect.width + parallaxX,
        y: (leftIndexTipRaw.y / 100) * rect.height + parallaxY
      };

      const rightIndexTip = {
        x: (rightIndexTipRaw.x / 100) * rect.width + parallaxX,
        y: (rightIndexTipRaw.y / 100) * rect.height + parallaxY
      };

      const coreCoords = {
        x: (coreX / 100) * rect.width + parallaxX * 0.7,
        y: (coreY / 100) * rect.height + parallaxY * 0.7
      };

      // Draw the energy loop paths and pulses
      drawEnergyLoop(ctx, leftIndexTip, coreCoords, rightIndexTip, time);

      animationFrameId = requestAnimationFrame(render);
    };

    // Helper to compute actual particle coordinates from relative percentages and noise
    const getParticleCoords = (
      p: Particle,
      w: number,
      h: number,
      time: number,
      pX: number,
      pY: number
    ) => {
      const skeleton = p.hand === "left" ? leftHandSkeleton : rightHandSkeleton;
      const basePt = getPointOnPath(skeleton, p.pathName, p.progress);

      // Organic wave noise
      const noiseT = time * 0.0015 + p.noiseOffset;
      const noiseX = Math.sin(noiseT) * p.noiseRange;
      const noiseY = Math.cos(noiseT * 0.8) * p.noiseRange;

      // Parallax multiplier based on where the particle resides
      const parallaxMult = p.pathName === "wrist" ? 0.6 : 1.0;

      return {
        x: (basePt.x / 100) * w + noiseX + pX * parallaxMult,
        y: (basePt.y / 100) * h + noiseY + pY * parallaxMult
      };
    };

    // Draw flowing electricity/energy streams between left-hand, center AI Core, and right-hand
    const drawEnergyLoop = (
      ctx: CanvasRenderingContext2D,
      tipL: { x: number; y: number },
      core: { x: number; y: number },
      tipR: { x: number; y: number },
      time: number
    ) => {
      // Loop phase timing
      const progress = energyProgressRef.current;
      let chargeX = 0;
      let chargeY = 0;
      let beamColor = "rgba(168, 85, 247, 0.4)";

      if (progress < 0.33) {
        // Phase 1: From Left Tip -> Core
        const ratio = progress / 0.33;
        chargeX = tipL.x + (core.x - tipL.x) * ratio;
        chargeY = tipL.y + (core.y - tipL.y) * ratio;
        beamColor = "rgba(168, 85, 247, 0.7)"; // Fuchsia
      } else if (progress < 0.66) {
        // Phase 2: Orbit/Charge the Core
        const ratio = (progress - 0.33) / 0.33;
        const angle = ratio * Math.PI * 2 + (time * 0.002);
        const radius = 24 + Math.sin(time * 0.01) * 3;
        chargeX = core.x + Math.cos(angle) * radius;
        chargeY = core.y + Math.sin(angle) * radius;
        beamColor = "rgba(129, 140, 248, 0.9)"; // Indigo
      } else {
        // Phase 3: Core -> Right Tip
        const ratio = (progress - 0.66) / 0.34;
        chargeX = core.x + (tipR.x - core.x) * ratio;
        chargeY = core.y + (tipR.y - core.y) * ratio;
        beamColor = "rgba(59, 130, 246, 0.7)"; // Royal Blue
      }

      // Draw faint guidelines between tips & core
      ctx.beginPath();
      ctx.strokeStyle = "rgba(147, 51, 234, 0.08)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.moveTo(tipL.x, tipL.y);
      ctx.lineTo(core.x, core.y);
      ctx.lineTo(tipR.x, tipR.y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Render flowing laser pulse
      ctx.beginPath();
      const pulseGlow = ctx.createRadialGradient(chargeX, chargeY, 0, chargeX, chargeY, 14);
      pulseGlow.addColorStop(0, "#ffffff");
      pulseGlow.addColorStop(0.3, beamColor);
      pulseGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = pulseGlow;
      ctx.arc(chargeX, chargeY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Emit energy trail sparks
      if (Math.random() < 0.35) {
        ctx.beginPath();
        ctx.fillStyle = progress < 0.5 ? "rgba(168, 85, 247, 0.9)" : "rgba(59, 130, 246, 0.9)";
        ctx.arc(
          chargeX + (Math.random() - 0.5) * 12, 
          chargeY + (Math.random() - 0.5) * 12, 
          0.8 + Math.random() * 1.5, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  // Periodic heartbeat ripple wave representing the NexHire AI Guidance
  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setPulseWave(1);
      setTimeout(() => setPulseWave(0), 1800);
    }, 4500);

    return () => clearInterval(pulseTimer);
  }, []);

  // Compute positions of core and hand tips for HTML overlays
  const parallaxX = mousePos.x * 16;
  const parallaxY = mousePos.y * 12;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
    >
      {/* 60fps GPU-Accelerated Interactive Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.85 }}
      />

      {/* ========================================================================= */}
      {/*                      LEFT HAND (STUDENT) VISUAL OVERLAYS                 */}
      {/* ========================================================================= */}
      <div 
        style={{
          transform: `translate(${parallaxX * 0.9}px, ${parallaxY * 0.9}px)`,
          transition: "transform 0.1s ease-out"
        }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Floating Code Snippet < /> Bubble */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute left-[8%] sm:left-[11%] top-[56%] sm:top-[50%] p-3.5 bg-purple-950/40 border border-purple-500/20 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)] flex items-center justify-center text-purple-400 group-hover:border-purple-400/40"
        >
          <Code className="h-4.5 w-4.5 text-purple-300 animate-pulse" />
          <span className="ml-1.5 font-mono text-[9px] font-bold tracking-wider text-purple-300">JS</span>
        </motion.div>

        {/* Floating JSON Object { } Bubble */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="absolute left-[15%] sm:left-[19%] top-[72%] p-3 bg-purple-950/30 border border-purple-500/15 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.1)] text-purple-300"
        >
          <Terminal className="h-4 w-4" />
        </motion.div>

        {/* Floating Resume Symbol Bubble */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          className="absolute left-[3%] sm:left-[5%] top-[64%] p-2.5 bg-purple-950/20 border border-purple-500/10 rounded-full backdrop-blur-sm text-purple-400/80"
        >
          <FileText className="h-4 w-4" />
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/*                      RIGHT HAND (CAREER) VISUAL OVERLAYS                 */}
      {/* ========================================================================= */}
      <div 
        style={{
          transform: `translate(${parallaxX * 0.9}px, ${parallaxY * 0.9}px)`,
          transition: "transform 0.1s ease-out"
        }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Floating Briefcase Outline Bubble */}
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute right-[12%] sm:right-[15%] top-[45%] sm:top-[38%] p-3.5 bg-blue-950/45 border border-blue-500/25 rounded-2xl backdrop-blur-md shadow-[0_0_25px_rgba(59,130,246,0.2)] flex items-center justify-center text-blue-300"
        >
          <Briefcase className="h-5 w-5 text-blue-300" />
        </motion.div>

        {/* Floating Offer Letter Document */}
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[6%] sm:right-[10%] top-[56%] p-3.5 w-[110px] sm:w-[130px] bg-blue-950/40 border border-blue-500/20 rounded-xl backdrop-blur-md shadow-[0_15px_35px_rgba(59,130,246,0.15)] text-left flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[7.5px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1 py-0.5 rounded uppercase">Verified</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="text-[10px] font-heading font-extrabold text-white tracking-tight uppercase">Offer Letter</div>
          <div className="h-[1px] w-full bg-blue-500/25"></div>
          <div className="space-y-1">
            <div className="h-1 w-14 bg-zinc-600 rounded-full"></div>
            <div className="h-1 w-11 bg-zinc-600 rounded-full"></div>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span className="text-[8px] font-mono font-semibold text-zinc-300">Software Eng.</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Building / Company Symbol Bubble */}
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute right-[16%] sm:right-[20%] top-[72%] p-3 bg-blue-950/30 border border-blue-500/15 rounded-xl backdrop-blur-sm text-blue-400"
        >
          <Building2 className="h-4 w-4" />
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/*                        CENTERPIECE: NEXHIRE AI CORE                       */}
      {/* ========================================================================= */}
      <div 
        style={{
          left: `${coreX}%`,
          top: `${coreY}%`,
          transform: `translate(-50%, -50%) translate(${parallaxX * 0.7}px, ${parallaxY * 0.7}px)`,
          transition: "transform 0.1s ease-out"
        }}
        className="absolute z-30 flex flex-col items-center justify-center"
      >
        {/* Core Halo Waves radiating outwards */}
        <AnimatePresence>
          {pulseWave === 1 && (
            <motion.div
              initial={{ opacity: 0.6, scale: 0.6 }}
              animate={{ opacity: 0, scale: 2.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute h-48 w-48 rounded-full border border-indigo-500/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-[2px]"
            />
          )}
        </AnimatePresence>

        {/* Floating AI Hexagonal Core Centerpiece Container */}
        <div 
          onMouseEnter={() => setHoveredCore(true)}
          onMouseLeave={() => setHoveredCore(false)}
          className="relative h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          {/* Hexagon Shape Outline Background Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/30 to-purple-500/20 blur-xl animate-pulse"></div>

          {/* Double Spinning Hexagonal borders (SVG for crisp line resolution) */}
          <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
            <polygon 
              points="50,12 85,31 85,69 50,88 15,69 15,31" 
              fill="none" 
              stroke="url(#coreGradient)" 
              strokeWidth="1.2"
              className="opacity-70"
            />
            <defs>
              <linearGradient id="coreGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner Counter-Rotating Hexagon */}
          <svg className="absolute inset-2 w-[85%] h-[85%] animate-spin-reverse-slow" viewBox="0 0 100 100">
            <polygon 
              points="50,12 85,31 85,69 50,88 15,69 15,31" 
              fill="none" 
              stroke="url(#coreGradientInner)" 
              strokeWidth="0.95"
              strokeDasharray="5, 3"
              className="opacity-55"
            />
            <defs>
              <linearGradient id="coreGradientInner" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Sphere Core Button */}
          <motion.div
            animate={{ 
              scale: hoveredCore ? 1.15 : [1, 1.05, 1],
              rotate: hoveredCore ? 180 : 0
            }}
            transition={{ 
              scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 0.8, ease: "easeInOut" }
            }}
            className="relative h-11 w-11 sm:h-13 sm:w-13 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.35)] flex items-center justify-center overflow-hidden z-20 group"
          >
            {/* Spinning gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 opacity-20 group-hover:opacity-40 transition-opacity" />
            
            {/* Pulsing Sparkles Icon */}
            <Sparkles className="h-5.5 w-5.5 text-indigo-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] animate-pulse" />
          </motion.div>
        </div>

        {/* Minimal subtitle label for AI Core */}
        <span className="mt-4 font-mono text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-full backdrop-blur-md shadow-md animate-pulse">
          NexHire AI Core
        </span>
      </div>
    </div>
  );
}
