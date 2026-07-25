import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Bot, Briefcase, Award, TrendingUp, History, Play, StopCircle,
  RefreshCw, Mic, MicOff, Volume2, Video, Eye, ShieldCheck, AlertCircle,
  CheckCircle2, CornerDownRight, BarChart3, Clock, Layers, Star, Plus, X,
  ChevronDown, ChevronUp, MessageSquare, ThumbsUp, Send, Check, Info, Sparkle,
  BookOpen, Flame, HelpCircle, Trophy, User, ArrowRight
} from "lucide-react";

interface AIMockInterviewProps {
  session: { name: string; email: string; token?: string };
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  codeSnippet?: string;
  feedback?: {
    clarity: number;
    confidence: number;
    technicalDepth: number;
    grammar: number;
    statement: string;
  };
}

interface InterviewHistoryItem {
  id: string;
  date: string;
  role: string;
  company: string;
  score: number;
  duration: string;
  difficulty: string;
  type: string;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    impressive: string;
    needsImprovement: string;
    tips: {
      technical: string;
      communication: string;
      behavioral: string;
      confidence: string;
    };
  };
  questions: {
    id: string;
    question: string;
    userAnswer: string;
    suggestedAnswer: string;
    score: number;
    improvements: string[];
  }[];
  metrics: {
    speakingTime: string;
    responseTime: string;
    avgLength: string;
    fillWords: { word: string; count: number }[];
    trends: { name: string; score: number }[];
  };
}

