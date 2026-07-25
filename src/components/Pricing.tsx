import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, Info, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";

interface PricingProps {
  onPlanSelect?: () => void;
}

export default function Pricing({ onPlanSelect }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter Cohort",
      desc: "For college students starting their placement preps.",
      price: { monthly: 0, annual: 0 },
      features: [
        "Basic ATS Resume Review",
        "50 Handpicked DSA Questions",
        "1 AI Technical Mock Interview (Text)",
        "Standard General Career Roadmaps",
        "Standard Application Tracker CRM",
        "Community Discord Access",
      ],
      notIncluded: [
        "Interactive AI Resume Bullet Rewriter",
        "Full Compiler Sandbox & Edge Case Evaluation",
        "Unlimited Audio-Guided AI Mock Simulations",
        "Company-Targeted Pathways (Stripe, Linear, Microsoft)",
        "Premium Recruiter Directory Placement",
      ],
      cta: "Get Started Free",
      popular: false,
      accent: "border-[#27272A] bg-[#121215]",
    },
    {
      name: "Career Accelerator",
      desc: "Comprehensive suite for active placement & internship seekers.",
      price: { monthly: 999, annual: 599 },
      features: [
        "Advanced ATS Score Review & AI Action Bullet Rewriters",
        "Unlimited DSA Algorithmic Arena with production-grade compilers",
        "Unlimited Audio-Guided AI Mock Interview simulations",
        "Confidence & Speech Rate analytical voice dashboards",
        "Company-Targeted Pathways (Stripe, Linear, Microsoft, Google)",
        "Direct visibility in the NexHire certified Recruiter Pool",
        "1-on-1 resume feedback audits from senior engineering peers",
      ],
      notIncluded: [],
      cta: "Join Career Accelerator",
      popular: true,
      accent: "border-[#0066FF]/40 bg-[#121215] shadow-2xl shadow-[#0066FF]/10",
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#666666]">
            Transparent Plans
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
            Invest in Your Engineering Career
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#999999]">
            Accelerate your mock clearance speeds, ATS compatibility scoring, and direct placement opportunities. Save up to 40% on our annual plans.
          </p>

          {/* Billing Toggle */}
          <div className="pt-6 flex justify-center">
            <div className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] p-1 rounded-full flex items-center gap-1">
              <button
                id="billing-btn-monthly"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#1f1f1f] text-white shadow"
                    : "text-[#666666] hover:text-[#999999]"
                }`}
              >
                Monthly
              </button>
              <button
                id="billing-btn-annual"
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "annual"
                    ? "bg-[#0066FF] text-white shadow"
                    : "text-[#666666] hover:text-[#999999]"
                }`}
              >
                Annual Save 40%
              </button>
            </div>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-6 md:p-8 border flex flex-col justify-between transition-all duration-300 ${plan.accent} ${
                plan.popular ? "border-[#0066FF]/40 bg-[#0d0d0d]" : "border-[rgba(255,255,255,0.08)] bg-[#0d0d0d]"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white font-sans text-[10px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Sparkles className="h-3 w-3" /> Most Popular Tier
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Metadata */}
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-white">{plan.name}</h3>
                  <p className="font-sans text-xs text-[#999999] mt-1.5 leading-relaxed">{plan.desc}</p>
                </div>

                {/* Plan Pricing */}
                <div className="py-2">
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading font-extrabold text-4xl text-white">
                      ₹{billingCycle === "monthly" ? plan.price.monthly : plan.price.annual}
                    </span>
                    <span className="font-sans text-[#666666] text-xs">/ month</span>
                  </div>
                  {billingCycle === "annual" && plan.price.annual > 0 && (
                    <span className="text-[10px] text-[#0066FF] font-medium mt-1 block">
                      Billed annually at ₹{plan.price.annual * 12}
                    </span>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-3.5 pt-4 border-t border-white/5">
                  <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    Included Features:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="leading-relaxed font-sans">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Excluded features for visual contrast */}
                  {plan.notIncluded && plan.notIncluded.length > 0 && (
                    <div className="space-y-2.5 pt-4">
                      <span className="block text-[10px] uppercase font-bold text-zinc-600 tracking-wider">
                        Not Included:
                      </span>
                      <ul className="space-y-2.5">
                        {plan.notIncluded.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-600 opacity-60">
                            <span className="text-zinc-600 mt-0.5 font-bold shrink-0 text-xs leading-none">×</span>
                            <span className="leading-relaxed font-sans line-through">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-auto">
                <button
                  id={`pricing-btn-${index}`}
                  onClick={onPlanSelect}
                  className={`w-full py-3.5 rounded-full font-sans text-xs font-bold transition-all duration-300 cursor-pointer ${
                    plan.popular
                      ? "bg-white hover:bg-zinc-100 text-black shadow-lg shadow-white/5"
                      : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                  }`}
                >
                  {plan.cta}
                </button>
                <div className="flex items-center justify-center gap-1 mt-3.5 text-[10px] text-zinc-500 font-sans">
                  <ShieldCheck className="h-3 w-3" /> Cancel anytime. 14-day refund policy.
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
