import React, { useState } from "react";
import { motion } from "motion/react";
import { FileText, Code, Bot, Compass, Briefcase, ChevronRight, Check, Play, Cpu, Star, Sparkles } from "lucide-react";

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const features = [
    {
      icon: FileText,
      tag: "ATS Scoring Engine",
      title: "AI Resume Architect",
      desc: "Instantly draft, review, and rebuild your resume to hit 90+ ATS clearance targets. Injects premium impact action verbs and automatically extracts missing keywords based on the target job role.",
      color: "from-blue-600/10 to-indigo-600/10",
      accentBorder: "border-blue-500/20",
      preview: (
        <div className="space-y-3 bg-zinc-950/90 rounded-xl p-4 border border-white/5 font-sans">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
            <span className="text-zinc-400 font-semibold">ATS Compatibility Report</span>
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">94% Fit</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>Verb Density (Action Verbs)</span>
              <span>Optimal (12 found)</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[90%] rounded-full"></div>
            </div>
          </div>
          <div className="space-y-1.5 p-2 bg-white/2 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <Check className="h-3 w-3" /> Inserted 4 Critical Keywords:
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">
              + Redis Cache, + System Design, + CI/CD Pipelines, + Unit Testing
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Code,
      tag: "Interactive Compiler",
      title: "Master DSA & Algorithms",
      desc: "Solve handpicked, placement-relevant questions in our advanced code sandbox. Features live code analysis, step-by-step algorithmic visualizations, and customized feedback for edge cases.",
      color: "from-indigo-600/10 to-purple-600/10",
      accentBorder: "border-indigo-500/20",
      preview: (
        <div className="space-y-3 bg-zinc-950/90 rounded-xl p-4 border border-white/5 font-mono text-[11px]">
          <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/5 font-sans">
            <span className="text-xs font-semibold">Two Sum - LeetCode 1</span>
            <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">Completed</span>
          </div>
          <div className="space-y-1 bg-black p-2.5 rounded-lg text-zinc-400">
            <div><span className="text-blue-400">for</span> i, num <span className="text-blue-400">in</span> <span className="text-yellow-400">enumerate</span>(nums):</div>
            <div className="pl-4">diff = target - num</div>
            <div className="pl-4"><span className="text-blue-400">if</span> diff <span className="text-blue-400">in</span> seen:</div>
            <div className="pl-8"><span className="text-blue-400">return</span> [seen[diff], i]</div>
            <div className="pl-4">seen[num] = i</div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-sans">
            <span>TC: O(N) — Beats 99.2%</span>
            <span>SC: O(N) — Beats 92.4%</span>
          </div>
        </div>
      ),
    },
    {
      icon: Bot,
      tag: "Mock Simulations",
      title: "Real-time AI Mock Recruiter",
      desc: "Sit in realistic, audio-guided interview simulations with specialized technical and behavioral feedback. Receives speech velocity tracking, structural answering quality reviews, and confidence metrics.",
      color: "from-purple-600/10 to-pink-600/10",
      accentBorder: "border-purple-500/20",
      preview: (
        <div className="space-y-3 bg-zinc-950/90 rounded-xl p-4 border border-white/5 font-sans">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
            <span className="text-zinc-400 font-semibold">NexHire Recruiter AI</span>
            <span className="text-purple-400 font-mono text-[10px] animate-pulse">● Recieving Audio</span>
          </div>
          <div className="flex items-center gap-2 bg-white/2 p-2 rounded-lg border border-white/5">
            <div className="flex gap-0.5 items-end h-6 shrink-0">
              {[3, 8, 5, 9, 4, 7, 2, 8, 6, 4, 7, 3, 5, 8].map((h, i) => (
                <div key={i} className="w-1 bg-purple-500 rounded-full animate-pulse" style={{ height: `${h * 10}%` }}></div>
              ))}
            </div>
            <div className="text-[10px] text-zinc-400 italic truncate">
              \"...I resolved concurrency using optimistic locks...\"
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-1.5 rounded text-center">
              <span className="text-zinc-500 block uppercase text-[8px]">Confidence</span>
              <span className="text-emerald-400 font-bold">Strong (92%)</span>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 p-1.5 rounded text-center">
              <span className="text-zinc-500 block uppercase text-[8px]">Speech Velocity</span>
              <span className="text-blue-400 font-bold">140 WPM (Perfect)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Compass,
      tag: "Interactive Pathways",
      title: "Company-Targeted Roadmaps",
      desc: "Quit wondering what to study next. Access precise, role-based roadmaps tailored for top employers (Stripe, Linear, Microsoft). Includes handpicked conceptual topics, cheat sheets, and mock tests.",
      color: "from-blue-600/10 to-purple-600/10",
      accentBorder: "border-blue-500/20",
      preview: (
        <div className="space-y-3 bg-zinc-950/90 rounded-xl p-4 border border-white/5 font-sans">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
            <span className="text-zinc-300 font-semibold">Stripe Preparation Roadmap</span>
            <span className="text-zinc-500 text-[10px]">Step 3 / 8</span>
          </div>
          <div className="relative pl-6 space-y-4">
            {/* Thread line */}
            <div className="absolute top-1 bottom-1 left-2 w-[1px] bg-white/5"></div>
            {[
              { title: "System Integration", sub: "Webhooks, API limits", status: "completed" },
              { title: "Database Sharding", sub: "SQL partitioning", status: "active" },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-5 h-2 w-2 rounded-full border ${
                  step.status === "completed" ? "bg-emerald-500 border-emerald-500" : "bg-blue-500 border-blue-500 animate-pulse"
                }`}></div>
                <h5 className="text-[11px] font-semibold text-zinc-300">{step.title}</h5>
                <p className="text-[9px] text-zinc-500">{step.sub}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Briefcase,
      tag: "Application CRM",
      title: "Unified Job Tracker",
      desc: "Stop scrambling through emails and spreadsheets. Manage your entire placement process in our integrated Kanban board. Automatically maps drive dates, interview stages, and custom tasks.",
      color: "from-purple-600/10 to-pink-600/10",
      accentBorder: "border-pink-500/20",
      preview: (
        <div className="space-y-3 bg-zinc-950/90 rounded-xl p-3 border border-white/5 font-sans text-[10px]">
          <div className="grid grid-cols-3 gap-2">
            {[
              { title: "Applied", company: "Stripe", color: "bg-blue-500" },
              { title: "Interview", company: "Linear", color: "bg-purple-500" },
              { title: "Offer Recieved", company: "Vercel", color: "bg-emerald-500" },
            ].map((col, i) => (
              <div key={i} className="space-y-1.5">
                <span className="text-[9px] text-zinc-500 uppercase font-semibold">{col.title}</span>
                <div className="bg-white/2 border border-white/5 rounded-lg p-2 space-y-1">
                  <div className="flex items-center gap-1">
                    <div className={`h-1 w-1 rounded-full ${col.color}`}></div>
                    <span className="font-semibold text-white">{col.company}</span>
                  </div>
                  <span className="text-[8px] text-zinc-500 block">Software Eng I</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div id="features-glow" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-1 bg-[#141414] border border-[rgba(255,255,255,0.08)] px-3 py-1 rounded-full text-[#999999] text-xs font-semibold uppercase tracking-wider font-mono">
            <Cpu className="h-3 w-3 text-[#0066FF]" /> Platform Suite
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
            Every placement resource, <br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              under a single premium hood.
            </span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#999999]">
            Stop switching between resumes tools, algorithmic compilers, behavioral courses, and application sheets. NexHire synthesizes your entire journey.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Large Feature Card 1 (AI Resume Architect) */}
          <div className="md:col-span-7 card-premium p-6 md:p-8 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="font-mono text-[9px] uppercase text-[#999999] bg-[#141414] border border-[rgba(255,255,255,0.08)] px-2.5 py-1 rounded-full font-bold">
                  {features[0].tag}
                </span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-white mb-2">{features[0].title}</h3>
              <p className="font-sans text-xs text-[#999999] leading-relaxed max-w-md mb-8">{features[0].desc}</p>
            </div>
            <div className="mt-4 md:mt-0 relative z-10 w-full max-w-sm">
              {features[0].preview}
            </div>
          </div>

          {/* Feature Card 2 (DSA Sandbox) */}
          <div className="md:col-span-5 card-premium p-6 md:p-8 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] flex items-center justify-center">
                  <Code className="h-5 w-5" />
                </div>
                <span className="font-mono text-[9px] uppercase text-[#999999] bg-[#141414] border border-[rgba(255,255,255,0.08)] px-2.5 py-1 rounded-full font-bold">
                  {features[1].tag}
                </span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-white mb-2">{features[1].title}</h3>
              <p className="font-sans text-xs text-[#999999] leading-relaxed mb-8">{features[1].desc}</p>
            </div>
            <div className="mt-4 md:mt-0 relative z-10 w-full">
              {features[1].preview}
            </div>
          </div>

          {/* Feature Card 3 (AI Mock Recruiter) */}
          <div className="md:col-span-5 card-premium p-6 md:p-8 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="font-mono text-[9px] uppercase text-[#999999] bg-[#141414] border border-[rgba(255,255,255,0.08)] px-2.5 py-1 rounded-full font-bold">
                  {features[2].tag}
                </span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-white mb-2">{features[2].title}</h3>
              <p className="font-sans text-xs text-[#999999] leading-relaxed mb-8">{features[2].desc}</p>
            </div>
            <div className="mt-4 md:mt-0 relative z-10 w-full">
              {features[2].preview}
            </div>
          </div>

          {/* Feature Card 4 (Placement Roadmaps) & Feature Card 5 (Unified Tracker) stacked horizontally */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card-premium p-6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-9 w-9 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] flex items-center justify-center">
                    <Compass className="h-4.5 w-4.5" />
                  </div>
                </div>
                <h4 className="font-heading font-bold text-lg text-white mb-1.5">{features[3].title}</h4>
                <p className="font-sans text-[11px] text-[#999999] leading-relaxed mb-6">{features[3].desc}</p>
              </div>
              <div className="relative z-10 w-full mt-2">
                {features[3].preview}
              </div>
            </div>

            <div className="card-premium p-6 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-9 w-9 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20 text-[#0066FF] flex items-center justify-center">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                </div>
                <h4 className="font-heading font-bold text-lg text-white mb-1.5">{features[4].title}</h4>
                <p className="font-sans text-[11px] text-[#999999] leading-relaxed mb-6">{features[4].desc}</p>
              </div>
              <div className="relative z-10 w-full mt-2">
                {features[4].preview}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
