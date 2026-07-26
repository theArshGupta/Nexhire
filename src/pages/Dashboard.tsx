import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap, LogOut, FileText, Code, Bot, Briefcase,
  Sparkles, CheckCircle2, ChevronRight, Play, Square,
  Terminal, ShieldCheck, Award, RefreshCw, Star, ArrowRight,
  TrendingUp, Flame, Info, Check, CornerDownRight, Search,
  Bell, Moon, Settings, MessageSquare, Compass, Sliders, ChevronDown, User
} from "lucide-react";
import { UserSession } from "../types";

// Sub-components
import DashboardOverview from "../components/DashboardOverview";
import CommandPalette from "../components/CommandPalette";
import NotificationPanel from "../components/NotificationPanel";
import AIResumeStudio from "../components/AIResumeStudio";
import AIMockInterview from "../components/AIMockInterview";
import NexMentor from "../components/NexMentor";

interface DashboardProps {
  session: UserSession;
  onSignOut: () => void;
}

export default function Dashboard({ session, onSignOut }: DashboardProps) {
  // Sidebar State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  // --- Search state & AI Quick Ask state ---
  const [quickAskInput, setQuickAskInput] = useState("");
  const [isQuickAskLoading, setIsQuickAskLoading] = useState(false);
  const [quickAskResult, setQuickAskResult] = useState("");

  // --- Resume Optimizer States ---
  const [resumeText, setResumeText] = useState(
    "Responsible for coding student registration portal. Handled backend server files. Fixed slow tables."
  );
  const [resumeScore, setResumeScore] = useState(0);
  const [optimizerLoading, setOptimizerLoading] = useState(false);
  const [isOptimizerDone, setIsOptimizerDone] = useState(false);
  const [optimizedText, setOptimizedText] = useState("");
  const [resumeTips, setResumeTips] = useState<string[]>([]);

  // --- DSA compiler states ---
  const [dsaScore, setDsaScore] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [dsaCode, setDsaCode] = useState(`bool isValidBST(TreeNode* root, TreeNode* minNode = nullptr, TreeNode* maxNode = nullptr) {
    if (!root) return true;
    if (minNode && root->val <= minNode->val) return false;
    if (maxNode && root->val >= maxNode->val) return false;
    return isValidBST(root->left, minNode, root) && isValidBST(root->right, root, maxNode);
}`);
  const [dsaLogs, setDsaLogs] = useState<string[]>([]);
  const [compilerRunning, setCompilerRunning] = useState(false);
  const [testsPassed, setTestsPassed] = useState(false);

  // --- Mock Interview States ---
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [interviewStep, setInterviewStep] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [voiceSpectrum, setVoiceSpectrum] = useState<number[]>(Array(15).fill(25));
  const [aiQuestion, setAiQuestion] = useState("Click 'Start Session' to begin the mock technical interview.");
  const [userSpeechLog, setUserSpeechLog] = useState("");

  // --- AI Career Coach State ---
  const [coachMessages, setCoachMessages] = useState([
    { sender: "coach", text: "Hello! I am your AI career coach. Ask me anything about tech resumes, coding practices, system design models, or upcoming interviews." }
  ]);
  const [coachInput, setCoachInput] = useState("");
  const [isCoachTyping, setIsCoachTyping] = useState(false);

  // --- Notifications State ---
  const [notifications, setNotifications] = useState([
    { id: "1", category: "hiring" as const, title: "Stripe Recruiter matched!", description: "A Stripe recruiter matched your verified NexScore parameters for the Summer 2026 Cohort.", time: "2 hours ago", read: false },
    { id: "2", category: "suggestion" as const, title: "Enhance Resume metrics", description: "Optimize your system design bullet to bypass Vercel's automated ATS filters.", time: "4 hours ago", read: false },
    { id: "3", category: "achievement" as const, title: "8-Day Streak unlocked!", description: "Consistent algorithmic code practice rewards 50 bonus XP.", time: "1 day ago", read: true },
    { id: "4", category: "system" as const, title: "Direct Placement Network update", description: "Vercel pipeline status was moved to On-site schedule.", time: "2 days ago", read: true },
  ]);

  // Real Database Fetched States
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);

  // Fetch real statistics and profile details
  const fetchStats = () => {
    fetch("/api/user/stats", {
      headers: {
        "Authorization": `Bearer ${session.token || ""}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
          setResumeScore(data.stats.resumeScore);
          setDsaScore(data.stats.dsaSolved);
        }
      })
      .catch(err => console.error("Error fetching user stats:", err));
  };

  // Fetch real job applications pipeline list
  const fetchApplications = () => {
    fetch("/api/jobs/applications", {
      headers: {
        "Authorization": `Bearer ${session.token || ""}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.applications) {
          setApplications(data.applications);
        }
      })
      .catch(err => console.error("Error fetching applications:", err));
  };

  // Trigger data fetching on mount
  useEffect(() => {
    fetchStats();
    fetchApplications();

    // Fetch latest resume ATS score from DB
    fetch("/api/resume/latest", {
      headers: { Authorization: `Bearer ${session.token || ""}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && typeof data.data.atsScore === "number") {
          setResumeScore(data.data.atsScore);
        }
      })
      .catch(() => {});

    // Fetch latest mock interview score from DB
    fetch("/api/interview/history", {
      headers: { Authorization: `Bearer ${session.token || ""}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.history && Array.isArray(data.history) && data.history.length > 0) {
          const latest = data.history[0];
          const score = latest.overallScore || latest.report?.overallScore || 0;
          if (score > 0) {
            setConfidenceScore(score);
          }
        }
      })
      .catch(() => {});
  }, [session.token]);

  // Periodic microphone waveform fluctuations
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInterviewing) {
      timer = setInterval(() => {
        setVoiceSpectrum((prev) => prev.map(() => Math.floor(Math.random() * 70) + 15));
        setConfidenceScore((prev) => {
          const shift = Math.random() > 0.5 ? 1 : -1;
          const next = prev + shift;
          return next >= 80 && next <= 98 ? next : prev;
        });
      }, 150);
    } else {
      setVoiceSpectrum(Array(15).fill(25));
    }
    return () => clearInterval(timer);
  }, [isInterviewing]);

  // Command palette hotkey handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- Action Handlers ---
  const handleOptimizeResume = () => {
    setOptimizerLoading(true);
    setResumeTips([]);
    setIsOptimizerDone(false);

    fetch("/api/resume/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.token || ""}`
      },
      body: JSON.stringify({
        resumeText: resumeText,
        targetRole: session.targetRole || "Software Engineer"
      })
    })
      .then(res => res.json())
      .then(data => {
        setOptimizerLoading(false);
        if (data.success && data.data) {
          setResumeScore(data.data.atsScore);
          setOptimizedText(
            data.data.summary + "\n\nKey Actionable Fix:\n- " + (data.data.actionableFixes?.[0] || "Optimize key verbs")
          );
          setResumeTips([
            ...data.data.strengths.map((s: string) => `Strength: ${s}`),
            ...data.data.criticalGaps.map((g: string) => `Gap: ${g}`),
            ...data.data.actionableFixes.map((f: string) => `Fix: ${f}`)
          ]);
          setIsOptimizerDone(true);
          fetchStats(); // Update stats in header
        } else {
          alert(`Analysis failed: ${data.error || "Please set a valid GEMINI_API_KEY"}`);
        }
      })
      .catch((err) => {
        setOptimizerLoading(false);
        alert("Network error connecting to Gemini Resume Analyzer.");
      });
  };

  const handleApplyOptimization = () => {
    setResumeText(optimizedText);
    setIsOptimizerDone(false);
  };

  const handleRunCompiler = () => {
    setCompilerRunning(true);
    setDsaLogs(["$ node compile solution.ts", "Compiling solution codebase..."]);
    setTestsPassed(false);

    fetch("/api/dsa/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.token || ""}`
      },
      body: JSON.stringify({
        code: dsaCode,
        language: selectedLanguage,
        problemId: "dsa_1"
      })
    })
      .then(res => res.json())
      .then(data => {
        setCompilerRunning(false);
        if (data.success) {
          setDsaLogs(data.logs || []);
          if (data.status === "Accepted") {
            setTestsPassed(true);
            fetchStats(); // Refresh dsaScore XP dynamically
          }
        } else {
          setDsaLogs([`Error: ${data.error || "Compilation failed"}`]);
        }
      })
      .catch((err) => {
        setCompilerRunning(false);
        setDsaLogs(["Error: Network failure connecting to compiler gateway."]);
      });
  };

  const startInterviewSession = () => {
    setIsInterviewing(true);
    setInterviewStep(1);
    setAiQuestion("How do you design a high-throughput chat server supporting real-time offline notifications?");
    setUserSpeechLog("Listening... (Speak or explain your strategy now)");
  };

  const stopInterviewSession = () => {
    setIsInterviewing(false);
    setInterviewStep(0);
    setAiQuestion("Click 'Start Session' to begin the mock technical interview.");
    setUserSpeechLog("");
  };

  const submitInterviewAnswer = () => {
    setUserSpeechLog("Analyzing your vocal tone, confidence thresholds, and semantic keywords...");
    setTimeout(() => {
      setInterviewStep(2);
      setUserSpeechLog(
        "Strong semantic keywords found (WebSockets, Redis Pub/Sub, horizontal partitioning). Your confidence rating is excellent. Minimal use of filler words (um/uh) detected."
      );
    }, 1500);
  };

  // --- AI Coach conversation handlers ---
  const handleCoachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;

    const userMsg = coachInput;
    setCoachMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setCoachInput("");
    setIsCoachTyping(true);

    setTimeout(() => {
      setIsCoachTyping(false);
      let reply = "";
      const cleaned = userMsg.toLowerCase();
      if (cleaned.includes("resume") || cleaned.includes("ats")) {
        reply = "To satisfy strict ATS checkpoints, keep your layout single-columned and always prefix bullet statements with heavy action verbs like 'Engineered', 'Optimized', or 'Architected'. Follow up immediately with key metrics showing business latency decreases or traffic multipliers.";
      } else if (cleaned.includes("stripe") || cleaned.includes("interview")) {
        reply = "Stripe interviews center heavily around high-quality API craftsmanship, schema modeling, and robust test coverage. In system design trials, structure your microservices horizontally, utilizing messaging pipelines (Kafka/RabbitMQ) for safe decoupled ingestion.";
      } else if (cleaned.includes("roadmap") || cleaned.includes("study")) {
        reply = "I recommend moving through Milestone 2: Distributed Publisher network design. Practice horizontally scaling state-sharded environments before taking your mock technical examination.";
      } else {
        reply = "Excellent inquiry! Your current progress levels indicates solid foundational logic in Tree structures. Let's augment this by preparing standard System Design templates and caching configurations.";
      }

      setCoachMessages((prev) => [...prev, { sender: "coach", text: reply }]);
    }, 1300);
  };

  // --- Quick Ask handlers ---
  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAskInput.trim()) return;

    setIsQuickAskLoading(true);
    setQuickAskResult("");

    setTimeout(() => {
      setIsQuickAskLoading(false);
      setQuickAskResult("Stripe values real-world integration precision. I suggest focusing practice on idempotent transaction design and message broker patterns.");
    }, 1200);
  };

  // --- Notification Managers ---
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div id="startup-dashboard-shell" className="relative min-h-screen bg-[#000000] text-zinc-100 flex overflow-hidden font-sans">
      
      {/* Background radial spotlight design */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,102,255,0.06),transparent)] pointer-events-none z-0"></div>

      {/* LEFT COLLAPSIBLE/HOVER SIDEBAR */}
      <aside
        id="dashboard-sidebar"
        className={`relative z-30 bg-[#121215] border-r border-[#27272A] flex flex-col justify-between transition-all duration-300 group/sidebar ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex flex-col gap-6 p-4">
          {/* Logo brand wrapper */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/15">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-heading font-black text-sm text-white tracking-tight">
                  NexHire
                </span>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer hidden lg:block text-xs"
              >
                ◀
              </button>
            )}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer hidden lg:block text-xs mx-auto"
              >
                ▶
              </button>
            )}
          </div>

          {/* Navigation link stacks */}
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: Terminal },
              { id: "resume", label: "AI Resume Studio", icon: Sparkles },
              { id: "roadmap", label: "Learning Roadmap", icon: Compass },
              { id: "coding", label: "Coding Practice", icon: Code },
              { id: "interview", label: "Mock Interviews", icon: Bot },
              { id: "applications", label: "Applications", icon: Briefcase },
              { id: "coach", label: "NexMentor", icon: Sparkles },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "achievements", label: "Achievements", icon: Award },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative cursor-pointer ${
                    isActive
                      ? "bg-zinc-900 text-indigo-400 font-bold border-l-2 border-indigo-500"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border-l-2 border-transparent"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-indigo-400" : "text-zinc-500 group-hover/sidebar:text-zinc-400"}`} />
                  {!sidebarCollapsed && (
                    <span className="text-xs tracking-wide font-medium">{tab.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Section */}
        <div className="p-4 border-t border-zinc-800/60 bg-[#09090b]/40">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 font-bold text-xs uppercase">
              {session.name.substring(0, 2)}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{session.name}</p>
                <p className="text-[10px] text-zinc-500 truncate font-mono">PRO MEMBER</p>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="mt-4 pt-3 border-t border-zinc-800/50 flex flex-col gap-2">
              <button
                onClick={onSignOut}
                className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-zinc-900 rounded-lg text-left text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTAINER WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        
        {/* STICKY BLURRED GLASS TOP NAVIGATION */}
        <header
          id="dashboard-top-nav"
          className="sticky top-0 z-20 bg-[#09090b]/75 backdrop-blur-md border-b border-zinc-800/80 px-6 py-3.5 flex items-center justify-between"
        >
          {/* Left Block: Search Launcher */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2.5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/60 px-3.5 py-1.5 rounded-xl text-left text-xs text-zinc-500 hover:text-zinc-400 transition-all cursor-pointer w-48 sm:w-64 active:scale-[0.99]"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search platform...</span>
              <kbd className="ml-auto font-mono text-[9px] bg-zinc-800 border border-zinc-700 text-zinc-500 px-1.5 py-0.2 rounded hidden sm:inline-block">Ctrl K</kbd>
            </button>
          </div>

          {/* Right Block: Actions */}
          <div className="flex items-center gap-4">
            
            {/* XP and Streak display */}
            <div className="hidden md:flex items-center gap-3.5 bg-zinc-900/40 border border-zinc-800 px-3 py-1.5 rounded-full">
              <div className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-500 fill-current" />
                <span className="text-[11px] font-mono font-black text-white">8D STREAK</span>
              </div>
              <span className="text-zinc-700 font-mono text-xs">•</span>
              <div className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-[11px] font-mono font-black text-indigo-400">{dsaScore + 180} XP</span>
              </div>
            </div>

            {/* Notifications Trigger */}
            <button
              onClick={() => setNotificationPanelOpen(true)}
              className="relative p-2 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              )}
            </button>

            {/* Profile Avatar Trigger */}
            <div
              onClick={() => setActiveTab("settings")}
              className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] cursor-pointer shadow-md shadow-blue-500/10 active:scale-95 transition-transform"
            >
              <div className="h-full w-full bg-zinc-950 rounded-[11px] flex items-center justify-center font-bold text-xs text-white">
                {session.name.substring(0, 2).toUpperCase()}
              </div>
            </div>

          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-grow">
          <AnimatePresence mode="wait">
            
            {/* 1. MASTER BENTO DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard-overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <DashboardOverview
                  session={session}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  resumeScore={resumeScore}
                  dsaScore={dsaScore}
                  confidenceScore={confidenceScore}
                  onOptimizeResume={handleOptimizeResume}
                  onRunCompiler={handleRunCompiler}
                  onStartInterview={startInterviewSession}
                />
              </motion.div>
            )}

            {/* 2. AI RESUME STUDIO TAB */}
            {activeTab === "resume" && (
              <motion.div
                key="resume-tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AIResumeStudio session={session} initialScore={resumeScore} />
              </motion.div>
            )}

            {/* 3. LEARNING ROADMAP TAB */}
            {activeTab === "roadmap" && (
              <motion.div
                key="roadmap-tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">MODULE 02 • LEARNING MODEL</span>
                    <h2 className="font-heading font-extrabold text-2xl text-white mt-1">Interactive Learning Roadmap</h2>
                  </div>
                </div>

                <div className="relative border-l border-zinc-800/80 ml-4 pl-8 space-y-8 py-4">
                  {[
                    {
                      num: "01",
                      title: "Dynamic Programming optimization models",
                      desc: "Master sharding sub-problem matrices and pathfinding formulations.",
                      xp: "120 XP",
                      status: "In Progress",
                      items: ["Knapsack memoization arrays", "Matrix chain sharding benchmarks", "Floyd-Warshall routing logs"]
                    },
                    {
                      num: "02",
                      title: "Distributed Publisher network topologies",
                      desc: "Review horizontally partitioned caching networks and pub/sub structures.",
                      xp: "150 XP",
                      status: "Awaiting",
                      items: ["Redis horizontal replication", "Kafka cluster broker parameters", "Idempotence handshakes"]
                    },
                    {
                      num: "03",
                      title: "Relational Indexing & clustering optimization",
                      desc: "Perfect performance limits of primary cluster layouts and B-tree branches.",
                      xp: "180 XP",
                      status: "Locked",
                      items: ["B-Tree range index limits", "PostgreSQL write-ahead logging", "Horizontal partitioning query pipelines"]
                    }
                  ].map((milestone, idx) => (
                    <div key={idx} className="relative group">
                      {/* Interactive node marker */}
                      <span className={`absolute -left-12 top-0 h-8 w-8 rounded-full border flex items-center justify-center font-bold text-xs ${
                        milestone.status === "In Progress"
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                          : milestone.status === "Awaiting"
                          ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                          : "bg-zinc-950 border-zinc-900 text-zinc-600"
                      }`}>
                        {milestone.num}
                      </span>

                      <div className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-6 space-y-4 max-w-3xl group-hover:border-zinc-700/80 transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-bold text-white">{milestone.title}</h3>
                            <p className="text-xs text-zinc-400 font-light mt-1">{milestone.desc}</p>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded border ${
                            milestone.status === "In Progress"
                              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse"
                              : milestone.status === "Awaiting"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-zinc-950 border-zinc-900 text-zinc-500"
                          }`}>{milestone.status}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-900">
                          {milestone.items.map((item, iIdx) => (
                            <div key={iIdx} className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-xl text-[11px] text-zinc-400 font-mono flex items-center gap-2">
                              <span className="h-1 w-1 bg-zinc-600 rounded-full"></span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. CODING PRACTICE TAB */}
            {activeTab === "coding" && (
              <motion.div
                key="dsa-tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">MODULE 03 • ALGORITHMIC MUSCLE</span>
                    <h2 className="font-heading font-extrabold text-2xl text-white mt-1">Rigorous Code Sandbox</h2>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase">Mastery Score</span>
                    <span className="text-base font-heading font-black text-emerald-400">
                      {dsaScore} xp
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left block problem specs */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Problem: Validate Binary Search Tree</span>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-mono font-medium">MEDIUM</span>
                      </div>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">
                        Given the root of a binary tree, determine if it is a valid binary search tree (BST).
                      </p>
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between items-center bg-[#111115] border border-zinc-800/80 px-4 py-2.5 rounded-t-xl border-b-0">
                        <span className="text-zinc-400 text-[11px]">solution.cpp</span>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 px-2.5 py-1 rounded focus:outline-none"
                        >
                          <option value="cpp">C++ (GCC 12)</option>
                          <option value="py">Python (3.10)</option>
                          <option value="js">JavaScript (V8)</option>
                        </select>
                      </div>
                      <textarea
                        value={dsaCode}
                        onChange={(e) => setDsaCode(e.target.value)}
                        className="w-full h-56 bg-zinc-950 border border-zinc-800 rounded-b-xl p-4 text-[10px] font-mono text-zinc-200 focus:outline-none leading-relaxed resize-none"
                      />
                    </div>
                  </div>

                  {/* Right block compilation stream */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="flex-1 bg-black rounded-2xl border border-zinc-800 p-5 font-mono text-[10px] flex flex-col justify-between min-h-[220px]">
                      <div className="flex items-center gap-1.5 text-zinc-500 border-b border-zinc-900 pb-2">
                        <Terminal className="h-3.5 w-3.5" />
                        <span>Mock GCC Output Streams</span>
                      </div>
                      <div className="flex-1 space-y-1 py-3 overflow-y-auto max-h-[160px] scrollbar-thin">
                        {dsaLogs.length === 0 ? (
                          <span className="text-zinc-600 italic">// Code sandbox waiting for compilation command.</span>
                        ) : (
                          dsaLogs.map((log, i) => (
                            <div
                              key={i}
                              className={`${
                                log.includes("Passed") || log.includes("successful")
                                  ? "text-emerald-400 font-semibold"
                                  : log.startsWith("$")
                                  ? "text-zinc-500"
                                  : "text-zinc-300"
                              }`}
                            >
                              {log}
                            </div>
                          ))
                        )}
                      </div>
                      {testsPassed && (
                        <div className="flex items-center gap-1.5 text-[9px] bg-emerald-500/10 text-emerald-400 p-2 rounded-xl border border-emerald-500/20 font-sans font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          <span>ALL TESTS COMPLETED SUCCESSFULLY!</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleRunCompiler}
                      disabled={compilerRunning}
                      className="w-full relative group overflow-hidden rounded-xl p-[1px] cursor-pointer block"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl"></span>
                      <div className="relative px-4 py-3 bg-zinc-950 hover:bg-zinc-950/10 rounded-xl transition-all duration-200 text-center">
                        <span className="font-sans text-xs font-bold text-white flex items-center justify-center gap-1.5 tracking-wider uppercase">
                          {compilerRunning ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Compiling solution scripts...</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5 fill-current text-blue-400" />
                              <span>Compile & Run Test Suite</span>
                            </>
                          )}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. MOCK INTERVIEWS TAB */}
            {activeTab === "interview" && (
              <motion.div
                key="interview-tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <AIMockInterview session={session} />
              </motion.div>
            )}

            {/* 6. APPLICATIONS PIPELINE TAB */}
            {activeTab === "applications" && (
              <motion.div
                key="applications-tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">MODULE 05 • STRATEGIC OPPORTUNITIES</span>
                    <h2 className="font-heading font-extrabold text-2xl text-white mt-1">Direct Certified Recruiter Pools</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <div className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-10 text-center text-zinc-500 font-sans">
                      <Briefcase className="h-8 w-8 mx-auto text-zinc-600 mb-3" />
                      <p className="text-xs">No active applications in your pipeline yet.</p>
                      <p className="text-[10px] text-zinc-600 mt-1">Verify your placement matches in the Opportunities board to start pipelines.</p>
                    </div>
                  ) : (
                    applications.map((app, idx) => {
                      let color = "text-zinc-400 bg-zinc-500/10 border-zinc-500/25";
                      if (app.status === "Offered") color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
                      else if (app.status === "Interview") color = "text-purple-400 bg-purple-500/10 border-purple-500/25";
                      else if (app.status === "Screening") color = "text-amber-400 bg-amber-500/10 border-amber-500/25";
                      else if (app.status === "Applied") color = "text-blue-400 bg-blue-500/10 border-blue-500/25";
                      else if (app.status === "Matched") color = "text-zinc-400 bg-zinc-500/10 border-zinc-500/25";
                      else if (app.status === "Rejected") color = "text-red-400 bg-red-500/10 border-red-500/25";

                      return (
                        <div
                          key={app.id || idx}
                          className="bg-[#111115] border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-5 flex flex-col md:flex-row gap-6 justify-between transition-all duration-300"
                        >
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-base shadow-sm">
                                {app.logo || "💼"}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-heading font-extrabold text-sm text-white">{app.companyName}</h3>
                                  <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.2 rounded font-mono">
                                    NEXHIRE VETTED
                                  </span>
                                </div>
                                <span className="text-[11px] text-zinc-500 block mt-0.5">{app.role}</span>
                              </div>
                            </div>

                            <div className="space-y-2 pl-12 border-l border-zinc-800 mt-2">
                              <div className="flex items-start gap-2 text-[10px] text-zinc-400">
                                <CornerDownRight className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-0.5" />
                                <span className="leading-relaxed font-light">
                                  <strong className="text-zinc-300 font-semibold">Application Record Registered</strong> • {app.appliedDate}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex md:flex-col justify-between items-end gap-3 md:text-right shrink-0">
                            <div>
                              <span className="text-[9px] text-zinc-600 font-mono uppercase block">NexScore Threshold</span>
                              <span className="text-xs font-mono font-bold text-zinc-300">{app.matchScore} / 100</span>
                            </div>
                            <span className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${color}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {/* 7. NEXMENTOR AI CAREER WORKSPACE */}
            {activeTab === "coach" && (
              <motion.div
                key="coach-tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <NexMentor session={session} />
              </motion.div>
            )}

            {/* 8. ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics-tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">MODULE 07 • PERFORMANCE SUMMARY</span>
                    <h2 className="font-heading font-extrabold text-2xl text-white mt-1">Analytics Intelligence</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Interview Readiness", val: "89%", status: "Optimal", color: "text-indigo-400" },
                    { title: "Weekly Growth", val: "+14.2%", status: "Steady", color: "text-emerald-400" },
                    { title: "Learning Hours", val: "18.5 hrs", status: "Target met", color: "text-indigo-400" },
                    { title: "Success Rate", val: "94.8%", status: "Excellent", color: "text-emerald-400" },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">{stat.title}</span>
                      <p className={`text-2xl font-black font-heading ${stat.color}`}>{stat.val}</p>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/70" />
                        <span>Status: {stat.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytical progress list details */}
                <div className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-bold text-white">Detailed Diagnostic Breakdown</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Algorithmic Precision (BSTs, Hash Tables, Matrix sharding)", pct: 92, count: "132 xp completed" },
                      { label: "ATS Keyword Compatibility", pct: resumeScore, count: `${resumeScore}% coverage matched` },
                      { label: "Mock Oral Communication & Vocal Eloquence", pct: confidenceScore, count: `${confidenceScore}% confidence score` },
                    ].map((row, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-zinc-300">{row.label}</span>
                          <span className="text-zinc-400">{row.count}</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                          <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${row.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 9. ACHIEVEMENTS TAB */}
            {activeTab === "achievements" && (
              <motion.div
                key="achievements-tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">MODULE 08 • GAMIFIED PROGRESS</span>
                    <h2 className="font-heading font-extrabold text-2xl text-white mt-1">Achievements Gallery</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "ATS Overlord", desc: "Unlock by increasing resume bullet validation score above 90%.", unlocked: resumeScore >= 90, badge: "🛡️" },
                    { title: "BST Conqueror", desc: "Unlock by executing binary tree traversals without compiler logs.", unlocked: testsPassed, badge: "📐" },
                    { title: "Eloquent Speaker", desc: "Unlock by maintaining interview oral confidence indices above 85%.", unlocked: confidenceScore >= 85, badge: "🎙️" },
                    { title: "First Recruiter Match", desc: "Unlock by qualifying for corporate Stripe placement pipelines.", unlocked: true, badge: "💳" },
                  ].map((ach, idx) => (
                    <div
                      key={idx}
                      className={`relative border rounded-2xl p-5 flex flex-col justify-between min-h-[160px] transition-all duration-300 ${
                        ach.unlocked
                          ? "bg-[#111115] border-zinc-800/80 hover:border-indigo-500/30 text-white"
                          : "bg-zinc-950/30 border-zinc-900/60 text-zinc-500 opacity-60"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="h-9 w-9 bg-zinc-900 rounded-xl flex items-center justify-center text-lg border border-zinc-800">
                            {ach.badge}
                          </div>
                          {ach.unlocked ? (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold tracking-wider">UNLOCKED</span>
                          ) : (
                            <span className="text-[9px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded font-mono">LOCKED</span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold">{ach.title}</h3>
                        <p className="text-[11px] leading-relaxed font-light text-zinc-500">{ach.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 10. SETTINGS TAB */}
            {activeTab === "settings" && (
              <motion.div
                key="settings-tab-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">MODULE 09 • SYSTEM PREFERENCES</span>
                    <h2 className="font-heading font-extrabold text-2xl text-white mt-1">Platform Settings</h2>
                  </div>
                </div>

                <div className="bg-[#111115] border border-zinc-800/80 rounded-2xl p-6 space-y-6 max-w-3xl">
                  {/* Account Profile Details */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Verified Candidate</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Primary Name</span>
                        <p className="text-xs font-bold text-white">{session.name}</p>
                      </div>
                      <div className="space-y-1 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Authorized Email</span>
                        <p className="text-xs font-bold text-indigo-400 font-mono">{session.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-3 pt-4 border-t border-zinc-900">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Preferences</h3>
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-white">Direct Placement Matchmaking</p>
                          <p className="text-[11px] text-zinc-500 font-light mt-0.5">Let verified recruiters matching your NexScore view metrics instantly.</p>
                        </div>
                        <div className="h-5 w-10 bg-indigo-600 rounded-full p-0.5 cursor-pointer flex items-center justify-end">
                          <div className="h-4 w-4 bg-white rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-white">Audio Mock Feedback Recording</p>
                          <p className="text-[11px] text-zinc-500 font-light mt-0.5">Allow our voice synthesis model to record vocal benchmarks safely offline.</p>
                        </div>
                        <div className="h-5 w-10 bg-zinc-800 rounded-full p-0.5 cursor-pointer flex items-center justify-start">
                          <div className="h-4 w-4 bg-zinc-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* SECURE SUB-FOOTER */}
        <footer
          id="dashboard-sub-footer"
          className="border-t border-zinc-800/40 py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-zinc-600 bg-[#09090b]/20"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500/60" />
            <span>NEXHIRE CORE COCKPIT ENGINE • SHARED ACCOUNT CHANNEL</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>COCKPIT VER: 1.4</span>
            <span>GATEWAY STATUS: ENCRYPTED SECURE</span>
          </div>
        </footer>
      </div>

      {/* FLOAT COMMAND PALETTE */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onSignOut={onSignOut}
      />

      {/* FLOAT SLIDE-OVER NOTIFICATIONS PANEL */}
      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />

    </div>
  );
}
