import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Bot, Briefcase, Award, TrendingUp, Search, Play, StopCircle,
  RefreshCw, Mic, MicOff, Volume2, Video, Eye, ShieldCheck, AlertCircle,
  CheckCircle2, CornerDownRight, BarChart3, Clock, Layers, Star, Plus, X,
  ChevronDown, ChevronUp, MessageSquare, ThumbsUp, Send, Check, Info, Sparkle,
  BookOpen, Flame, HelpCircle, Trophy, User, ArrowRight, Bookmark, Share2,
  Download, Paperclip, Terminal, Code2, Heart, Trash2, Pin, FolderOpen,
  ArrowUpRight, Compass, Shield, Cpu, RefreshCcw, Sparkles as SparklesIcon, FileText,
  Copy, ListTodo
} from "lucide-react";
import LeftSidebarWidgets from "./LeftSidebarWidgets";
import RightSidebarWidgets from "./RightSidebarWidgets";

interface NexMentorProps {
  session: { name: string; email: string; token?: string };
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  codeBlock?: {
    language: string;
    code: string;
    explanation?: string;
  };
  stages?: string[];
  isPinned?: boolean;
}

interface Folder {
  id: string;
  name: string;
  color: string;
}

interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
}

interface AIMemory {
  currentGoal: string;
  learningProgress: number;
  savedPreferences: string;
  targetCompany: string;
  currentTechStack: string[];
  weakAreas: string[];
  recentTopics: string[];
}

