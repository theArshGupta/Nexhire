import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X, Sparkles, GraduationCap } from "lucide-react";

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onOpenFigmaModal?: () => void;
}

export default function Navbar({ onNavigate, activeSection, onLoginClick, onSignupClick, onOpenFigmaModal }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", id: "features" },
    { name: "How it Works", id: "how-it-works" },
    { name: "Showcase", id: "showcase" },
    { name: "Testimonials", id: "testimonials" },
    { name: "Pricing", id: "pricing" },
    { name: "FAQ", id: "faq" },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050505]/70 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            id="nav-logo-container"
            onClick={() => onNavigate("hero")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#141414] flex items-center justify-center group-hover:border-[rgba(255,255,255,0.25)] transition-all duration-300 border border-[rgba(255,255,255,0.1)]">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                NexHire
                <span className="text-[10px] bg-[#141414] text-[#888888] px-1.5 py-0.5 rounded-full font-mono font-medium tracking-normal border border-[rgba(255,255,255,0.08)]">
                  BETA
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div id="desktop-nav-links" className="hidden md:flex items-center gap-1 bg-[#0a0a0a]/90 border border-[rgba(255,255,255,0.08)] p-1 rounded-full backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  activeSection === item.id
                    ? "text-white bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] shadow-sm"
                    : "text-[#999999] hover:text-white hover:bg-[#121212] border border-transparent"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop Right Side CTA */}
          <div id="desktop-nav-cta" className="hidden md:flex items-center gap-3">
            <button
              onClick={onLoginClick || (() => onNavigate("faq"))}
              className="text-[#999999] hover:text-white font-sans text-xs font-medium cursor-pointer transition-colors px-2"
            >
              Log In
            </button>

            <button
              onClick={onSignupClick || (() => onNavigate("pricing"))}
              className="btn-primary-gradient text-xs font-semibold"
            >
              <span>Sign Up</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 text-black" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div id="mobile-menu-toggle-container" className="md:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-sans text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-white bg-white/5 border border-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (onLoginClick) {
                      onLoginClick();
                    } else {
                      onNavigate("faq");
                    }
                    setIsOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 rounded-xl text-zinc-400 hover:text-white font-sans text-sm font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    if (onSignupClick) {
                      onSignupClick();
                    } else {
                      onNavigate("pricing");
                    }
                    setIsOpen(false);
                  }}
                  className="w-full btn-primary-gradient text-xs font-semibold py-3 flex items-center justify-center gap-1.5"
                >
                  Sign Up <ArrowRight className="h-4 w-4 text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
