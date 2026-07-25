import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight, RotateCw, Lock, Puzzle, MoreVertical, Check, Info, Shield, HelpCircle } from "lucide-react";
import { AppView, UserSession } from "../types";

interface GitHubAuthProps {
  onNavigate: (view: AppView) => void;
  onAuthorize: (session: UserSession) => void;
}

export default function GitHubAuth({ onNavigate, onAuthorize }: GitHubAuthProps) {
  const [username, setUsername] = useState("arshgupta731");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Please fill in your GitHub username.");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onAuthorize({
        name: username.includes("@") ? username.split("@")[0] : username,
        email: username.includes("@") ? username : `${username}@github.com`,
        authMethod: "github",
      });
    }, 1800);
  };

  return (
    <div id="github-auth-container" className="relative min-h-screen bg-[#070709] text-zinc-300 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      {/* Dynamic background lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c11_1px,transparent_1px),linear-gradient(to_bottom,#0c0c11_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] opacity-25 pointer-events-none z-0"></div>

      {/* Simulated premium web browser frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl rounded-2xl overflow-hidden border border-zinc-800 bg-[#0d0d10] shadow-[0_35px_90px_rgba(0,0,0,0.95)] z-10 flex flex-col min-h-[660px]"
      >
        {/* Browser Top Navigation Bar (Chrome/Safari simulator) */}
        <div className="bg-[#16161a] px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between gap-4 select-none shrink-0">
          {/* Traffic Lights / window controls */}
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate("signup")} className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-90 transition-all flex items-center justify-center group cursor-pointer" title="Close tab">
              <span className="text-[7px] text-[#4c0002] opacity-0 group-hover:opacity-100 font-bold transition-opacity">✕</span>
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
          </div>

          {/* Navigation Controls & Omnibar */}
          <div className="flex-1 flex items-center gap-3 max-w-2xl">
            {/* History navigation buttons */}
            <div className="flex items-center gap-1.5 text-zinc-500">
              <button onClick={() => onNavigate("signup")} className="p-1 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button disabled className="p-1 rounded-md text-zinc-700">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="p-1 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors cursor-pointer">
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Omnibox / Address Bar */}
            <div className="flex-1 bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-zinc-400 font-mono tracking-wide overflow-hidden select-all shadow-inner">
              <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="text-emerald-500 text-[11px] font-semibold shrink-0">Secure</span>
              <span className="text-zinc-500 shrink-0">|</span>
              <span className="truncate text-zinc-300 select-all font-sans">
                https://github.com/login/oauth/authorize?client_id=nexhire_metrics_38210&redirect_uri=https://nexhire.co/auth/github/callback&scope=user,repo
              </span>
            </div>
          </div>

          {/* Browser actions/menu on right */}
          <div className="flex items-center gap-2 text-zinc-500">
            <button className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors cursor-pointer">
              <Puzzle className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors cursor-pointer">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Browser Bookmark Bar simulation */}
        <div className="bg-[#121215] px-5 py-1.5 border-b border-zinc-900/80 flex items-center gap-4 text-[11px] font-mono text-zinc-500 select-none shrink-0">
          <div className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z"/></svg>
            <span>NexHire Portal</span>
          </div>
          <span className="text-zinc-800">•</span>
          <div className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
            <svg className="h-3 w-3 fill-current text-indigo-400" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
            <span>GitHub Auth Node</span>
          </div>
        </div>

        {/* Browser Page Content Section (Authentic GitHub Authorize screen layout) */}
        <div className="flex-1 bg-[#0d0d10] flex flex-col justify-between p-6 sm:p-10 relative overflow-y-auto">
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              /* Highly realistic authorization handshake spinner */
              <motion.div
                key="github-handshake-loading"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center py-16"
              >
                <div className="relative mb-8">
                  {/* Rotating GitHub spinner */}
                  <div className="h-20 w-20 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin"></div>
                  <div className="absolute inset-2 bg-[#0d0d10] rounded-full flex items-center justify-center">
                    <svg className="h-8 w-8 fill-current text-white animate-pulse" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="font-mono text-[10px] text-emerald-500 tracking-wider uppercase font-bold">Secure Authorization</span>
                  <h3 className="font-heading font-extrabold text-lg text-white">Connecting candidate portfolio...</h3>
                  <p className="text-xs text-zinc-500 font-mono tracking-wide">
                    Exchanging OAuth codes & indexing developer metrics securely
                  </p>
                </div>
              </motion.div>
            ) : (
              /* High-fidelity GitHub OAuth layout */
              <motion.div
                key="github-oauth-main"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full"
              >
                {/* Visual OAuth Connector Bridge */}
                <div className="flex items-center justify-center gap-8 mb-6 sm:mb-8 text-zinc-400 select-none">
                  {/* User Profile avatar */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white border-2 border-zinc-800 shadow-lg">
                      AG
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-wide uppercase">arshgupta731</span>
                  </div>

                  {/* Connecting line with a lock check icon */}
                  <div className="flex-1 max-w-[120px] relative flex items-center justify-center">
                    <div className="w-full h-[2px] bg-gradient-to-r from-zinc-800 via-emerald-500/40 to-zinc-800"></div>
                    <div className="absolute h-6 w-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-md">
                      <Check className="h-3 w-3 text-emerald-400 font-extrabold" />
                    </div>
                  </div>

                  {/* NexHire Cap logo */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 rounded-full bg-[#18181b] border-2 border-zinc-800 flex items-center justify-center shadow-lg relative group">
                      <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <GraduationCap className="h-7 w-7 text-indigo-400 relative z-10" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-wide uppercase">NexHire Inc</span>
                  </div>
                </div>

                {/* Authorization Card Panel */}
                <div className="bg-[#161b22] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                  {/* Card Title Header */}
                  <div className="p-6 border-b border-zinc-800 bg-[#0d1117]/60">
                    <h2 className="text-base font-bold text-white">
                      Authorize <span className="text-zinc-100 font-extrabold">NexHire</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      by <span className="text-indigo-400 hover:underline font-semibold cursor-pointer">nexhire-co</span>
                      <span className="ml-2 inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 text-[8px] rounded font-mono font-bold">
                        ✓ VERIFIED INTEGRATION
                      </span>
                    </p>
                  </div>

                  {/* Permissions detail description */}
                  <div className="p-6 space-y-6">
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                      The application <strong className="text-white">NexHire</strong> is requesting authorization to access your public profile and repositories to score your portfolio.
                    </p>

                    {/* Permissions list group */}
                    <div className="space-y-4 font-sans text-xs">
                      {/* Permission 1: user details */}
                      <div className="flex items-start gap-3.5">
                        <div className="mt-0.5 h-5 w-5 bg-zinc-800/80 border border-zinc-700 flex items-center justify-center rounded-md shrink-0">
                          <Check className="h-3 w-3 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-bold text-white">Personal user data</p>
                          <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">
                            Grants read-only access to your public email addresses, user biography, public profile URLs, and activity counts.
                          </p>
                        </div>
                      </div>

                      {/* Permission 2: public repos */}
                      <div className="flex items-start gap-3.5">
                        <div className="mt-0.5 h-5 w-5 bg-zinc-800/80 border border-zinc-700 flex items-center justify-center rounded-md shrink-0">
                          <Check className="h-3 w-3 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-bold text-white">Public repositories</p>
                          <p className="text-zinc-500 text-[11px] mt-0.5 leading-normal">
                            Allows reading public repository metadata, commits history, and language distributions to calculate developer score metrics.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer banner */}
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-start gap-3 text-[11px] text-zinc-500 leading-normal font-light">
                      <Info className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                      <div>
                        Authorizing will redirect back to <strong className="text-zinc-400">nexhire.co</strong>. You can revoke this permission anytime inside your GitHub Developer Settings menu.
                      </div>
                    </div>
                  </div>

                  {/* Action buttons (Styled with genuine GitHub branding layout) */}
                  <div className="p-6 border-t border-zinc-800/80 bg-[#0d1117]/30 flex flex-col sm:flex-row gap-3 items-center justify-end">
                    <button
                      type="button"
                      onClick={() => onNavigate("signup")}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#21262d] hover:bg-[#30363d] border border-zinc-700 hover:border-zinc-600 rounded-lg text-xs font-semibold text-zinc-300 transition-colors cursor-pointer text-center"
                    >
                      Cancel & Return
                    </button>
                    
                    <form onSubmit={handleSubmit} className="w-full sm:w-auto">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#2ea44f] hover:bg-[#2c974b] hover:brightness-110 active:brightness-95 border border-emerald-500/30 rounded-lg text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wide"
                      >
                        Authorize nexhire-co
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer of the page */}
          <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-600 mt-8 shrink-0 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>GitHub Secure Sandbox v2.84</span>
            </div>
            
            <div className="flex gap-5">
              <span className="cursor-pointer hover:text-zinc-400">Terms</span>
              <span className="cursor-pointer hover:text-zinc-400">Privacy</span>
              <span className="cursor-pointer hover:text-zinc-400">Docs help</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
