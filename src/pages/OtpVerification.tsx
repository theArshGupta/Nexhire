import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { GraduationCap, ArrowRight, RefreshCw, KeyRound, ArrowLeft } from "lucide-react";
import { AppView, UserSession } from "../types";

interface OtpVerificationProps {
  email: string;
  onNavigate: (view: AppView) => void;
  onVerifySuccess: (session: UserSession) => void;
}

export default function OtpVerification({ email, onNavigate, onVerifySuccess }: OtpVerificationProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Decrement resend timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, val: string) => {
    // Only allow single numeric digits
    const cleaned = val.replace(/[^0-9]/g, "");
    if (!cleaned) return;

    const newCode = [...code];
    newCode[index] = cleaned[0];
    setCode(newCode);
    setError("");

    // Shift focus to next field if current digit is entered
    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      
      if (!code[index] && index > 0) {
        // If current box is empty, delete previous box and focus it
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Otherwise, delete current box
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedText)) return;

    const digits = pastedText.split("");
    setCode(digits);
    setError("");
    inputRefs.current[5]?.focus();
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Please fill in all 6 verification digits.");
      return;
    }

    setIsVerifying(true);
    fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: fullCode })
    })
      .then(res => res.json())
      .then(data => {
        setIsVerifying(false);
        if (data.success && data.user) {
          onVerifySuccess({
            name: data.user.name,
            email: data.user.email,
            college: data.user.college,
            authMethod: "email",
            token: data.token
          });
        } else {
          setError(data.error || "Invalid verification code.");
        }
      })
      .catch(() => {
        setIsVerifying(false);
        setError("Network error. Unable to verify OTP code.");
      });
  };

  // Automatically trigger verification when all 6 digits are entered
  useEffect(() => {
    if (code.join("").length === 6) {
      handleVerify();
    }
  }, [code]);

  return (
    <div id="otp-page-container" className="relative min-h-screen bg-[#030303] text-zinc-200 flex flex-col justify-between overflow-hidden">
      {/* Visual background layers */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d0d12_1px,transparent_1px),linear-gradient(to_bottom,#0d0d12_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none z-0"></div>
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none z-0"></div>

      {/* Header / Brand Nav */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
            <GraduationCap className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-white">
            NexHire
          </span>
        </div>
        <button
          onClick={() => onNavigate("signup")}
          className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Use a Different Email</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          id="otp-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 sm:p-10 shadow-2xl relative"
        >
          {/* Accent glow line */}
          <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent"></div>

          {isVerifying ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <div className="relative">
                <div className="h-14 w-14 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
                <KeyRound className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm text-white">Verifying code...</h3>
                <p className="text-xs text-zinc-500 mt-1 font-mono tracking-wide">Confirming placement token with Secure Gateway</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Branding and Heading */}
              <div className="text-center space-y-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                  <KeyRound className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h1 className="font-heading font-black text-xl tracking-tight text-white">Verify your email</h1>
                  <p className="text-xs text-zinc-400 font-light mt-1.5 leading-relaxed">
                    If you are new to NexHire, we sent a 6-digit confirmation code to{" "}
                    <strong className="text-zinc-200 font-semibold block mt-1 font-mono">{email || "arshgupta731@gmail.com"}</strong>.
                  </p>
                </div>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleVerify} className="space-y-6">
                {error && (
                  <div className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl">
                    {error}
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
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      className="w-12 h-14 bg-[#07070a] border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-center font-heading font-extrabold text-xl text-white rounded-xl focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  id="otp-submit-btn"
                  className="w-full relative group overflow-hidden rounded-xl p-[1px] cursor-pointer mt-2 active:scale-[0.99]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl transition-all duration-300"></span>
                  <div className="relative px-4 py-3 bg-zinc-950 hover:bg-zinc-950/10 rounded-xl transition-all duration-300 text-center">
                    <span className="font-sans text-xs font-bold text-white flex items-center justify-center gap-1.5 tracking-wider uppercase">
                      Confirm & Open Cockpit <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </button>
              </form>

              {/* Resend Actions */}
              <div className="flex items-center justify-between text-xs pt-2 font-mono">
                <span className="text-zinc-600">Didn't receive code?</span>
                {countdown > 0 ? (
                  <span className="text-zinc-500">Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={() => {
                      setCountdown(59);
                      setError("");
                      setCode(Array(6).fill(""));
                      inputRefs.current[0]?.focus();
                      fetch("/api/auth/otp/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email })
                      }).catch(err => console.error("Failed to resend OTP:", err));
                    }}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: "3s" }} />
                    <span>Resend Code</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <footer className="relative z-10 p-6 border-t border-zinc-900 text-[10px] font-mono text-zinc-600 text-center">
        <span>Protected by NexHire Anti-Fraud Shield. Double check spam or bulk folders.</span>
      </footer>
    </div>
  );
}
