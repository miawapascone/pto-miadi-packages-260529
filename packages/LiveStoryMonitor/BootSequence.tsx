/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Shield, Wifi, Layers } from "lucide-react";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING NARRATIVE LATTICE...",
  ]);

  const steps = [
    { threshold: 15, log: "Connecting to workspace redis stream... [OK]" },
    { threshold: 35, log: "Mapping package workspaces (@packages/live-story-monitor)... [OK]" },
    { threshold: 55, log: "Calibrating structural tension diagnostics... [OK]" },
    { threshold: 75, log: "Loading SpecLang narrative templates... [OK]" },
    { threshold: 90, log: "Initializing multi-universe portals... [OK]" },
    { threshold: 100, log: "System Ready. Opening ceremonial container..." },
  ];

  useEffect(() => {
    // 2500ms total progress ticks
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    steps.forEach((step) => {
      if (progress >= step.threshold) {
        setLogs((prev) => {
          if (!prev.includes(step.log)) {
            return [...prev, step.log];
          }
          return prev;
        });
      }
    });
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-slate-950 font-mono flex items-center justify-center z-50 p-4">
      <motion.div 
        id="boot-container"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -inset-10 bg-radial from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 text-slate-400">
          <div className="flex items-center gap-2 text-xs">
            <Terminal size={14} className="text-cyan-400 animate-pulse" />
            <span>NCP_BOOT_ROUTINE // v1.2</span>
          </div>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-800" />
            <span className="w-2 h-2 rounded-full bg-slate-800" />
            <span className="w-2 h-2 rounded-full bg-cyan-500/50" />
          </div>
        </div>

        {/* Console output display */}
        <div className="min-h-[160px] text-xs space-y-2 mb-6 select-none leading-relaxed">
          <AnimatePresence>
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`${
                  idx === logs.length - 1 ? "text-cyan-300" : "text-slate-400"
                } flex items-start gap-2`}
              >
                <span className="text-cyan-500/50">❯</span>
                <span>{log}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress Bar Gauge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wilder">
            <span>Synchronizing Lattice</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[1px]">
            <motion.div
              id="boot-progress-bar"
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500"
              style={{ width: `${progress}%` }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
          </div>
        </div>

        {/* Footers */}
        <div className="mt-6 flex justify-between border-t border-slate-800/60 pt-4 text-[9px] text-slate-600">
          <div className="flex gap-3">
            <span className="flex items-center gap-1"><Layers size={10} /> WSL_MONO_OK</span>
            <span className="flex items-center gap-1"><Shield size={10} /> AES_256</span>
          </div>
          <span className="animate-pulse flex items-center gap-1">
            <Wifi size={10} className="text-emerald-500" /> ONLINE_SANDBOX
          </span>
        </div>
      </motion.div>
    </div>
  );
}
