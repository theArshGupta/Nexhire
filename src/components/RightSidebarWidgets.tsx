import React from "react";
import { 
  BookOpen, Lightbulb, Award, Code2, Activity, Calendar,
  ChevronRight, Zap, ArrowUpRight, Target
} from "lucide-react";

interface RightSidebarProps {
  workspaceContext: {
    topic: string;
    targetCompany: string;
    todayLearning: string;
    interviewTip: string;
    resumeTip: string;
    challengeTitle: string;
    challengeDesc: string;
    recentActivity: string;
    upcomingInterviews: { company: string; role: string; date: string }[];
    techStack: string[];
  };
  triggerMentorResponse: (topic: string) => void;
  setInputText: (text: string) => void;
  atsScore: number;
  onQuickFixResume: () => void;
}

export default function RightSidebarWidgets({
  workspaceContext,
  triggerMentorResponse,
  setInputText,
  atsScore,
  onQuickFixResume
}: RightSidebarProps) {
  // Learning Goals Progress
  const learningGoals = [
    { name: "Frontend Architecture", progress: 78 },
    { name: "Distributed Systems", progress: 45 },
    { name: "System Design Patterns", progress: 60 }
  ];

  const handleChallengeTrigger = () => {
    setInputText(`Let me solve the coding challenge: "${workspaceContext.challengeTitle}". Walk me through the optimal approach step by step.`);
    triggerMentorResponse(`Coding Challenge: ${workspaceContext.challengeTitle}`);
  };

  return (
    <div className="space-y-3 w-full text-left font-sans">
      
      {/* 1. TODAY'S FOCUS */}
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-blue-500/30 rounded-xl p-4 transition-all duration-300 shadow-md">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[rgba(255,255,255,0.05)] mb-3">
          <div className="p-1 rounded-md bg-blue-500/10 border border-blue-500/20">
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <h4 className="text-[11px] font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">Today's Focus</h4>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wide font-semibold">Active Topic</div>
          <div className="text-xs font-semibold text-[#F5F5F5]">{workspaceContext.topic}</div>
          <p className="text-[11px] text-[#A1A1AA] leading-relaxed font-normal">{workspaceContext.todayLearning}</p>
        </div>

        <div className="mt-3.5 space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-[#71717A]">
            <span>MODULE PROGRESS</span>
            <span className="text-blue-400 font-semibold">63%</span>
          </div>
          <div className="w-full bg-[#161616] rounded-full h-1.5 overflow-hidden border border-[rgba(255,255,255,0.04)]">
            <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 h-full rounded-full w-[63%]" />
          </div>
        </div>
      </div>

      {/* 2. RESUME SCORE */}
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-purple-500/30 rounded-xl p-4 transition-all duration-300 shadow-md">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[rgba(255,255,255,0.05)] mb-3">
          <div className="p-1 rounded-md bg-purple-500/10 border border-purple-500/20">
            <Award className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <h4 className="text-[11px] font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">Resume Score</h4>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="text-xl font-bold text-[#F5F5F5] flex items-baseline gap-1.5">
              <span>{atsScore}/100</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm">
                {atsScore >= 90 ? "Optimal" : "Needs Review"}
              </span>
            </div>
            <div className="text-[10px] text-[#A1A1AA]">
              ATS Match Grade: <span className="text-emerald-400 font-medium">+12% this week</span>
            </div>
          </div>

          <div className="h-11 w-11 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-xs text-purple-300 shadow-sm">
            {atsScore}%
          </div>
        </div>

        <button 
          onClick={onQuickFixResume}
          className="w-full mt-3 py-2 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 hover:from-purple-900/50 hover:to-purple-900/50 border border-purple-500/30 text-[#F5F5F5] font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span>Apply ATS Fixes (+6%)</span>
        </button>
      </div>

      {/* 3. INTERVIEW PROGRESS */}
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-amber-500/30 rounded-xl p-4 transition-all duration-300 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/20">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <h4 className="text-[11px] font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">Interview Tip</h4>
        </div>
        <p className="text-[11px] text-[#A1A1AA] leading-relaxed font-normal italic">
          "{workspaceContext.interviewTip}"
        </p>
        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.05)] text-[10px] text-[#71717A]">
          <span className="font-mono uppercase text-[#A1A1AA]">MOCK PRACTICE</span>
          <button 
            onClick={() => triggerMentorResponse("Mock behavioral review")}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors font-semibold"
          >
            <span>Practice Now</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 4. LEARNING GOALS */}
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-300 shadow-md">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[rgba(255,255,255,0.05)] mb-3">
          <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <Target className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <h4 className="text-[11px] font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">Learning Goals</h4>
        </div>

        <div className="space-y-3">
          {learningGoals.map((goal, idx) => {
            const colors = [
              "bg-gradient-to-r from-indigo-500 to-purple-500", 
              "bg-gradient-to-r from-blue-500 to-cyan-400", 
              "bg-gradient-to-r from-emerald-500 to-teal-400"
            ];
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#F5F5F5] font-medium">{goal.name}</span>
                  <span className="text-indigo-400 font-mono text-[10px] font-semibold">{goal.progress}%</span>
                </div>
                <div className="w-full bg-[#161616] rounded-full h-1.5 overflow-hidden border border-[rgba(255,255,255,0.04)]">
                  <div className={`${colors[idx % colors.length]} h-full rounded-full`} style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. RECENT ACTIVITY */}
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-300 shadow-md">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[rgba(255,255,255,0.05)] mb-3">
          <div className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <h4 className="text-[11px] font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">Recent Activity</h4>
        </div>

        <div className="space-y-2">
          {[
            { label: "Resume Bullet Audit", val: "Approved score 94", date: "10:30 AM", dot: "bg-emerald-400" },
            { label: "Vercel Mock Session", val: "STAR scenario review", date: "Yesterday", dot: "bg-blue-400" },
            { label: "CDN Architecture", val: "Token bucket design", date: "Jul 20", dot: "bg-purple-400" }
          ].map((act, actIdx) => (
            <div key={actIdx} className="p-2.5 bg-[#151515] border border-[rgba(255,255,255,0.06)] rounded-lg flex justify-between items-center gap-2 hover:border-[rgba(255,255,255,0.12)] transition-colors">
              <div className="min-w-0 flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${act.dot}`} />
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-[#F5F5F5] truncate">{act.label}</div>
                  <div className="text-[10px] text-[#71717A] truncate">{act.val}</div>
                </div>
              </div>
              <span className="text-[9px] font-mono text-[#71717A] shrink-0 uppercase">{act.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. UPCOMING INTERVIEWS */}
      <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-rose-500/30 rounded-xl p-4 transition-all duration-300 shadow-md">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[rgba(255,255,255,0.05)] mb-3">
          <div className="p-1 rounded-md bg-rose-500/10 border border-rose-500/20">
            <Calendar className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <h4 className="text-[11px] font-mono font-medium text-[#A1A1AA] uppercase tracking-wider">Upcoming Schedule</h4>
        </div>

        <div className="space-y-2">
          {workspaceContext.upcomingInterviews.map((item, idx) => (
            <div key={idx} className="p-2.5 bg-[#151515] border border-[rgba(255,255,255,0.06)] rounded-lg flex justify-between items-center gap-2 hover:border-rose-500/30 transition-colors">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-[#F5F5F5] truncate">{item.company}</div>
                <div className="text-[10px] text-[#71717A] truncate">{item.role}</div>
              </div>
              <span className="text-[9px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30 shrink-0 font-semibold">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

