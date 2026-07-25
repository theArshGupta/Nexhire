import React, { useState } from "react";
import { 
  Trophy, Flame, CheckSquare, Square, Star,
  ListTodo, GraduationCap, Bookmark, Trash2
} from "lucide-react";

interface LeftSidebarProps {
  session: { name: string; email: string };
  aiMemory: {
    currentGoal: string;
    learningProgress: number;
    savedPreferences: string;
    targetCompany: string;
    currentTechStack: string[];
    weakAreas: string[];
    recentTopics: string[];
  };
  folders: { id: string; name: string; color: string }[];
  savedPrompts: { id: string; title: string; prompt: string }[];
  triggerMentorResponse: (topic: string) => void;
  setInputText: (text: string) => void;
  bookmarkedMessages: { id: string; text: string; timestamp: string }[];
  onRemoveBookmark: (id: string) => void;
  onUploadResumeClick: () => void;
}

export default function LeftSidebarWidgets({
  session,
  aiMemory,
  bookmarkedMessages,
  onRemoveBookmark
}: LeftSidebarProps) {
  // 1. Interactive Agenda State
  const [agenda, setAgenda] = useState([
    { id: "ag-1", task: "ATS Resume Tuning & Audit", time: "10:30 AM", checked: true },
    { id: "ag-2", task: "Vercel System Mock Scenario", time: "02:00 PM", checked: false },
    { id: "ag-3", task: "DSA: O(1) LRU Cache Implement", time: "04:00 PM", checked: false },
    { id: "ag-4", task: "Sync Career Goals Snapshot", time: "05:30 PM", checked: false }
  ]);

  const toggleAgenda = (id: string) => {
    setAgenda(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const sparklineData = [20, 45, 30, 65, 50, 85, 78];
  const chartPoints = sparklineData.map((val, idx) => `${idx * 38 + 15},${90 - val}`).join(" ");

  return (
    <div className="space-y-3 w-full text-left font-sans">
      
      {/* 1. AI GOAL TRACKER */}
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-indigo-500/30 rounded-xl p-4 transition-all duration-300 shadow-md group">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/20">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <span className="text-[11px] font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">Goal Progress</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 font-semibold shadow-sm">
            Lvl 4
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="relative h-13 w-13 shrink-0 flex items-center justify-center bg-[#161616] rounded-xl border border-indigo-500/40 font-mono text-xs font-bold text-indigo-300 shadow-inner group-hover:border-indigo-400/60 transition-colors">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-xl blur-sm" />
            <span className="relative z-10">{aiMemory.learningProgress}%</span>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wide font-semibold">Target Role</div>
            <div className="text-xs font-semibold text-[#F5F5F5] truncate">{aiMemory.targetCompany} Engineering</div>
            <div className="text-[11px] text-[#A1A1AA] truncate font-normal">{aiMemory.currentGoal}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3.5 pt-2.5 border-t border-[rgba(255,255,255,0.05)] text-[10px]">
          <div className="bg-[#151515] p-2 rounded-lg border border-[rgba(255,255,255,0.06)] flex items-center gap-2 hover:border-rose-500/30 transition-colors">
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            <div>
              <div className="text-[9px] font-mono text-[#71717A]">STREAK</div>
              <div className="font-semibold text-[#F5F5F5]">12 Days</div>
            </div>
          </div>
          <div className="bg-[#151515] p-2 rounded-lg border border-[rgba(255,255,255,0.06)] flex items-center gap-2 hover:border-purple-500/30 transition-colors">
            <Star className="h-3.5 w-3.5 text-purple-400" />
            <div>
              <div className="text-[9px] font-mono text-[#71717A]">XP</div>
              <div className="font-semibold text-[#F5F5F5]">14.5k XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S AGENDA */}
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-300 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.05)] mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
              <ListTodo className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <h4 className="text-[11px] font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">Today's Agenda</h4>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 font-semibold">{agenda.filter(a => a.checked).length}/{agenda.length}</span>
        </div>

        <div className="space-y-1.5">
          {agenda.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleAgenda(item.id)}
              className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                item.checked 
                  ? "bg-[#151515]/40 border-transparent opacity-60" 
                  : "bg-[#151515] hover:bg-[#181818] border-[rgba(255,255,255,0.06)] hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <button className="text-[#71717A]">
                  {item.checked ? (
                    <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Square className="h-3.5 w-3.5 text-[#71717A]" />
                  )}
                </button>
                <div className={`text-[11px] truncate ${item.checked ? "line-through text-[#71717A]" : "text-[#F5F5F5] font-medium"}`}>
                  {item.task}
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#71717A] bg-[#0E0E0E] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.06)] shrink-0">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WEEKLY PROGRESS */}
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-300 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.05)] mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <h4 className="text-[11px] font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">Weekly Progress</h4>
          </div>
          <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">This Week</span>
        </div>

        <div className="relative h-18 w-full bg-[#151515] rounded-lg border border-[rgba(255,255,255,0.06)] p-2 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 250 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path 
              d={`M 15,90 L ${chartPoints} L 243,90 Z`} 
              fill="url(#emeraldArea)"
            />
            <polyline 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="2.5" 
              points={chartPoints} 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {sparklineData.map((val, idx) => (
              <circle 
                key={idx} 
                cx={idx * 38 + 15} 
                cy={90 - val} 
                r="3" 
                className="fill-[#151515] stroke-emerald-400" 
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>

        <div className="flex justify-between px-1 mt-2.5 text-[9px] font-mono text-[#71717A]">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, dIdx) => (
            <span key={dIdx} className={dIdx === 6 ? "text-emerald-400 font-bold" : ""}>{day}</span>
          ))}
        </div>
      </div>

      {/* 4. BOOKMARKS IF ANY */}
      {bookmarkedMessages.length > 0 && (
        <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgba(255,255,255,0.05)]">
            <Bookmark className="h-3.5 w-3.5 text-amber-400" />
            <h4 className="text-[11px] font-mono font-medium text-[#71717A] uppercase tracking-wider">Saved Items</h4>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {bookmarkedMessages.map(bm => (
              <div key={bm.id} className="p-2 bg-[#151515] border border-[rgba(255,255,255,0.04)] rounded-lg flex justify-between items-start gap-2">
                <p className="text-[10px] text-[#A1A1AA] line-clamp-2">{bm.text}</p>
                <button onClick={() => onRemoveBookmark(bm.id)} className="text-[#71717A] hover:text-rose-400 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

