import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText, Code, Bot, Briefcase, Sparkles, Award, Star,
  ArrowRight, Flame, TrendingUp, Info, Check, Calendar, ChevronRight,
  Terminal, ShieldCheck, CheckCircle2, Clock, MapPin, Zap, User
} from "lucide-react";
import { UserSession } from "../types";

interface DashboardOverviewProps {
  session: UserSession;
  onNavigateTab: (tab: string) => void;
  resumeScore: number;
  dsaScore: number;
  confidenceScore: number;
  onOptimizeResume: () => void;
  onRunCompiler: () => void;
  onStartInterview: () => void;
}

export default function DashboardOverview({
  session,
  onNavigateTab,
  resumeScore,
  dsaScore,
  confidenceScore,
  onOptimizeResume,
  onRunCompiler,
  onStartInterview
}: DashboardOverviewProps) {
  // Kanban Task State
  const [tasks, setTasks] = useState([
    { id: "t1", title: "Complete System Design review for Vercel", due: "Today's Tasks", done: false, priority: "High" },
    { id: "t2", title: "Optimize previous internship resume bullets", due: "Today's Tasks", done: true, priority: "Medium" },
    { id: "t3", title: "Solve 3 Binary Search Tree challenges", due: "Tomorrow", done: false, priority: "High" },
    { id: "t4", title: "Schedule Stripe technical on-site mock", due: "Tomorrow", done: false, priority: "Medium" },
    { id: "t5", title: "Review behavioral answers on engineering failures", due: "This Week", done: false, priority: "Low" },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const activeTasks = tasks.filter((t) => !t.done).length;

  // AI Advice rotating list
  const adviceList = [
    "Your BST execution beats 98% of candidates. Focus next on Graph traversals and topological sorting.",
    "Stripe values highly structured API reasoning. Prepare for an interactive integration design mock.",
    "Your current resume ATS score is excellent (94%). Leverage this to apply to Linear's new product tier role.",
    "Vocal clarity is at a record high of 92%. Maintain a calm, structured tone for on-site interviews."
  ];
  const [adviceIndex, setAdviceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdviceIndex((prev) => (prev + 1) % adviceList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12">
      {/* 1. HERO HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] p-8 md:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3.5">
            <span className="font-mono text-xs text-[#B2B2B2] font-bold uppercase tracking-widest bg-[#141414] px-2.5 py-1 rounded border border-[rgba(255,255,255,0.08)]">
              NexHire Placement Engine
            </span>
            <div>
              <h1 className="font-sans font-black text-3xl md:text-4xl text-white tracking-tight leading-none">
                Welcome back, {session.name.split(" ")[0]} 👋
              </h1>
              <p className="font-sans font-medium text-base text-[#B2B2B2] mt-2 max-w-xl leading-relaxed">
                Build. Prepare. Get Hired.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onNavigateTab("interview")}
                className="btn-primary-gradient px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <span>Continue Preparing</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.08)] pt-6 md:pt-0 md:pl-8">
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-[#777777] font-medium uppercase block">Readiness %</span>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-xl md:text-2xl text-white">89%</span>
                <TrendingUp className="h-4 w-4 text-[#0066FF]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-[#777777] font-medium uppercase block">Weekly Goal</span>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-xl md:text-2xl text-white">4 / 5</span>
                <Check className="h-4 w-4 text-[#0066FF]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-[#777777] font-medium uppercase block">Today's XP</span>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-xl md:text-2xl text-white">180</span>
                <Zap className="h-4 w-4 text-[#0066FF]" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic visual progress indicators */}
        <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)] grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Circle 1 */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0 flex items-center justify-center">
              <svg className="h-12 w-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#1f1f1f" strokeWidth="4" fill="transparent" />
                <circle cx="24" cy="24" r="20" stroke="#0066FF" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - 0.89)} strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-bold font-mono text-white">89%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Interview Readiness</p>
              <p className="text-xs text-[#B2B2B2] font-normal mt-0.5">Scored across ATS, DSA and Communication</p>
            </div>
          </div>

          {/* Progress Circle 2 */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0 flex items-center justify-center">
              <svg className="h-12 w-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#1f1f1f" strokeWidth="4" fill="transparent" />
                <circle cx="24" cy="24" r="20" stroke="#0066FF" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - 0.8)} strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-bold font-mono text-white">80%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Weekly Targets Met</p>
              <p className="text-xs text-[#B2B2B2] font-normal mt-0.5">80% of weekly coding targets cleared</p>
            </div>
          </div>

          {/* Progress Circle 3 */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0 flex items-center justify-center">
              <svg className="h-12 w-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#1f1f1f" strokeWidth="4" fill="transparent" />
                <circle cx="24" cy="24" r="20" stroke="#0066FF" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - 0.7)} strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-bold font-mono text-white">70%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">ATS Improvements</p>
              <p className="text-xs text-[#B2B2B2] font-normal mt-0.5">Resume metrics alignment matched</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CENTERPIECE AI CAREER COACH */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] p-6 shadow-xl group hover:border-[rgba(255,255,255,0.16)] transition-all duration-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4 items-start">
            <div className="relative shrink-0 mt-1">
              <div className="h-10 w-10 rounded-xl bg-[#141414] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                <Bot className="h-5 w-5 text-[#0066FF]" />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-mono font-bold text-[#B2B2B2] uppercase tracking-widest">NexAI Career Co-pilot</h2>
                <span className="text-[10px] bg-[#141414] text-white border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">LIVE FEED</span>
              </div>
              <div className="text-base font-sans font-medium text-white min-h-[40px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={adviceIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="leading-relaxed font-semibold text-white italic"
                  >
                    "{adviceList[adviceIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab("coach")}
              className="px-4.5 py-2.5 border border-[rgba(255,255,255,0.08)] bg-[#101010] hover:bg-[#151515] text-white text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wide"
            >
              <span>Consult Coach</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#0066FF]" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. CORE INTEGRATIVE BENTO BUNDLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* WIDGET A: RESUME REVIEW (Lg: 6) */}
        <div className="lg:col-span-6 bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 hover:border-[rgba(255,255,255,0.16)] transition-all duration-300 relative group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#141414] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#0066FF]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Resume Scorecard</h3>
                  <p className="text-xs text-[#B2B2B2] font-normal mt-1">ATS Matching Score</p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#101010] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-sm font-black font-heading text-white">
                {resumeScore}%
              </div>
            </div>

            <div className="space-y-2 bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#B2B2B2] font-normal">Structure Validation:</span>
                <span className="text-white font-medium font-mono">Passed ✓</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#B2B2B2] font-normal">Quantifiable Impact:</span>
                <span className="text-white font-mono">
                  {resumeScore > 75 ? "Excellent (92%)" : "Low (68%)"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#B2B2B2] font-normal">STAR Metrics Rating:</span>
                <span className="text-white font-mono">
                  {resumeScore > 75 ? "Optimal" : "Sub-optimal"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-between items-center border-t border-[rgba(255,255,255,0.08)] mt-4">
            <span className="text-xs text-[#777777] italic font-normal">
              {resumeScore > 75 ? "Resume aligned for ATS screening." : "Optimize bullets to increase matching."}
            </span>
            <button
              onClick={() => onNavigateTab("resume")}
              className="text-xs font-bold text-white hover:text-[#0066FF] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Optimise Bullet</span>
              <ChevronRight className="h-4 w-4 text-[#0066FF]" />
            </button>
          </div>
        </div>

        {/* WIDGET B: CODING SANDBOX (Lg: 6) */}
        <div className="lg:col-span-6 bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 hover:border-[rgba(255,255,255,0.16)] transition-all duration-300 relative group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#141414] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#0066FF]">
                  <Code className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">DSA Algorithmic Core</h3>
                  <p className="text-xs text-[#B2B2B2] font-normal mt-1">Problem Solving stats</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#141414] border border-[rgba(255,255,255,0.08)] px-2.5 py-1 rounded text-xs font-mono font-bold text-white">
                <Flame className="h-3.5 w-3.5 text-[#0066FF]" />
                <span>8 DAY STREAK</span>
              </div>
            </div>

            {/* Mini coding metric graph */}
            <div className="p-4 bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-2xl flex items-end justify-between h-20 gap-2">
              {[35, 48, 40, 60, 52, 70, 85].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    style={{ height: `${val}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      idx === 6 ? "bg-[#0066FF]" : "bg-[#1A1A1A]"
                    }`}
                  ></div>
                  <span className="text-[10px] font-mono text-[#777777] font-medium">{["M", "T", "W", "T", "F", "S", "S"][idx]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-between items-center border-t border-[rgba(255,255,255,0.08)] mt-4">
            <div className="text-xs text-[#B2B2B2] font-normal">
              <span className="font-bold text-white">{dsaScore}</span> XP accumulated
            </div>
            <button
              onClick={() => onNavigateTab("coding")}
              className="text-xs font-bold text-white hover:text-[#0066FF] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Practice DSA</span>
              <ChevronRight className="h-4 w-4 text-[#0066FF]" />
            </button>
          </div>
        </div>

        {/* WIDGET C: MOCK INTERVIEWS (Lg: 7) */}
        <div className="lg:col-span-7 bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 hover:border-[rgba(255,255,255,0.16)] transition-all duration-300 relative group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#141414] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#0066FF]">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">AI Mock Interview Sessions</h3>
                  <p className="text-xs text-[#B2B2B2] font-normal mt-1">Vocal communication index</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-[#0066FF] fill-current" />
                <span className="text-sm font-bold text-white">{confidenceScore}% score</span>
              </div>
            </div>

            <div className="bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white">Stripe Systems On-site Preparation</p>
                <p className="text-xs text-[#B2B2B2] leading-normal font-normal">Recommended focus: Horizontally partitioned publisher networks</p>
              </div>
              <div className="shrink-0 flex items-center gap-1 h-8">
                {[15, 30, 20, 45, 25, 40, 15].map((h, i) => (
                  <div key={i} style={{ height: `${h}px` }} className="w-0.5 bg-[#0066FF] rounded-full"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-between items-center border-t border-[rgba(255,255,255,0.08)] mt-4">
            <span className="text-xs text-[#777777] font-normal italic">Next interview scheduled tomorrow</span>
            <button
              onClick={() => onNavigateTab("interview")}
              className="text-xs font-bold text-white hover:text-[#0066FF] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Practice Mock</span>
              <ChevronRight className="h-4 w-4 text-[#0066FF]" />
            </button>
          </div>
        </div>

        {/* WIDGET D: APPLICATIONS PIPELINE (Lg: 5) */}
        <div className="lg:col-span-5 bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 hover:border-[rgba(255,255,255,0.16)] transition-all duration-300 relative group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#141414] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#0066FF]">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Placement Pipeline</h3>
                  <p className="text-xs text-[#B2B2B2] font-normal mt-1">Hiring progress pipeline</p>
                </div>
              </div>
            </div>

            {/* Quick mini-funnel */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-[#B2B2B2] mb-1 font-normal">
                  <span>ATS Screening cleared</span>
                  <span className="font-bold text-white">3 applications</span>
                </div>
                <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0066FF] h-full rounded-full w-[100%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#B2B2B2] mb-1 font-normal">
                  <span>Technical rounds pending</span>
                  <span className="font-bold text-white">2 pending</span>
                </div>
                <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0066FF] h-full rounded-full w-[65%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#B2B2B2] mb-1 font-normal">
                  <span>Direct offer Extended</span>
                  <span className="font-bold text-white">1 offer</span>
                </div>
                <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0066FF] h-full rounded-full w-[33%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-between items-center border-t border-[rgba(255,255,255,0.08)] mt-4">
            <span className="text-xs text-[#777777] font-normal">1 active Stripe tracking pipeline</span>
            <button
              onClick={() => onNavigateTab("applications")}
              className="text-xs font-bold text-white hover:text-[#0066FF] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Pipeline</span>
              <ChevronRight className="h-4 w-4 text-[#0066FF]" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. CONTINUE PREPARING LARGE CARDS GRID */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <h2 className="text-base font-mono font-bold text-white uppercase tracking-widest">Continue Preparing</h2>
            </div>
            <p className="text-sm text-[#A1A1AA] font-normal mt-1">Jump directly into specialized mock scenarios, AI evaluation systems, and interactive tools.</p>
          </div>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30 font-semibold self-start sm:self-auto">
            8 Active Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {[
            {
              title: "Resume Review",
              desc: "Verify keyword density, ATS alignment, and STAR structure metrics against top tech standards.",
              tab: "resume",
              icon: FileText,
              tag: "ATS Audit",
              theme: {
                borderHover: "hover:border-blue-500/50 hover:shadow-blue-500/10",
                gradient: "from-blue-600/20 via-cyan-500/10 to-transparent",
                iconBg: "group-hover:bg-blue-500/20 group-hover:border-blue-500/40 text-blue-400",
                badge: "bg-blue-500/10 text-blue-300 border-blue-500/30",
                arrow: "text-blue-400"
              }
            },
            {
              title: "Mock Interview",
              desc: "Simulate structured technical and behavioral oral examinations with real-time AI feedback.",
              tab: "interview",
              icon: Bot,
              tag: "Live AI Sim",
              theme: {
                borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
                gradient: "from-purple-600/20 via-indigo-500/10 to-transparent",
                iconBg: "group-hover:bg-purple-500/20 group-hover:border-purple-500/40 text-purple-400",
                badge: "bg-purple-500/10 text-purple-300 border-purple-500/30",
                arrow: "text-purple-400"
              }
            },
            {
              title: "Coding Round",
              desc: "Solve structured algorithmic challenges, run test cases, and dry-run code synchronously.",
              tab: "coding",
              icon: Code,
              tag: "DSA & Compiler",
              theme: {
                borderHover: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
                gradient: "from-cyan-600/20 via-blue-500/10 to-transparent",
                iconBg: "group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 text-cyan-400",
                badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
                arrow: "text-cyan-400"
              }
            },
            {
              title: "Aptitude Scenarios",
              desc: "Sharpen quantitative logic, analytical puzzles, probability, and sequence assessments.",
              tab: "coach",
              icon: Sparkles,
              tag: "Quant & Puzzles",
              theme: {
                borderHover: "hover:border-amber-500/50 hover:shadow-amber-500/10",
                gradient: "from-amber-600/20 via-orange-500/10 to-transparent",
                iconBg: "group-hover:bg-amber-500/20 group-hover:border-amber-500/40 text-amber-400",
                badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
                arrow: "text-amber-400"
              }
            },
            {
              title: "HR Standard Questions",
              desc: "Perfect foundational self-introductions, career goal rationales, and negotiation framing.",
              tab: "interview",
              icon: Bot,
              tag: "Behavioral HR",
              theme: {
                borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
                gradient: "from-emerald-600/20 via-teal-500/10 to-transparent",
                iconBg: "group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 text-emerald-400",
                badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
                arrow: "text-emerald-400"
              }
            },
            {
              title: "Behavioral Parameters",
              desc: "Structure historical leadership anecdotes using the STAR formula to showcase ownership.",
              tab: "interview",
              icon: Bot,
              tag: "STAR Method",
              theme: {
                borderHover: "hover:border-rose-500/50 hover:shadow-rose-500/10",
                gradient: "from-rose-600/20 via-pink-500/10 to-transparent",
                iconBg: "group-hover:bg-rose-500/20 group-hover:border-rose-500/40 text-rose-400",
                badge: "bg-rose-500/10 text-rose-300 border-rose-500/30",
                arrow: "text-rose-400"
              }
            },
            {
              title: "Systems & Projects",
              desc: "Map database schemas, caching layers, microservices, and high-concurrency scaling.",
              tab: "coding",
              icon: Code,
              tag: "System Design",
              theme: {
                borderHover: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
                gradient: "from-indigo-600/20 via-purple-500/10 to-transparent",
                iconBg: "group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 text-indigo-400",
                badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
                arrow: "text-indigo-400"
              }
            },
            {
              title: "AI Interactive Coach",
              desc: "Interact with our core mentor for personalized interview strategies, schedules, and guidance.",
              tab: "coach",
              icon: Bot,
              tag: "Mentor Chat",
              theme: {
                borderHover: "hover:border-violet-500/50 hover:shadow-violet-500/10",
                gradient: "from-violet-600/20 via-fuchsia-500/10 to-transparent",
                iconBg: "group-hover:bg-violet-500/20 group-hover:border-violet-500/40 text-violet-400",
                badge: "bg-violet-500/10 text-violet-300 border-violet-500/30",
                arrow: "text-violet-400"
              }
            },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                onClick={() => onNavigateTab(card.tab)}
                className={`group relative overflow-hidden bg-[#0F0F14] border border-[rgba(255,255,255,0.08)] ${card.theme.borderHover} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[180px]`}
              >
                {/* Ambient Radial Spotlight Gradient on Hover */}
                <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl bg-gradient-to-br ${card.theme.gradient}`} />
                
                {/* Top Subtle Edge Highlight Line */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className={`h-9 w-9 rounded-xl bg-[#16161D] border border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all duration-300 shadow-inner group-hover:scale-110 ${card.theme.iconBg}`}>
                      <Icon className="h-4.5 w-4.5 transition-transform group-hover:scale-105" />
                    </div>
                    
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold transition-transform duration-300 group-hover:scale-105 ${card.theme.badge}`}>
                      {card.tag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-200 transition-all duration-300">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] group-hover:text-zinc-300 leading-relaxed font-normal transition-colors duration-200">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between relative z-10">
                  <span className="text-[11px] font-mono font-semibold text-[#71717A] group-hover:text-white transition-colors duration-200">
                    Launch Module
                  </span>
                  <div className="flex items-center gap-1">
                    <ArrowRight className={`h-4 w-4 ${card.theme.arrow} group-hover:translate-x-1.5 transition-transform duration-300`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 5. ROADMAP, TIMELINE & KANBAN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ROADMAP milestones (Lg: 7) */}
        <div className="lg:col-span-7 bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 hover:border-[rgba(255,255,255,0.16)] transition-all duration-300">
          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.08)] pb-4 mb-6">
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Learning Roadmap</h3>
              <p className="text-xs text-[#B2B2B2] font-normal mt-1">Interactive structural curriculum</p>
            </div>
            <button
              onClick={() => onNavigateTab("roadmap")}
              className="text-xs font-bold text-white hover:text-[#0066FF] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Roadmap</span>
              <ChevronRight className="h-4 w-4 text-[#0066FF]" />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { title: "Dynamic Programming optimization models", status: "In Progress", xp: "120 XP", num: "01", progress: 60 },
              { title: "Distributed Publisher network topologies", status: "Awaiting", xp: "150 XP", num: "02", progress: 0 },
              { title: "Relational Indexing & clustering optimization", status: "Locked", xp: "180 XP", num: "03", progress: 0 },
            ].map((milestone, idx) => (
              <div key={idx} className="bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex gap-3.5 items-center">
                  <div className="h-8 w-8 rounded-lg bg-[#141414] flex items-center justify-center text-xs font-mono font-bold text-white border border-[rgba(255,255,255,0.08)]">
                    {milestone.num}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{milestone.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B2B2B2]">{milestone.status}</span>
                      <span className="text-[#777777]">•</span>
                      <span className="text-[10px] font-mono text-[#777777]">{milestone.xp}</span>
                    </div>
                  </div>
                </div>

                {milestone.progress > 0 ? (
                  <div className="w-20 shrink-0 text-right space-y-1">
                    <span className="text-xs font-mono text-white font-bold">{milestone.progress}%</span>
                    <div className="w-full bg-[#1A1A1A] h-1 rounded-full overflow-hidden border border-[rgba(255,255,255,0.08)]">
                      <div className="bg-[#0066FF] h-full" style={{ width: `${milestone.progress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-[#777777] font-bold uppercase shrink-0">LOCKED</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* UPCOMING KANBAN-INSPIRED TASKS (Lg: 5) */}
        <div className="lg:col-span-5 bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 hover:border-[rgba(255,255,255,0.16)] transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.08)] pb-4 mb-4">
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Placement Tasks</h3>
                <p className="text-xs text-[#B2B2B2] font-normal mt-1">{activeTasks} tasks remaining</p>
              </div>
              <span className="text-[10px] bg-[#141414] text-white px-2 py-0.5 rounded font-mono font-semibold border border-[rgba(255,255,255,0.08)]">KANBAN</span>
            </div>

            {/* Kanban List */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto scrollbar-thin">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    task.done
                      ? "bg-[#101010] border-[rgba(255,255,255,0.04)] opacity-50"
                      : "bg-[#101010] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)]"
                  }`}
                >
                  <div className={`mt-0.5 h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    task.done
                      ? "bg-[#0066FF] border-[#0066FF] text-white"
                      : "bg-transparent border-[rgba(255,255,255,0.16)] hover:border-white"
                  }`}>
                    {task.done && <Check className="h-3.5 w-3.5" />}
                  </div>
                  
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className={`text-sm font-semibold leading-relaxed ${task.done ? "line-through text-[#777777]" : "text-white"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#777777]">{task.due}</span>
                      <span className="text-[#777777] font-mono text-[10px]">•</span>
                      <span className="font-mono text-[9px] px-1 py-0.5 rounded font-bold uppercase tracking-wider bg-[#141414] text-[#B2B2B2] border border-[rgba(255,255,255,0.08)]">{task.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] mt-4 flex items-center justify-between text-xs font-mono text-[#777777] font-medium">
            <span>Click boxes to complete</span>
            <span>Task tracker</span>
          </div>
        </div>

      </div>
    </div>
  );
}
