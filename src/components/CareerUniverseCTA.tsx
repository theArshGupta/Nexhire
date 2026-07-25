import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Mic, 
  Code, 
  Briefcase, 
  BarChart3, 
  Calendar, 
  Brain, 
  Map, 
  Target, 
  Users, 
  Zap, 
  Trophy, 
  GraduationCap, 
  Sparkles, 
  ArrowRight
} from "lucide-react";

interface FooterProps {
  onExplorePricing: () => void;
}

interface OrbitNode {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  orbitIndex: number; // 0 = inner, 1 = middle, 2 = outer
  baseAngle: number;  // initial angle offset
  speedMultiplier: number; // rotation speed multiplier
  color: string; // tailwind/glow color
  colorHex: string; // hex color for canvas lines
}

const nodesData: OrbitNode[] = [
  // Inner orbit (3 nodes)
  {
    id: "resume",
    label: "📄 ATS Resume Builder",
    description: "Instantly score and optimize your resume for applicant tracking systems.",
    icon: FileText,
    orbitIndex: 0,
    baseAngle: 0,
    speedMultiplier: 1.0,
    color: "from-purple-500 to-indigo-500",
    colorHex: "#a855f7"
  },
  {
    id: "interview",
    label: "🎤 AI Mock Interview",
    description: "Practice real-world behavioral and technical questions with live speech feedback.",
    icon: Mic,
    orbitIndex: 0,
    baseAngle: (2 * Math.PI) / 3,
    speedMultiplier: -0.85,
    color: "from-blue-500 to-indigo-500",
    colorHex: "#3b82f6"
  },
  {
    id: "dsa",
    label: "💻 DSA Tracker",
    description: "Master algorithms and data structures with curated, interactive code puzzles.",
    icon: Code,
    orbitIndex: 0,
    baseAngle: (4 * Math.PI) / 3,
    speedMultiplier: 1.2,
    color: "from-indigo-500 to-violet-500",
    colorHex: "#6366f1"
  },
  // Middle orbit (4 nodes)
  {
    id: "jobs",
    label: "💼 Job Portal",
    description: "Discover verified corporate listings tailored to your validated skills.",
    icon: Briefcase,
    orbitIndex: 1,
    baseAngle: 0,
    speedMultiplier: -0.75,
    color: "from-emerald-500 to-teal-500",
    colorHex: "#10b981"
  },
  {
    id: "analytics",
    label: "📊 Analytics Dashboard",
    description: "Visualize placement readiness scores and track your skill growth curves.",
    icon: BarChart3,
    orbitIndex: 1,
    baseAngle: Math.PI / 2,
    speedMultiplier: 0.8,
    color: "from-violet-500 to-fuchsia-500",
    colorHex: "#8b5cf6"
  },
  {
    id: "tracker",
    label: "📅 Application Tracker",
    description: "Manage and pipeline your ongoing recruitment applications in one place.",
    icon: Calendar,
    orbitIndex: 1,
    baseAngle: Math.PI,
    speedMultiplier: -0.65,
    color: "from-blue-400 to-cyan-500",
    colorHex: "#60a5fa"
  },
  {
    id: "mentor",
    label: "🧠 AI Career Mentor",
    description: "Get smart career consulting, industry tips, and placement strategies 24/7.",
    icon: Brain,
    orbitIndex: 1,
    baseAngle: (3 * Math.PI) / 2,
    speedMultiplier: 0.95,
    color: "from-pink-500 to-rose-500",
    colorHex: "#ec4899"
  },
  // Outer orbit (5 nodes)
  {
    id: "roadmap",
    label: "🛣 Career Roadmap",
    description: "Follow customized learning milestones curated for your dream role.",
    icon: Map,
    orbitIndex: 2,
    baseAngle: 0,
    speedMultiplier: 0.45,
    color: "from-amber-500 to-orange-500",
    colorHex: "#f59e0b"
  },
  {
    id: "readiness",
    label: "🎯 Placement Readiness",
    description: "Evaluate your preparedness across foundational core domains with detailed scores.",
    icon: Target,
    orbitIndex: 2,
    baseAngle: (2 * Math.PI) / 5,
    speedMultiplier: -0.5,
    color: "from-rose-500 to-red-500",
    colorHex: "#f43f5e"
  },
  {
    id: "network",
    label: "🤝 Networking Hub",
    description: "Exchange insights with successful alumni and target campus peer circles.",
    icon: Users,
    orbitIndex: 2,
    baseAngle: (4 * Math.PI) / 5,
    speedMultiplier: 0.5,
    color: "from-sky-500 to-blue-400",
    colorHex: "#0ea5e9"
  },
  {
    id: "skills",
    label: "⚡ Skill Assessment",
    description: "Identify and fill key technical skill gaps using micro-quizzes.",
    icon: Zap,
    orbitIndex: 2,
    baseAngle: (6 * Math.PI) / 5,
    speedMultiplier: -0.4,
    color: "from-yellow-500 to-amber-500",
    colorHex: "#eab308"
  },
  {
    id: "success",
    label: "🏆 Interview Success",
    description: "Unlock top placement strategies and real solved interviews from tier-1 giants.",
    icon: Trophy,
    orbitIndex: 2,
    baseAngle: (8 * Math.PI) / 5,
    speedMultiplier: 0.55,
    color: "from-teal-500 to-emerald-500",
    colorHex: "#14b8a6"
  }
];

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export default function CareerUniverseCTA({ onExplorePricing }: FooterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<HTMLDivElement[]>([]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isCoreHovered, setIsCoreHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Keep refs of reactive states for high performance RAF access (prevents stale closures)
  const hoveredIndexRef = useRef<number | null>(null);
  const isCoreHoveredRef = useRef(false);
  const isButtonHoveredRef = useRef(false);

  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
  }, [hoveredIndex]);

  useEffect(() => {
    isCoreHoveredRef.current = isCoreHovered;
  }, [isCoreHovered]);

  useEffect(() => {
    isButtonHoveredRef.current = isButtonHovered;
  }, [isButtonHovered]);

  // Animation constants and accumulators
  const timeRef = useRef(0);
  const introProgressRef = useRef(0);
  const nodeAnglesRef = useRef<number[]>(nodesData.map(n => n.baseAngle));
  
  // Starfield simulation state
  const starsRef = useRef<{ x: number; y: number; size: number; opacity: number; phase: number }[]>([]);
  const shootingStarsRef = useRef<{ x: number; y: number; vx: number; vy: number; length: number; alpha: number; active: boolean }[]>([]);

  // Trigger Intersection Observer for viewport-aware loading
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize starfield
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2
      });
    }
    starsRef.current = stars;
  }, []);

  // Frame animation loop (60 FPS, updates styles directly via DOM refs)
  useEffect(() => {
    let animId: number;

    const tick = () => {
      timeRef.current += 1;

      if (isInView && introProgressRef.current < 1) {
        introProgressRef.current += 0.012; // smooth intro ramp
        if (introProgressRef.current > 1) introProgressRef.current = 1;
      }

      const scaleProgress = easeOutCubic(introProgressRef.current);
      const container = containerRef.current;
      const canvas = canvasRef.current;

      if (container && canvas) {
        const cx = container.offsetWidth / 2;
        const cy = container.offsetHeight / 2;
        
        // Dynamically compute layout scale based on device sizing for fluid responsive bounds
        const rawScale = Math.min(1.0, Math.max(0.48, container.offsetWidth / 1024));
        const scale = rawScale * scaleProgress;

        // Setup Retina-ready canvas bounds
        const dpr = window.devicePixelRatio || 1;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
          canvas.width = width * dpr;
          canvas.height = height * dpr;
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.clearRect(0, 0, width, height);

          // 1. DRAW LUXURY AMBIENT COSMOS (Background Stars)
          starsRef.current.forEach(star => {
            const sx = star.x * width;
            const sy = star.y * height;
            // Twinkle effect
            const twinkle = Math.sin(timeRef.current * 0.015 + star.phase) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle * scaleProgress})`;
            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            ctx.fill();
          });

          // 2. DYNAMIC SHOOTING STARS
          if (Math.random() < 0.012 && shootingStarsRef.current.filter(s => s.active).length < 2) {
            shootingStarsRef.current.push({
              x: Math.random() * width,
              y: Math.random() * (height * 0.3),
              vx: -(6 + Math.random() * 8),
              vy: 4 + Math.random() * 5,
              length: 60 + Math.random() * 80,
              alpha: 0,
              active: true
            });
          }

          shootingStarsRef.current.forEach(star => {
            if (!star.active) return;
            star.x += star.vx;
            star.y += star.vy;
            star.alpha += 0.04;
            if (star.alpha > 1) star.alpha = 1;

            if (star.x < -100 || star.y > height + 100) {
              star.active = false;
            } else {
              const grad = ctx.createLinearGradient(star.x, star.y, star.x - star.vx * 3, star.y - star.vy * 3);
              grad.addColorStop(0, `rgba(168, 85, 247, ${0.4 * star.alpha * scaleProgress})`);
              grad.addColorStop(1, "rgba(59, 130, 246, 0)");
              ctx.strokeStyle = grad;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(star.x - star.vx * 3, star.y - star.vy * 3);
              ctx.stroke();
            }
          });

          // 3. ELEGANT GEOMETRIC ORBIT RINGS
          // Elliptical scales mimicking isometric depth perspective
          const rxList = [150 * scale, 270 * scale, 390 * scale];
          const ryList = [75 * scale, 135 * scale, 195 * scale];

          ctx.setLineDash([3, 11]);
          ctx.lineWidth = 1.0;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(cx, cy, rxList[i], ryList[i], 0, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * scaleProgress})`;
            ctx.stroke();
          }
          ctx.setLineDash([]);

          // Cache positions to render connection paths
          const computedPositions: { x: number; y: number }[] = [];
          const angles = nodeAnglesRef.current;
          const currentHovered = hoveredIndexRef.current;
          const coreHovered = isCoreHoveredRef.current;
          const buttonHovered = isButtonHoveredRef.current;

          // Compute and draw node coordinate calculations
          nodesData.forEach((node, idx) => {
            const rx = rxList[node.orbitIndex];
            const ry = ryList[node.orbitIndex];

            // Speed slows down if individual node is hovered, or accelerates on central core hover
            let speed = 0.0032 * node.speedMultiplier;
            if (currentHovered === idx) {
              speed *= 0.15; // Slow down orbit momentarily to focus
            } else if (coreHovered) {
              speed *= 2.6; // Accelerate orbit as energy surge flows
            }

            angles[idx] += speed;
            const angle = angles[idx];

            // Hover status allows nodes to float individually with secondary phase
            const floatOffset = Math.sin(timeRef.current * 0.03 + idx) * 4;
            
            // X and Y positions
            const x = cx + Math.cos(angle) * rx;
            const y = cy + Math.sin(angle) * ry + floatOffset;
            computedPositions.push({ x, y });

            // Apply style directly using GPU transitions for fluid performance
            const el = nodeRefs.current[idx];
            if (el) {
              el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
              el.style.opacity = `${scaleProgress}`;
            }
          });

          // 4. CONNECTION NEURAL PATHS & ENERGIZED PARTICLES
          nodesData.forEach((node, idx) => {
            const pos = computedPositions[idx];
            if (!pos) return;

            const isNodeHovered = currentHovered === idx;

            // Draw Connection Line
            ctx.beginPath();
            ctx.moveTo(cx, cy);

            // Connect lines grow from center outward during introduction build
            const targetX = cx + (pos.x - cx) * scaleProgress;
            const targetY = cy + (pos.y - cy) * scaleProgress;
            ctx.lineTo(targetX, targetY);

            if (isNodeHovered) {
              ctx.strokeStyle = node.colorHex;
              ctx.lineWidth = 1.8;
              ctx.shadowColor = node.colorHex;
              ctx.shadowBlur = 12;
            } else if (coreHovered) {
              ctx.strokeStyle = "rgba(129, 140, 248, 0.28)";
              ctx.lineWidth = 1.1;
            } else {
              ctx.strokeStyle = "rgba(255, 255, 255, 0.038)";
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
            ctx.shadowBlur = 0; // reset

            // Flow continuous analytical energy pulses towards active orbits
            if (scaleProgress > 0.4) {
              const baseSpeed = 0.0022;
              let particleSpeed = baseSpeed;

              if (isNodeHovered) {
                particleSpeed = baseSpeed * 2.8;
              } else if (coreHovered) {
                particleSpeed = baseSpeed * 3.4;
              }

              // Multiple pulses per line using mathematical offsets
              const pulseOffsets = [0, 0.5];
              pulseOffsets.forEach(offset => {
                const t = (timeRef.current * particleSpeed + offset + idx * 0.17) % 1.0;
                
                // Position interpolation
                const px = cx + (pos.x - cx) * t;
                const py = cy + (pos.y - cy) * t;

                ctx.fillStyle = node.colorHex;
                ctx.beginPath();
                ctx.arc(px, py, isNodeHovered ? 2.5 : 1.6, 0, Math.PI * 2);
                ctx.shadowColor = node.colorHex;
                ctx.shadowBlur = isNodeHovered ? 8 : 4;
                ctx.fill();
                ctx.shadowBlur = 0;
              });
            }
          });

          // 5. PRIMARY BUTTON POWER SURGE INTERACTION
          if (buttonHovered && scaleProgress > 0.8) {
            const bx = cx;
            const by = cy + 145 * scale; // coordinates matching the absolutely positioned buttons below

            // Energy beam to the CTA button
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = "rgba(99, 102, 241, 0.32)";
            ctx.lineWidth = 1.4;
            ctx.shadowColor = "#818cf8";
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Flow heavy power surge particles down the conduit
            const surgeParticlesCount = 3;
            for (let i = 0; i < surgeParticlesCount; i++) {
              const t = (timeRef.current * 0.009 + i * 0.33) % 1.0;
              const px = cx + (bx - cx) * t;
              const py = cy + (by - cy) * t;

              ctx.fillStyle = "#c084fc"; // Royal purple pulse core
              ctx.beginPath();
              ctx.arc(px, py, 3.2, 0, Math.PI * 2);
              ctx.shadowColor = "#c084fc";
              ctx.shadowBlur = 12;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }

          // 6. ANIMATE AI CORE SUSPENSION
          const coreEl = coreRef.current;
          if (coreEl) {
            const floatY = Math.sin(timeRef.current * 0.022) * 5.5;
            const rotate = Math.sin(timeRef.current * 0.012) * 2.8;
            const hoverScale = isCoreHovered ? 1.08 : 1.0;
            coreEl.style.transform = `translate3d(-50%, -50%, 0) translateY(${floatY}px) rotate(${rotate}deg) scale(${hoverScale})`;
          }

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isInView, isCoreHovered, isButtonHovered, hoveredIndex]);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-[#050505] border-t border-[rgba(255,255,255,0.08)]">
      {/* Dynamic tech grids & volumetric glows matching design rules */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Deep luxurious color gradients in background */}
      <div className="ambient-lighting-spot top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#1e3a8a] z-0" />
      <div className="ambient-lighting-spot top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#1e3a8a] z-0" />

      {/* CONTENT HEADING PANEL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center space-y-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-1.5 bg-[#101010] border border-[rgba(255,255,255,0.08)] px-3.5 py-1.5 rounded-full"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#3b82f6] animate-pulse" />
          <span className="font-mono text-[10px] font-bold tracking-wider text-[#B0B0B0] uppercase">
            The Connected Career Universe
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-tight"
        >
          Everything Your Career Needs.<br className="hidden sm:inline" />
          <span className="text-[#999999]">
            Connected by AI.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-xs sm:text-sm text-[#999999] max-w-2xl mx-auto leading-relaxed"
        >
          From resumes and coding practice to AI interviews, job tracking, analytics, and career planning—NexHire brings your entire placement journey into one intelligent platform.
        </motion.p>
      </div>

      {/* DYNAMIC ORBITAL ECOSYSTEM CONTAINER */}
      <div 
        ref={containerRef}
        className="relative w-full h-[460px] sm:h-[520px] md:h-[600px] lg:h-[640px] select-none overflow-hidden touch-none"
      >
        {/* Dynamic Interactive Drawing Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

        {/* 1. THE AI CORE (Centered glass sphere) */}
        <div 
          ref={coreRef}
          onMouseEnter={() => setIsCoreHovered(true)}
          onMouseLeave={() => setIsCoreHovered(false)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
        >
          {/* Volumetric background core glow pulsing dynamically */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 to-purple-600/30 blur-xl transition-all duration-500 pointer-events-none"
            style={{
              transform: `scale(${isCoreHovered ? 1.35 : 1.1 + Math.sin(timeRef.current * 0.04) * 0.05})`,
              opacity: isCoreHovered ? 1.0 : 0.7
            }}
          />

          {/* Core Glass Sphere Shield */}
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-500 border backdrop-blur-2xl relative
            ${isCoreHovered 
              ? "border-indigo-400/50 bg-indigo-505/10 shadow-[0_0_50px_rgba(129,140,248,0.4)]" 
              : "border-white/10 bg-white/[0.02] shadow-[0_0_30px_rgba(59,130,246,0.15)]"}`}
          >
            {/* Spinning orbital geometric overlays */}
            <div className="absolute inset-1 rounded-full border border-dashed border-blue-500/20 animate-[spin_18s_linear_infinite]" />
            <div className="absolute inset-2.5 rounded-full border border-dashed border-purple-500/25 animate-[spin_12s_linear_infinite_reverse]" />
            <div className="absolute inset-4.5 rounded-full border border-dashed border-indigo-400/15 animate-[spin_6s_linear_infinite]" />

            {/* Core Center Emblem */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <GraduationCap className={`h-8 w-8 sm:h-10 sm:w-10 transition-transform duration-500
                ${isCoreHovered ? "scale-110 text-indigo-300" : "text-white"}`} 
              />
            </div>
          </div>
        </div>

        {/* 2. GLOWING GLASS BADGE NODES */}
        {nodesData.map((node, idx) => {
          const isNodeHovered = hoveredIndex === idx;

          return (
            <div
              ref={(el) => { if (el) nodeRefs.current[idx] = el; }}
              key={node.id}
              className="absolute z-20 group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Circular glass hub */}
              <div 
                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-xl shadow-lg cursor-pointer relative
                  ${isNodeHovered 
                    ? `border-blue-400 bg-white/[0.08] shadow-[0_0_20px_rgba(59,130,246,0.35)] scale-112` 
                    : `border-white/5 bg-zinc-950/45 hover:border-white/15`}`}
              >
                {/* Node-specific miniature energy orbit halo */}
                <div 
                  className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${node.color} opacity-0 transition-opacity duration-300 pointer-events-none blur-sm
                    ${isNodeHovered ? "opacity-25" : ""}`}
                />

                <node.icon className={`h-4.5 w-4.5 transition-all duration-300 relative z-10
                  ${isNodeHovered ? "text-blue-300 scale-105" : "text-zinc-400 group-hover:text-white"}`} 
                />
              </div>

              {/* Hover Interactive Glass Tooltip */}
              <AnimatePresence>
                {isNodeHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.94 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-50 pointer-events-none w-52 sm:w-60 bg-[#07070a]/95 border border-zinc-800/80 rounded-xl p-3 shadow-2xl backdrop-blur-2xl"
                  >
                    {/* Seamless Arrow pointer */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#07070a] border-r border-b border-zinc-800/80 -translate-y-[4px]"></div>
                    
                    <div className="space-y-1 text-left">
                      <div className="text-[11px] font-bold text-white flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-tr ${node.color}`} />
                        {node.label}
                      </div>
                      <p className="text-[9.5px] text-zinc-400 leading-normal">
                        {node.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* 3. CENTERED BUTTON PANEL DYNAMICALLY ANCHORED BELOW CORE */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 z-40 flex items-center justify-center w-full px-4 max-w-sm sm:max-w-md pointer-events-auto"
          style={{ 
            top: containerRef.current 
              ? `calc(50% + ${140 * Math.min(1.0, Math.max(0.48, containerRef.current.offsetWidth / 1024)) * easeOutCubic(introProgressRef.current)}px)`
              : "calc(50% + 140px)",
            opacity: introProgressRef.current > 0.6 ? 1 : 0,
            transform: `translate(-50%, 0) translateY(${(1 - easeOutCubic(introProgressRef.current)) * 20}px)`,
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out"
          }}
        >
          <button
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={onExplorePricing}
            className="w-full sm:w-auto relative group overflow-hidden rounded-full p-[1px] shadow-2xl cursor-pointer"
          >
            {/* Pulsing energy border */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full transition-all group-hover:scale-105 duration-300"></span>
            
            <div className="relative px-7 py-3.5 bg-[#08080c] hover:bg-transparent rounded-full transition-all duration-300">
              <span className="font-sans text-xs font-bold text-white flex items-center justify-center gap-2 whitespace-nowrap">
                Start Preparing Free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>

            {/* Glowing backdrop halo */}
            <div className="absolute -inset-px rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-25 blur-md transition-opacity duration-300 pointer-events-none" />
          </button>
        </div>

      </div>

      {/* FOOTER BULLET CONVENIENCES */}
      <div className="max-w-2xl mx-auto px-4 relative z-20 -mt-2 sm:-mt-8 text-center flex items-center justify-center gap-6 text-[10px] text-zinc-500 font-sans flex-wrap">
        <span className="flex items-center gap-1">✓ 100% Free Trial</span>
        <span className="flex items-center gap-1">✓ Full Interactive Sandbox</span>
        <span className="flex items-center gap-1">✓ Cancel Instantly Any Time</span>
      </div>
    </section>
  );
}
