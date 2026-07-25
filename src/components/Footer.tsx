import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, GraduationCap, Github, Twitter, Linkedin, MessageSquare, ShieldCheck } from "lucide-react";

interface FooterProps {
  onExplorePricing: () => void;
}

export default function Footer({ onExplorePricing }: FooterProps) {
  const footerLinks = {
    Product: [
      { name: "AI Resume Scorer", href: "#features" },
      { name: "DSA Coding Arena", href: "#features" },
      { name: "Mock Interviews", href: "#features" },
      { name: "Company Roadmaps", href: "#features" },
    ],
    Resources: [
      { name: "Placement Guide 2026", href: "#" },
      { name: "C++ Cheat Sheets", href: "#" },
      { name: "Behavioral Scripting", href: "#" },
      { name: "System Design Guide", href: "#" },
    ],
    Institutional: [
      { name: "Placement Cell Licenses", href: "#" },
      { name: "Hiring Partnerships", href: "#" },
      { name: "Corporate Talent Pools", href: "#" },
      { name: "Case Studies", href: "#" },
    ],
    Legal: [
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Refund Policy", href: "#" },
      { name: "Security Standards", href: "#" },
    ],
  };

  return (
    <footer className="relative border-t border-[rgba(255,255,255,0.08)] bg-[#000000]">
      {/* SITEMAP GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Logo Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="h-8 w-8 rounded-lg bg-[#151515] border border-[rgba(255,255,255,0.12)] flex items-center justify-center shadow-lg group-hover:bg-[#1e3a8a] transition-colors">
                <GraduationCap className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-heading font-extrabold text-md tracking-tight text-white flex items-center gap-1.5">
                NexHire
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#6E6E6E] leading-relaxed max-w-xs">
              AI-powered placement preps and standardized direct corporate hiring cohorts built for modern engineering campuses.
            </p>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-3.5">
              <h5 className="font-heading font-bold text-[10px] uppercase tracking-wider text-[#B0B0B0]">{title}</h5>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="font-sans text-[11px] text-[#6E6E6E] hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM METADATA & SOCIALS */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-[#6E6E6E]">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 NexHire Inc. All rights reserved.</span>
            <span className="h-3 w-[1px] bg-[rgba(255,255,255,0.08)] hidden sm:inline"></span>
            <span className="hidden sm:inline flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> ISO/IEC 27001 Certified Readiness Pool</span>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {[
              { icon: Twitter, href: "https://twitter.com" },
              { icon: Github, href: "https://github.com" },
              { icon: Linkedin, href: "https://linkedin.com" },
              { icon: MessageSquare, href: "https://discord.com" },
            ].map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-full bg-[#101010] hover:bg-[#151515] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] flex items-center justify-center text-[#6E6E6E] hover:text-white transition-all"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
