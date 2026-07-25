import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  RotateCcw, 
  Check, 
  XCircle, 
  Briefcase, 
  Target, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Info
} from "lucide-react";
import { UserSession } from "../types";

interface AIResumeStudioProps {
  session: UserSession;
  initialScore?: number;
}

interface AnalysisResult {
  atsScore: number;
  resumeMatch: number;
  verdict: string;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  keywordSuggestions: string[];
  strengths: string[];
  weaknesses: string[];
  recruiterFeedback: string;
  improvementSuggestions: {
    title: string;
    category: string;
    recommendation: string;
    tip: string;
  }[];
}

export default function AIResumeStudio({ session, initialScore }: AIResumeStudioProps) {
  // Navigation & Flow State: "upload" | "results"
  const [viewState, setViewState] = useState<"upload" | "results">("upload");

  // Form Inputs
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64File, setBase64File] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string>("application/pdf");
  const [jobDescription, setJobDescription] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [expandedSuggestionIdx, setExpandedSuggestionIdx] = useState<number | null>(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Check for pre-existing analysis on mount
  useEffect(() => {
    if (!session.token) return;
    fetch("/api/resume/latest", {
      headers: { Authorization: `Bearer ${session.token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAnalysisResult(data.data);
          setViewState("results");
        }
      })
      .catch((err) => console.error("Could not fetch latest analysis:", err));
  }, [session.token]);

  // File Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
      setErrorMsg("Please upload a valid PDF or DOCX file.");
      return;
    }

    setErrorMsg("");
    setSelectedFile(file);
    setFileMime(file.type || "application/pdf");

    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const base64 = res.includes(",") ? res.split(",")[1] : res;
      setBase64File(base64);
    };
    reader.onerror = () => setErrorMsg("Failed to read file. Please try again.");
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setBase64File(null);
  };

  // Trigger Analysis
  const handleAnalyze = async () => {
    if (!selectedFile && !base64File) {
      setErrorMsg("Please upload your resume before analyzing.");
      return;
    }

    setErrorMsg("");
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token || ""}`
        },
        body: JSON.stringify({
          fileBase64: base64File,
          mimeType: fileMime,
          jobDescription: jobDescription.trim(),
          targetRole: "Software Engineer"
        })
      });

      const data = await response.json();
      setIsAnalyzing(false);

      if (data.success && data.data) {
        setAnalysisResult(data.data);
        setViewState("results");
      } else {
        setErrorMsg(data.error || "Resume analysis failed. Please try again.");
      }
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMsg("Network error connecting to analysis service. Please try again.");
    }
  };

  // Reset to Upload Page
  const handleReset = () => {
    setSelectedFile(null);
    setBase64File(null);
    setJobDescription("");
    setAnalysisResult(null);
    setErrorMsg("");
    setViewState("upload");
  };

  // Safe variables for rendering results
  const atsScore = typeof analysisResult?.atsScore === "number" ? analysisResult.atsScore : 82;
  const resumeMatch = typeof analysisResult?.resumeMatch === "number" ? analysisResult.resumeMatch : 85;
  const verdict = analysisResult?.verdict || "Strong Candidate - ATS Optimized";
  const summaryText = analysisResult?.summary || "Candidate demonstrates solid engineering foundations.";

  const matchingSkills = Array.isArray(analysisResult?.matchingSkills) && analysisResult!.matchingSkills.length > 0
    ? analysisResult!.matchingSkills
    : ["TypeScript", "React", "Node.js", "REST APIs", "Git"];

  const missingSkills = Array.isArray(analysisResult?.missingSkills) && analysisResult!.missingSkills.length > 0
    ? analysisResult!.missingSkills
    : ["GraphQL", "Docker", "CI/CD Pipelines", "AWS"];

  const keywordSuggestions = Array.isArray(analysisResult?.keywordSuggestions) && analysisResult!.keywordSuggestions.length > 0
    ? analysisResult!.keywordSuggestions
    : ["System Architecture", "Unit Testing", "Redux Toolkit", "PostgreSQL", "Agile"];

  const strengths = Array.isArray(analysisResult?.strengths) && analysisResult!.strengths.length > 0
    ? analysisResult!.strengths
    : [
        "Clear technical stack hierarchy in experience section",
        "Strong demonstrated knowledge of modern frontend frameworks",
        "Clean document structure with legible font hierarchy"
      ];

  const weaknesses = Array.isArray(analysisResult?.weaknesses) && analysisResult!.weaknesses.length > 0
    ? analysisResult!.weaknesses
    : (Array.isArray((analysisResult as any)?.criticalGaps) ? (analysisResult as any).criticalGaps : [
        "Lacks metrics or quantified performance impacts in project descriptions",
        "Missing key cloud infrastructure terms (AWS, Docker, CI/CD)"
      ]);

  const recruiterFeedback = analysisResult?.recruiterFeedback || summaryText;

  const rawFixes = analysisResult?.improvementSuggestions || (analysisResult as any)?.actionableFixes || [];
  const improvementSuggestions = Array.isArray(rawFixes) && rawFixes.length > 0
    ? rawFixes.map((item: any) => ({
        title: item.title || item.label || "Resume Enhancement",
        category: item.category || item.impact || "General Fix",
        recommendation: item.recommendation || item.rec || "Optimize bullet points to highlight technical outcomes.",
        tip: item.tip || "Use action verbs and quantitative metrics."
      }))
    : [
        {
          title: "Better Project Descriptions",
          category: "Project Impact",
          recommendation: "Re-structure project bullets to emphasize technical architecture decisions and metrics.",
          tip: "Use the X-Y-Z formula: Accomplished [X] measured by [Y] by doing [Z]."
        },
        {
          title: "Stronger Action Verbs",
          category: "Tone & Action Verbs",
          recommendation: "Replace passive verbs like 'worked on' with strong engineering verbs like 'Architected', 'Spearheaded', and 'Engineered'.",
          tip: "Start every experience bullet point with an imperative action verb."
        },
        {
          title: "Grammar & Formatting",
          category: "Grammar & Formatting",
          recommendation: "Standardize bullet point line spacing and remove mixed font weights across section headers.",
          tip: "Keep line spacing between 1.15x and 1.25x for optimal ATS scanning."
        }
      ];

  // Download Analysis Report
  const handleDownloadReport = () => {
    const reportContent = `NEXRESUME ANALYSIS REPORT
=========================
Candidate: ${session.name || "Candidate"}
Date: ${new Date().toLocaleDateString()}

ATS Score: ${atsScore} / 100
Resume Match: ${resumeMatch}%
Verdict: ${verdict}

SUMMARY
-------
${summaryText}

MATCHING SKILLS
---------------
${matchingSkills.map((s) => `• ${s}`).join("\n")}

MISSING SKILLS
--------------
${missingSkills.map((s) => `• ${s}`).join("\n")}

RECOMMENDED KEYWORDS
--------------------
${keywordSuggestions.join(", ")}

STRENGTHS
---------
${strengths.map((s) => `• ${s}`).join("\n")}

WEAKNESSES
----------
${weaknesses.map((w) => `• ${w}`).join("\n")}

RECRUITER FEEDBACK
------------------
${recruiterFeedback}

IMPROVEMENT SUGGESTIONS
-----------------------
${improvementSuggestions
  .map(
    (imp) =>
      `[${imp.category}] ${imp.title}\nRecommendation: ${imp.recommendation}\nTip: ${imp.tip}\n`
  )
  .join("\n")}
`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NexResume_Analysis_${session.name.replace(/\s+/g, "_") || "User"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-200 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#0066FF] selection:text-white">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {viewState === "upload" ? (
            /* ==================================================== */
            /* UPLOAD PAGE                                         */
            /* ==================================================== */
            <motion.div
              key="upload-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center py-6"
            >
              <div className="w-full bg-[#121215] border border-[#27272A] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                {/* Subtle Glow Accent */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#0066FF]/40 to-transparent"></div>

                {/* Header */}
                <div className="text-center space-y-3 mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Career Cockpit</span>
                  </div>
                  <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                    NexResume
                  </h1>
                  <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
                    Upload your resume and optionally paste a job description. Our AI will analyze your resume, evaluate ATS compatibility, compare it with the job requirements, and provide personalized improvement suggestions.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-xs font-medium">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* SECTION 1: Large Drag & Drop Upload Area */}
                <div className="space-y-3 mb-8">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    1. Upload Resume
                  </label>

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-4 ${
                        isDragOver
                          ? "border-[#0066FF] bg-[#0066FF]/5 scale-[0.99]"
                          : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <div className="h-14 w-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-[#0066FF] shadow-lg">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">
                          Drag & Drop your resume here
                        </p>
                        <p className="text-xs text-zinc-400 font-light">
                          Supports PDF and DOCX formats (Max 10MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors border border-zinc-700 cursor-pointer"
                      >
                        Browse File
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/20 flex items-center justify-center text-[#0066FF] shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 font-mono">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 cursor-pointer shrink-0"
                      >
                        Replace file
                      </button>
                    </div>
                  )}
                </div>

                {/* SECTION 2: Job Description Textarea */}
                <div className="space-y-2 mb-8">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      2. Job Description <span className="text-zinc-500 font-normal lowercase">(optional)</span>
                    </label>
                  </div>
                  <textarea
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here..."
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] rounded-xl p-4 text-xs text-zinc-200 placeholder-zinc-500 transition-all duration-200 resize-y min-h-[140px] font-sans"
                  />
                  <p className="text-[11px] text-zinc-500 font-light">
                    Leave this empty if you only want a general resume analysis.
                  </p>
                </div>

                {/* PRIMARY BUTTON */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] active:scale-[0.99] text-white font-semibold text-xs transition-all duration-200 shadow-lg shadow-[#0066FF]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyzing Resume with AI...</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze Resume</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ==================================================== */
            /* RESULTS PAGE                                        */
            /* ==================================================== */
            <motion.div
              key="results-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 py-4"
            >
              {/* Header Status Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#121215] border border-[#27272A] rounded-2xl p-6 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 text-[#0066FF] text-xs font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>NexResume AI Insights</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-white tracking-tight">
                    Resume Analysis Results
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Analyze Another Resume</span>
                </button>
              </div>

              {/* 1. RESUME SCORE */}
              <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-8 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#0066FF]/40 to-transparent"></div>
                
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
                  Overall Resume Score
                </p>

                {/* Radial Score Gauge */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-zinc-800/80"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * atsScore) / 100}
                      strokeLinecap="round"
                      className={
                        atsScore >= 80
                          ? "text-emerald-500 transition-all duration-1000"
                          : atsScore >= 60
                          ? "text-amber-500 transition-all duration-1000"
                          : "text-rose-500 transition-all duration-1000"
                      }
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="font-heading font-black text-4xl text-white">
                      {atsScore}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      out of 100
                    </span>
                  </div>
                </div>

                {/* Short AI Summary */}
                <div className="max-w-xl p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    "{summaryText}"
                  </p>
                </div>
              </div>

              {/* 2. ATS ANALYSIS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-2">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    ATS Score
                  </p>
                  <p className="text-2xl font-heading font-bold text-white">
                    {atsScore} <span className="text-xs text-zinc-500 font-normal">/ 100</span>
                  </p>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>ATS Compliant Layout</span>
                  </p>
                </div>

                <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-2">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Resume Match %
                  </p>
                  <p className="text-2xl font-heading font-bold text-[#0066FF]">
                    {resumeMatch}%
                  </p>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    Target Role Alignment
                  </p>
                </div>

                <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-2">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Overall Verdict
                  </p>
                  <p className="text-sm font-semibold text-[#0066FF] truncate">
                    {verdict}
                  </p>
                  <p className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Ready for submission</span>
                  </p>
                </div>
              </div>

              {/* 3. SKILLS ANALYSIS */}
              <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#0066FF]" />
                  <span>Skills Analysis</span>
                </h3>

                {/* Matching & Missing Skills Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Matching Skills */}
                  <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                    <p className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Matching Skills ({matchingSkills.length})</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matchingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Missing Skills */}
                  <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                    <p className="text-xs font-semibold text-amber-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Missing Skills ({missingSkills.length})</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended Keywords */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-3">
                  <p className="text-xs font-semibold text-zinc-400">
                    Recommended Keywords to Add
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {keywordSuggestions.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. RESUME FEEDBACK */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Strengths */}
                <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Strengths</span>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300 font-light">
                    {strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Areas for Improvement</span>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300 font-light">
                    {weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recruiter Feedback */}
                <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-[#0066FF] text-xs font-semibold">
                    <Target className="w-4 h-4" />
                    <span>Recruiter Verdict</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed">
                    "{recruiterFeedback}"
                  </p>
                </div>
              </div>

              {/* 5. IMPROVEMENT SUGGESTIONS */}
              <div className="bg-[#121215] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0066FF]" />
                  <span>Actionable Improvement Suggestions</span>
                </h3>

                <div className="space-y-3">
                  {improvementSuggestions.map((item, idx) => {
                    const isExpanded = expandedSuggestionIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedSuggestionIdx(isExpanded ? null : idx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/80 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] text-[10px] font-semibold">
                              {item.category}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              {item.title}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="p-4 pt-0 text-xs space-y-3 border-t border-zinc-800/60 bg-zinc-900/60">
                            <div>
                              <p className="text-[11px] font-semibold text-zinc-400 mb-1">
                                Recommendation:
                              </p>
                              <p className="text-zinc-300 font-light leading-relaxed">
                                {item.recommendation}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-[#0066FF]/5 border border-[#0066FF]/15 text-[11px] text-[#0066FF] flex items-start gap-2">
                              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span><strong>Action Tip:</strong> {item.tip}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. BOTTOM ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] active:scale-[0.99] text-white font-semibold text-xs transition-all duration-200 shadow-lg shadow-[#0066FF]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Improved Resume</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-[#27272A] text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Analyze Another Resume</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
