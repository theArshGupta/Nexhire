import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, ArrowRight, KeyRound, Mail, Lock, ShieldCheck, RefreshCw, ArrowLeft } from "lucide-react";
import { AppView } from "../types";

interface ForgotPasswordProps {
  onNavigate: (view: AppView) => void;
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"request" | "reset">("request");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setIsLoading(true);

    fetch("/api/auth/password/reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success) {
          setStep("reset");
          setCountdown(59);
          setSuccess("Verification code sent to your email address.");
        } else {
          setError(data.error || "Failed to request password reset.");
        }
      })
      .catch(() => {
        setIsLoading(false);
        setError("Network error. Please try again.");
      });
  };

  const handleResendCode = () => {
    setCountdown(59);
    setError("");
    setCode(Array(6).fill(""));
    inputRefs.current[0]?.focus();

    fetch("/api/auth/password/reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    }).catch(err => console.error("Failed to resend reset OTP:", err));
  };

  const handleVerifyChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    if (!cleaned) return;

    const newCode = [...code];
    newCode[index] = cleaned[0];
    setCode(newCode);
    setError("");

    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (!code[index] && index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      } else {
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handleVerifyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedText)) return;

    const digits = pastedText.split("");
    setCode(digits);
    setError("");
    inputRefs.current[5]?.focus();
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = code.join("");
    if (otpCode.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);

    fetch("/api/auth/password/reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: otpCode, newPassword })
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success) {
          setSuccess("Password reset successfully! Redirecting you to login...");
          setTimeout(() => {
            onNavigate("login");
          }, 2500);
        } else {
          setError(data.error || "Failed to reset password.");
        }
      })
      .catch(() => {
        setIsLoading(false);
        setError("Network error. Please try again.");
      });
  };

  return (
    <div id="forgot-password-container" className="relative min-h-screen bg-[#030303] text-white flex flex-col justify-between overflow-hidden">
      {/* Background visual layers */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d0d12_1px,transparent_1px),linear-gradient(to_bottom,#0d0d12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_50%,transparent_100%)] opacity-30 pointer-events-none z-0"></div>
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none z-0"></div>

      {/* Header / Brand Nav */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div 
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:shadow-purple-500/20 transition-all duration-300">
            <GraduationCap className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-white">
            NexHire
          </span>
        </div>
        <button
          onClick={() => onNavigate("login")}
          className="text-xs text-zinc-400 hover:text-white transition-colors font-medium border border-zinc-800 hover:border-zinc-700 px-3.5 py-1.5 rounded-full bg-zinc-900/30 backdrop-blur-sm cursor-pointer"
        >
          Log In
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          id="forgot-password-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-zinc-950/40 border border-white/5 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative"
        >
          {/* Accent glow line */}
          <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent"></div>

          <AnimatePresence mode="wait">
            {step === "request" ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="font-heading font-black text-2xl tracking-tight text-white">
                    Reset Password
                  </h1>
                  <p className="font-sans text-xs text-zinc-400 font-light leading-relaxed">
                    Enter the email address associated with your account and we will send you a 6-digit verification code.
                  </p>
                </div>

                <form onSubmit={handleRequestReset} className="space-y-4">
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
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group overflow-hidden rounded-xl p-[1px] cursor-pointer mt-2 active:scale-[0.99] transition-transform duration-100 block"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl transition-all duration-300"></span>
                    <div className="relative px-4 py-3 bg-zinc-950 hover:bg-zinc-950/10 rounded-xl transition-all duration-300 text-center">
                      <span className="font-sans text-xs font-bold text-white flex items-center justify-center gap-1.5 tracking-wider uppercase">
                        {isLoading ? "Sending Code..." : "Send Verification Code"}
                        {!isLoading && <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
                      </span>
                    </div>
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                    <KeyRound className="h-4.5 w-4.5" />
                  </div>
                  <h1 className="font-heading font-black text-2xl tracking-tight text-white">
                    Enter Verification Code
                  </h1>
                  <p className="font-sans text-xs text-zinc-400 font-light mt-1.5 leading-relaxed">
                    We sent a 6-digit verification code to
                    <strong className="text-zinc-200 font-semibold block mt-1 font-mono">{email}</strong>.
                  </p>
                </div>

                <form onSubmit={handleConfirmReset} className="space-y-5">
                  {error && (
                    <div className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-xl">
                      {success}
                    </div>
                  )}

                  {/* 6 Digit slots */}
                  <div className="flex items-center justify-between gap-2.5">
                    {code.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          if (el) inputRefs.current[idx] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleVerifyChange(idx, e.target.value)}
                        onKeyDown={(e) => handleVerifyKeyDown(idx, e)}
                        onPaste={idx === 0 ? handleVerifyPaste : undefined}
                        className="w-12 h-14 bg-[#07070a] border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-center font-heading font-extrabold text-xl text-white rounded-xl focus:outline-none transition-all font-mono"
                      />
                    ))}
                  </div>

                  {/* New Password fields */}
                  <div className="space-y-3.5 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-[#07070a] border border-zinc-800 focus:border-indigo-500 hover:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-[#07070a] border border-zinc-800 focus:border-indigo-500 hover:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-sans"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group overflow-hidden rounded-xl p-[1px] cursor-pointer mt-2 active:scale-[0.99] transition-transform duration-100 block"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl transition-all duration-300"></span>
                    <div className="relative px-4 py-3 bg-zinc-950 hover:bg-zinc-950/10 rounded-xl transition-all duration-300 text-center">
                      <span className="font-sans text-xs font-bold text-white flex items-center justify-center gap-1.5 tracking-wider uppercase">
                        {isLoading ? "Resetting..." : "Save Password & Login"}
                        {!isLoading && <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
                      </span>
                    </div>
                  </button>
                </form>

                {/* Resend actions */}
                <div className="flex items-center justify-between text-xs pt-2 font-mono">
                  <span className="text-zinc-600">Didn't receive code?</span>
                  {countdown > 0 ? (
                    <span className="text-zinc-500">Resend in {countdown}s</span>
                  ) : (
                    <button
                      onClick={handleResendCode}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-bold bg-transparent border-0"
                    >
                      <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: "3s" }} />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="w-full text-center text-[10px] font-mono text-zinc-500 hover:text-zinc-300 py-1 transition-colors uppercase tracking-widest mt-1 flex items-center justify-center gap-1 bg-transparent border-0 cursor-pointer"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Change Email Address</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer Links */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
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
