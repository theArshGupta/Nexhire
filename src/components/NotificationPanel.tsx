import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bell, Briefcase, Award, Sparkles, Check, CheckCircle2, ShieldAlert } from "lucide-react";

interface Notification {
  id: string;
  category: "hiring" | "suggestion" | "achievement" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPanelProps) {
  const getIcon = (category: Notification["category"]) => {
    switch (category) {
      case "hiring":
        return <Briefcase className="h-4 w-4 text-emerald-400" />;
      case "suggestion":
        return <Sparkles className="h-4 w-4 text-indigo-400" />;
      case "achievement":
        return <Award className="h-4 w-4 text-amber-400" />;
      case "system":
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
    }
  };

  const getBg = (category: Notification["category"]) => {
    switch (category) {
      case "hiring":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "suggestion":
        return "bg-indigo-500/10 border-indigo-500/20";
      case "achievement":
        return "bg-amber-500/10 border-amber-500/20";
      case "system":
        return "bg-rose-500/10 border-rose-500/20";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm"
          />

          {/* Slider Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-[#101014] border-l border-zinc-800/80 shadow-[0_24px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between bg-[#141419]/40">
                <div className="flex items-center gap-2.5">
                  <Bell className="h-5 w-5 text-indigo-400" />
                  <div>
                    <h2 className="text-sm font-bold text-white">Notifications</h2>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {unreadCount} unread alert{unreadCount !== 1 && "s"} received
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="text-[10px] font-mono font-semibold text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/20 bg-indigo-500/5 px-2 py-1 rounded-lg cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && onMarkAsRead(n.id)}
                      className={`relative group border rounded-xl p-4 transition-all duration-200 ${
                        n.read
                          ? "bg-[#141418]/40 border-zinc-900/60 opacity-60"
                          : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 cursor-pointer"
                      }`}
                    >
                      {/* Unread Indicator dot */}
                      {!n.read && (
                        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      )}

                      <div className="flex gap-3.5">
                        <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${getBg(n.category)}`}>
                          {getIcon(n.category)}
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className={`text-xs font-semibold leading-relaxed ${n.read ? "text-zinc-300" : "text-white"}`}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-normal font-light">
                            {n.description}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="font-mono text-[9px] text-zinc-600 font-bold uppercase">{n.category}</span>
                            <span className="text-zinc-800 font-mono text-[9px]">•</span>
                            <span className="font-mono text-[9px] text-zinc-600">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-24 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="max-w-xs mx-auto space-y-1">
                      <h4 className="text-xs font-bold text-zinc-400">All cleared up!</h4>
                      <p className="text-[11px] text-zinc-600 font-light leading-relaxed">
                        No pending notifications. Check back later for recruiter matches or profile audits.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-900 bg-[#141419]/20 text-center text-[10px] font-mono text-zinc-600">
                SECURE END-TO-END GATEWAY ALERTS
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
