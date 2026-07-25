import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, Palette, Type, Component, Smartphone, Monitor, Tablet, Sparkles, Layers, ShieldCheck, ExternalLink } from "lucide-react";

interface FigmaDesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FigmaDesignSystemModal({ isOpen, onClose }: FigmaDesignSystemModalProps) {
  const [activeTab, setActiveTab] = useState<"tokens" | "typography" | "components" | "responsive">("tokens");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  const colorTokens = [
    { name: "Canvas Background", hex: "#000000", altHex: "#0A0A0C", role: "Pitch black background for max focus & deep contrast", class: "bg-[#000000]" },
    { name: "Surface Level 1", hex: "#121215", altHex: "#18181B", role: "Card fills, navigation containers, feature panels", class: "bg-[#121215]" },
    { name: "Surface Level 2", hex: "#202024", altHex: "#27272A", role: "Nested UI blocks, input fields, active row hovers", class: "bg-[#202024]" },
    { name: "Border Stroke", hex: "#27272A", role: "1px crisp solid borders for structured separation", class: "bg-[#27272A]" },
    { name: "Primary Electric Accent", hex: "#0066FF", altHex: "#0070F3", role: "High-energy blue for primary CTAs, active tags, highlights", class: "bg-[#0066FF]" },
    { name: "Status Neon Green", hex: "#22C55E", role: "Live indicators, high performance metrics, positive badges", class: "bg-[#22C55E]" },
    { name: "Text Primary", hex: "#FFFFFF", role: "Main headlines, primary button labels, high contrast text", class: "bg-[#FFFFFF]" },
    { name: "Text Muted", hex: "#A1A1AA", altHex: "#71717A", role: "Subtitles, body copy, table metadata, micro-captions", class: "bg-[#A1A1AA]" }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl bg-[#0a0a0c] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#121215] border-b border-[#27272a]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/30 flex items-center justify-center text-[#0066FF]">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Framer & Vercel Design System Brief
                  <span className="text-[10px] font-mono bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 px-2 py-0.5 rounded-full font-semibold">
                    SPECIFICATION V1.0
                  </span>
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Ultra-modern dark-mode SaaS UI component tokens, scales & interactive library
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#A1A1AA] hover:text-white bg-[#18181b] hover:bg-[#202024] border border-[#27272a] rounded-xl transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0c] border-b border-[#27272a] overflow-x-auto">
            <button
              onClick={() => setActiveTab("tokens")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "tokens"
                  ? "bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20"
                  : "bg-[#121215] text-[#A1A1AA] hover:text-white border border-[#27272a]"
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Color Tokens</span>
            </button>

            <button
              onClick={() => setActiveTab("typography")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "typography"
                  ? "bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20"
                  : "bg-[#121215] text-[#A1A1AA] hover:text-white border border-[#27272a]"
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              <span>Typography & Scales</span>
            </button>

            <button
              onClick={() => setActiveTab("components")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "components"
                  ? "bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20"
                  : "bg-[#121215] text-[#A1A1AA] hover:text-white border border-[#27272a]"
              }`}
            >
              <Component className="h-3.5 w-3.5" />
              <span>UI Component Library</span>
            </button>

            <button
              onClick={() => setActiveTab("responsive")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "responsive"
                  ? "bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20"
                  : "bg-[#121215] text-[#A1A1AA] hover:text-white border border-[#27272a]"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Responsive Breakpoints</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">

            {/* TAB 1: COLOR TOKENS */}
            {activeTab === "tokens" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Color Palette Tokens</h4>
                  <p className="text-xs text-[#A1A1AA] mt-1">High-contrast pitch black layered with dark grey elevated containers and electric blue accents.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {colorTokens.map((token, idx) => (
                    <div key={idx} className="p-4 bg-[#121215] border border-[#27272a] rounded-xl space-y-3 hover:border-[#3F3F46] transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{token.name}</span>
                        <div className={`h-6 w-6 rounded-md border border-[#27272a] ${token.class}`} />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#0066FF] font-semibold">{token.hex}</span>
                          {token.altHex && <span className="text-[#A1A1AA]">{token.altHex}</span>}
                        </div>
                        <p className="text-[11px] text-[#A1A1AA] leading-relaxed">{token.role}</p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(token.hex)}
                        className="w-full py-1.5 bg-[#202024] hover:bg-[#27272a] border border-[#27272a] rounded-lg text-[10px] font-mono font-semibold text-[#A1A1AA] hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedToken === token.hex ? (
                          <>
                            <Check className="h-3 w-3 text-[#22C55E]" />
                            <span className="text-[#22C55E]">Copied HEX!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Token Value</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#121215] border border-[#27272a] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[#22C55E]" />
                    <div>
                      <span className="text-xs font-bold text-white block">WCAG AA Contrast Compliant</span>
                      <span className="text-[11px] text-[#A1A1AA]">4.5:1 minimum text contrast guaranteed across all dark-mode surface layers</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-1 rounded-full">
                    STATUS: PASS
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: TYPOGRAPHY & SCALES */}
            {activeTab === "typography" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2. Typography Hierarchy & Spacing Math</h4>
                  <p className="text-xs text-[#A1A1AA] mt-1">Inter / Plus Jakarta Sans display typography paired with JetBrains Mono data labels.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#0066FF]">
                      <span>HERO DISPLAY (56px – 72px) • tracking-tight (-0.03em)</span>
                      <span>Font: Plus Jakarta Sans / Inter</span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                      Build. Prepare. Get Hired.
                    </div>
                  </div>

                  <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#0066FF]">
                      <span>SECTION TITLES (32px – 40px) • Semi-Bold</span>
                      <span>Font: Plus Jakarta Sans</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      AI Career Operating System
                    </div>
                  </div>

                  <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#0066FF]">
                      <span>BODY COPY (16px – 18px) • Regular/Medium</span>
                      <span>Color: #A1A1AA (Cool Grey)</span>
                    </div>
                    <div className="text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
                      NexHire unifies everything you need to crack internships and placements. AI-powered guidance, practice, and opportunities — all in one intelligent platform.
                    </div>
                  </div>

                  <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#0066FF]">
                      <span>MONOSPACE TECHNICAL LABELS & DATA</span>
                      <span>Font: JetBrains Mono</span>
                    </div>
                    <div className="font-mono text-xs text-[#22C55E] bg-[#000000] border border-[#27272a] p-3 rounded-lg flex items-center justify-between">
                      <span>⚡ SYSTEM_ATS_SCORE: 94/100 (PASSED)</span>
                      <span className="text-[#A1A1AA]">TIME_TTFB: 42ms</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: UI COMPONENT LIBRARY */}
            {activeTab === "components" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3. UI Component Library</h4>
                  <p className="text-xs text-[#A1A1AA] mt-1">Interactive states for buttons, badges, dark-themed inputs, and data cards.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Buttons */}
                  <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-4">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">Buttons & CTA States</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="px-5 py-2.5 bg-white text-black font-semibold rounded-lg text-xs hover:bg-zinc-200 transition-all cursor-pointer">
                        Primary Solid White
                      </button>
                      <button className="px-5 py-2.5 bg-[#0066FF] text-white font-semibold rounded-lg text-xs hover:bg-[#0052CC] shadow-lg shadow-[#0066FF]/20 transition-all cursor-pointer">
                        Electric Blue CTA
                      </button>
                      <button className="px-4 py-2 bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white rounded-full text-xs transition-all cursor-pointer">
                        Secondary Dark Pill
                      </button>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-4">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">Status Badges & Micro Tags</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-mono font-semibold rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                        LIVE METRIC: 98%
                      </span>
                      <span className="px-3 py-1 bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#0066FF] text-xs font-mono font-semibold rounded-full">
                        AI CO-PILOT
                      </span>
                      <span className="px-3 py-1 bg-[#202024] border border-[#27272A] text-[#A1A1AA] text-xs font-mono rounded-full">
                        FREE TIER
                      </span>
                    </div>
                  </div>

                  {/* Dark Theme Input */}
                  <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">Dark-Themed Input Field</span>
                    <input
                      type="text"
                      placeholder="e.g. Enter resume link or ask NexMentor..."
                      defaultValue="Senior Full Stack Engineer Role"
                      className="w-full px-4 py-2.5 bg-[#202024] border border-[#27272A] focus:border-[#0066FF] rounded-lg text-xs text-white placeholder-[#71717A] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Content Card Spec */}
                  <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">Framed Surface Card</span>
                      <span className="text-[10px] font-mono text-[#A1A1AA]">Radius: 16px</span>
                    </div>
                    <p className="text-xs text-[#A1A1AA]">Layering uses 1px solid stroke `#27272A` with `#121215` card background fill.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RESPONSIVE BREAKPOINTS */}
            {activeTab === "responsive" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">4. Responsive Viewport Prototypes</h4>
                    <p className="text-xs text-[#A1A1AA] mt-1">Simulate application layout density across Mobile, Tablet & Ultra-Wide Desktop.</p>
                  </div>

                  <div className="flex items-center gap-1 bg-[#121215] border border-[#27272a] p-1 rounded-xl">
                    <button
                      onClick={() => setViewportMode("desktop")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        viewportMode === "desktop" ? "bg-[#0066FF] text-white" : "text-[#A1A1AA] hover:text-white"
                      }`}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      <span>Desktop (1280px)</span>
                    </button>
                    <button
                      onClick={() => setViewportMode("tablet")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        viewportMode === "tablet" ? "bg-[#0066FF] text-white" : "text-[#A1A1AA] hover:text-white"
                      }`}
                    >
                      <Tablet className="h-3.5 w-3.5" />
                      <span>Tablet (768px)</span>
                    </button>
                    <button
                      onClick={() => setViewportMode("mobile")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        viewportMode === "mobile" ? "bg-[#0066FF] text-white" : "text-[#A1A1AA] hover:text-white"
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>Mobile (375px)</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Device Sandbox Container */}
                <div className="flex justify-center bg-[#000000] border border-[#27272a] rounded-2xl p-6 min-h-[320px] items-center overflow-x-auto">
                  <div
                    className={`transition-all duration-300 bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4 shadow-2xl ${
                      viewportMode === "mobile"
                        ? "w-[340px]"
                        : viewportMode === "tablet"
                        ? "w-[600px]"
                        : "w-full max-w-3xl"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                        <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                        <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[10px] font-mono text-[#A1A1AA]">NexHire — {viewportMode.toUpperCase()} VIEWPORT</span>
                    </div>

                    <div className="space-y-3">
                      <div className="text-lg font-bold text-white">Interactive Responsive Prototype</div>
                      <p className="text-xs text-[#A1A1AA]">
                        All page elements adapt dynamically: navigation switches to collapsible mobile drawer, metrics grids collapse from 4-column desktop to 2-column mobile cards, and buttons expand to full-width touch targets.
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-mono font-bold rounded-full">
                          PASSED_RESPONSIVE_TEST
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-[#121215] border-t border-[#27272a] flex items-center justify-between">
            <span className="text-xs font-mono text-[#A1A1AA]">DESIGN TOKENS ACTIVE • FRAMER/VERCEL AESTHETIC</span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Close Design Brief
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
