import React from "react";
import { motion } from "motion/react";
import { TrendingUp, Users, Award, Building } from "lucide-react";

export default function Stats() {
  const partners = [
    { name: "Google", icon: "G" },
    { name: "Stripe", icon: "S" },
    { name: "Linear", icon: "L" },
    { name: "Notion", icon: "N" },
    { name: "Vercel", icon: "V" },
    { name: "Raycast", icon: "R" },
    { name: "Amazon", icon: "A" },
    { name: "Microsoft", icon: "M" },
  ];

  const metrics = [
    {
      label: "Average Package Recieved",
      value: "₹14.2 LPA",
      growth: "+24% YoY",
      desc: "For fresh graduates across CS, IT & Circuit branches.",
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: "Placement Conversion Rate",
      value: "96.4%",
      growth: "Industry Best",
      desc: "Students who solved 100+ DSA and completed 3 mocks on NexHire.",
      icon: Award,
      color: "from-indigo-500 to-purple-500",
    },
    {
      label: "Active Campus Partnerships",
      value: "140+ Colleges",
      growth: "Tier 1-3 coverage",
      desc: "Unified placement drives and direct campus hiring pools.",
      icon: Building,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Active Ready-to-Hire Students",
      value: "25,000+",
      growth: "Joined recently",
      desc: "Verified profiles with standardized placement-readiness scores.",
      icon: Users,
      color: "from-blue-500 to-pink-500",
    },
  ];

  return (
    <section id="stats" className="py-20 relative bg-[#000000] border-y border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Partners Grid */}
        <div className="text-center mb-16 space-y-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[#666666]">
            Engineered to meet the standards of top-tier talent acquirers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40 hover:opacity-80 transition-opacity duration-300">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all duration-300 group cursor-default"
              >
                <div className="h-6 w-6 rounded-md bg-[#0d0d0d] text-[#999999] border border-[rgba(255,255,255,0.08)] font-heading font-extrabold flex items-center justify-center text-xs group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-300">
                  {partner.icon}
                </div>
                <span className="font-heading font-bold text-[#999999] group-hover:text-white transition-colors">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Outcome Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative card-premium p-6"
              >
                {/* Subtle edge illumination on card hover */}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-[#141414] border border-[rgba(255,255,255,0.08)] text-[#999999] group-hover:text-white transition-colors`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] text-[#666666] bg-[#141414] border border-[rgba(255,255,255,0.08)] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {metric.growth}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="block font-heading font-extrabold text-2xl tracking-tight text-white transition-all duration-300">
                    {metric.value}
                  </span>
                  <h4 className="text-xs font-semibold text-[#999999] font-sans">{metric.label}</h4>
                  <p className="text-xs text-[#666666] leading-relaxed font-sans">{metric.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
