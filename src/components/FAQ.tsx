import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the AI Resume Evaluation work?",
      a: "Our AI parser reverse-engineers the target job description to match exact key phrases, technical keywords, and operational action density. It scores your bullet points against industry-wide ATS standards, helping you replace passive descriptions with high-impact STAR (Situation, Task, Action, Result) bullets.",
    },
    {
      q: "Which programming languages are supported in the DSA Arena?",
      a: "NexHire currently supports fully native, real-time code execution and analysis for C++, Java, Python, and JavaScript. Your solutions are compiled and executed against standard edge-case sets with memory allocation and CPU execution graphs logged in real-time.",
    },
    {
      q: "How do direct recruiter placement drives work?",
      a: "Once you achieve a NexHire Readiness Score of 90+ through our combined modules, your profile enters our Verified Talent Cohorts. Rather than applying via noisy job boards, hiring managers from our partner companies search the directory directly to recruit qualified, ready-to-interview candidates.",
    },
    {
      q: "Is there a custom plan or discount for colleges and universities?",
      a: "Yes! We partner directly with university placement cells to offer unified university dashboards, mock assessment environments, and discounted group pricing. Please contact our institutional relations desk through support@nexhire.com.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a 100% no-questions-asked, 14-day money-back guarantee. If you do not see a massive improvements in your resume clearance scores or simulated mock interviews, simply request a refund from your profile settings page.",
    },
  ];

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#141414] border border-[rgba(255,255,255,0.08)] px-3 py-1 rounded-full text-[#999999] text-xs font-semibold uppercase tracking-wider font-mono">
            <HelpCircle className="h-3 w-3 text-[#0066FF]" /> FAQ
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
            Placement Prep: Answers Resolved
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#999999]">
            Have queries regarding automated scoring, compiler support, and recruiter pathways? Review our responses below.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all duration-300 ${
                  isOpen
                    ? "bg-[#101010] border-[rgba(255,255,255,0.14)] shadow-lg"
                    : "bg-[#050505] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)]"
                }`}
              >
                <button
                  id={`faq-btn-${idx}`}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-heading font-semibold text-sm sm:text-base text-[#CCCCCC] hover:text-white transition-colors">
                    {faq.q}
                  </span>
                  <div className={`h-8 w-8 rounded-full border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-[#141414] text-white" : "text-[#666666]"}`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-[#999999] leading-relaxed font-sans border-t border-[rgba(255,255,255,0.05)] pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Dynamic Contact Callout */}
        <div className="mt-12 p-6 rounded-2xl card-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-heading font-bold text-xs text-white">Still have questions regarding direct hiring drives?</h4>
            <p className="font-sans text-[11px] text-[#6E6E6E] mt-1">Our customer support agents are active 24/7 to resolve queries.</p>
          </div>
          <button
            onClick={() => window.open("mailto:support@nexhire.com")}
            className="btn-secondary-matte text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Contact Support</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
