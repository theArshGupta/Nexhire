import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Play, Terminal, CheckCircle2, AlertCircle, FileCheck, ShieldCheck, Star } from "lucide-react";

interface ProductShowcaseProps {
  onSignupClick?: () => void;
}

export default function ProductShowcase({ onSignupClick }: ProductShowcaseProps) {
  const [activeWorkflow, setActiveWorkflow] = useState<"build" | "prepare" | "gethired">("build");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  // States for live simulations
  // Build (Resume scan states)
  const [resumeScore, setResumeScore] = useState(64);
  const [resumeBullet, setResumeBullet] = useState("Created backend server code for student data portal.");
  const [isScanned, setIsScanned] = useState(false);

  // Prepare (DSA compiler states)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [compilerPassed, setCompilerPassed] = useState(false);

  const runResumeScan = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setTimeout(() => {
      setSimulationStep(2);
      setResumeScore(78);
    }, 1200);
    setTimeout(() => {
      setSimulationStep(3);
      setResumeScore(96);
      setResumeBullet("Architected highly available Node.js Express endpoints serving 10,000+ students, reducing database latency by 42% via Redis caching.");
      setIsScanned(true);
      setIsSimulating(false);
    }, 2500);
  };

  const runDsaCompiler = () => {
    setIsSimulating(true);
    setTerminalLogs(["$ g++ -O3 solution.cpp -o solution", "Compiling solution..."]);
    setTimeout(() => {
      setTerminalLogs((prev) => [...prev, "Compilation successful.", "$ ./solution --test-all"]);
    }, 800);
    setTimeout(() => {
      setTerminalLogs((prev) => [...prev, "Running Test Case 1/3 (Standard: root = [2,1,3])... Passed [0.2ms]", "Running Test Case 2/3 (Negative: root = [5,1,4,null,null,3,6])... Passed [0.1ms]"]);
    }, 1600);
    setTimeout(() => {
      setTerminalLogs((prev) => [...prev, "Running Test Case 3/3 (Edge Cases: giant degenerate BST)... Passed [0.4ms]", "All 3/3 test cases passed.", "TC: O(N) SC: O(H)"]);
      setCompilerPassed(true);
      setIsSimulating(false);
    }, 2600);
  };

  const resetSimulations = () => {
    setResumeScore(64);
    setResumeBullet("Created backend server code for student data portal.");
    setIsScanned(false);
    setTerminalLogs([]);
    setCompilerPassed(false);
    setSimulationStep(0);
    setIsSimulating(false);
  };

  const handleWorkflowChange = (workflow: "build" | "prepare" | "gethired") => {
    setActiveWorkflow(workflow);
    resetSimulations();
  };

  return (
    <section id="showcase" className="py-24 relative overflow-hidden bg-[#000000] border-t border-[rgba(255,255,255,0.08)]">
      {/* Ambient Lighting Spot */}
      <div className="ambient-lighting-spot top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#0066FF] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Step-by-Step Navigation & Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#666666]">
            How NexHire Works
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
            The Three Pillars of Placement Success
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#999999]">
            Click on each pillar below to run a real interactive placement simulation. See how NexHire improves your career readiness metrics instantly.
          </p>
        </div>

        {/* 3 Pillars Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0d0d0d] p-2 rounded-2xl border border-[rgba(255,255,255,0.08)] max-w-4xl mx-auto mb-12">
          {[
            { id: "build", step: "01", title: "Build Premium Resume", desc: "Instantly scoring & fixing bullet impact metrics" },
            { id: "prepare", step: "02", title: "Prepare DSA Coding", desc: "Rigorous interactive compilation & code testing" },
            { id: "gethired", step: "03", title: "Get Hired Faster", desc: "Automating matching recommendations & workflows" },
          ].map((item) => (
            <button
              key={item.id}
              id={`showcase-pillar-${item.id}`}
              onClick={() => handleWorkflowChange(item.id as any)}
              className={`text-left p-4 rounded-xl transition-all border cursor-pointer flex gap-4 ${
                activeWorkflow === item.id
                  ? "bg-[#141414] border-[rgba(255,255,255,0.14)] text-white shadow-lg"
                  : "bg-transparent border-transparent text-[#666666] hover:text-[#999999] hover:bg-[#121212]"
              }`}
            >
              <span className={`font-mono font-bold text-lg ${activeWorkflow === item.id ? "text-[#0066FF]" : "text-[#666666]"}`}>
                {item.step}
              </span>
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider">{item.title}</h4>
                <p className="font-sans text-[11px] text-[#999999] mt-1 leading-normal">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Canvas Container */}
        <div className="card-premium p-6 md:p-10 max-w-5xl mx-auto backdrop-blur-2xl">
          <AnimatePresence mode="wait">
            
            {/* PILLAR 1: BUILD (RESUME INTEGRATION) */}
            {activeWorkflow === "build" && (
              <motion.div
                key="build-workflow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-[10px] font-mono font-semibold">
                    <FileCheck className="h-3 w-3" /> Live Optimization Demo
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-white leading-tight">
                    Transform Weak Bullets into Quantified Engineering Metrics.
                  </h3>
                  <p className="font-sans text-xs text-[#999999] leading-relaxed">
                    Most students list passive duties on resumes, failing ATS standards. NexHire AI rewrites your entries into highly persuasive STAR metrics that recruiters value.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#999999]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0066FF]"></div>
                      <span>Boosts ATS indexing up to 98%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#999999]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0066FF]"></div>
                      <span>Injects industry-specific high-impact verbs</span>
                    </div>
                  </div>

                  {!isScanned && !isSimulating && (
                    <button
                      id="btn-scan-resume"
                      onClick={runResumeScan}
                      className="btn-primary-gradient text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Optimize Sample Resume</span>
                      <ArrowRight className="h-4 w-4 text-black" />
                    </button>
                  )}

                  {(isScanned || isSimulating) && (
                    <button
                      id="btn-reset-resume"
                      onClick={resetSimulations}
                      className="btn-secondary-matte text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      Reset Simulation
                    </button>
                  )}
                </div>

                <div className="lg:col-span-7 bg-[#080808] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 md:p-6 space-y-6 relative overflow-hidden">
                  <div className="flex justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.08)]">
                    <span className="font-heading font-semibold text-xs text-[#999999]">ATS Evaluation Dashboard</span>
                    <span className="font-mono text-[10px] text-[#666666]">STATUS: READY</span>
                  </div>

                  {/* SCORE DIAL */}
                  <div className="flex items-center gap-6 bg-[#0d0d0d] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
                    <div className="relative shrink-0 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" fill="transparent" stroke="#151515" strokeWidth="5" />
                        <circle cx="32" cy="32" r="28" fill="transparent" stroke={resumeScore > 80 ? "#10b981" : "#0066FF"} strokeWidth="5" strokeDasharray={175} strokeDashoffset={175 - (175 * resumeScore) / 100} className="transition-all duration-1000 ease-out" />
                      </svg>
                      <span className="absolute font-heading font-extrabold text-xs text-white">{resumeScore}%</span>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xs text-white">Overall Score Clearance</h4>
                      <p className="font-sans text-[11px] text-[#999999] mt-0.5">
                        {simulationStep === 0 && "Basic text matched. Needs active action metrics."}
                        {simulationStep === 1 && "AI analyzing keywords and action density..."}
                        {simulationStep === 2 && "Adding quantifiable impacts..."}
                        {simulationStep === 3 && "Optimal clearance tier! Fully prepared."}
                      </p>
                    </div>
                  </div>

                  {/* BULLET TRANSFORM */}
                  <div className="space-y-2">
                    <span className="block text-[10px] uppercase tracking-wider text-[#666666]">Resume Experience Section:</span>
                    <div className="p-3.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0d0d0d] font-sans text-xs leading-relaxed space-y-2">
                      <div className="flex justify-between text-[10px] text-[#666666]">
                        <span>Original Bullet</span>
                        {simulationStep >= 2 && <span className="text-emerald-400 font-semibold flex items-center gap-0.5">✓ Optimized by NexHire</span>}
                      </div>
                      <p className={`${isScanned ? "text-emerald-400 font-medium" : "text-[#999999]"}`}>
                        "{resumeBullet}"
                      </p>
                    </div>
                  </div>

                  {/* LOADING GRAPHICS */}
                  {isSimulating && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-[#0066FF] font-mono">
                        <span>{simulationStep === 1 ? "Extracting tech tokens..." : "Synthesizing bullet metric matrices..."}</span>
                        <span>{simulationStep * 33}%</span>
                      </div>
                      <div className="h-1.5 bg-[#141414] rounded-full overflow-hidden">
                        <div className="h-full bg-[#0066FF] rounded-full transition-all duration-1000" style={{ width: `${simulationStep * 33}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* PILLAR 2: PREPARE (DSA COMPILER INTEGRATION) */}
            {activeWorkflow === "prepare" && (
              <motion.div
                key="prepare-workflow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-[#141414] border border-[rgba(255,255,255,0.08)] px-3 py-1 rounded-full text-[#999999] text-[10px] font-mono font-semibold">
                    <Terminal className="h-3.5 w-3.5 text-[#0066FF]" /> Compiler Playground
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-white leading-tight">
                    Solve Coding Puzzles in a Production-Grade Sandbox.
                  </h3>
                  <p className="font-sans text-xs text-[#999999] leading-relaxed">
                    Build structural muscle memory on placement-targeted questions. Get instant visual stack frames, complex test coverage validations, and detailed time-space efficiency metrics.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#999999]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0066FF]"></div>
                      <span>Integrated virtual stack visualizer</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#999999]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0066FF]"></div>
                      <span>Checks against boundary & giant test inputs</span>
                    </div>
                  </div>

                  {!isSimulating && !compilerPassed && (
                    <button
                      id="btn-run-compiler"
                      onClick={runDsaCompiler}
                      className="btn-primary-gradient text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Compile & Run Test Cases</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  {(compilerPassed || isSimulating) && (
                    <button
                      id="btn-reset-compiler"
                      onClick={resetSimulations}
                      className="btn-secondary-matte text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      Reset Compiler Demo
                    </button>
                  )}
                </div>

                <div className="lg:col-span-7 bg-[#050505] rounded-2xl border border-[rgba(255,255,255,0.08)] p-4 md:p-6 font-mono text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3 font-sans">
                    <span className="font-semibold text-[#B0B0B0]">Problem 98: Validate Binary Search Tree</span>
                    <span className="text-[9px] bg-[#1e3a8a]/30 text-blue-300 px-2 py-0.5 rounded font-mono">MEDIUM</span>
                  </div>

                  {/* Terminal Outputs */}
                  <div className="bg-[#000000] rounded-xl p-4 border border-[rgba(255,255,255,0.08)] space-y-2 h-[180px] overflow-y-auto scrollbar-thin">
                    {terminalLogs.length === 0 ? (
                      <span className="text-[#6E6E6E] italic">// Click 'Compile & Run Test Cases' to start the demo compiler simulation.</span>
                    ) : (
                      terminalLogs.map((log, i) => (
                        <div
                          key={i}
                          className={`${
                            log.includes("Passed") || log.includes("success")
                              ? "text-emerald-400 font-semibold"
                              : log.startsWith("$")
                              ? "text-[#6E6E6E]"
                              : "text-[#B0B0B0]"
                          }`}
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Metric results */}
                  {compilerPassed && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between font-sans">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span className="text-xs font-semibold">All 3 test suites succeeded.</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#B0B0B0]">TC: O(N) — beats 99%</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* PILLAR 3: GET HIRED (CRM INTERACTIVE WORKFLOW) */}
            {activeWorkflow === "gethired" && (
              <motion.div
                key="gethired-workflow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-[#141414] border border-[rgba(255,255,255,0.08)] px-3 py-1 rounded-full text-[#999999] text-[10px] font-mono font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#0066FF]" /> Direct Placements
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-white leading-tight">
                    Direct Corporate Pools & Unified Pipelines.
                  </h3>
                  <p className="font-sans text-xs text-[#999999] leading-relaxed">
                    Once you hit NexHire readiness standards, your profile becomes visible in our recruiters pool. Avoid generic applications—engage directly with managers hiring from certified talent cohorts.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#999999]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0066FF]"></div>
                      <span>Vetted directly by over 120 hiring partners</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#999999]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0066FF]"></div>
                      <span>Average response time under 4 days</span>
                    </div>
                  </div>

                  <a
                    href="#pricing"
                    className="btn-primary-gradient text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <span>Get Certified Readiness Score</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="lg:col-span-7 bg-[#050505] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.08)]">
                    <span className="font-heading font-semibold text-xs text-[#B0B0B0]">Your Corporate Placement Status</span>
                    <span className="text-[10px] bg-[#1e3a8a]/30 text-blue-300 px-2 py-0.5 rounded font-mono">ACTIVE DRIVE</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { company: "Stripe", role: "Software Engineer Intern", score: "96 / 100", status: "Technical On-site", statusColor: "text-blue-300 bg-[#1e3a8a]/20 border-[#1e3a8a]/40" },
                      { company: "Linear", role: "Frontend UI Specialist", score: "94 / 100", status: "Offer Made", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                      { company: "Vercel", role: "Developer Advocate", score: "91 / 100", status: "Behavioral Review", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                    ].map((job, idx) => (
                      <div
                        key={idx}
                        className="bg-[#101010] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#151515] transition-colors"
                      >
                        <div>
                          <h4 className="font-heading font-bold text-xs text-white">{job.company}</h4>
                          <span className="text-[10px] text-[#6E6E6E] block mt-0.5">{job.role}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[9px] text-[#6E6E6E] uppercase block">NexScore</span>
                            <span className="text-xs font-bold text-[#B0B0B0]">{job.score}</span>
                          </div>
                          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded border ${job.statusColor}`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Centered CTA Button below the Interactive Sandbox */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={onSignupClick}
            className="btn-primary-gradient text-xs uppercase tracking-wider font-bold cursor-pointer flex items-center justify-center gap-2 py-3.5 px-8"
          >
            <span>Start Preparing Free</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
