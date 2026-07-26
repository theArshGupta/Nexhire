import React, { useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, ArrowRight, Mail, Lock, ShieldCheck, HelpCircle } from "lucide-react";
import { AppView, UserSession } from "../types";

interface LoginProps {
  onNavigate: (view: AppView) => void;
  onLoginSuccess: (session: UserSession) => void;
}

export default function Login({ onNavigate, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsLoading(true);

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success && data.user) {
          onLoginSuccess({
            name: data.user.name,
            email: data.user.email,
            college: data.user.college,
            authMethod: "email",
            token: data.token
          });
        } else {
          setError(data.error || "Invalid email or password");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Network error. Unable to connect to the authentication server.");
      });
  };

  return (
    <div id="login-page-container" className="relative min-h-screen bg-[#000000] text-white flex flex-col justify-between overflow-hidden">
      {/* Visual background layers */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d0d12_1px,transparent_1px),linear-gradient(to_bottom,#0d0d12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_50%,transparent_100%)] opacity-30 pointer-events-none z-0"></div>
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#0066FF]/10 rounded-full blur-[130px] pointer-events-none z-0"></div>

      {/* Header / Brand Nav */}
      <header id="login-header" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div 
          id="login-logo-btn"
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="h-8 w-8 rounded-lg bg-[#0066FF] flex items-center justify-center shadow-lg shadow-[#0066FF]/20 transition-all duration-300">
            <GraduationCap className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-white">
            NexHire
          </span>
        </div>
        <button
          onClick={() => onNavigate("signup")}
          className="text-xs text-[#A1A1AA] hover:text-white transition-colors font-medium border border-[#27272A] hover:border-[#3F3F46] px-3.5 py-1.5 rounded-full bg-[#121215] cursor-pointer"
        >
          Create Account
        </button>
      </header>

      {/* Main Authentication Card Grid */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          id="login-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-[#121215] border border-[#27272A] rounded-2xl p-8 sm:p-10 shadow-2xl relative group/card hover:border-[#3F3F46] transition-all duration-300"
        >
          {/* Accent glow line */}
          <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-[#0066FF]/50 to-transparent"></div>

          {/* Title Area */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="font-sans text-xs text-zinc-400 font-light">
              Enter your credentials to access your AI Career cockpit.
            </p>
          </div>

          {/* Social Logins Section */}
          <div className="space-y-3 mb-6">
            {/* Google Authentication */}
            <button
              type="button"
              id="login-social-google"
              onClick={() => { window.location.href = "/api/auth/google"; }}
              className="w-full flex items-center justify-center gap-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-xl px-4 py-3 transition-all duration-200 cursor-pointer text-xs font-semibold text-zinc-200 active:scale-[0.99]"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>

            {/* GitHub Authentication */}
            <button
              type="button"
              id="login-social-github"
              onClick={() => { window.location.href = "/api/auth/github"; }}
              className="w-full flex items-center justify-center gap-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-xl px-4 py-3 transition-all duration-200 cursor-pointer text-xs font-semibold text-zinc-200 active:scale-[0.99]"
            >
              <svg className="h-4 w-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Separator line */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Or login with email</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Email / Password Login Form */}
          <form id="login-credentials-form" onSubmit={handleEmailSubmit} className="space-y-4">
            {error && (
              <div className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#07070a] border border-zinc-800 focus:border-indigo-500 hover:border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  className="text-[10px] text-zinc-500 hover:text-[#0066FF] transition-colors font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#07070a] border border-zinc-800 focus:border-indigo-500 hover:border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-xl p-[1px] cursor-pointer mt-2 active:scale-[0.99] transition-transform duration-100 block"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl transition-all duration-300"></span>
              <div className="relative px-4 py-3.5 bg-zinc-950 hover:bg-zinc-950/10 rounded-xl transition-all duration-300 text-center">
                <span className="font-sans text-xs font-bold text-white flex items-center justify-center gap-1.5 tracking-wider uppercase">
                  {isLoading ? "Authenticating..." : "Sign In to Cockpit"} 
                  {!isLoading && <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
                </span>
              </div>
            </button>
          </form>

          {/* Switch to Signup Option */}
          <div className="text-center mt-6">
            <span className="text-xs text-zinc-500 font-light">
              New to NexHire?{" "}
              <button
                onClick={() => onNavigate("signup")}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Create free account
              </button>
            </span>
          </div>
        </motion.div>
      </main>

      {/* Footer Links */}
      <footer id="login-footer" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-zinc-600 font-mono text-[9px]">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-500/55" />
          <span>SECURED PLACEMENT NETWORK • © 2026 NEXHIRE INC</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-500">
          <a href="#terms" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
          <a href="#privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
          <a href="#support" className="hover:text-zinc-300 transition-colors">Developer Help</a>
        </div>
      </footer>
    </div>
  );
}
