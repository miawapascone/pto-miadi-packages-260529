/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ContextLog, UniverseType, ThemeStyles } from "@packages/shared";
import { Terminal, Send, Github, Settings, Feather, Compass, RefreshCw } from "lucide-react";

interface ContextStreamProps {
  logs: ContextLog[];
  activeUniverse: UniverseType;
  theme: ThemeStyles;
  onSendReflection: (text: string) => Promise<void>;
}

export default function ContextStream({
  logs,
  activeUniverse,
  theme,
  onSendReflection,
}: ContextStreamProps) {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new logs stream in
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSendReflection(inputText.trim());
      setInputText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSourceDetails = (source: ContextLog["source"]) => {
    switch (source) {
      case "GITHUB":
        return {
          icon: <Github size={12} />,
          badgeClass: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
          itemClass: "border-l-2 border-cyan-500 bg-cyan-950/5",
        };
      case "LANGFUSE":
        return {
          icon: <Settings size={12} />,
          badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          itemClass: "border-l-2 border-amber-500 bg-amber-950/5",
        };
      case "REFLECTION":
        return {
          icon: <Feather size={12} />,
          badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          itemClass: "border-l-2 border-emerald-500 bg-emerald-950/5",
        };
      case "SYSTEM":
      default:
        return {
          icon: <Compass size={12} />,
          badgeClass: "bg-violet-500/10 text-violet-300 border-violet-500/30",
          itemClass: "border-l-2 border-slate-500 bg-slate-900/40",
        };
    }
  };

  return (
    <div 
      id="context-stream-panel"
      className="flex flex-col h-[calc(100vh-140px)] bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800/60">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-300">
          <Terminal size={14} className={theme.iconColor} />
          <span>Context Stream Ingestion</span>
        </div>
        <div className="flex items-baseline gap-1.5 font-mono text-[9px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 uppercase">Live Pipeline</span>
        </div>
      </div>

      {/* Message Ingestion feed */}
      <div 
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-[11px] scroll-smooth min-h-[300px]"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => {
            const { icon, badgeClass, itemClass } = getSourceDetails(log.source);
            return (
              <motion.div
                key={log.id}
                id={`log-item-${log.id}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-lg border border-slate-800/50 flex flex-col gap-2 ${itemClass}`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded border flex items-center gap-1 text-[9px] font-bold ${badgeClass}`}>
                      {icon}
                      {log.source}
                    </span>
                    <span className="text-slate-500 text-[9px]">
                      {log.activeUniverse === "ENGINEER" ? "🧠" : log.activeUniverse === "CEREMONY" ? "💕" : "🌸"}
                    </span>
                  </div>
                  <span className="text-slate-600 text-[9px]">{log.timestamp}</span>
                </div>
                <div className="text-slate-200 select-all leading-normal whitespace-pre-wrap">{log.content}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Mini status helper */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/40 text-[10px] text-slate-500 font-mono flex items-center gap-2">
        <RefreshCw size={10} className="animate-spin text-slate-600" />
        <span>Watching simulated SpecLang events queue...</span>
      </div>

      {/* Direct reflection insertion form */}
      <form 
        onSubmit={handleSubmit}
        className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2"
        id="reflection-form"
      >
        <input
          id="reflection-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Embed a walking reflection thought..."
          className="flex-1 px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
          disabled={isSubmitting}
        />
        <button
          id="submit-reflection-btn"
          type="submit"
          className={`p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors ${
            !inputText.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!inputText.trim() || isSubmitting}
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
