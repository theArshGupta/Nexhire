import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, ArrowRight, UserCheck, Shield, ChevronLeft, ChevronRight, RotateCw, Lock, Sparkles, MoreVertical, Puzzle, Grid, ExternalLink } from "lucide-react";
import { AppView, UserSession } from "../types";

interface GoogleAuthProps {
  onNavigate: (view: AppView) => void;
  onSelectAccount: (session: UserSession) => void;
}

export default function GoogleAuth({ onNavigate, onSelectAccount }: GoogleAuthProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const accounts = [
    {
      name: "arsh gupta",
      email: "arshgupta731@gmail.com",
      avatarEmoji: "🦒",
      avatarBg: "bg-[#ffd633]/20 border-[#ffd633]/40",
      active: true,
    },
    {
      name: "arsh gupta (Academic)",
      email: "agupta731@stanford.edu",
      avatarEmoji: "🎓",
      avatarBg: "bg-[#4285F4]/20 border-[#4285F4]/40",
      active: false,
    },
  ];

  const handleSelect = (account: typeof accounts[0]) => {
    setSelectedEmail(account.email);
    setSelectedName(account.name);
    setIsVerifying(true);
    setTimeout(() => {
      onSelectAccount({
        name: account.name,
        email: account.email,
        authMethod: "google",
      });
    }, 1800);
  };

  return (
    <div id="google-auth-container" className="relative min-h-screen bg-[#0a0a0c] text-zinc-200 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      {/* Dynamic background lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d0d12_1px,transparent_1px),linear-gradient(to_bottom,#0d0d12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] opacity-20 pointer-events-none z-0"></div>
      
      {/* simulated premium web browser frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-2xl overflow-hidden border border-zinc-800 bg-[#0f0f11] shadow-[0_30px_80px_rgba(0,0,0,0.9)] z-10 flex flex-col min-h-[640px]"
      >
        {/* Browser Top Navigation Bar (Chrome/Safari simulator) */}
        <div className="bg-[#18181b] px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between gap-4 select-none shrink-0">
          {/* Traffic Lights / window controls */}
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate("signup")} className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-90 transition-all flex items-center justify-center group cursor-pointer" title="Close tab">
              <span className="text-[7px] text-[#4c0002] opacity-0 group-hover:opacity-100 font-bold transition-opacity">✕</span>
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
          </div>

          {/* Navigation Controls & Omnibar */}
          <div className="flex-1 flex items-center gap-3 max-w-3xl">
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
                https://accounts.google.com/v3/signin/accountchooser?client_id=nexhire_placement_cockpit_258013&redirect_uri=https://nexhire.io/auth/callback&scope=profile%20email
              </span>
            </div>
          </div>

          {/* Browser actions/menu on right */}
          <div className="flex items-center gap-2 text-zinc-500">
            <button className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors cursor-pointer" title="Browser Extensions">
              <Puzzle className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors cursor-pointer" title="Google account">
              <div className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                G
              </div>
            </button>
            <button className="p-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-300 transition-colors cursor-pointer">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Browser Bookmark Bar simulation */}
        <div className="bg-[#151518] px-5 py-1.5 border-b border-zinc-900 flex items-center gap-4 text-[11px] font-mono text-zinc-500 select-none shrink-0">
          <div className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z"/></svg>
            <span>NexHire Portal</span>
          </div>
          <span className="text-zinc-800">•</span>
          <div className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
            <span>GitHub Repos</span>
          </div>
          <span className="text-zinc-800">•</span>
          <div className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
            <svg className="h-3 w-3 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            <span>Google Drive APIs</span>
          </div>
        </div>

        {/* Browser Page Content Section (Authentic Google Sign-In replica) */}
        <div className="flex-1 bg-[#0f0f11] flex flex-col justify-between p-6 sm:p-10 md:p-12 relative overflow-y-auto">
          
          <AnimatePresence mode="wait">
            {isVerifying ? (
              /* High-fidelity Google security verification step */
              <motion.div
                key="google-verifying-ui"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center py-12"
              >
                {/* Simulated colorful loader wrapper */}
                <div className="relative mb-8">
                  {/* Google colorful circular progress bar simulator */}
                  <div className="h-20 w-20 rounded-full border-4 border-zinc-800 border-t-[#4285F4] border-r-[#EA4335] border-b-[#FBBC05] border-l-[#34A853] animate-spin"></div>
                  <div className="absolute inset-2 bg-[#0f0f11] rounded-full flex items-center justify-center">
                    <Shield className="h-7 w-7 text-indigo-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase">Google OAuth Gateway</span>
                  <h3 className="font-heading font-extrabold text-xl text-white">Verifying credentials...</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-sm">
                    Connecting your primary profile securely to register your NexHire candidate dashboard session.
                  </p>
                </div>

                {/* Handshake Details */}
                <div className="mt-8 p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl w-full flex items-center gap-3 text-left">
                  <div className="h-10 w-10 rounded-full bg-[#ffd633]/20 border border-[#ffd633]/30 flex items-center justify-center text-lg shrink-0">
                    🦒
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white uppercase truncate">{selectedName}</p>
                    <p className="text-[11px] text-zinc-500 font-mono truncate">{selectedEmail}</p>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                </div>
              </motion.div>
            ) : (
              /* Left column/Right column authentic layout from screenshot */
              <motion.div
                key="google-select-ui"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full"
              >
                {/* Main Card Container */}
                <div className="bg-[#131314] rounded-[28px] border border-zinc-800 p-8 md:p-12 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start relative overflow-hidden">
                  
                  {/* Left Column: Brand & Action statement */}
                  <div className="md:col-span-5 space-y-6">
                    {/* Google original color logo with Sign In text */}
                    <div className="flex items-center gap-3">
                      <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.1-.13-.19-.27-.26-.41z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span className="font-heading font-black text-sm tracking-tight text-white/90">Sign in with Google</span>
                    </div>

                    <div className="space-y-3">
                      <h1 className="font-sans font-normal text-3xl tracking-tight text-white">
                        Choose an account
                      </h1>
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        <span>to continue to</span>
                        <div className="flex items-center gap-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2.5 py-1 text-white text-xs font-semibold shadow-sm">
                          <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                          <span>NexHire</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Account List */}
                  <div className="md:col-span-7 space-y-6">
                    {/* List Group */}
                    <div className="divide-y divide-zinc-800/80 border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-900/10">
                      {accounts.map((acc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelect(acc)}
                          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-zinc-800/40 transition-all cursor-pointer group active:bg-zinc-800"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {/* giraffe avatar layout matching screenshot */}
                            <div className={`h-11 w-11 rounded-full flex items-center justify-center text-xl border shrink-0 ${acc.avatarBg} shadow-inner`}>
                              {acc.avatarEmoji}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors uppercase">
                                {acc.name}
                              </p>
                              <p className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate">{acc.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {acc.active && (
                              <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
                                PRIMARY
                              </span>
                            )}
                            <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      ))}

                      {/* Use another account option */}
                      <button
                        onClick={() => onNavigate("signup")}
                        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-zinc-800/40 transition-colors cursor-pointer text-xs font-semibold text-zinc-400 hover:text-white"
                      >
                        <div className="h-11 w-11 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0 text-xl font-light">
                          +
                        </div>
                        <span>Use another account</span>
                      </button>
                    </div>

                    {/* Disclaimer Policy Notice (screenshot styled) */}
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
                      Before using this app, you can review NexHire's{" "}
                      <a href="#privacy" className="text-indigo-400 hover:underline">Privacy Policy</a> and{" "}
                      <a href="#terms" className="text-indigo-400 hover:underline">Terms of Service</a>.
                    </p>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer of the Google Choose page */}
          <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500 mt-8 shrink-0">
            <div className="relative">
              <select
                defaultValue="en-gb"
                className="bg-transparent border-none text-zinc-400 hover:text-white text-xs cursor-pointer focus:outline-none pr-6 py-1 font-sans"
              >
                <option value="en-gb" className="bg-[#131314] text-white">English (United Kingdom)</option>
                <option value="en-us" className="bg-[#131314] text-white">English (United States)</option>
                <option value="es" className="bg-[#131314] text-white">Español</option>
                <option value="fr" className="bg-[#131314] text-white">Français</option>
              </select>
            </div>
            
            <div className="flex gap-5">
              <a href="#help" className="hover:text-zinc-300 transition-colors">Help</a>
              <a href="#privacy" className="hover:text-zinc-300 transition-colors">Privacy</a>
              <a href="#terms" className="hover:text-zinc-300 transition-colors">Terms</a>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