export default function AIMockInterview({ session }: AIMockInterviewProps) {
  // Navigation State: "setup" | "interview" | "thinking" | "complete"
  const [appState, setAppState] = useState<"setup" | "interview" | "complete">("setup");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);

  // Setup state parameters
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level (2-5 years)");
  const [interviewType, setInterviewType] = useState("Frontend");
  const [duration, setDuration] = useState("30 Minutes");
  const [difficulty, setDifficulty] = useState("Medium");
  const [companyStyle, setCompanyStyle] = useState("Google");
  const [language, setLanguage] = useState("English");
  const [interviewMode, setInterviewMode] = useState<"Voice" | "Video" | "Text">("Text");
  const [customQuestions, setCustomQuestions] = useState<string[] | null>(null);

  // Custom configuration additions
  const [customRole, setCustomRole] = useState("");
  const [customCompany, setCustomCompany] = useState("");

  // Live Interview State
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [recordingText, setRecordingText] = useState("");
  const [voiceSpectrum, setVoiceSpectrum] = useState<number[]>([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);

  // Expand/collapse states for reviewing complete questions
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Active view tab in Results: "overview" | "feedback" | "review" | "analytics"
  const [resultsTab, setResultsTab] = useState<"overview" | "feedback" | "review" | "analytics">("overview");

  // Gamified achievements states
  const [streak, setStreak] = useState(4);
  const [xp, setXp] = useState(1250);
  const [level, setLevel] = useState(4);

  // Quick Notes in Interview panel
  const [quickNotes, setQuickNotes] = useState("");

  // Static Data: Interview Questions Database adapting to types
  const interviewQuestionsDB: Record<string, string[]> = {
    Frontend: [
      "How would you optimize the rendering of a large interactive grid with 10,000 items in React, keeping core layouts, DOM recycling, and web vitals in mind?",
      "Can you detail how JavaScript closure scopes behave in asynchronous loops, and how the event loop queues macro-tasks vs micro-tasks?",
      "Scenario: A client application experiences slow initial load due to massive bundle sizes. Walk me through your step-by-step strategy to implement tree shaking, dynamic route splits, and asset hydration benchmarks."
    ],
    Backend: [
      "How would you architect a resilient global session cache using Redis that handles split-brain network partition scenarios without data loss?",
      "Explain your schema design and indexing strategy for supporting high-frequency real-time balance queries in a ledger system with over 20 million active users.",
      "How do you safely transition a critical synchronous monolithic endpoint into an event-driven queue-backed pipeline using Kafka, preserving strict processing order?"
    ],
    "System Design": [
      "Design a highly available notification dispatch engine that supports rate-limiting, prioritized channel routing (email/push/SMS), and absolute cross-channel deduplication.",
      "How would you architect a global multiplayer game leaderboard service with near-instant updates for 5 million daily active players, minimizing database write hotspots?",
      "Design a distributed rate limiter that can handle 100,000 requests per second across a global multi-region server cluster."
    ],
    Behavioral: [
      "Tell me about a time you had a fundamental technical disagreement with a senior teammate. How did you build alignment, and what was the trade-off made?",
      "Describe a scenario where you had to ship a feature under extremely tight business deadlines, resulting in tech debt. How did you monitor and eventually pay down that debt?",
      "Walk me through a major failure in production that occurred under your watch. What immediate steps did you take, and how did you engineer permanent post-mortem solutions?"
    ],
    Technical: [
      "What are the structural trade-offs between implementing a hash table with chaining via linked lists versus open addressing with linear probing?",
      "How does the operating system manage virtual memory paging, and what causes a page fault to trigger CPU interrupts?",
      "Can you describe how TLS handshakes establish end-to-end symmetrical encryption, and why forward secrecy is vital for long-term session safety?"
    ],
    DSA: [
      "Given an unsorted array of integers, how would you find the longest consecutive elements sequence in O(N) time complexity?",
      "Explain how a Red-Black Tree maintains its self-balancing invariants during insertion, and what are its worst-case search bounds compared to AVL trees?",
      "How would you implement an optimal LRU Cache from scratch that supports GET and PUT operations in O(1) constant time complexity?"
    ],
    HR: [
      "Why are you looking to leave your current employer, and what specific cultural and technical indicators are you searching for in your next role?",
      "How do you evaluate success in your career, and where do you visualize your leadership impact inside an engineering division over the next three years?",
      "If you receive multiple offers from competing startups and enterprise firms, what criteria will dictate your final commitment decision?"
    ]
  };

  // Pre-configured Exemplar Answers & Feedback Data
  const questionFeedbackMockDB: Record<string, {
    suggestedAnswer: string;
    score: number;
    improvements: string[];
    feedbackStatement: string;
  }[]> = {
    Frontend: [
      {
        suggestedAnswer: "An optimal solution implements DOM Virtualization (e.g., react-window) to recycle nodes outside the viewport, reducing the active DOM nodes from 10,000 to ~30. Combine this with React.memo on grid cells, CSS content-visibility: auto, useMemo for computation caches, and offload filtering tasks to a Web Worker to keep the main thread completely responsive (maximizing Interaction to Next Paint - INP).",
        score: 91,
        improvements: [
          "Incorporate explicit mentions of CSS content-visibility properties to assist layout thread cycles.",
          "Elaborate on how Web Workers communicate sharded data array buffers back to the UI state."
        ],
        feedbackStatement: "Outstanding use of DOM virtualization terminology. Great focus on Core Web Vitals, but you could emphasize offloading filters to Web Workers to score perfect marks."
      },
      {
        suggestedAnswer: "Closures preserve the lexical scope references even when outer functions finish execution. In asynchronous loops, using 'let' creates a block-scoped binding per iteration, whereas 'var' binds to the same function scope. The Event Loop prioritizes the Micro-task queue (Promise callbacks, MutationObserver) over Macro-tasks (setTimeout, requestAnimationFrame, I/O) – completing all micro-tasks before drawing frame paints or starting the next macro-task.",
        score: 87,
        improvements: [
          "State clearly how requestAnimationFrame behaves relative to composite render loops.",
          "Describe standard garbage collection heuristics for orphaned closure references."
        ],
        feedbackStatement: "Strong comprehension of loop variable scoping. Adding a visual contrast between Micro-task flushing and rendering cycles would enhance structural precision."
      },
      {
        suggestedAnswer: "I would utilize a staged analysis: 1) Run Webpack Bundle Analyzer to identify duplicate libraries and load heavy dependencies asynchronously. 2) Apply ES Module dynamic imports for code-sharded page routes. 3) Configure persistent service worker assets caching, and 4) Streamline rendering by serving compressed modern formats (AVIF, WOFF2) over HTTP/3 CDN layers with early preconnect resource hints.",
        score: 93,
        improvements: [
          "Define how modern Edge hydration models can improve Time to Interactive.",
          "Describe setting up automatic Bundle Size Budgets in the CI/CD pipeline."
        ],
        feedbackStatement: "Brilliant chronological layout of optimization milestones. The inclusion of modern CDN resource hints demonstrates high architectural mastery."
      }
    ],
    Backend: [
      {
        suggestedAnswer: "To handle split-brain partitions, configure Redis Sentinel or Cluster with a quorum (e.g., minimum of 3 master nodes and replicas). Set 'min-replicas-to-write' to 1 to reject writes if a master loses its slave connectivity. For absolute safety, utilize Redlock algorithms across multiple independent nodes or leverage Raft consensus-based database clusters to manage state changes synchronously.",
        score: 89,
        improvements: [
          "Detail Redis memory eviction policies (e.g., volatile-lru) when cluster limits are reached.",
          "Discuss the performance trade-offs of synchronous replication versus async snapshots."
        ],
        feedbackStatement: "Solid command of clustering safety. Explaining the synchronization lag between master-slave write channels would make this answer completely bulletproof."
      },
      {
        suggestedAnswer: "For 20 million users and instant balance queries, establish a dual-write pipeline. The primary write of transactions goes to a PostgreSQL partition table with a strict SERIALIZABLE isolation level. Read queries are served from an in-memory Redis cluster storing current user balances. Implement index partitioning on user_id, use composite indexes on status/timestamp, and leverage write-ahead logs with read-replicas for balance audits.",
        score: 94,
        improvements: [
          "Add details about pessimistic vs optimistic locking strategies under high concurrency.",
          "Explain caching invalidation triggers under distributed transaction rollbacks."
        ],
        feedbackStatement: "Exceptional integration of ACID transaction isolation details combined with caching. Mentioning specific database index structures like B-Trees was highly appropriate."
      },
      {
        suggestedAnswer: "First, deploy Kafka with an appropriate replication factor (minimum 3). Configure the producers with 'acks=all' and 'max.in.flight.requests.per.connection=1' to guarantee in-order delivery. Use a consistent partition key (e.g., tenant_id) to route relevant events to the same partition. Implement idempotent consumers utilizing a distributed deduplication key stored in Redis to ignore duplicate deliveries gracefully.",
        score: 91,
        improvements: [
          "Highlight transaction schemas or outbox patterns to link PostgreSQL writes to Kafka events safely.",
          "State how consumer rebalancing processes can affect temporary latency peaks."
        ],
        feedbackStatement: "Superb coverage of partition key delivery logic and consumer idempotence. Integrating the transactional outbox pattern would elevate this to a top 1% score."
      }
    ]
  };

  // Thinking step pipelines
  const thinkingSteps = [
    "Analyzing speech frequency & semantic layers...",
    "Evaluating STAR methodology compliance...",
    "Testing response against technical keyword registers...",
    "Assessing syntax and algorithmic complexity...",
    "Formulating contextual follow-up question..."
  ];

  // Active interview variables
  const activeQuestions = customQuestions || interviewQuestionsDB[interviewType] || interviewQuestionsDB["Technical"];

  // Voice spectrum visualization generator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVoiceRecording) {
      interval = setInterval(() => {
        setVoiceSpectrum(
          Array.from({ length: 15 }, () => Math.floor(Math.random() * 80) + 20)
        );
      }, 100);
    } else {
      setVoiceSpectrum(Array.from({ length: 15 }, () => 12));
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  // Timer useEffect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && appState === "interview") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, appState]);

  // Live session and voice refs
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Format Timer to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const [interviewCategory, setInterviewCategory] = useState<"technical" | "english_fluency">("technical");

  // Fetch Mock Interview History Records from Database
  useEffect(() => {
    async function fetchDatabaseHistory() {
      try {
        const res = await fetch("/api/interview/history", {
          headers: {
            Authorization: `Bearer ${session.token || ""}`
          }
        });
        const data = await res.json();
        if (data?.history && Array.isArray(data.history) && data.history.length > 0) {
          setHistoryList(data.history);
        }
      } catch (err) {
        console.warn("Failed to fetch database interview history:", err);
      }
    }
    fetchDatabaseHistory();
  }, [session.token]);

  // Text-to-Speech (TTS) AI Voice Synthesizer
  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/###?\s*/g, "")
      .replace(/`{1,3}.*?`{1,3}/gs, "code block");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Alex") || v.name.includes("Daniel")) && v.lang.startsWith("en")
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Start the interview room with real AI backend
  const handleStartInterview = async () => {
    setAppState("interview");
    setTimer(0);
    setIsTimerActive(true);
    setCurrentQuestionIdx(0);
    
    if (interviewCategory === "english_fluency") {
      const openingQuestion = `Hello ${session.name || "Candidate"}! Welcome to your Conversational English & Fluency Interview. Let's start with a quick introduction — please introduce yourself, walk me through your background, and share what key projects or goals you are currently working on.`;
      const initialMessage: Message = {
        id: "ai-welcome-fluency",
        sender: "ai",
        text: openingQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialMessage]);
      speakText(openingQuestion);
      return;
    }
    
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.token || ""}`
        },
        body: JSON.stringify({
          role: selectedRole || interviewType,
          company: companyStyle,
          experienceLevel: experienceLevel,
          interviewType: interviewType,
          totalQuestions: 5
        })
      });

      const data = await res.json();
      if (data?.sessionId && data?.firstQuestion) {
        setActiveSessionId(data.sessionId);
        setCustomQuestions([data.firstQuestion]);
        const initialMessage: Message = {
          id: "ai-welcome",
          sender: "ai",
          text: `Hello ${session.name || "Candidate"}. Welcome to your ${interviewType} Mock Interview tailored for ${companyStyle}. Let's begin.\n\n**Question 1:** ${data.firstQuestion}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([initialMessage]);
        speakText(`Hello ${session.name || "Candidate"}. Welcome to your ${interviewType} Mock Interview tailored for ${companyStyle}. Question 1: ${data.firstQuestion}`);
        return;
      }
    } catch (err) {
      console.error("Failed to start interview session via API:", err);
    }

    // Fallback welcome message
    const firstQuestion = activeQuestions[0];
    const initialMessage: Message = {
      id: "ai-welcome",
      sender: "ai",
      text: `Hello ${session.name || "Candidate"}. Welcome to your premium ${interviewType} Mock Interview designed specifically to simulate ${companyStyle}'s evaluation standards. I will assess your technical depth, clarity, communication, and structural answers using the STAR method. Let's begin.\n\n**Question 1:** ${firstQuestion}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMessage]);
    speakText(`Hello ${session.name || "Candidate"}. Welcome to your ${interviewType} Mock Interview. Question 1: ${firstQuestion}`);
  };

  // Real Microphone Voice Stream & Transcription
  const handleToggleVoice = async () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);

      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
        recognitionRef.current = null;
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          if (audioBlob.size > 0 && !inputText.trim()) {
            try {
              const reader = new FileReader();
              reader.onload = async () => {
                const base64 = (reader.result as string).split(",")[1];
                const res = await fetch("/api/interview/transcribe", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.token || ""}`
                  },
                  body: JSON.stringify({ audioBase64: base64 })
                });
                const data = await res.json();
                if (data.transcript && data.transcript.trim()) {
                  setInputText(data.transcript.trim());
                }
              };
              reader.readAsDataURL(audioBlob);
            } catch (err) {
              console.error("Transcription error:", err);
            }
          }
        };
      }
    } else {
      setIsVoiceRecording(true);
      setInputText("");
      audioChunksRef.current = [];

      // 1. Browser Native SpeechRecognition for streaming transcript preview
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = "en-US";

          recognition.onresult = (event: any) => {
            let currentTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript;
            }
            setInputText(currentTranscript);
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (recErr) {
          console.warn("SpeechRecognition init warning:", recErr);
        }
      }

      // 2. Raw Microphone Recording for Whisper AI Backup
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
          };
          mediaRecorder.start();
          mediaRecorderRef.current = mediaRecorder;
        } catch (streamErr) {
          console.error("Microphone access error:", streamErr);
          setIsVoiceRecording(false);
          alert("Microphone access is required for voice recording. Please enable microphone permissions in your browser.");
        }
      }
    }
  };

  // Submit Answer & trigger AI cognitive evaluation sequence
  const handleSubmitAnswer = () => {
    if (!inputText.trim()) return;

    // Stop voice recording if active
    if (isVoiceRecording) {
      handleToggleVoice();
    }

    // 1. Add User Answer Message
    const userMsg: Message = {
      id: `user-${currentQuestionIdx}`,
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const submittedText = inputText;
    setInputText("");

    // 2. Trigger Thinking state
    setIsThinking(true);
    setThinkingStep(0);
    
    // Progress thinking steps while waiting for AI API call
    let step = 0;
    const thinkingInterval = setInterval(() => {
      if (step < thinkingSteps.length - 1) {
        step += 1;
        setThinkingStep(step);
      } else {
        clearInterval(thinkingInterval);
        processAINextStep(submittedText);
      }
    }, 500);
  };

  // Formulate real AI evaluation feedback and dynamic next question
  const processAINextStep = async (userText: string) => {
    let evaluationData: any = null;
    let nextQuestionText: string = "";
    let isFinished = false;

    if (interviewCategory === "english_fluency") {
      try {
        const res = await fetch("/api/interview/english-fluency", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token || ""}`
          },
          body: JSON.stringify({
            currentQuestion: messages[messages.length - 1]?.text || "Introduce yourself and walk me through your background.",
            transcript: userText,
            isFinalQuestion: currentQuestionIdx >= 4
          })
        });
        const data = await res.json();
        if (data?.evaluation) {
          evaluationData = data.evaluation;
          nextQuestionText = data.nextQuestion || "";
          isFinished = currentQuestionIdx >= 4;
        }
      } catch (err) {
        console.error("English fluency evaluation error:", err);
      }

      setIsThinking(false);

      const overall = evaluationData ? Math.round(evaluationData.overallScore) : 84;
      const grammar = evaluationData ? Math.round(evaluationData.grammarScore) : 85;
      const vocab = evaluationData ? Math.round(evaluationData.vocabularyScore) : 82;
      const fluency = evaluationData ? Math.round(evaluationData.fluencyScore) : 80;
      const feedbackText = evaluationData?.feedback || "Great natural flow and articulation! Refining transition phrases will elevate your spoken English.";

      setMessages((prev) => {
        return prev.map((m) => {
          if (m.id === `user-${currentQuestionIdx}`) {
            return {
              ...m,
              feedback: {
                clarity: fluency,
                confidence: overall,
                technicalDepth: grammar,
                grammar: vocab,
                statement: `🗣️ Spoken English Fluency: ${overall}/100 | Grammar: ${grammar}% | Vocab: ${vocab}% | Fluency: ${fluency}%\n\n${feedbackText}`
              }
            };
          }
          return m;
        });
      });

      const nextIdx = currentQuestionIdx + 1;
      if (nextIdx < 5 && !isFinished) {
        setCurrentQuestionIdx(nextIdx);
        const nextQuestion = nextQuestionText || "Could you tell me about a major technical or personal challenge you faced and how you resolved it?";

        const aiResponse: Message = {
          id: `ai-${nextIdx}`,
          sender: "ai",
          text: `**English Feedback:** ${feedbackText}\n\n**Next Question ${nextIdx + 1}:** ${nextQuestion}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, aiResponse]);
        speakText(`Feedback: ${feedbackText}. Question ${nextIdx + 1}: ${nextQuestion}`);
      } else {
        setIsTimerActive(false);
        setAppState("complete");
        setResultsTab("overview");
        speakText("Thank you for completing the conversational English fluency interview. Your detailed speaking performance report is ready.");
      }
      return;
    }

    // Call Real Groq AI backend API
    try {
      const res = await fetch("/api/interview/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token || ""}`
        },
        body: JSON.stringify({
          sessionId: activeSessionId || "demo-session",
          transcript: userText
        })
      });
      const data = await res.json();
      if (data?.evaluation) {
        evaluationData = data.evaluation;
        nextQuestionText = data.nextQuestion || "";
        isFinished = data.isCompleted || false;
      }
    } catch (err) {
      console.error("AI answer evaluation error:", err);
    }

    setIsThinking(false);

    // Fallback values if API is unavailable
    const defaultFeedbackList = questionFeedbackMockDB[interviewType] || questionFeedbackMockDB["Frontend"];
    const feedbackItem = defaultFeedbackList[currentQuestionIdx % defaultFeedbackList.length];

    const techScore = evaluationData ? Math.round(evaluationData.technicalScore * 10) : feedbackItem.score;
    const commScore = evaluationData ? Math.round(evaluationData.communicationScore * 10) : 80;
    const confScore = evaluationData ? Math.round(evaluationData.confidenceScore * 10) : 75;
    const feedbackStmt = evaluationData?.feedback || feedbackItem.feedbackStatement;

    // Attach real AI scores and feedback to user message
    setMessages((prev) => {
      return prev.map((m) => {
        if (m.id === `user-${currentQuestionIdx}`) {
          return {
            ...m,
            feedback: {
              clarity: commScore,
              confidence: confScore,
              technicalDepth: techScore,
              grammar: commScore,
              statement: feedbackStmt
            }
          };
        }
        return m;
      });
    });

    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < 5 && !isFinished) {
      setCurrentQuestionIdx(nextIdx);
      const nextQuestion = nextQuestionText || activeQuestions[nextIdx % activeQuestions.length];
      
      const aiResponse: Message = {
        id: `ai-${nextIdx}`,
        sender: "ai",
        text: `**Feedback:** ${feedbackStmt}\n\n**Next Question ${nextIdx + 1}:** ${nextQuestion}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      speakText(`Feedback: ${feedbackStmt}. Question ${nextIdx + 1}: ${nextQuestion}`);
    } else {
      // Interview complete - fetch final report
      if (activeSessionId) {
        try {
          await fetch("/api/interview/end", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token || ""}`
            },
            body: JSON.stringify({ sessionId: activeSessionId })
          });
        } catch (_) {}
      }

      setIsTimerActive(false);
      setAppState("complete");
      setResultsTab("overview");
      setExpandedQuestionId(null);
      setXp((prev) => prev + 250);
      setStreak((prev) => prev + 1);
      speakText("Thank you for completing the mock interview. Your comprehensive AI performance report is now ready.");
    }
  };

  // Cancel / Restart
  const handleRestart = () => {
    setAppState("setup");
    setTimer(0);
    setIsTimerActive(false);
    setCurrentQuestionIdx(0);
    setMessages([]);
  };

  // Mock past historical interviews list
  const [historyList, setHistoryList] = useState<InterviewHistoryItem[]>([
    {
      id: "hist-01",
      date: "Today, 06:12 AM",
      role: "Senior Full-Stack Architect",
      company: "Linear",
      score: 91,
      duration: "18:42",
      difficulty: "Hard",
      type: "System Design",
      feedback: {
        strengths: [
          "Outstanding database write partitioning strategies using consistent hashing indexes.",
          "Perfect execution of STAR technique across complex distributed transaction systems.",
          "Excellent mitigation descriptions for single-point-of-failure vulnerabilities."
        ],
        weaknesses: [
          "Marginally long explanation structure on client-side state recovery hooks.",
          "Could introduce more concrete metrics on server-side message latency reductions."
        ],
        impressive: "Your response to our notification engine write hotspot scaling was incredibly mature, integrating Redis sharding and client debounces perfectly.",
        needsImprovement: "Pay special attention to quantifying network overhead margins when describing replication clusters across multi-region networks.",
        tips: {
          technical: "Discuss the raw throughput parameters of Raft vs Paxos protocols in depth next time.",
          communication: "Use micro-pauses between structural transitions to project complete mastery.",
          behavioral: "Incorporate direct feedback loops you had with stakeholders on tech-debt agreements.",
          confidence: "Maintain your structured vocal delivery rate of ~140 words per minute."
        }
      },
      questions: [
        {
          id: "q-1",
          question: "How would you architect a global multiplayer game leaderboard service with near-instant updates for 5 million daily active players, minimizing database write hotspots?",
          userAnswer: "I would use Redis Sorted Sets to maintain scores dynamically in memory. Write-hotspots can be resolved by sharding players into separate sorted sets by geography or ID. Updates can be pushed back to a durable database asynchronously using buffered queues like SQS.",
          suggestedAnswer: "An optimal architecture leverages Redis cluster sharding on Player ID hashes. Use ZADD operations for O(log N) leaderboard ranking. Maintain a high-performance Write-Through or Write-Behind caching strategy backed by PostgreSQL using transaction buffering to eliminate database lock escalations. Push instant score updates to clients via persistent WebSocket connections powered by AWS API Gateway.",
          score: 93,
          improvements: [
            "Quantify write reductions by showing how queue buffering limits database IOPS spikes.",
            "Explain read caching strategies for players far down the global ranking tree."
          ]
        },
        {
          id: "q-2",
          question: "Design a distributed rate limiter that can handle 100,000 requests per second across a global multi-region server cluster.",
          userAnswer: "We can write a rate limiter using the Token Bucket algorithm. Redis would store the current tokens. To scale global regions, we can run local Redis instances and synchronize tokens back and forth asynchronously to avoid network lag.",
          suggestedAnswer: "Deploy a distributed rate limiter using a sliding window counter algorithm implemented in Redis via Lua scripts for atomic operations. To avoid multi-region latency bottlenecks, implement localized token buckets at the Envoy/API Gateway edge with asynchronous background synchronization of bucket ratios via a centralized mesh, utilizing local caching with soft rate limits.",
          score: 89,
          improvements: [
            "Detail the Lua script logic to prove thread safety under intense request volumes.",
            "Formulate fallback rules in the event of complete redis mesh partitions."
          ]
        }
      ],
      metrics: {
        speakingTime: "14m 12s",
        responseTime: "1.2 seconds",
        avgLength: "182 words",
        fillWords: [
          { word: "like", count: 4 },
          { word: "um", count: 2 },
          { word: "ah", count: 1 },
          { word: "so", count: 5 }
        ],
        trends: [
          { name: "Intro", score: 85 },
          { name: "Q1 Design", score: 93 },
          { name: "Q2 Limiter", score: 89 },
          { name: "Summary", score: 94 }
        ]
      }
    },
    {
      id: "hist-02",
      date: "Yesterday, 04:30 PM",
      role: "Lead Software Engineer",
      company: "Stripe",
      score: 84,
      duration: "12:15",
      difficulty: "Medium",
      type: "Frontend",
      feedback: {
        strengths: [
          "Superb description of render pipeline optimizations and garbage collection.",
          "Good incorporation of high-visibility technology terms (Vite, Web Workers)."
        ],
        weaknesses: [
          "Response lacked depth on the visual frame compositing process inside Chromium.",
          "High density of fill words (e.g. 'um', 'like') observed during technical transition blocks."
        ],
        impressive: "The breakdown of bundle size analysis using dependency graphs was highly structured and actionable.",
        needsImprovement: "Try to eliminate conversational filler words to keep communication looking completely clean and professional.",
        tips: {
          technical: "Dive into the low-level rendering differences between Canvas and standard SVG rendering grids.",
          communication: "Practice structural pauses before answering complex architectural loops.",
          behavioral: "Ensure you mention the team impact of your performance optimizations.",
          confidence: "Adopt a more declarative speaking style when explaining performance metrics."
        }
      },
      questions: [
        {
          id: "q-3",
          question: "How would you optimize the rendering of a large interactive grid with 10,000 items in React, keeping core layouts, DOM recycling, and web vitals in mind?",
          userAnswer: "I would use a virtualized grid like react-window to recycle cells. This keeps only visible cells in the DOM. I'd also memoize grid items using React.memo to avoid unneeded re-renders when other states change.",
          suggestedAnswer: "Implement windowed virtualization to cap active DOM nodes at ~40. Cache computational indices with useMemo. Apply CSS contain-intrinsic-size to hold layout spaces. Offload massive calculations to background Web Workers, maintaining a buttery 60 FPS scrolling cycle under standard browser loads.",
          score: 85,
          improvements: [
            "Elaborate on how CSS containment reduces browser repaint computations.",
            "Discuss data loading thresholds when scroll velocities exceed virtual thresholds."
          ]
        }
      ],
      metrics: {
        speakingTime: "8m 44s",
        responseTime: "2.1 seconds",
        avgLength: "140 words",
        fillWords: [
          { word: "like", count: 12 },
          { word: "um", count: 8 },
          { word: "ah", count: 4 },
          { word: "so", count: 7 }
        ],
        trends: [
          { name: "Intro", score: 80 },
          { name: "Q1 Grid", score: 85 },
          { name: "Summary", score: 87 }
        ]
      }
    }
  ]);

  // Load an existing historical interview review
  const handleLoadHistory = (item: InterviewHistoryItem) => {
    // Re-construct complete feedback parameters from history item
    setInterviewType(item.type);
    setSelectedRole(item.role);
    setCompanyStyle(item.company);
    setDifficulty(item.difficulty);
    
    // Simulate current mock metrics based on loaded historical data
    setAppState("complete");
    setResultsTab("overview");
    setExpandedQuestionId(null);
  };

  // Generate dynamic stats and metrics for the current (newly finished) session
  const currentSessionData = {
    role: selectedRole === "Custom Interview" ? (customRole || "Specialized Engineer") : selectedRole,
    company: companyStyle === "Custom" ? (customCompany || "Future Tech") : companyStyle,
    score: 88,
    duration: formatTime(timer),
    difficulty: difficulty,
    type: interviewType,
    feedback: {
      strengths: [
        `Excellent integration of standard ${interviewType} principles tailored for ${companyStyle}.`,
        "Strong structure leveraging direct metrics (STAR methodology) in project summaries.",
        "Demonstrated clear command over system performance, latency, and cache safety bounds."
      ],
      weaknesses: [
        "Slight vocal lag noted during early conceptual definition blocks.",
        "Could utilize even more specific hardware/network volume figures when handling scaling questions."
      ],
      impressive: `Your architectural alignment with ${companyStyle}'s core design standards on distributed scalability was highly impressive.`,
      needsImprovement: "Formulate a more precise description of failure modes and circuit-breakers inside high-throughput APIs.",
      tips: {
        technical: `Ensure you study ${companyStyle}'s open source papers and engineering architecture blogs to detail exact database parameters.`,
        communication: "Focus on presenting your outline in clear 1-2-3 bullet items before entering long code code explanations.",
        behavioral: "Utilize direct examples of mentoring junior colleagues when discussing design disagreements.",
        confidence: "Maintain your solid posture and deep voice pitches to project massive authority."
      }
    },
    questions: activeQuestions.map((q, idx) => {
      const defaultFeedbackList = questionFeedbackMockDB[interviewType] || questionFeedbackMockDB["Frontend"];
      const feedbackItem = defaultFeedbackList[idx % defaultFeedbackList.length];
      return {
        id: `cur-q-${idx}`,
        question: q,
        userAnswer: messages.find(m => m.id === `user-${idx}`)?.text || "Simulated technical response using modern enterprise parameters.",
        suggestedAnswer: feedbackItem.suggestedAnswer,
        score: feedbackItem.score,
        improvements: feedbackItem.improvements
      };
    }),
    metrics: {
      speakingTime: formatTime(Math.floor(timer * 0.75)),
      responseTime: "1.4 seconds",
      avgLength: "158 words",
      fillWords: [
        { word: "like", count: 5 },
        { word: "um", count: 3 },
        { word: "ah", count: 2 },
        { word: "so", count: 6 }
      ],
      trends: [
        { name: "Intro", score: 81 },
        { name: "Question 1", score: 89 },
        { name: "Question 2", score: 87 },
        { name: "Question 3", score: 91 }
      ]
    }
  };

  const currentResultItem = currentSessionData;

  return (
    <div className="bg-[#09090B] min-h-screen text-zinc-100 flex flex-col font-sans relative overflow-hidden">
      
      {/* Background Neon Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 flex-grow relative z-10">
        
        {/* ================== APP STATES PANEL ================== */}
        <AnimatePresence mode="wait">
          
          {appState === "setup" && (
            // ================== PHASE 1: PREMIUM INTERVIEW SETUP ==================
            <motion.div
              key="setup-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* HERO SECTION */}
              <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-mono font-medium tracking-wide">
                  <Sparkle className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                  <span>NEXT-GENERATION HR SIMULATOR</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-heading">
                  AI Mock Interview
                </h1>
                <p className="text-[#999999] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
                  Practice real interview questions with an AI interviewer, receive instant feedback, improve your communication skills, and prepare for your dream job.
                </p>
              </div>

              {/* SETUP CONFIGURATION Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
                
                {/* CONFIGURATION COLUMN */}
                <div className="lg:col-span-8 bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-indigo-400" />
                      <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-widest">Configure Interview Mode</h3>
                    </div>
                    <div className="flex p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <button
                        onClick={() => setInterviewCategory("technical")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          interviewCategory === "technical"
                            ? "bg-indigo-600 text-white shadow"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Technical Role Interview
                      </button>
                      <button
                        onClick={() => setInterviewCategory("english_fluency")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                          interviewCategory === "english_fluency"
                            ? "bg-emerald-600 text-white shadow"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-300" />
                        Conversational English & Fluency Mode
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Role Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider block">Job Target Role</label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 text-zinc-300 text-xs rounded-xl p-3 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Architect">Backend Architect</option>
                        <option value="Full Stack Engineer">Full Stack Engineer</option>
                        <option value="System Design Architect">System Design Architect</option>
                        <option value="Data Structures Expert">Data Structures Expert</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="Custom Interview">Custom Interview</option>
                      </select>
                    </div>

                    {/* Experience Level */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider block">Experience Bracket</label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 text-zinc-300 text-xs rounded-xl p-3 focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Entry Level / New Graduate">Entry Level / New Graduate</option>
                        <option value="Mid-level (2-5 years)">Mid-level (2-5 years)</option>
                        <option value="Senior Level (5+ years)">Senior Level (5+ years)</option>
                        <option value="Principal Architect">Principal Architect</option>
                      </select>
                    </div>

                    {/* Interview Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider block">Interview Focus Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Frontend", "Backend", "System Design", "Behavioral", "Technical", "DSA", "HR"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setInterviewType(type)}
                            className={`p-2.5 rounded-xl border text-[11px] font-medium tracking-wide transition-all text-center cursor-pointer ${
                              interviewType === type
                                ? "bg-indigo-600/15 border-indigo-500 text-indigo-300 font-bold shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                                : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Left details stacking */}
                    <div className="space-y-4">
                      
                      {/* Interview Duration */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider block">Duration Allocation</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {["15 Mins", "30 Mins", "45 Mins", "60 Mins"].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setDuration(t)}
                              className={`py-2 rounded-lg border text-[10px] font-mono transition-all text-center cursor-pointer ${
                                duration === t
                                  ? "bg-indigo-600 border-indigo-500 text-white"
                                  : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider block">Simulation Difficulty</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {["Easy", "Medium", "Hard"].map((diff) => (
                            <button
                              key={diff}
                              type="button"
                              onClick={() => setDifficulty(diff)}
                              className={`py-2 rounded-lg border text-[10px] font-mono transition-all text-center cursor-pointer ${
                                difficulty === diff
                                  ? "bg-indigo-600 border-indigo-500 text-white"
                                  : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                              }`}
                            >
                              {diff}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Custom role triggers */}
                  {selectedRole === "Custom Interview" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Specify Custom Role Title</label>
                        <input
                          type="text"
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          placeholder="e.g. Distributed Infrastructure Engineer"
                          className="w-full bg-[#111827] border border-zinc-800 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Target Team / Project Scope</label>
                        <input
                          type="text"
                          value={customCompany}
                          onChange={(e) => setCustomCompany(e.target.value)}
                          placeholder="e.g. High Throughput DB Core Team"
                          className="w-full bg-[#111827] border border-zinc-800 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-white outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Extra Parameters: Style, Language, Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/60">
                    
                    {/* Company style */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold text-zinc-400 uppercase block">Company Target Style</label>
                      <select
                        value={companyStyle}
                        onChange={(e) => setCompanyStyle(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 text-zinc-300 text-xs rounded-xl p-2.5 focus:outline-none cursor-pointer"
                      >
                        <option value="Google">Google (Deep Engineering)</option>
                        <option value="Amazon">Amazon (STAR Leadership)</option>
                        <option value="Netflix">Netflix (Freedom & Responsibility)</option>
                        <option value="Meta">Meta (Move Fast & Build)</option>
                        <option value="Apple">Apple (Pixel & Architecture)</option>
                        <option value="Startup">Early Stage Startup</option>
                        <option value="Custom">Custom Company</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold text-zinc-400 uppercase block">Spoken Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 text-zinc-300 text-xs rounded-xl p-2.5 focus:outline-none cursor-pointer"
                      >
                        <option value="English">English (United States)</option>
                        <option value="Hindi">Hindi (Official Standard)</option>
                        <option value="Mixed">Mixed (Hinglish / Multi)</option>
                      </select>
                    </div>

                    {/* Interview Mode */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold text-zinc-400 uppercase block">Interactivity Mode</label>
                      <div className="grid grid-cols-3 gap-1">
                        {["Text", "Voice", "Video"].map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setInterviewMode(mode as any)}
                            className={`py-2 rounded-lg border text-[10px] font-mono transition-all text-center cursor-pointer ${
                              interviewMode === mode
                                ? "bg-indigo-600/15 border-indigo-500 text-indigo-300 font-bold"
                                : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* START BUTTON */}
                  <div className="pt-4">
                    <button
                      onClick={handleStartInterview}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-sans text-sm font-extrabold rounded-2xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 uppercase tracking-widest relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Play className="h-4.5 w-4.5 animate-pulse" />
                      <span>Start Simulated Interview Room</span>
                    </button>
                  </div>

                </div>

                {/* SIDEBAR PREVIOUS HISTORIES & ACHIEVEMENTS */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Streak & XP Gamification card */}
                  <div className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-5 shadow-xl relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-orange-500/10 rounded-full blur-xl" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500 animate-bounce" />
                        <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">Practice Streak</span>
                      </div>
                      <span className="text-xl font-black text-orange-400">{streak} Days</span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">Total Career XP:</span>
                        <span className="text-white font-bold font-mono">{xp} XP</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                          <span>Level {level} Progress</span>
                          <span>78%</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                          <div className="bg-orange-500 h-full" style={{ width: "78%" }} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 mt-2">
                        <Trophy className="h-4 w-4 text-yellow-500 shrink-0" />
                        <span className="text-[10px] text-zinc-400">Next milestone badge: <strong className="text-zinc-200">STAR Architect</strong> at 1,500 XP.</span>
                      </div>
                    </div>
                  </div>

                  {/* Previous simulation archives */}
                  <div className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-5 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                      <History className="h-4 w-4 text-indigo-400" />
                      <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest">Simulation Archive</h3>
                    </div>

                    <p className="text-[11px] text-zinc-500 leading-normal font-light">
                      Click to load metrics, full chat logs, and Suggested STAR answers of prior attempts:
                    </p>

                    <div className="space-y-3.5">
                      {historyList.map((hist) => (
                        <div
                          key={hist.id}
                          onClick={() => handleLoadHistory(hist)}
                          className="bg-zinc-950/50 border border-zinc-900 hover:border-zinc-800 p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-200"
                        >
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{hist.role}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                              <span>{hist.company}</span>
                              <span>•</span>
                              <span>{hist.date}</span>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-md">
                              {hist.score}%
                            </span>
                            <span className="block text-[8px] font-mono text-zinc-600 mt-1 uppercase">{hist.difficulty}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {appState === "interview" && (
            // ================== PHASE 2: IMMERSIVE LIVE INTERVIEW ROOM ==================
            <motion.div
              key="interview-room"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              
              {/* LEFT COLUMN: INTERVIEWER METRICS & CONTROLS */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                
                {/* AI Interviewer Avatar Core */}
                <div className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 shadow-xl relative overflow-hidden flex-grow flex flex-col justify-between space-y-6">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500" />
                  
                  {/* Meta headers */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">LIVE MOCK SIMULATION</span>
                    </div>
                    
                    <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {formatTime(timer)}
                    </span>
                  </div>

                  {/* AI Interactive Avatar representation */}
                  <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="relative">
                      {/* Avatar container */}
                      <div className="h-24 w-24 rounded-full bg-zinc-950 border-2 border-indigo-500/30 flex items-center justify-center relative overflow-hidden shadow-2xl">
                        {isThinking ? (
                          <motion.div
                            animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute inset-2 border-2 border-dashed border-indigo-400 rounded-full opacity-60"
                          />
                        ) : isVoiceRecording ? (
                          <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
                        ) : null}
                        
                        <Bot className={`h-10 w-10 text-indigo-400 ${isThinking ? "animate-bounce" : "animate-pulse"}`} />
                      </div>

                      {/* Glowing decorative rings */}
                      <div className="absolute -inset-1.5 rounded-full border border-indigo-500/20 animate-ping opacity-10 pointer-events-none" />
                      
                      {/* Micro visual indicator badges */}
                      <span className="absolute -bottom-1 right-2 h-4 w-4 rounded-full bg-indigo-500 border-2 border-zinc-900 flex items-center justify-center text-[8px] text-white font-black animate-bounce">
                        AI
                      </span>
                    </div>

                    <div className="text-center space-y-1">
                      <h4 className="text-sm font-bold text-white">NexAI Recruiter Bot</h4>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">Evaluating {companyStyle} Blueprints</p>
                    </div>

                    {/* Waveform Visualization block */}
                    <div className="w-full bg-zinc-950/80 border border-zinc-900/80 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center justify-center gap-1.5 h-10 w-full px-6">
                        {voiceSpectrum.map((height, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: isThinking ? "20%" : `${height}%` }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        {isThinking ? "AI Synthesizing Question" : isVoiceRecording ? "Microphone capturing transcript" : "Interviewer listening"}
                      </span>
                    </div>
                  </div>

                  {/* Stage Progress indicators */}
                  <div className="space-y-2 pt-4 border-t border-zinc-800">
                    <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase">
                      <span>Question Progress</span>
                      <span>{currentQuestionIdx + 1} of {activeQuestions.length}</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIdx + 1) / activeQuestions.length) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between gap-1.5 pt-2">
                      {activeQuestions.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            i < currentQuestionIdx
                              ? "bg-emerald-500"
                              : i === currentQuestionIdx
                              ? "bg-indigo-500 animate-pulse"
                              : "bg-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                </div>

                {/* INTERVIEW QUIT/RESTART CONTROLS */}
                <div className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-4 flex gap-3 shadow-md">
                  <button
                    onClick={() => {
                      const newMuteState = !isMuted;
                      setIsMuted(newMuteState);
                      if (newMuteState && typeof window !== "undefined" && "speechSynthesis" in window) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className={`px-3.5 py-2.5 border text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isMuted
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/15"
                        : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/15"
                    }`}
                    title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                  >
                    {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    <span>{isMuted ? "Voice Off" : "AI Voice On"}</span>
                  </button>
                  <button
                    onClick={handleRestart}
                    className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
                  >
                    Restart Setup
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && "speechSynthesis" in window) {
                        window.speechSynthesis.cancel();
                      }
                      setIsTimerActive(false);
                      setAppState("complete");
                      setResultsTab("overview");
                    }}
                    className="flex-1 py-2.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center flex items-center justify-center gap-1"
                  >
                    <StopCircle className="h-3.5 w-3.5" />
                    <span>End Interview</span>
                  </button>
                </div>

              </div>

              {/* CENTER COLUMN: LIVE CONVERSATION LOGS & CHAT PANEL */}
              <div className="lg:col-span-8 bg-[#111827] border border-zinc-800/80 rounded-[20px] p-5 sm:p-6 shadow-2xl flex flex-col justify-between h-[650px] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                {/* Chat meta header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest">{interviewType} Interview Pipeline</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{difficulty} Difficulty</span>
                </div>

                {/* Conversation Body Area */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
                  {messages.map((msg) => {
                    const isAI = msg.sender === "ai";
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 max-w-4xl ${isAI ? "justify-start" : "justify-end ml-12"}`}
                      >
                        {isAI && (
                          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}

                        <div className="space-y-1.5 max-w-[85%]">
                          {/* Chat bubble element */}
                          <div
                            className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-light ${
                              isAI
                                ? "bg-zinc-950 text-zinc-200 rounded-tl-none border border-zinc-900"
                                : "bg-indigo-600 text-white rounded-tr-none shadow-md"
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.text}</p>
                          </div>

                          {/* Render Live feedback score indicators for User messages */}
                          {!isAI && msg.feedback && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 space-y-2"
                            >
                              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 uppercase font-bold">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Live Answer Analysis Saved
                              </div>
                              <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
                                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Clarity</span>
                                  <span className="text-xs font-bold text-white">{msg.feedback.clarity}%</span>
                                </div>
                                <div className="bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
                                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Confidence</span>
                                  <span className="text-xs font-bold text-white">{msg.feedback.confidence}%</span>
                                </div>
                                <div className="bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
                                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Tech Depth</span>
                                  <span className="text-xs font-bold text-indigo-300">{msg.feedback.technicalDepth}%</span>
                                </div>
                                <div className="bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
                                  <span className="block text-[8px] font-mono text-zinc-500 uppercase">Grammar</span>
                                  <span className="text-xs font-bold text-white">{msg.feedback.grammar}%</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-zinc-400 italic font-light leading-normal">
                                "{msg.feedback.statement}"
                              </p>
                            </motion.div>
                          )}

                          <span className="block text-[9px] font-mono text-zinc-500 text-right uppercase">
                            {msg.sender === "ai" ? "Interviewer" : "You"} • {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Thinking state overlay */}
                  {isThinking && (
                    <div className="flex items-start gap-3 max-w-4xl justify-start">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 animate-spin" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="p-4 rounded-2xl bg-zinc-950 text-zinc-200 rounded-tl-none border border-zinc-900 space-y-3">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                            <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest">{thinkingSteps[thinkingStep]}</span>
                          </div>
                          
                          {/* Animated skeleton lines */}
                          <div className="space-y-1.5">
                            <div className="h-2 bg-zinc-900 rounded-full w-4/5 animate-pulse" />
                            <div className="h-2 bg-zinc-900 rounded-full w-2/3 animate-pulse" />
                            <div className="h-2 bg-zinc-900 rounded-full w-1/2 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Chat controls & text input panel */}
                <div className="pt-4 border-t border-zinc-800 space-y-3 bg-[#111827] relative z-20">
                  <div className="flex gap-2.5">
                    
                    {/* Simulated Speech capture button */}
                    <button
                      onClick={handleToggleVoice}
                      className={`h-12 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                        isVoiceRecording
                          ? "bg-rose-500/15 border-rose-500 text-rose-400 animate-pulse"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                      title={isVoiceRecording ? "Click to synthesize transcript" : "Click to speak via micro stream"}
                    >
                      <Mic className="h-5 w-5" />
                      <span className="text-xs font-mono uppercase tracking-wider hidden sm:inline">
                        {isVoiceRecording ? "Transcribing" : "Voice Stream"}
                      </span>
                    </button>

                    {/* Chat Text Input field */}
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitAnswer()}
                      placeholder="Type your technical response here (incorporate STAR points)..."
                      className="flex-1 bg-zinc-950 border border-zinc-800/80 focus:border-indigo-500 rounded-xl px-4 text-xs font-sans text-zinc-100 focus:outline-none"
                    />

                    {/* Send Answer button */}
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!inputText.trim()}
                      className="h-12 w-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>

                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase px-1">
                    <span>Pro-tip: Answer using: Task, Action, and Quantifiable Results.</span>
                    <span>Press Enter to Submit</span>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {appState === "complete" && (
            // ================== PHASE 3: INTERACTIVE PLATFORM ANALYTICS ==================
            <motion.div
              key="results-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              
              {/* COMPREHENSIVE PERFORMANCE CARD BANNER */}
              <div className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full text-xs font-mono">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>EVALUATION REPORT GENERATED</span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {currentResultItem.role} Critique Profile
                    </h2>
                    
                    <p className="text-xs text-zinc-400 font-mono">
                      MAPPED AGAINST {currentResultItem.company.toUpperCase()} RECRUITE STANDARDS • MEDIUM DIFFICULTY
                    </p>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRestart}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>New Interview</span>
                    </button>
                    
                    <button
                      onClick={() => setAppState("setup")}
                      className="px-4 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Change Params</span>
                    </button>
                  </div>
                </div>

                {/* Sub Tab Navigation inside results */}
                <div className="flex items-center gap-2 mt-8 border-b border-zinc-800/60 pb-3">
                  {[
                    { id: "overview", label: "Executive Summary", icon: Award },
                    { id: "feedback", label: "AI Qualitative SWOT", icon: Bot },
                    { id: "review", label: "Question-by-Question Blueprint", icon: BookOpen },
                    { id: "analytics", label: "Speech & Latency Analytics", icon: BarChart3 }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setResultsTab(tab.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        resultsTab === tab.id
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                          : "bg-transparent text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200"
                      }`}
                    >
                      <tab.icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC RESULTS TAB RENDER */}
              <AnimatePresence mode="wait">
                
                {resultsTab === "overview" && (
                  // ================== RESULTS SUB-TAB: EXECUTIVE SUMMARY ==================
                  <motion.div
                    key="results-overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    
                    {/* Dial Score left block */}
                    <div className="lg:col-span-4 bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 shadow-xl flex flex-col justify-between items-center text-center space-y-6">
                      <div className="w-full text-left">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">MASTER COGNITIVE GRADE</span>
                        <h3 className="text-sm font-black text-white uppercase mt-0.5">Overall Performance Score</h3>
                      </div>

                      {/* Interactive Radial Score Meter */}
                      <div className="relative h-48 w-48 flex items-center justify-center">
                        <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="#1f2937"
                            strokeWidth="10"
                            fill="transparent"
                          />
                          <motion.circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="url(#emeraldGrad)"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={502.4}
                            initial={{ strokeDashoffset: 502.4 }}
                            animate={{ strokeDashoffset: 502.4 * (1 - currentResultItem.score / 100) }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                          </defs>
                        </svg>

                        <div className="text-center space-y-0.5 relative z-10">
                          <span className="text-5xl font-black tracking-tight text-white block">
                            {currentResultItem.score}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                            Score / 100
                          </span>
                        </div>
                      </div>

                      {/* Hiring Recommendation indicator */}
                      <div className="w-full bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-2">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">RECRUITER RECOMMENDATION COEFFICIENT</span>
                        <p className="text-sm font-extrabold text-emerald-400 uppercase tracking-wide">
                          Strong Hire / L5 Potential
                        </p>
                        <p className="text-[11px] text-zinc-400 font-light leading-normal">
                          Candidate demonstrating exceptional distributed optimization awareness and fluent vocal pace pacing. Recommended for fast-track panel.
                        </p>
                      </div>
                    </div>

                    {/* Breakdown meters center/right block */}
                    <div className="lg:col-span-8 bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 sm:p-8 shadow-xl space-y-6">
                      <div className="border-b border-zinc-800 pb-3">
                        <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-widest">Dimension Competency Indices</h3>
                        <p className="text-xs text-zinc-500 font-light mt-1">Weighted metric breakdown assessing technical completeness, verbal power, and speed.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { title: "Technical Completeness", score: 91, color: "bg-emerald-500", desc: "Embeds appropriate high-value architectural terms and precise APIs structures." },
                          { title: "Communication Fluency", score: 86, color: "bg-indigo-500", desc: "Maintains optimal word pacing with negligible hesitations or structural circles." },
                          { title: "Confidence Pitch Index", score: 88, color: "bg-blue-500", desc: "Presents clear declarative statements without vocal pitching anomalies." },
                          { title: "STAR Structure Match", score: 94, color: "bg-purple-500", desc: "Consistently structures answers into Situation, Action, and quantified results." },
                          { title: "Problem Solving Bounds", score: 89, color: "bg-emerald-500", desc: "Quickly isolates bottlenecks and articulates clear time/space bounds." },
                          { title: "Time Management Pace", score: 92, color: "bg-blue-500", desc: "Spends appropriate focus duration on core action parameters without dragging." }
                        ].map((metric, idx) => (
                          <div key={idx} className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-white">{metric.title}</span>
                              <span className="text-xs font-mono font-black text-indigo-300">{metric.score}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                              <div className={`${metric.color} h-full rounded-full`} style={{ width: `${metric.score}%` }} />
                            </div>
                            <p className="text-[10px] text-zinc-400 font-light leading-normal">
                              {metric.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}

                {resultsTab === "feedback" && (
                  // ================== RESULTS SUB-TAB: SWOT FEEDBACK CARDS ==================
                  <motion.div
                    key="results-feedback"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn"
                  >
                    {/* Strengths & Weaknesses SWOT */}
                    <div className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 shadow-xl space-y-5">
                      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-widest">Key Performance Strengths</h3>
                      </div>

                      <div className="space-y-4">
                        {currentResultItem.feedback.strengths.map((str, i) => (
                          <div key={i} className="flex gap-3 items-start p-3 bg-zinc-950/50 border border-zinc-900 rounded-xl">
                            <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-zinc-300 font-light leading-relaxed">{str}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <div className="bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/10 text-[11px] text-emerald-300">
                          <strong>Most Impressive Segment:</strong> "{currentResultItem.feedback.impressive}"
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 shadow-xl space-y-5">
                      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-widest">Constructive Optimization Items</h3>
                      </div>

                      <div className="space-y-4">
                        {currentResultItem.feedback.weaknesses.map((weak, i) => (
                          <div key={i} className="flex gap-3 items-start p-3 bg-zinc-950/50 border border-zinc-900 rounded-xl">
                            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <p className="text-xs text-zinc-300 font-light leading-relaxed">{weak}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <div className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/10 text-[11px] text-amber-300">
                          <strong>Actionable Area of Growth:</strong> "{currentResultItem.feedback.needsImprovement}"
                        </div>
                      </div>
                    </div>

                    {/* AI Action Tips Bento Grid block */}
                    <div className="md:col-span-2 bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 sm:p-8 shadow-xl space-y-6">
                      <div className="border-b border-zinc-800 pb-3">
                        <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-widest">NexAI Specialized Action Advice</h3>
                        <p className="text-xs text-zinc-500 font-light mt-1">Step-by-step custom directives computed to optimize future high-end technical interviews.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2">
                          <span className="text-[9px] font-mono text-indigo-400 uppercase font-bold block">Technical Depth</span>
                          <p className="text-xs text-zinc-300 leading-normal font-light">
                            {currentResultItem.feedback.tips.technical}
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2">
                          <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold block">Verbal Power</span>
                          <p className="text-xs text-zinc-300 leading-normal font-light">
                            {currentResultItem.feedback.tips.communication}
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2">
                          <span className="text-[9px] font-mono text-purple-400 uppercase font-bold block">Behavioral Impact</span>
                          <p className="text-xs text-zinc-300 leading-normal font-light">
                            {currentResultItem.feedback.tips.behavioral}
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-2">
                          <span className="text-[9px] font-mono text-blue-400 uppercase font-bold block">Confidence Stature</span>
                          <p className="text-xs text-zinc-300 leading-normal font-light">
                            {currentResultItem.feedback.tips.confidence}
                          </p>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}

                {resultsTab === "review" && (
                  // ================== RESULTS SUB-TAB: QUESTION REVIEW ACCORDION ==================
                  <motion.div
                    key="results-review"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 sm:p-8 shadow-xl space-y-6"
                  >
                    <div className="border-b border-zinc-800 pb-3">
                      <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-widest">Question-by-Question Blueprint Critique</h3>
                      <p className="text-xs text-zinc-500 font-light mt-1">Examine every transcript response, compare against Silicon Valley suggested answers, and view explicit improvements.</p>
                    </div>

                    <div className="space-y-4">
                      {currentResultItem.questions.map((qItem, idx) => {
                        const isExpanded = expandedQuestionId === qItem.id;
                        return (
                          <div
                            key={qItem.id}
                            className="bg-zinc-950/60 border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-200"
                          >
                            {/* Accordion header clicker */}
                            <div
                              onClick={() => setExpandedQuestionId(isExpanded ? null : qItem.id)}
                              className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/40 transition-colors"
                            >
                              <div className="space-y-1.5 min-w-0">
                                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">Question {idx + 1}</span>
                                <p className="text-xs sm:text-sm font-bold text-white truncate max-w-2xl">{qItem.question}</p>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded-lg">
                                  {qItem.score}%
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-zinc-500" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                                )}
                              </div>
                            </div>

                            {/* Accordion content body */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-zinc-900 bg-zinc-950 p-4 sm:p-6 space-y-5 text-xs sm:text-sm"
                                >
                                  {/* User answer comparison */}
                                  <div className="space-y-2">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Your Transcript Answer:</span>
                                    <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl leading-relaxed text-zinc-300 italic font-light">
                                      "{qItem.userAnswer}"
                                    </div>
                                  </div>

                                  {/* AI Exemplar suggested blueprint */}
                                  <div className="space-y-2">
                                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block flex items-center gap-1">
                                      <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" /> AI Suggested Exemplar Answer (STAR Compliant):
                                    </span>
                                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl leading-relaxed text-zinc-200">
                                      {qItem.suggestedAnswer}
                                    </div>
                                  </div>

                                  {/* Targeted improvements checklist */}
                                  <div className="space-y-2.5 pt-2 border-t border-zinc-900">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Targeted Improvements for Perfect Score:</span>
                                    <div className="space-y-2">
                                      {qItem.improvements.map((imp, i) => (
                                        <div key={i} className="flex gap-2 items-start text-xs text-zinc-400 leading-normal font-light">
                                          <CornerDownRight className="h-3.5 w-3.5 text-zinc-600 shrink-0 mt-0.5" />
                                          <span>{imp}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                </motion.div>
                              )}
                            </AnimatePresence>

                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {resultsTab === "analytics" && (
                  // ================== RESULTS SUB-TAB: CUSTOM METRICS CHARTS ==================
                  <motion.div
                    key="results-analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    
                    {/* SVG Coherence Trend Curve */}
                    <div className="lg:col-span-8 bg-[#111827] border border-zinc-800/80 rounded-[20px] p-6 shadow-xl space-y-6">
                      <div>
                        <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-widest">Performance Coherence Curve</h3>
                        <p className="text-xs text-zinc-500 font-light mt-1">Real-time analytical trace showing structural complete levels over the consecutive questions loop.</p>
                      </div>

                      {/* Custom SVG line chart */}
                      <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-4 h-64 flex flex-col justify-between">
                        <div className="flex-1 relative">
                          <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            <line x1="0" y1="30" x2="400" y2="30" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                            <line x1="0" y1="75" x2="400" y2="75" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                            <line x1="0" y1="120" x2="400" y2="120" stroke="#1f2937" strokeWidth="1" strokeDasharray="4" />
                            
                            {/* Chart Line path */}
                            <path
                              d="M 20 120 Q 120 40, 220 80 T 380 30"
                              fill="none"
                              stroke="url(#chartGrad)"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />

                            {/* Chart Area Gradient Fill */}
                            <path
                              d="M 20 120 Q 120 40, 220 80 T 380 30 L 380 150 L 20 150 Z"
                              fill="url(#areaGrad)"
                              opacity="0.15"
                            />

                            {/* Data points */}
                            <circle cx="20" cy="120" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                            <circle cx="140" cy="50" r="5" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />
                            <circle cx="260" cy="72" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="1.5" />
                            <circle cx="380" cy="30" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />

                            <defs>
                              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#10b981" />
                              </linearGradient>
                              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#111827" />
                              </linearGradient>
                            </defs>
                          </svg>

                          {/* Hover Overlay Labels */}
                          <div className="absolute top-1 right-2 bg-zinc-900 border border-zinc-800 p-2 rounded text-[9px] font-mono text-zinc-400">
                            Peak Coherence: <strong className="text-emerald-400">91.4%</strong>
                          </div>
                        </div>

                        {/* Chart X axis parameters */}
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase px-2 pt-2 border-t border-zinc-900">
                          <span>Intro (81%)</span>
                          <span>Question 1 (89%)</span>
                          <span>Question 2 (87%)</span>
                          <span>Question 3 (91%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Speech Latency & Fill words counts */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Filler Words tracker */}
                      <div className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-5 shadow-xl space-y-4">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Conversation Fill Word Counter</span>
                        
                        <div className="space-y-3.5">
                          {currentResultItem.metrics.fillWords.map((item, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400 font-bold">"{item.word}" occurrences</span>
                                <span className="text-white">{item.count} times</span>
                              </div>
                              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                                <div
                                  className="bg-amber-500 h-full rounded-full"
                                  style={{ width: `${(item.count / 12) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl text-[10px] text-amber-300 font-light leading-normal">
                          * Your overall filler words count decreased by <strong className="font-bold">42%</strong> compared to the average entry level practice.
                        </div>
                      </div>

                      {/* Speaking speed meter */}
                      <div className="bg-[#111827] border border-zinc-800/80 rounded-[20px] p-5 shadow-xl space-y-3">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Core Speech Benchmarks</span>
                        
                        <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-400">Average Vocal Pace:</span>
                          <span className="text-indigo-400 font-bold">142 WPM (Elite)</span>
                        </div>
                        <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-400">Response Latency:</span>
                          <span className="text-emerald-400 font-bold">1.4s (Immediate)</span>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
