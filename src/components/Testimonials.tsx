import React from "react";
import { motion } from "motion/react";
import { Star, Quote, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rohan Sen",
      college: "IIT Kharagpur",
      placement: "Software Engineer I @ Google",
      img: "R",
      text: "NexHire saved me weeks of manual preparation. The AI mock feedback tracked my speaking pace and confidence. I went into my Google system design round feeling completely in control.",
      score: "98/100 Readiness",
      accent: "from-blue-500/10 to-indigo-500/10",
    },
    {
      name: "Priya Patel",
      college: "VIT Vellore",
      placement: "Backend Developer @ Stripe",
      img: "P",
      text: "The ATS resume builder is absolute magic. Pushing my score from 64 to 94 using the action metrics got me interview callbacks for roles where I previously struggled to get noticed.",
      score: "95/100 Readiness",
      accent: "from-purple-500/10 to-pink-500/10",
    },
    {
      name: "Akash Sharma",
      college: "Delhi Technological University",
      placement: "Frontend Engineer @ Linear",
      img: "A",
      text: "I mastered tree traversals and graph heuristics using the interactive DSA sandbox. The test-suite compiler is incredibly fast and helped me catch subtle edge cases before on-site coding.",
      score: "96/100 Readiness",
      accent: "from-indigo-500/10 to-blue-500/10",
    },
    {
      name: "Sneha Reddy",
      college: "BITS Pilani",
      placement: "SDE @ Microsoft",
      img: "S",
      text: "The company-targeted roadmaps took away all the guesswork. Instead of wandering through endless random YouTube playlists, NexHire gave me a structured, linear path directly to Microsoft.",
      score: "94/100 Readiness",
      accent: "from-pink-500/10 to-purple-500/10",
    },
  ];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-[#050505] border-y border-[rgba(255,255,255,0.08)]">
      {/* Background glow lights */}
      <div className="ambient-lighting-spot top-1/2 right-1/4 w-[500px] h-[500px] bg-[#1e3a8a] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#666666]">
              Verified Success
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
              Graduate Outcomes that Speak for Themselves
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#999999] max-w-xl">
              Hear directly from fresh graduates and engineering cohorts who used NexHire to accelerate their prep, bypass screening filters, and land premier engineering roles.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <div className="inline-flex items-center gap-1.5 bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] px-4 py-2 rounded-2xl">
              <span className="font-heading font-bold text-sm text-white">4.9 / 5.0</span>
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[10px] text-[#666666] font-medium">(2,400+ reviews)</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card-premium p-6 md:p-8 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-6">
                {/* Upper row: User profile */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#151515] border border-[rgba(255,255,255,0.1)] text-white font-heading font-extrabold flex items-center justify-center text-sm shadow-md">
                      {t.img}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xs text-white">{t.name}</h4>
                      <p className="font-sans text-[11px] text-[#666666]">{t.college}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#141414] border border-[rgba(255,255,255,0.08)] px-2.5 py-1 rounded-full font-mono text-[#999999] font-bold">
                    {t.score}
                  </span>
                </div>

                {/* Quote Text */}
                <div className="relative">
                  <Quote className="h-10 w-10 text-[rgba(255,255,255,0.05)] absolute -top-4 -left-2 z-0" />
                  <p className="font-sans text-xs md:text-sm text-[#999999] leading-relaxed relative z-10">
                    {t.text}
                  </p>
                </div>
              </div>

              {/* Lower row: Corporate placement details */}
              <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-sans font-medium text-[#666666] group-hover:text-white transition-colors">
                  <span>Placed at:</span>
                  <span className="font-semibold text-white">{t.placement}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#666666] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
