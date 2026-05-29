/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StoryScene, ContextLog, ToastMessage, UniverseType, ThemeStyles } from "@packages/shared";

// Sub components from workspace library
import { BootSequence, ContextStream, NarrativeMirror, SystemSpecs } from "@packages/components";

// Lucide icons
import { 
  Code2, Feather, Sparkles, Layers, CheckCircle2, 
  Info, AlertTriangle, X, Terminal, ArrowRight, HelpCircle 
} from "lucide-react";

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [activeUniverse, setActiveUniverse] = useState<UniverseType>("ENGINEER");
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [logs, setLogs] = useState<ContextLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simple, polished toast mechanism
  const addToast = useCallback((title: string, description: string, type: ToastMessage["type"] = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Set up active Styles configuration based on active universe
  const themes: Record<UniverseType, ThemeStyles> = {
    ENGINEER: {
      accentBg: "bg-cyan-500/10",
      accentText: "text-cyan-400",
      accentBorder: "border-cyan-500/20",
      barColor: "bg-gradient-to-r from-cyan-500 to-emerald-400",
      glowColor: "from-cyan-500/10",
      iconColor: "text-cyan-400",
      buttonHover: "hover:bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
      baseColor: "cyan"
    },
    CEREMONY: {
      accentBg: "bg-purple-500/10",
      accentText: "text-purple-400",
      accentBorder: "border-purple-500/20",
      barColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
      glowColor: "from-purple-500/10",
      iconColor: "text-purple-400",
      buttonHover: "hover:bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
      baseColor: "purple"
    },
    STORY_ENGINE: {
      accentBg: "bg-pink-500/10",
      accentText: "text-pink-400",
      accentBorder: "border-pink-500/20",
      barColor: "bg-gradient-to-r from-pink-500 to-rose-400",
      glowColor: "from-pink-500/10",
      iconColor: "text-pink-400",
      buttonHover: "hover:bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.15)]",
      baseColor: "pink"
    },
  };

  const activeTheme = themes[activeUniverse];

  // Fetch or Remix current scene
  const fetchScene = useCallback(async (universe: UniverseType, slownessMs = 800) => {
    setIsGenerating(true);
    // Mimic the aesthetic transition period specified in the specs
    await new Promise((r) => setTimeout(r, slownessMs));

    try {
      const response = await fetch("/api/live-story-monitor/scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universe, recentCount: 5 }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentScene(data.scene);
        if (data.source === "gemini") {
          addToast("Scene Remixed", `Gemini model formed a custom moment for ${universe}`, "success");
        } else {
          addToast("Templates Loaded", `Loaded high-fidelity SpecLang fallback scene for ${universe}`, "info");
        }
      }
    } catch {
      addToast("Failed to fetch scene", "Check your system server context configs.", "error");
    } finally {
      setIsGenerating(false);
    }
  }, [addToast]);

  // Connect Server-Sent Events (SSE) Stream to ingest logs in real time
  useEffect(() => {
    if (isBooting) return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const setupSSE = () => {
      eventSource = new EventSource("/api/live-story-monitor/stream");

      eventSource.onmessage = (event) => {
        try {
          const logData = JSON.parse(event.data) as ContextLog;
          setLogs((prev) => {
            // Uniquely insert log so index duplicates are rejected
            if (prev.some((x) => x.id === logData.id)) return prev;
            const updated = [...prev, logData];
            if (updated.length > 50) updated.shift();
            return updated;
          });
        } catch {
          // Silent JSON parsing fallbacks
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
        }
        // Attempt silent reconnection in 5s if restarted
        reconnectTimeout = setTimeout(setupSSE, 5000);
      };
    };

    setupSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [isBooting]);

  // Trigger initial scene load once booting finishes
  useEffect(() => {
    if (!isBooting) {
      fetchScene("ENGINEER", 0);
    }
  }, [isBooting, fetchScene]);

  // Handle Universe Switching
  const handleUniverseSwitch = async (universe: UniverseType) => {
    if (universe === activeUniverse || isGenerating) return;
    setActiveUniverse(universe);
    await fetchScene(universe, 700);
  };

  // Submit manual walks reflections
  const handleSendReflection = async (text: string) => {
    try {
      const response = await fetch("/api/live-story-monitor/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, universe: activeUniverse }),
      });
      const data = await response.json();
      if (data.success) {
        addToast("Context Ingested", "Your walking reflection has been broadcast to the timeline.", "success");
      }
    } catch {
      addToast("Submission failed", "Could not send reflection to the pipeline.", "error");
    }
  };

  // Archive Scene
  const handleArchiveScene = async (reflectionText: string) => {
    if (!currentScene) return;
    try {
      const response = await fetch("/api/live-story-monitor/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: currentScene, reflection: reflectionText }),
      });
      const data = await response.json();
      if (data.success) {
        addToast("Scene Archived", "Archived to Walkmemory and stored in the spiral index.", "success");
      }
    } catch {
      addToast("Failed to archive", "Server memory storage index returned an error.", "error");
    }
  };

  if (isBooting) {
    return (
      <BootSequence 
        onComplete={() => {
          setIsBooting(false);
          addToast("Lattice Synchronized", "Ceremonial space successfully configured & parsed.", "success");
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Dynamic Background Glow representing active universe */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className={`absolute -top-40 left-1/4 w-[600px] h-[600px] bg-gradient-to-b ${activeTheme.glowColor} to-transparent rounded-full filter blur-[120px] opacity-60 transition-all duration-1000`} />
        <div className={`absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-t ${activeTheme.glowColor} to-transparent rounded-full filter blur-[100px] opacity-40 transition-all duration-1000`} />
      </div>

      {/* Main Core Layout Navigation Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${activeTheme.iconColor} transition-colors duration-500`}>
              <Layers size={18} className="animate-pulse" />
            </div>
            <div className="text-left font-mono">
              <h1 className="text-sm font-bold tracking-wider uppercase text-white font-sans flex items-center gap-1.5">
                Live Story Monitor
                <span className="text-[9px] px-1 bg-slate-850 rounded text-slate-500 font-mono">v1.0</span>
              </h1>
              <p className="text-[10px] text-slate-500 tracking-tight">Active Prototyping Module Grid</p>
            </div>
          </div>

          {/* Universe Swifter Navigation Tab-Bar */}
          <nav className="flex bg-slate-900 rounded-xl p-1 border border-slate-800/80 gap-1 font-mono text-xs select-none shadow-inner" id="universe-nav">
            <button
              id="nav-engineer"
              onClick={() => handleUniverseSwitch("ENGINEER")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                activeUniverse === "ENGINEER"
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 size={13} />
              <span>Engineer</span>
            </button>
            <button
              id="nav-ceremony"
              onClick={() => handleUniverseSwitch("CEREMONY")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                activeUniverse === "CEREMONY"
                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Feather size={13} />
              <span>Ceremony</span>
            </button>
            <button
              id="nav-story"
              onClick={() => handleUniverseSwitch("STORY_ENGINE")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                activeUniverse === "STORY_ENGINE"
                  ? "bg-pink-500/10 border border-pink-500/20 text-pink-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles size={13} />
              <span>Weaver</span>
            </button>
          </nav>

          {/* Configuration panel and System spec switches */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400 tracking-wide uppercase text-[10px]">● System Online</span>
            </div>
            <button
              id="toggle-specs-btn"
              onClick={() => setShowSpecs(true)}
              className="px-3 py-1.5 border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
            >
              Specs
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Work-Dashboard Frame */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left aggregation context column (3/12 width) */}
        <div className="lg:col-span-3 h-full">
          <ContextStream
            logs={logs}
            activeUniverse={activeUniverse}
            theme={activeTheme}
            onSendReflection={handleSendReflection}
          />
        </div>

        {/* Narrative Mirror Display (9/12 width) */}
        <div className="lg:col-span-9 h-full flex flex-col justify-start">
          <NarrativeMirror
            scene={currentScene}
            isGenerating={isGenerating}
            theme={activeTheme}
            onRefresh={() => fetchScene(activeUniverse, 900)}
            onArchive={handleArchiveScene}
          />
        </div>
      </main>

      {/* Slide-over Detail Specs Modal */}
      <AnimatePresence>
        {showSpecs && <SystemSpecs onClose={() => setShowSpecs(false)} />}
      </AnimatePresence>

      {/* Custom Toast Message alert container */}
      <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => {
            const icon = {
              success: <CheckCircle2 size={16} className="text-emerald-400" />,
              info: <Info size={16} className="text-cyan-400" />,
              warning: <AlertTriangle size={16} className="text-amber-400" />,
              error: <AlertTriangle size={16} className="text-rose-400" />,
            }[toast.type];

            return (
              <motion.div
                key={toast.id}
                id={`toast-${toast.id}`}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-2xl flex items-start gap-3 relative overflow-hidden"
              >
                {/* Visual Accent bar depending on Toast status */}
                <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                  toast.type === "success" ? "bg-emerald-500" :
                  toast.type === "info" ? "bg-cyan-500" :
                  toast.type === "warning" ? "bg-amber-500" : "bg-rose-500"
                }`} />

                <div className="pt-0.5">{icon}</div>
                <div className="flex-1 text-left">
                  <h4 className="text-xs font-bold text-slate-100 font-mono">{toast.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{toast.description}</p>
                </div>
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-850"
                >
                  <X size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
