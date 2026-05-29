/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StoryScene, ThemeStyles } from "./types.js";
import { 
  Sparkles, RefreshCw, Archive, Download, Compass, 
  HelpCircle, BookOpen, AlertCircle, Quote 
} from "lucide-react";

interface NarrativeMirrorProps {
  scene: StoryScene | null;
  isGenerating: boolean;
  theme: ThemeStyles;
  onRefresh: () => Promise<void>;
  onArchive: (reflection: string) => Promise<void>;
}

export default function NarrativeMirror({
  scene,
  isGenerating,
  theme,
  onRefresh,
  onArchive,
}: NarrativeMirrorProps) {
  const [archiveReflection, setArchiveReflection] = useState("");
  const [showArchiveForm, setShowArchiveForm] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchiveSubmit = async () => {
    if (isArchiving) return;
    setIsArchiving(true);
    try {
      await onArchive(archiveReflection.trim());
      setArchiveReflection("");
      setShowArchiveForm(false);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleExportJson = () => {
    if (!scene) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scene, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `story_scene_${scene.universe.toLowerCase()}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const borderGlow = {
    cyan: "shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)] border-cyan-500/30",
    purple: "shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)] border-purple-500/30",
    pink: "shadow-[0_0_15px_-3px_rgba(236,72,153,0.3)] border-pink-500/30",
  }[theme.baseColor];

  const accentColorClass = {
    cyan: "text-cyan-400",
    purple: "text-purple-400",
    pink: "text-pink-400",
  }[theme.baseColor];

  return (
    <div 
      id="narrative-mirror-panel"
      className={`relative min-h-[500px] bg-slate-900/40 backdrop-blur-md rounded-xl border p-6 flex flex-col justify-between transition-all duration-500 ${borderGlow}`}
    >
      {/* Sparkled loading screen overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            id="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 rounded-xl flex flex-col items-center justify-center gap-4 border border-slate-800"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className={`p-3 rounded-full bg-slate-900 border border-slate-800 ${accentColorClass}`}
            >
              <Sparkles className="h-6 w-6 animate-pulse" />
            </motion.div>
            <div className="text-center font-mono space-y-1">
              <p className="text-xs text-slate-300 font-bold tracking-wide uppercase">Remixing Narrative Lattice...</p>
              <p className="text-[10px] text-slate-500">Decomposing telemetry logs and mapping archetypal points</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {scene ? (
        <div className="space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/60 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase font-mono border ${theme.accentBg} ${theme.accentText} ${theme.accentBorder}`}>
                  {scene.universe} WORLD
                </span>
                <span className="text-slate-500 text-xs font-mono">•</span>
                <span className="text-slate-400 font-mono text-xs flex items-center gap-1.5">
                  <Compass size={12} className={theme.iconColor} />
                  {scene.archetype}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">{scene.title}</h1>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                id="refresh-scene-btn"
                onClick={onRefresh}
                title="Generates a new, context-aware variant using Gemini"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border bg-slate-900/60 transition-all ${theme.accentBorder} ${theme.accentText} ${theme.buttonHover}`}
              >
                <RefreshCw size={12} className="animate-pulse" />
                <span>Remix</span>
              </button>
              <button
                id="toggle-archive-btn"
                onClick={() => setShowArchiveForm(!showArchiveForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900 border border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white transition-all"
              >
                <Archive size={12} />
                <span>Archive</span>
              </button>
              <button
                id="export-scene-btn"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900 border border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white transition-all"
              >
                <Download size={12} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Archiving Form drawer */}
          <AnimatePresence>
            {showArchiveForm && (
              <motion.div
                id="archive-form-drawer"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-slate-950/60 border border-slate-800/60 rounded-lg space-y-3 overflow-hidden"
              >
                <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <BookOpen size={12} className={theme.iconColor} />
                  <span>Before sending into the Memory Spiral, record your Walkmemory thoughts (optional):</span>
                </p>
                <div className="flex gap-2">
                  <input
                    id="archive-reflection-input"
                    type="text"
                    value={archiveReflection}
                    onChange={(e) => setArchiveReflection(e.target.value)}
                    placeholder="Enter a takeaway, feeling, or commitment..."
                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                  <button
                    id="confirm-archive-btn"
                    onClick={handleArchiveSubmit}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-white ${theme.barColor} hover:brightness-110 transition-all`}
                  >
                    Commit to Spiral
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Narrative Text Block */}
          <div className="relative border-l border-slate-800 pl-4 py-1 space-y-4 font-mono leading-relaxed text-sm text-slate-300 select-all">
            <Quote className="absolute right-0 top-0 h-16 w-16 text-slate-800/20 select-none pointer-events-none" />
            
            {scene.narrativeText.split("\n\n").map((para, i) => (
              <p key={i} className="first-letter:text-lg first-letter:font-bold first-letter:text-slate-100">
                {para}
              </p>
            ))}
          </div>

          {/* Dynamic Tension Meter */}
          <div className="space-y-2 border-t border-slate-800/40 pt-4">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <AlertCircle size={12} className={theme.iconColor} />
                <span>Structural Tension Level</span>
              </span>
              <span className={`font-bold ${theme.accentText}`}>{scene.tensionLevel}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full p-[1.5px] border border-slate-800">
              <motion.div
                id="tension-bar-gauge"
                initial={{ width: 0 }}
                animate={{ width: `${scene.tensionLevel}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${theme.barColor} shadow-inner cursor-pointer`}
                title={`Selected universe tension at ${scene.tensionLevel}%`}
              />
            </div>
            <p className="text-[10px] font-mono text-slate-500 italic pl-1">
              *Tension rises with workflow event complexity and settles through reflection closures.
            </p>
          </div>

          {/* Reflection Seeds & Story Development Props */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/40 pt-5">
            {/* Guided Questions */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle size={13} className={theme.iconColor} />
                Reflection Seeds
              </h3>
              <ul className="space-y-1.5">
                {scene.reflections.map((ref, idx) => (
                  <li key={idx} className="text-xs font-mono text-slate-400 pl-3 border-l border-slate-800 leading-relaxed">
                    "{ref}"
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Seeds */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className={theme.iconColor} />
                Potential Plot Developments
              </h3>
              <ul className="space-y-1.5">
                {scene.nextSeeds.map((seed, idx) => (
                  <li key={idx} className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span>{seed}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3 py-12 select-none">
          <BookOpen className="h-12 w-12 text-slate-700 animate-pulse" />
          <p className="font-mono text-xs">No narrative scene is active. Remix to generate one from telemetry context.</p>
        </div>
      )}
    </div>
  );
}
