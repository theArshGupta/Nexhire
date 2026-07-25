import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import RaycastBackground from "./RaycastBackground";
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Code, 
  FileText, 
  Bot, 
  Trophy, 
  Compass, 
  CheckCircle2, 
  Flame, 
  Briefcase, 
  TrendingUp, 
  Zap, 
  Check, 
  ChevronRight,
  TrendingDown,
  LineChart,
  Award,
  Users
} from "lucide-react";

interface HeroProps {
  onExploreFeatures: () => void;
  onExplorePricing: () => void;
}

export default function Hero({ onExploreFeatures, onExplorePricing }: HeroProps) {
  // Metric animation states (simulating a live-updating premium dashboard)
  const [resumeScore, setResumeScore] = useState(82);
  const [dsaStreak, setDsaStreak] = useState(118);
  const [jobMatches, setJobMatches] = useState(19);
  const [interviewScore, setInterviewScore] = useState(84);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [voiceHeights, setVoiceHeights] = useState([35, 75, 45, 90, 60, 85, 40, 70, 95, 50, 80, 45, 65]);

  // Mouse coordinate state for 3D premium parallax depth
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Periodic counters to simulate a living system climbing to target metrics and then fluctuating in real-time
  useEffect(() => {
    // 1. Resume Score climbs to 92, then fluctuates subtly between 92 and 94
    const resumeTimer = setInterval(() => {
      setResumeScore((prev) => {
        if (prev < 92) return prev + 1;
        // 15% chance to fluctuate by small value once target reached
        return Math.random() > 0.85 ? 92 + Math.floor(Math.random() * 3) : prev;
      });
    }, 180);

    // 2. DSA Streak climbs to 132, then occasionally increments or fluctuates around 132-133
    const dsaTimer = setInterval(() => {
      setDsaStreak((prev) => {
        if (prev < 132) return prev + 1;
        // 10% chance to fluctuate by 1
        return Math.random() > 0.90 ? 132 + Math.floor(Math.random() * 2) : prev;
      });
    }, 120);

    // 3. Job Matches climbs to 27, then fluctuates dynamically between 27 and 29 simulating new jobs discovered in real-time
    const jobsTimer = setInterval(() => {
      setJobMatches((prev) => {
        if (prev < 27) return prev + 1;
        // 20% chance to fluctuate
        return Math.random() > 0.80 ? 27 + Math.floor(Math.random() * 3) : prev;
      });
    }, 220);

    // 4. AI Interview Score climbs to 96, then fluctuates dynamically between 94 and 98 mimicking fine-grained real-time rating updates
    const interviewTimer = setInterval(() => {
      setInterviewScore((prev) => {
        if (prev < 96) return prev + 1;
        // 15% chance to fluctuate
        return Math.random() > 0.85 ? 94 + Math.floor(Math.random() * 5) : prev;
      });
    }, 150);

    // 5. Voice spectrum bars continuously animating to look like an active real-time microphone stream
    const voiceTimer = setInterval(() => {
      setVoiceHeights((prev) => 
        prev.map(() => Math.floor(Math.random() * 65) + 30) // fluctuate heights between 30% and 95%
      );
    }, 140);

    return () => {
      clearInterval(resumeTimer);
      clearInterval(dsaTimer);
      clearInterval(jobsTimer);
      clearInterval(interviewTimer);
      clearInterval(voiceTimer);
    };
  }, []);

  // Handle subtle mouse move parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2); // Normalize between -1 and 1
    const y = (e.clientY - top - height / 2) / (height / 2);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 }); // Smoothly center back
  };

  // Companies for Job Applications Tracker
  const targetCompanies = [
    { name: "Stripe", logo: "💳", status: "Offer Extended", color: "text-[#B2B2B2] bg-[#141414] border-[rgba(255,255,255,0.08)]" },
    { name: "Google", logo: "🔍", status: "Interviewing", color: "text-[#B2B2B2] bg-[#141414] border-[rgba(255,255,255,0.08)]" },
    { name: "Linear", logo: "📐", status: "Resume Screen", color: "text-[#B2B2B2] bg-[#141414] border-[rgba(255,255,255,0.08)]" },
  ];

  return (
    <section 
      id="hero" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen pt-36 pb-16 overflow-hidden flex flex-col justify-between bg-[#050505] transition-all duration-300 select-none"
    >
      {/* High-fidelity Raycast-style animated diagonal beams of light */}
      <RaycastBackground />

      {/* Grid Lines Overlay to tie background to NexHire dashboard layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none z-0"></div>
      
      {/* Custom Radial Micro-Dots for texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0"></div>

      {/* Ambient Lighting Spot */}
      <div className="ambient-lighting-spot top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#1e3a8a] z-0"></div>

      {/* Hero Outer Content Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex-1 flex flex-col justify-center items-center">
        
        {/* ==================== CENTRAL CONTENT PANEL ==================== */}
        <div className="max-w-3xl mx-auto text-center space-y-8 flex flex-col items-center">
          
          {/* NexHire AI Career Operating System Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] px-4 py-1.5 rounded-full backdrop-blur-xl shadow-lg transition-all group cursor-pointer"
          >
            <div className="flex h-2 w-2 relative rounded-full bg-[#0066FF]">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75"></span>
            </div>
            <span className="font-mono text-[10px] font-semibold tracking-widest text-[#999999] group-hover:text-white uppercase flex items-center gap-1.5 transition-colors">
              The AI Career Operating System
            </span>
          </motion.div>

          {/* Centered Headline with world-class display typography */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[58px] tracking-tight leading-[1.08] text-white max-w-2xl mx-auto"
            >
              Build. Prepare.<br />
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                Get Hired.
              </span>
            </motion.h1>

            {/* Short premium centered description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-sm sm:text-base text-[#999999] max-w-xl mx-auto leading-relaxed font-normal"
            >
              NexHire unifies everything you need to crack internships and placements. AI-powered guidance, practice, and opportunities — all in one intelligent platform.
            </motion.p>
          </div>

          {/* Centered CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            {/* Primary Framer-style Solid White CTA Button */}
            <button
              id="cta-start-preparing"
              onClick={onExplorePricing}
              className="btn-primary-gradient w-full sm:w-auto px-7 py-3.5 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 group"
            >
              <span>Start Preparing Free</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-black" />
            </button>

            {/* Secondary Framer Matte Button */}
            <button
              id="cta-watch-live"
              onClick={() => setIsDemoPlaying(!isDemoPlaying)}
              className="btn-secondary-matte w-full sm:w-auto px-6 py-3.5 text-xs transition-all flex items-center justify-center gap-2"
            >
              <div className="h-4 w-4 rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-white">
                <Play className="h-2 w-2 fill-current ml-0.5" />
              </div>
              <span>{isDemoPlaying ? "Close Demo" : "Watch Live Demo"}</span>
            </button>
          </motion.div>

          {/* Unified compact dashboard metrics row for all viewports */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl pt-4"
          >
            <div className="card-premium p-3 text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#888888] uppercase tracking-wider mb-1">
                <FileText className="h-3 w-3 text-[#0066FF]" />
                <span>Resume</span>
              </div>
              <div className="text-lg font-heading font-black text-white">
                {resumeScore}
                <span className="text-[10px] text-[#666666] font-normal">/100</span>
              </div>
            </div>

            <div className="card-premium p-3 text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#888888] uppercase tracking-wider mb-1">
                <Code className="h-3 w-3 text-[#0066FF]" />
                <span>DSA Streak</span>
              </div>
              <div className="text-lg font-heading font-black text-white">
                {dsaStreak}
                <span className="text-[10px] text-[#666666] font-normal">D</span>
              </div>
            </div>

            <div className="card-premium p-3 text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#888888] uppercase tracking-wider mb-1">
                <Bot className="h-3 w-3 text-[#0066FF]" />
                <span>Interview</span>
              </div>
              <div className="text-lg font-heading font-black text-white">
                {interviewScore}
                <span className="text-[10px] text-[#666666] font-normal">%</span>
              </div>
            </div>

            <div className="card-premium p-3 text-center backdrop-blur-md">
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#888888] uppercase tracking-wider mb-1">
                <Briefcase className="h-3 w-3 text-[#10b981]" />
                <span>Matches</span>
              </div>
              <div className="text-lg font-heading font-black text-[#10b981]">
                {jobMatches}
              </div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/*             FLOATING CORNER GLASS DASHBOARD CARDS (DESKTOP)               */}
      {/* ========================================================================= */}
      <div className="hidden lg:block pointer-events-none z-20">
        
        {/* 1. TOP-LEFT CORNER: RESUME ATS SCORE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -10, 0],
            x: [0, 4, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4 },
            scale: { duration: 0.8, delay: 0.4 },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 7, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-[18%] left-[1.5%] xl:left-[3%] 2xl:left-[5%] pointer-events-auto"
        >
          <div
            style={{
              transform: `translate(${mousePos.x * -16}px, ${mousePos.y * -16}px) rotateX(${mousePos.y * -4}deg) rotateY(${mousePos.x * 4}deg)`,
              transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)"
            }}
            className="w-[200px] xl:w-[220px] bg-[#0B0B0B] rounded-2xl border border-[rgba(255,255,255,0.08)] p-4 shadow-2xl hover:border-[rgba(255,255,255,0.16)] transition-colors duration-300 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-[#0066FF]" />
                <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider">ATS Resume Audit</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-mono text-white bg-[#141414] border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0066FF]"></span>
                <span>Live</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-heading font-extrabold text-white tracking-tight">
                {resumeScore}
              </span>
              <span className="text-xs text-[#666666]">/100</span>
              <span className="ml-auto text-[9px] text-white font-mono font-semibold bg-[#141414] border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded">
                98% ATS Pass
              </span>
            </div>

            {/* Progress Slider */}
            <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden mt-3 border border-[rgba(255,255,255,0.08)]">
              <div 
                style={{ width: `${resumeScore}%` }}
                className="h-full bg-[#0066FF] rounded-full transition-all duration-300"
              ></div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-[rgba(255,255,255,0.08)] space-y-1 text-left">
              <span className="block text-[8px] text-[#666666] font-mono uppercase tracking-wider">AI Impact Optimization</span>
              <p className="text-[10px] text-[#cccccc] leading-snug">
                Swapped bullet: <span className="text-[#0066FF] font-semibold font-mono">"Architected microservices"</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* 2. BOTTOM-LEFT CORNER: DSA STREAK TRACKER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, 8, 0],
            x: [0, -4, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.6 },
            scale: { duration: 0.8, delay: 0.6 },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-[18%] left-[1.5%] xl:left-[3%] 2xl:left-[5%] pointer-events-auto"
        >
          <div
            style={{
              transform: `translate(${mousePos.x * -20}px, ${mousePos.y * 12}px) rotateX(${mousePos.y * -3}deg) rotateY(${mousePos.x * 3}deg)`,
              transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)"
            }}
            className="w-[190px] xl:w-[210px] bg-[#0B0B0B] rounded-2xl border border-[rgba(255,255,255,0.08)] p-4 shadow-2xl hover:border-[rgba(255,255,255,0.16)] transition-colors duration-300 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Code className="h-4 w-4 text-[#0066FF]" />
                <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider">DSA Practice</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#B2B2B2]">
                <Flame className="h-3.5 w-3.5 fill-[#B2B2B2] text-[#B2B2B2]" />
                <span className="font-bold font-mono">{dsaStreak}D</span>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <div className="text-[8px] text-[#666666] tracking-wider uppercase font-mono">Dynamic Problem</div>
              <div className="bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-lg p-2 font-mono text-[9px] space-y-1">
                <div className="text-[#888888]"><span className="text-[#0066FF]">class</span> Solution:</div>
                <div className="text-[#666666] pl-2"># LRU Cache Get O(1)</div>
                <div className="text-[#B2B2B2] pl-2">return self.cache[key]</div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[rgba(255,255,255,0.08)]">
                <span className="text-[9px] text-[#888888]">Passed Cases</span>
                <span className="text-xs text-white font-mono font-bold">14/14 (0.8ms)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. TOP-RIGHT CORNER: AI MOCK INTERVIEW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, 9, 0],
            x: [0, -3, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.5 },
            scale: { duration: 0.8, delay: 0.5 },
            y: { duration: 8.5, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-[18%] right-[1.5%] xl:right-[3%] 2xl:right-[5%] pointer-events-auto"
        >
          <div
            style={{
              transform: `translate(${mousePos.x * 16}px, ${mousePos.y * -16}px) rotateX(${mousePos.y * 4}deg) rotateY(${mousePos.x * -4}deg)`,
              transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)"
            }}
            className="w-[200px] xl:w-[220px] bg-[#0B0B0B] rounded-2xl border border-[rgba(255,255,255,0.08)] p-4 shadow-2xl hover:border-[rgba(255,255,255,0.16)] transition-colors duration-300 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-[#0066FF]" />
                <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider">Mock Interview</span>
              </div>
              <span className="text-[8px] text-[#B2B2B2] font-mono bg-[#141414] border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded">
                Active AI
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-xl p-2.5">
                <div className="flex items-center justify-between text-[9px] text-[#888888] mb-1">
                  <span>Voice Spectrum</span>
                  <span className="text-white font-mono">Confident</span>
                </div>
                {/* Animated Voice Equalizer Bars */}
                <div className="flex items-center justify-between gap-[3px] h-5 mt-1">
                  {voiceHeights.map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }}
                      className="flex-1 rounded-full bg-[#0066FF] transition-all duration-150"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[rgba(255,255,255,0.08)]">
                <span className="text-[#888888]">Speech Clarity</span>
                <span className="text-white font-mono font-extrabold">{interviewScore}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. BOTTOM-RIGHT CORNER: MATCH ENGINE TRACKER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -10, 0],
            x: [0, 4, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.65 },
            scale: { duration: 0.8, delay: 0.65 },
            y: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-[18%] right-[1.5%] xl:right-[3%] 2xl:right-[5%] pointer-events-auto"
        >
          <div
            style={{
              transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 12}px) rotateX(${mousePos.y * 3}deg) rotateY(${mousePos.x * -3}deg)`,
              transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)"
            }}
            className="w-[195px] xl:w-[215px] bg-[#0B0B0B] rounded-2xl border border-[rgba(255,255,255,0.08)] p-4 shadow-2xl hover:border-[rgba(255,255,255,0.16)] transition-colors duration-300 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-[#0066FF]" />
                <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider">Match Engine</span>
              </div>
              <span className="text-xs text-white font-mono font-bold bg-[#141414] border border-[rgba(255,255,255,0.08)] px-2 py-0.5 rounded">
                {jobMatches} Matches
              </span>
            </div>

            {/* Real-time tracked company application list */}
            <div className="space-y-1.5 mt-2">
              {targetCompanies.map((comp, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-xl p-1.5 hover:bg-[#151515] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{comp.logo}</span>
                    <div className="text-[10px] font-bold text-white">{comp.name}</div>
                  </div>
                  <span className={`text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded border ${comp.color}`}>
                    {comp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      {/* ========================================================================= */}
      {/*              TRUSTED BY LEADERS BANNER (AT BASE OF HERO)                 */}
      {/* ========================================================================= */}
      <div className="w-full relative z-30 pt-16 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="block font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
            Trusted by Elite Students Placed At
          </span>
          
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-35 hover:opacity-55 transition-opacity duration-300">
            {/* Google */}
            <div className="flex items-center gap-1 text-white select-none">
              <svg className="h-4.5 w-auto fill-current text-white" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.564-1.88 4.59-6.887 4.59-4.33 0-7.859-3.578-7.859-7.99s3.53-7.99 7.859-7.99c2.46 0 4.108 1.025 5.05 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 7.165 1 3 5.03 3 10s4.165 9 9.24 9c5.3 0 8.825-3.692 8.825-8.913 0-.6-.065-1.062-.143-1.42l-8.682-.382z" />
              </svg>
              <span className="font-sans font-bold tracking-tight text-sm">Google</span>
            </div>

            {/* Microsoft */}
            <div className="flex items-center gap-2 text-white select-none">
              <div className="grid grid-cols-2 gap-0.5 h-3.5 w-3.5 shrink-0">
                <div className="bg-white/80 h-1.5 w-1.5"></div>
                <div className="bg-white/80 h-1.5 w-1.5"></div>
                <div className="bg-white/80 h-1.5 w-1.5"></div>
                <div className="bg-white/80 h-1.5 w-1.5"></div>
              </div>
              <span className="font-sans font-semibold tracking-tight text-sm">Microsoft</span>
            </div>

            {/* Amazon */}
            <div className="flex items-center gap-1 text-white select-none">
              <span className="font-sans font-black tracking-tight text-sm lowercase">amazon</span>
              <svg className="h-1.5 w-8 fill-current text-indigo-400 mt-1" viewBox="0 0 100 20">
                <path d="M5 5 Q 50 18 95 5 Q 98 12 90 15 Q 50 25 10 15 Z" />
              </svg>
            </div>

            {/* Adobe */}
            <div className="flex items-center gap-1.5 text-white select-none">
              <svg className="h-3.5 w-3.5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                <path d="M14.2 2H22v19.8L14.2 2zm-4.4 0H2v19.8L9.8 2zm2.2 6.4L18.6 22h-3.5l-3.1-7.1h-4l3.2-6.5z" />
              </svg>
              <span className="font-sans font-bold tracking-tight text-sm">Adobe</span>
            </div>

            {/* PayPal */}
            <div className="flex items-center gap-1 text-white select-none">
              <span className="font-sans font-extrabold italic tracking-tight text-sm text-white/90">Pay<span className="text-blue-400">Pal</span></span>
            </div>

            {/* Uber */}
            <div className="flex items-center gap-1 text-white select-none">
              <span className="font-sans font-bold tracking-widest text-sm uppercase">Uber</span>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Down Chevrons */}
        <div className="flex justify-center mt-12 animate-bounce cursor-pointer opacity-40 hover:opacity-80 transition-opacity">
          <svg 
            onClick={() => {
              const worksSec = document.getElementById("how-it-works");
              if (worksSec) worksSec.scrollIntoView({ behavior: "smooth" });
            }}
            className="h-5 w-5 text-zinc-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/*                 INTERACTIVE SIMULATOR DEMO MODAL POPUP                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isDemoPlaying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDemoPlaying(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#09090e] rounded-3xl border border-zinc-800 p-6 sm:p-8 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex flex-col gap-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-mono tracking-wider uppercase text-zinc-400">NexHire Career Simulator Tour</span>
                </div>
                <button 
                  onClick={() => setIsDemoPlaying(false)}
                  className="text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold uppercase tracking-wider"
                >
                  Close Player
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center py-6 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)] animate-bounce">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div className="max-w-md space-y-2">
                  <h4 className="text-lg font-heading font-extrabold text-white">Interactive Placement Playground Activated!</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed font-light">
                    Explore the live mock dashboard around you. Track real-time metric counters of the <strong className="text-indigo-400 font-semibold">Resume ATS Checkers</strong>, complete structured coding challenges inside our <strong className="text-indigo-400 font-semibold">DSA Streams</strong>, and test interactive speech audio waves during <strong className="text-indigo-400 font-semibold">AI Mock Interviews</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-900 text-[10px] text-zinc-600 font-mono">
                <span>SYSTEM CORE STATUS: ACTIVE</span>
                <span>NEXHIRE ENGINE V1.2</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
