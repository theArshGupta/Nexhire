import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, FileText, Code, Bot, Briefcase, Sparkles, Award, Settings, LogOut, Terminal, ArrowRight } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onSignOut: () => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate, onSignOut }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: "dashboard", label: "Go to Dashboard overview", icon: Terminal, category: "Navigation" },
    { id: "resume", label: "Optimize resume bullet (STAR)", icon: FileText, category: "AI Tools" },
    { id: "roadmap", label: "View personalized learning roadmap", icon: Sparkles, category: "AI Tools" },
    { id: "coding", label: "Practice algorithmic coding questions", icon: Code, category: "Practice" },
    { id: "interview", label: "Initiate verbal AI mock interview", icon: Bot, category: "Practice" },
    { id: "applications", label: "Check corporate hiring pipelines", icon: Briefcase, category: "Navigation" },
    { id: "coach", label: "Ask AI career coach a question", icon: Bot, category: "AI Tools" },
    { id: "achievements", label: "View achievements and streak progress", icon: Award, category: "Profile" },
    { id: "settings", label: "Manage account settings", icon: Settings, category: "Profile" },
    { id: "logout", label: "Sign out of your session", icon: LogOut, category: "Session" },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          handleSelect(filtered[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filtered]);

  const handleSelect = (cmd: typeof commands[0]) => {
    if (cmd.id === "logout") {
      onSignOut();
    } else {
      onNavigate(cmd.id);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#111115] border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] flex flex-col max-h-[480px]"
          >
            {/* Search Input bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800/60 bg-[#141419]/50">
              <Search className="h-4.5 w-4.5 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search tools..."
                className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-0"
              />
              <span className="font-mono text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700/50 uppercase tracking-wide">ESC</span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              {filtered.length > 0 ? (
                <div className="space-y-1">
                  {filtered.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected ? "bg-zinc-800/70 text-white" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg border ${isSelected ? "bg-zinc-700 border-zinc-600 text-indigo-400" : "bg-zinc-900 border-zinc-800/80 text-zinc-500"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-medium">{cmd.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-zinc-600 uppercase font-bold">{cmd.category}</span>
                          {isSelected && <ArrowRight className="h-3 w-3 text-indigo-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <p className="text-xs">No commands match your query</p>
                  <p className="text-[11px] text-zinc-600">Try typing "resume", "coding" or "AI coach"</p>
                </div>
              )}
            </div>

            {/* Hint Footer */}
            <div className="px-4 py-2 bg-[#141419]/40 border-t border-zinc-800/50 flex justify-between items-center text-[10px] font-mono text-zinc-600">
              <div className="flex items-center gap-1">
                <span>Use</span>
                <span className="bg-zinc-900 border border-zinc-800 px-1 py-0.2 rounded font-bold">↑</span>
                <span className="bg-zinc-900 border border-zinc-800 px-1 py-0.2 rounded font-bold">↓</span>
                <span>to navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-zinc-900 border border-zinc-800 px-1 py-0.2 rounded font-bold">ENTER</span>
                <span>to select</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
