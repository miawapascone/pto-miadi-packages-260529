/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { X, Layers, Terminal, Compass, Zap, ShieldAlert, Cpu } from "lucide-react";

interface SystemSpecsProps {
  onClose: () => void;
}

export default function SystemSpecs({ onClose }: SystemSpecsProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        id="specs-modal-container"
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Layers size={18} className="text-cyan-400" />
            <div className="font-mono text-left">
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">System Archeology Spec</h2>
              <p className="text-[10px] text-slate-500">Document ID: live-story-monitor-master-spec-v1.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
          
          {/* Wave Overview / Context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800/40 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-400">
                <Compass size={14} />
                <span>Wave 1 Scaffold</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Laying the groundwork at the application level to model multi-universe narratives, easily decompilable into standard modules.
              </p>
            </div>
            <div className="p-4 bg-slate-950/60 border border-slate-800/40 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-400 font-mono">
                <Cpu size={14} />
                <span>Workspaces Support</span>
              </div>
              <p className="text-[11px] text-slate-400">
                NPM workspaces are enabled via the packages directories (`packages/*`). Shares definitions seamlessly via tsconfig pathways.
              </p>
            </div>
            <div className="p-4 bg-slate-950/60 border border-slate-800/40 rounded-lg space-y-2">
              <div className="flex items-center gap-2 font-bold text-pink-400">
                <Zap size={14} />
                <span>Turborepo Ready</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Structure is fully primed to accept Turborepo bindings for smart build caches, linking parallel tasks seamlessly.
              </p>
            </div>
          </div>

          {/* Directory Hierarchy Tree */}
          <div className="space-y-3">
            <h3 className="text-slate-100 font-bold uppercase tracking-wider border-b border-slate-800/60 pb-1.5">Monorepo Layout Path-Map</h3>
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-cyan-500/80 select-all font-mono">
{`live-story-monitor (Workspace Root)
├── package.json                         # Declares npm "workspaces": ["packages/*"]
├── tsconfig.json                         # Defines "@packages/shared" path aliases
├── vite.config.ts                       # Dual-resolve mappings for Vite client routes
├── server.ts                             # Custom Express server running SSE log ingest & Gemini proxies
├── packages/
│   └── shared/                           # CORE REUSABLE MULTI-PACKAGE
│       ├── package.json                  # Workspace exports configuration
│       ├── types.ts                      # Common standard interfaces (StoryScene, ContextLog)
│       ├── templates.ts                  # SpecLang development context logs and stories
│       └── index.ts                      # Common export gateway
└── src/
    ├── App.tsx                           # Master orchestrator layout
    ├── components/
    │   ├── BootSequence.tsx              # Ceremonial transition sequences
    │   ├── ContextStream.tsx             # Scrolling live logs and reflection input
    │   └── NarrativeMirror.tsx           # Immersive prose, tension gauge, actions`}
            </div>
          </div>

          {/* RISE Methodology explanation */}
          <div className="space-y-3">
            <h3 className="text-slate-100 font-bold uppercase tracking-wider border-b border-slate-800/60 pb-1.5">The RISE Framework</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px]">
              <div className="p-3 border border-slate-800/60 bg-slate-900/40 rounded-lg space-y-1">
                <span className="font-bold text-cyan-400">R — Reverse-Engineer</span>
                <p className="text-slate-500">Trace and identify beloved user-facing structures from existing solutions.</p>
              </div>
              <div className="p-3 border border-slate-800/60 bg-slate-900/40 rounded-lg space-y-1">
                <span className="font-bold text-purple-400">I — Intent Extraction</span>
                <p className="text-slate-500">Isolate creative intentions from physical layout constraints.</p>
              </div>
              <div className="p-3 border border-slate-800/60 bg-slate-900/40 rounded-lg space-y-1">
                <span className="font-bold text-pink-400">S — Specify Precisely</span>
                <p className="text-slate-500">Draft meticulous specifications capturing behaviors and schemas prior to build.</p>
              </div>
              <div className="p-3 border border-slate-800/60 bg-slate-900/40 rounded-lg space-y-1">
                <span className="font-bold text-emerald-400">E — Export / Recreate</span>
                <p className="text-slate-500">Compile and ship robust modules capable of rebuilds in other runtimes.</p>
              </div>
            </div>
          </div>

          {/* NCP Alignment */}
          <div className="space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-200">
              <ShieldAlert size={14} className="text-amber-500" />
              <span className="font-bold">Narrative Context Protocol (NCP) Conformity</span>
            </div>
            <p>
              The system models events as <strong>Storybeats</strong>, grouping sequential actions into <strong>Moments</strong>, shifting view perspectives (Engineer, Ceremony, and Story Engine) across distinct <strong>Archetypes</strong> to maintain creative rhythm and avoid mechanical developer friction.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
          Building Wave 1 of many. Monorepo components fully loaded.
        </div>
      </motion.div>
    </div>
  );
}