export default function NexMentor({ session }: NexMentorProps) {
  // Navigation & Workspace State
  const [conversations, setConversations] = useState<{
    id: string;
    title: string;
    preview: string;
    isPinned: boolean;
    isFavorite: boolean;
    category: "recent" | "pinned" | "favorite" | "resume" | "interview";
    timestamp: string;
    messages: Message[];
  }[]>([
    {
      id: "chat-new",
      title: "New Chat",
      preview: "What's on your mind today?",
      isPinned: false,
      isFavorite: false,
      category: "recent",
      timestamp: "Just now",
      messages: []
    },
    {
      id: "chat-01",
      title: "Vercel Portfolio & ATS Review",
      preview: "We analyzed your Next.js project layout...",
      isPinned: false,
      isFavorite: true,
      category: "pinned",
      timestamp: "10:12 AM",
      messages: [
        {
          id: "m1",
          sender: "ai",
          text: "Welcome back! Let's continue review of your Vercel interview portfolio. We've refined your resume's technical summary to score above 94 on automated ATS engines.",
          timestamp: "10:12 AM"
        }
      ]
    },
    {
      id: "chat-02",
      title: "LRU Cache O(1) Explanation",
      preview: "Let's break down the Doubly Linked List + Hash Map schema...",
      isPinned: false,
      isFavorite: false,
      category: "pinned",
      timestamp: "Yesterday",
      messages: [
        {
          id: "m2",
          sender: "ai",
          text: "Let's explore the optimal implementation of an LRU Cache. To achieve O(1) reads and writes, we marry a Doubly Linked List for order tracking with a Hash Map for constant time node lookups.",
          timestamp: "Yesterday"
        }
      ]
    },
    {
      id: "chat-03",
      title: "System Design: CDN Rate Limiting",
      preview: "Exploring token bucket rates synchronized across Edge network routing...",
      isPinned: false,
      isFavorite: true,
      category: "favorite",
      timestamp: "2 days ago",
      messages: [
        {
          id: "m3",
          sender: "ai",
          text: "Ready to whiteboard the CDN Edge Token Bucket system. Let's start with distributed synchronization guarantees.",
          timestamp: "2 days ago"
        }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState<string>("chat-new");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  // Active chat search & lists
  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  // Dynamic Workspace State - Changes based on what user is talking about
  const [workspaceContext, setWorkspaceContext] = useState({
    topic: "Vercel Portfolio Prep",
    targetCompany: "Vercel",
    todayLearning: "Reconciliation Hooks & Edge Hydration",
    interviewTip: "Vercel focuses heavily on client-side loading speeds. Describe Largest Contentful Paint (LCP) offsets first.",
    resumeTip: "List Vercel deployment speeds. Mention dynamic route layout optimization directly.",
    challengeTitle: "Implement Custom React useTransition Hook",
    challengeDesc: "Write a high-performance useTransition mock queue that schedules non-blocking rendering frames.",
    recentActivity: "Optimized ATS score from 68% to 94%",
    upcomingInterviews: [
      { company: "Vercel", role: "Frontend Platform Engineer", date: "July 24, 02:00 PM" },
      { company: "Linear", role: "Core Systems Architect", date: "July 28, 10:30 AM" }
    ],
    techStack: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Node.js"]
  });

  // Folders and Saved Prompts list
  const [folders] = useState<Folder[]>([
    { id: "f-1", name: "System Design whiteboards", color: "bg-indigo-500" },
    { id: "f-2", name: "Coding Practice DSA", color: "bg-emerald-500" },
    { id: "f-3", name: "Behavioral Star Answers", color: "bg-purple-500" }
  ]);

  const [savedPrompts] = useState<SavedPrompt[]>([
    { id: "p-1", title: "Analyze My Project Portfolio", prompt: "Evaluate my Next.js GitHub repository architecture for production standards." },
    { id: "p-2", title: "Mock Google Coding Round", prompt: "Start an interactive medium-hard algorithmic DSA round on Tree traversal." },
    { id: "p-3", title: "Review Resume ATS score", prompt: "Critique my software engineering resume text for competitive ATS tracking." }
  ]);

  // AI Memory Tracker Card
  const [aiMemory, setAiMemory] = useState<AIMemory>({
    currentGoal: "Land Senior Frontend Platform Role at Vercel / Linear",
    learningProgress: 76,
    savedPreferences: "Prefers rigorous engineering explanations, values deep architectural tradeoffs over high-level advice.",
    targetCompany: "Vercel",
    currentTechStack: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Redis"],
    weakAreas: ["Distributed System consensus protocols", "Chromium rendering engine composite calculations"],
    recentTopics: ["React 19 Server Components", "Tailwind v4 optimization", "Token bucket rate limits"]
  });

  // Chat input and voice states
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [currentThinkingStage, setCurrentThinkingStage] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "speaking">("idle");
  const [voiceSpectrum, setVoiceSpectrum] = useState<number[]>(Array(16).fill(15));
  
  // Custom File attachment state
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Interactive Workspace States
  const [atsScore, setAtsScore] = useState(88);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<{ id: string; text: string; timestamp: string }[]>(() => {
    const saved = localStorage.getItem("nexmentor_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [isInputFocused, setIsInputFocused] = useState(false);

  // References
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto Scroll
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, streamingText, isThinking]);

  // Voice spectrum animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVoiceMode && voiceState !== "idle") {
      interval = setInterval(() => {
        setVoiceSpectrum(Array.from({ length: 16 }, () => Math.floor(Math.random() * 70) + 15));
      }, 100);
    } else {
      setVoiceSpectrum(Array(16).fill(12));
    }
    return () => clearInterval(interval);
  }, [isVoiceMode, voiceState]);

  // Send query to Real AI Chatbot Endpoint (/api/mentor/chat)
  const sendQueryToAI = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // Append user message immediately to state
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, userMsg],
            preview: userPrompt
          };
        }
        return c;
      })
    );

    setIsThinking(true);
    setCurrentThinkingStage("Connecting to NexMentor AI Engine...");

    try {
      const activeMsgs = activeChat?.messages || [];
      const apiPayload = [...activeMsgs, userMsg].map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        text: m.text
      }));

      const res = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token || ""}`
        },
        body: JSON.stringify({ messages: apiPayload })
      });

      const data = await res.json();
      setIsThinking(false);

      const replyText =
        data?.message?.content ||
        `I am analyzing your query regarding "${userPrompt}". Let's structure a production-ready solution!`;

      // Extract code block if AI response contains markdown code fences
      let codeBlock: { language: string; code: string; explanation: string } | undefined;
      const codeMatch = replyText.match(/```(\w+)?\n([\s\S]*?)```/);
      if (codeMatch) {
        codeBlock = {
          language: codeMatch[1] || "typescript",
          code: codeMatch[2].trim(),
          explanation: "AI generated production-ready code implementation."
        };
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        codeBlock
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              messages: [...c.messages, aiMsg],
              preview: aiMsg.text.substring(0, 60) + "..."
            };
          }
          return c;
        })
      );
    } catch (err) {
      setIsThinking(false);
      console.error("NexMentor AI Chat Error:", err);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `I've received your query on "${userPrompt}". Make sure your environment variables and API connections are configured. How else can I assist your engineering goals today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              messages: [...c.messages, aiMsg],
              preview: aiMsg.text.substring(0, 60) + "..."
            };
          }
          return c;
        })
      );
    }
  };

  const triggerMentorResponse = (topic: string) => {
    sendQueryToAI(`Can you help me with: ${topic}?`);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const typedText = inputText;
    setInputText("");
    await sendQueryToAI(typedText);
  };

  // Launch fresh new chat
  const handleCreateNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      id: newChatId,
      title: `New Chat`,
      preview: "Hi, how can I help you today?",
      isPinned: false,
      isFavorite: false,
      category: "recent" as const,
      timestamp: "Just Now",
      messages: []
    };

    setConversations(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
  };

  // Copy code utility simulation
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopyCode = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(blockId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle Chat Pinning
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, isPinned: !c.isPinned, category: !c.isPinned ? "pinned" : "recent" };
      }
      return c;
    }));
  };

  // Toggle Chat Favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, isFavorite: !c.isFavorite };
      }
      return c;
    }));
  };

  // Delete Chat
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) return;
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      setActiveChatId(remaining[0].id);
    }
  };

  // Interactive Code Execution State simulation (UI only as requested)
  const [runLogs, setRunLogs] = useState<string[]>([]);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const handleRunCodeMock = (codeName: string) => {
    setIsRunningCode(true);
    setRunLogs(["$ tsc --noEmit solution.ts", "Analyzing dependencies...", "Resolving AST types..."]);
    
    setTimeout(() => {
      setRunLogs(prev => [...prev, "$ node build/solution.js", "✔ Compilation Succeeded", "✔ All test benchmarks passing within 4ms bounds!", "Execution Memory: 18.2 MB"]);
      setIsRunningCode(false);
    }, 1200);
  };

  // Bookmark, Quick Fix & Export handlers
  const handleAddBookmark = (msg: Message) => {
    if (bookmarkedMessages.some(bm => bm.id === msg.id)) return;
    const updated = [...bookmarkedMessages, { id: msg.id, text: msg.text, timestamp: msg.timestamp }];
    setBookmarkedMessages(updated);
    localStorage.setItem("nexmentor_bookmarks", JSON.stringify(updated));
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = bookmarkedMessages.filter(bm => bm.id !== id);
    setBookmarkedMessages(updated);
    localStorage.setItem("nexmentor_bookmarks", JSON.stringify(updated));
  };

  const handleQuickFixResume = () => {
    if (atsScore >= 94) return;
    setAtsScore(94);
    
    // Simulate user request and AI response in current conversation
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: "Optimize my resume bullets using the Silicon Valley action-impact formula.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    
    setConversations(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, userMsg],
          preview: userMsg.text
        };
      }
      return c;
    }));

    setIsThinking(true);
    setCurrentThinkingStage("Running ATS score audit...");

    setTimeout(() => {
      setIsThinking(false);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "⚡ **ATS RESUME BULLETS OPTIMIZED SUCCESSFULLY (SCORE: 94)** ⚡\n\nI have automatically rewritten your resume descriptors to match the elite metrics scanned by modern tech companies:\n\n1.  **Technical Focus Hook**: Redefined *'Responsible for maintaining standard React components'* to *'Engineered reusable, high-performance React 19 / Vite UI elements, slashing render complexity and layout shift frames by 42%.'*\n2.  **Structural optimization**: Shifted 'Core Technical Skills' to the absolute top of the index for instant parser visibility.\n3.  **Active keyword density**: Successfully integrated *'Time-To-First-Byte (TTFB) offsets'*, *'distributed edge synchronization'*, and *'O(1) memory caching mechanisms'* without cluttering readability.\n\nYour automated ATS score has been elevated from **88** to **94**!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, aiMsg],
            preview: "ATS Audit Complete. Resume score 94!"
          };
        }
        return c;
      }));
    }, 1200);
  };

  const handleExportConversation = () => {
    const chatTitle = activeChat.title || "NexMentor_Chat";
    const header = `# ${chatTitle}\nNexMentor Premium AI Workspace - Conversation Export\nGenerated on: ${new Date().toLocaleDateString()}\n\n---\n\n`;
    const body = activeChat.messages.map(msg => {
      const sender = msg.sender === "user" ? "USER" : "AI MENTOR";
      let textStr = `### [${sender}] - ${msg.timestamp}\n${msg.text}\n`;
      if (msg.codeBlock) {
        textStr += `\n\`\`\`${msg.codeBlock.language}\n${msg.codeBlock.code}\n\`\`\`\n\n*Architectural Note: ${msg.codeBlock.explanation}*\n`;
      }
      return textStr;
    }).join("\n---\n\n");
    
    const element = document.createElement("a");
    const file = new Blob([header + body], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${chatTitle.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // File drop handler simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setAttachedFiles(prev => [
        ...prev,
        ...files.map((f: any) => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }))
      ]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setAttachedFiles(prev => [
        ...prev,
        ...files.map((f: any) => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }))
      ]);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="bg-[#090909] text-[#F5F5F5] font-sans min-h-screen relative flex flex-col overflow-hidden"
    >
      {/* Drag & Drop Visual Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#090909]/98 backdrop-blur-md border-2 border-dashed border-[#0066FF] flex flex-col items-center justify-center space-y-4"
          >
            <div className="p-5 bg-[#151515] rounded-full border border-[rgba(255,255,255,0.08)] text-[#F5F5F5]">
              <Paperclip className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-[#F5F5F5]">Upload Resume or Code Context</h3>
            <p className="text-[#A1A1AA] text-xs">Drop files to initiate instant parsing and AI career analysis.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 flex-grow flex flex-col space-y-6 relative z-10">
        
        {/* ================== HEADER ================== */}
        <div className="relative bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden shadow-xl">
          {/* Subtle top ambient glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 text-left relative z-10">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5] bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                NexMentor
              </h1>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-sm">
                v4.5 AI
              </span>
            </div>
            <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed max-w-2xl">
              Your AI Career Co-pilot. Master technical interviews, system design architecture, code reviews, resume ATS optimization, and career acceleration.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 relative z-10">
            <button 
              onClick={handleCreateNewChat}
              className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-indigo-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>New Conversation</span>
            </button>
            <div className="bg-[#151515] border border-[rgba(255,255,255,0.08)] px-3.5 py-2 rounded-lg flex items-center gap-2 text-xs shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#A1A1AA] font-mono text-[11px] font-medium">{workspaceContext.targetCompany} Synced</span>
            </div>
          </div>
        </div>

        {/* ================== QUICK PROMPTS STRIP ================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { title: "Review Resume", icon: FileText, topic: "Review My Resume", iconColor: "text-blue-400", hoverBorder: "hover:border-blue-500/40 hover:bg-blue-500/5", badgeBg: "bg-blue-500/10" },
            { title: "Mock Interview", icon: Bot, topic: "Prepare For Interview", iconColor: "text-purple-400", hoverBorder: "hover:border-purple-500/40 hover:bg-purple-500/5", badgeBg: "bg-purple-500/10" },
            { title: "Explain React", icon: Code2, topic: "Explain React", iconColor: "text-cyan-400", hoverBorder: "hover:border-cyan-500/40 hover:bg-cyan-500/5", badgeBg: "bg-cyan-500/10" },
            { title: "Explain Node.js", icon: Cpu, topic: "Explain Node.js", iconColor: "text-emerald-400", hoverBorder: "hover:border-emerald-500/40 hover:bg-emerald-500/5", badgeBg: "bg-emerald-500/10" },
            { title: "System Design", icon: Layers, topic: "System Design Help", iconColor: "text-indigo-400", hoverBorder: "hover:border-indigo-500/40 hover:bg-indigo-500/5", badgeBg: "bg-indigo-500/10" },
            { title: "DSA Practice", icon: Terminal, topic: "DSA Help", iconColor: "text-amber-400", hoverBorder: "hover:border-amber-500/40 hover:bg-amber-500/5", badgeBg: "bg-amber-500/10" },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                onClick={() => triggerMentorResponse(card.topic)}
                className={`bg-[#111111] hover:bg-[#161616] border border-[rgba(255,255,255,0.08)] ${card.hoverBorder} rounded-xl p-3 text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 group shadow-sm`}
              >
                <div className={`p-1.5 rounded-lg ${card.badgeBg} transition-transform group-hover:scale-110`}>
                  <Icon className={`h-4 w-4 ${card.iconColor} shrink-0`} />
                </div>
                <span className="text-xs font-semibold text-[#F5F5F5] truncate group-hover:text-white">{card.title}</span>
              </button>
            );
          })}
        </div>

        {/* ================== MAIN HERO LAYOUT (FULLY ALIGNED SIDEBARS + CHATBOX) ================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ================== LEFT CONVERSATIONS DRAWER + WIDGETS (3 / 12) ================== */}
          <div className="lg:col-span-3 flex flex-col space-y-3 h-[720px] lg:h-[780px] overflow-y-auto scrollbar-thin pr-1">
            
            <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-xl p-3 space-y-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#71717A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search threads..."
                  className="w-full bg-[#151515] border border-[rgba(255,255,255,0.06)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none focus:border-indigo-500/40 transition-colors"
                />
              </div>

              {/* Conversations List */}
              <div className="space-y-1 max-h-[220px] overflow-y-auto scrollbar-thin">
                {filteredConversations.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors flex justify-between items-center group ${
                      activeChatId === c.id
                        ? "bg-[#151515] border-indigo-500/30 text-[#F5F5F5]"
                        : "bg-transparent border-transparent hover:bg-[#151515]/50 text-[#A1A1AA]"
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="text-xs font-medium truncate text-[#F5F5F5]">{c.title}</div>
                      <div className="text-[10px] text-[#71717A] truncate font-normal">{c.preview}</div>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handleTogglePin(c.id, e)} className="p-1 hover:text-indigo-300 text-[#71717A]">
                        <Pin className="h-3 w-3 rotate-45" />
                      </button>
                      <button onClick={(e) => handleDeleteChat(c.id, e)} className="p-1 hover:text-rose-400 text-[#71717A]">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <LeftSidebarWidgets
              session={session}
              aiMemory={aiMemory}
              folders={folders}
              savedPrompts={savedPrompts}
              triggerMentorResponse={triggerMentorResponse}
              setInputText={setInputText}
              bookmarkedMessages={bookmarkedMessages}
              onRemoveBookmark={handleRemoveBookmark}
              onUploadResumeClick={() => fileInputRef.current?.click()}
            />

          </div>

          {/* ================== CENTER HERO CHAT AREA (6 / 12) ================== */}
          <div className="lg:col-span-6 flex flex-col h-[720px] lg:h-[780px]">
            
            {/* Main AI Chat Workspace Box */}
            <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-xl flex flex-col h-full overflow-hidden shadow-xl relative">
              
              {/* Chat Viewport Header */}
              <div className="px-5 py-4 bg-[#0E0E0E] border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#F5F5F5] flex items-center gap-2">
                      <span>{activeChat.title}</span>
                      {activeChat.isPinned && <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">PINNED</span>}
                    </h3>
                    <p className="text-xs text-[#A1A1AA] font-mono uppercase">SYMBOLS SYNCED WITH {workspaceContext.targetCompany}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={handleExportConversation} className="p-2 hover:bg-[#151515] rounded-lg text-[#71717A] hover:text-[#F5F5F5] transition-colors" title="Export Markdown">
                    <Download className="h-4 w-4 text-indigo-400" />
                  </button>
                </div>
              </div>

              {/* Message Streams / Empty State Viewport */}
              {activeChat.messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-[#090909] min-h-0">
                  <div className="w-full max-w-xl flex flex-col items-center space-y-6 my-auto">
                    
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#F5F5F5] tracking-tight">
                      What's on your mind today?
                    </h2>

                    {/* Centered Floating ChatGPT-Style Input Bar */}
                    <form
                      onSubmit={handleCustomSubmit}
                      className="w-full bg-[#18181D] border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.22)] focus-within:border-indigo-500/60 rounded-2xl p-2.5 shadow-2xl flex items-center gap-2.5 transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 bg-[#22222a] hover:bg-[#2b2b36] text-[#A1A1AA] hover:text-white rounded-xl transition-colors cursor-pointer shrink-0"
                        title="Attach File"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        multiple
                        className="hidden"
                      />

                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
                        placeholder="Ask anything..."
                        className="flex-1 bg-transparent border-none text-sm sm:text-base text-[#F5F5F5] placeholder-[#71717A] focus:outline-none px-2"
                      />

                      <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all cursor-pointer shrink-0 shadow-md flex items-center justify-center"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>

                    {/* Quick Suggestion Chips */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-xl pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const prompt = "Review my resume for technical engineering roles";
                          setInputText(prompt);
                          triggerMentorResponse(prompt);
                        }}
                        className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-[#141419] hover:bg-[#1f1f28] border border-[rgba(255,255,255,0.08)] hover:border-indigo-500/40 rounded-xl text-xs sm:text-sm text-[#D4D4D8] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer text-left"
                      >
                        <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span className="truncate">Review my resume</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const prompt = "Help me prepare for mock technical interview questions";
                          setInputText(prompt);
                          triggerMentorResponse(prompt);
                        }}
                        className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-[#141419] hover:bg-[#1f1f28] border border-[rgba(255,255,255,0.08)] hover:border-indigo-500/40 rounded-xl text-xs sm:text-sm text-[#D4D4D8] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer text-left"
                      >
                        <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="truncate">Mock interview prep</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const prompt = "Explain system design rate-limiting or distributed caching";
                          setInputText(prompt);
                          triggerMentorResponse(prompt);
                        }}
                        className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-[#141419] hover:bg-[#1f1f28] border border-[rgba(255,255,255,0.08)] hover:border-indigo-500/40 rounded-xl text-xs sm:text-sm text-[#D4D4D8] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer text-left"
                      >
                        <Code2 className="h-4 w-4 text-amber-400 shrink-0" />
                        <span className="truncate">System design & DSA</span>
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                <>
                  {/* Message Streams Viewport */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-[#090909] min-h-0">
                    {activeChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3.5 max-w-2xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                      >
                        {/* User / AI Avatar */}
                        <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                          msg.sender === "user" 
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                            : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                        }`}>
                          {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>

                        <div className="space-y-2 flex-1 min-w-0 text-left">
                          <div className={`p-4 sm:p-5 rounded-xl text-sm sm:text-base leading-relaxed transition-colors ${
                            msg.sender === "user"
                              ? "bg-indigo-950/30 text-[#F5F5F5] border border-indigo-500/30"
                              : "bg-[#111111] text-[#F5F5F5] border border-[rgba(255,255,255,0.08)]"
                          }`}>
                            <div className="space-y-2 whitespace-pre-wrap font-sans">
                              {msg.text}
                            </div>

                            {/* Code block experience */}
                            {msg.codeBlock && (
                              <div className="mt-4 border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden font-mono text-xs sm:text-sm bg-[#0E0E0E]">
                                <div className="bg-[#151515] px-4 py-2.5 flex justify-between items-center text-[#71717A] border-b border-[rgba(255,255,255,0.06)]">
                                  <span className="text-xs font-mono text-indigo-400 uppercase font-semibold">{msg.codeBlock.language}</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleCopyCode(msg.codeBlock!.code, msg.id)}
                                      className="px-2.5 py-1 rounded bg-[#111111] hover:bg-[#1A1A1A] text-[#A1A1AA] hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                                    >
                                      {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-blue-400" />}
                                      <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                                    </button>
                                    <button
                                      onClick={() => handleRunCodeMock(msg.id)}
                                      className="px-2.5 py-1 rounded bg-[#151515] hover:bg-[#1A1A1A] border border-emerald-500/20 text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                                    >
                                      <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                                      <span>Run</span>
                                    </button>
                                  </div>
                                </div>

                                <div className="p-4 overflow-x-auto text-[#F5F5F5] leading-relaxed max-h-72 overflow-y-auto scrollbar-thin bg-[#0E0E0E]">
                                  <pre><code>{msg.codeBlock.code}</code></pre>
                                </div>

                                {msg.codeBlock.explanation && (
                                  <div className="bg-[#111111] border-t border-[rgba(255,255,255,0.06)] p-3.5 text-xs text-[#A1A1AA] font-sans">
                                    <strong>Note:</strong> {msg.codeBlock.explanation}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action chips for AI responses */}
                          {msg.sender === "ai" && (
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                              <button
                                type="button"
                                onClick={() => handleCopyCode(msg.text, msg.id)}
                                className="px-2.5 py-1 bg-[#111111] hover:bg-[#151515] border border-[rgba(255,255,255,0.08)] rounded text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 font-medium"
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddBookmark(msg)}
                                className="px-2.5 py-1 bg-[#111111] hover:bg-[#151515] border border-[rgba(255,255,255,0.08)] rounded text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-medium"
                              >
                                <Bookmark className="h-3.5 w-3.5" />
                                <span>{bookmarkedMessages.some(bm => bm.id === msg.id) ? "Saved" : "Save"}</span>
                              </button>
                            </div>
                          )}

                          <span className="text-xs font-mono text-[#71717A] block pl-0.5">{msg.timestamp}</span>
                        </div>
                      </div>
                    ))}

                    {/* Real-time Streaming Response */}
                    {streamingText && (
                      <div className="flex gap-3.5 max-w-2xl mr-auto">
                        <div className="h-8 w-8 rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="space-y-2 flex-1 min-w-0 text-left">
                          <div className="p-4 sm:p-5 rounded-xl text-sm sm:text-base leading-relaxed bg-[#111111] text-[#F5F5F5] border border-[rgba(255,255,255,0.08)] font-sans">
                            <div className="whitespace-pre-wrap">{streamingText}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Thinking Stage */}
                    {isThinking && (
                      <div className="flex gap-3.5 max-w-2xl mr-auto">
                        <div className="h-8 w-8 rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="p-4 rounded-xl bg-[#111111] border border-indigo-500/20 text-xs sm:text-sm text-indigo-300 font-mono flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                          <span>{currentThinkingStage}</span>
                        </div>
                      </div>
                    )}

                    <div ref={chatBottomRef} />
                  </div>

                  {/* Bottom Chat Input Form (Shown when chatting) */}
                  <form
                    onSubmit={handleCustomSubmit}
                    className="p-4 bg-[#0E0E0E] border-t border-[rgba(255,255,255,0.05)] flex flex-col gap-2 shrink-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-[#151515] hover:bg-[#1A1A1A] text-[#A1A1AA] hover:text-indigo-400 rounded-lg border border-[rgba(255,255,255,0.08)] transition-colors cursor-pointer shrink-0"
                        title="Attach File"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>

                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value.slice(0, 1000))}
                        placeholder="Ask NexMentor anything..."
                        className="flex-1 bg-[#151515] border border-[rgba(255,255,255,0.08)] focus:border-indigo-500/60 focus:outline-none rounded-lg px-4 py-3 text-sm sm:text-base text-[#F5F5F5] placeholder-[#71717A] transition-colors"
                      />

                      <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#151515] text-white disabled:text-[#71717A] font-semibold rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

          </div>

          {/* ================== RIGHT SIDEBAR (3 / 12) ================== */}
          <div className="lg:col-span-3 flex flex-col space-y-3 h-[720px] lg:h-[780px] overflow-y-auto scrollbar-thin pr-1">
            <RightSidebarWidgets
              workspaceContext={workspaceContext}
              triggerMentorResponse={triggerMentorResponse}
              setInputText={setInputText}
              atsScore={atsScore}
              onQuickFixResume={handleQuickFixResume}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
