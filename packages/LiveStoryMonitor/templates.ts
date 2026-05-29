/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoryScene, ContextLog, UniverseType } from "./types.js";

/**
 * SpecLang Portal events representing real milestone commits and actions
 * that occurred during the creation of SpecLang.
 */
export const SPECLANG_PORTAL_EVENTS: Array<{
  source: "GITHUB" | "LANGFUSE" | "REFLECTION" | "SYSTEM";
  content: string;
  universe: UniverseType;
}> = [
  {
    source: "GITHUB",
    content: "Created rispecs/speclang-portal/ directory - RISE specifications initialized",
    universe: "ENGINEER",
  },
  {
    source: "LANGFUSE",
    content: "Trace: RISE Phase 1 (Reverse-Engineering) complete. 7 source pages analyzed.",
    universe: "STORY_ENGINE",
  },
  {
    source: "REFLECTION",
    content: "The specifications capture intent, not implementation. This feels like the right abstraction level.",
    universe: "CEREMONY",
  },
  {
    source: "SYSTEM",
    content: "SpecLang Portal rispecs: 6 specification files generated successfully.",
    universe: "STORY_ENGINE",
  },
  {
    source: "GITHUB",
    content: "Committed 01-types.spec.md - Documented Narrative Context Protocol interfaces.",
    universe: "ENGINEER",
  },
  {
    source: "REFLECTION",
    content: "By standardizing on types first, we bind the three worlds into a shared semantic space.",
    universe: "CEREMONY",
  },
  {
    source: "LANGFUSE",
    content: "Trace: Ingesting webhook models. Calculated narrative tension matches 45%.",
    universe: "STORY_ENGINE",
  },
  {
    source: "GITHUB",
    content: "Added 03-context-stream.spec.md describing real-time event aggregation.",
    universe: "ENGINEER",
  },
  {
    source: "REFLECTION",
    content: "The terminal feed acts as the pulse of the workspace. Every commit is a breath.",
    universe: "CEREMONY",
  },
  {
    source: "SYSTEM",
    content: "Validation: Type signatures in shared schemas are fully synchronized.",
    universe: "ENGINEER", // System logs are routed to the structural tracking perspective
  },
  {
    source: "GITHUB",
    content: "Created 04-narrative-mirror.spec.md - Configured tension meters and reflection seeds.",
    universe: "ENGINEER",
  },
  {
    source: "LANGFUSE",
    content: "Trace: User selected active universe 'CEREMONY'. Triggering color-shifting overlay.",
    universe: "STORY_ENGINE",
  },
  {
    source: "REFLECTION",
    content: "The tension meter visualizes the structural gap. It turns raw work into narrative stakes.",
    universe: "CEREMONY",
  },
  {
    source: "GITHUB",
    content: "Committed 05-universe-navigation.spec.md including cyan/purple/pink color tokens.",
    universe: "ENGINEER",
  },
  {
    source: "REFLECTION",
    content: "Moving between tabs must feel natural, translating the same core task across viewpoints.",
    universe: "CEREMONY",
  },
  {
    source: "LANGFUSE",
    content: "Trace: Invoked Walkmemory archival process for current scene (scene_id: 'spec-3').",
    universe: "STORY_ENGINE",
  },
  {
    source: "GITHUB",
    content: "Committed 06-integration-points.spec.md. Connected standard webhook ETL to Redis queue.",
    universe: "ENGINEER",
  },
  {
    source: "REFLECTION",
    content: "Every archived story-point is a seed buried in the memory garden. This completes the cycle.",
    universe: "CEREMONY",
  },
  {
    source: "SYSTEM",
    content: "Memory Spiral: Scene 'The Specification Forge' indexed at slot #4.",
    universe: "STORY_ENGINE",
  },
  {
    source: "GITHUB",
    content: "Refactored main App to import packages dynamically. Workspaces verified.",
    universe: "ENGINEER",
  }
];

/**
 * Pre-crafted story scenes embodying the unique narrative voice of each universe,
 * used as beautiful default scenes or high-fidelity fallbacks.
 */
export const SPECLANG_PORTAL_SCENES: Record<UniverseType, StoryScene[]> = {
  ENGINEER: [
    {
      id: "eng-spec-1",
      universe: "ENGINEER",
      title: "The Specification Forge",
      archetype: "The Builder",
      narrativeText: "You stand before the high-contrast repository, fingers poised over the keys. The SpecLang Portal's architecture unfolds inside your mind—seven panels, six principles, and countless connections. Today, you do not merely write lines of code. Today, you forge clean specifications that could recreate this entire system from pure intent. The compiler waits in silent anticipation, ready to cast your logic into crystalline structure.",
      emotionalResonance: "Methodical, Creative",
      tensionLevel: 55,
      reflections: [
        "What structural patterns make this portal valuable?",
        "How does writing high-fidelity specifications preserve your original creative intent?"
      ],
      nextSeeds: ["The types emerge", "Navigation crystallizes in space"],
      generatedAt: new Date().toISOString()
    },
    {
      id: "eng-spec-2",
      universe: "ENGINEER",
      title: "Interface Archaeology",
      archetype: "The Architect",
      narrativeText: "ContentBlock. NavItem. DemoState. Each custom interface is a fossil record of design decisions. You extract and map them carefully, preserving their structural relationships, documenting their underlying purpose. In the distance, the terminal clicks with incoming webhooks. You feel the satisfaction of finding structure inside a chaotic stream of event logs.",
      emotionalResonance: "Precise, Archaeological",
      tensionLevel: 40,
      reflections: [
        "What hidden assumptions are embedded in our core types?",
        "How do active interfaces reveal the historical evolution of the system?"
      ],
      nextSeeds: ["Components align", "Complex patterns resolve into simple primitives"]
    }
  ],
  CEREMONY: [
    {
      id: "cer-spec-1",
      universe: "CEREMONY",
      title: "The Recursive Mirror",
      archetype: "The Keeper",
      narrativeText: "You pause to honor an elegant, beautiful recursion: you are using the SpecLang methodology to create specifications for the SpecLang Portal itself. The framework that champions deliberate, intent-driven prototyping is being documented and preserved through its own principles. You look into the recursive mirror, recognizing that each of your commits is an offering of focus.",
      emotionalResonance: "Reflective, Honored",
      tensionLevel: 25,
      reflections: [
        "What does it mean for your documentation to demonstrate its own principles in real time?",
        "How does recursion reveal a deeper, self-consistent truth about your creations?"
      ],
      nextSeeds: ["The cycle of focus deepens", "Understanding blossoms in silence"]
    },
    {
      id: "cer-spec-2",
      universe: "CEREMONY",
      title: "The Seven Sacred Pages",
      archetype: "The Scribe",
      narrativeText: "Home. Philosophy. Workflow. Guidelines. Future. Demo. Resources. Seven distinct layout segments, like seven stages of creative birth. Each serves a deep, ceremonial purpose in the user's migration from confusion to comprehension. You light a quiet reflection candle in your mind, writing to welcome future developers who will stand where you are currently standing.",
      emotionalResonance: "Sacred, Purposeful",
      tensionLevel: 15,
      reflections: [
        "What custom journey does each page enable for a developer?",
        "How does sequence and structure become a ceremonial experience in your software?"
      ],
      nextSeeds: ["The demo grounds our theory", "Creative integration is solidified"]
    }
  ],
  STORY_ENGINE: [
    {
      id: "sto-spec-1",
      universe: "STORY_ENGINE",
      title: "The Meta-Narrative Loom",
      archetype: "The Weaver",
      narrativeText: "Plot threads converge around your cursor. The SpecLang Portal exists to teach the RISE framework. The RISE framework exists to generate pristine, intent-extracting specifications. And these specifications exist to regenerate the portal. You are no longer just documenting a codebase—you are weaving yourself directly into an epic loop of creation. The engine hums with your story.",
      emotionalResonance: "Epic, Expansive",
      tensionLevel: 85,
      reflections: [
        "What heroic story does your current specification tell to the world?",
        "Who will read these words centuries from now and build what you can only imagine today?"
      ],
      nextSeeds: ["The narrative climax approaches", "New side-quests spawn on the map"]
    },
    {
      id: "sto-spec-2",
      universe: "STORY_ENGINE",
      title: "The Living Seed",
      archetype: "The Voyager",
      narrativeText: "You realize these specifications are not static, dusty documents. They are living seeds. Any AI agent, given these files, could regrow this entire application from its base essence. Your beloved design qualities are preserved forever, independent of runtime changes. You feel the wind of the future in your wings as you launch the seed into the digital sky.",
      emotionalResonance: "Visionary, Generative",
      tensionLevel: 70,
      reflections: [
        "What emerges when system instructions block code generation until intent is fully extracted?",
        "How does true intent outlive its physical implementation in the sandbox?"
      ],
      nextSeeds: ["The seed lands in fertile soil", "The interface evolves into self-awareness"]
    }
  ]
};

/**
 * Log entries to bootstrap the Context Stream initially, creating a sense of history.
 */
export const SPECLANG_INITIAL_LOGS: ContextLog[] = [
  {
    id: "spec-init-1",
    timestamp: "12:14 AM",
    source: "SYSTEM",
    content: "RISE Framework session initiated for spec-story-monitor-v1.0",
    activeUniverse: "ENGINEER",
  },
  {
    id: "spec-init-2",
    timestamp: "12:15 AM",
    source: "GITHUB",
    content: "Analyzed USER_REQUEST.txt - Task: Create monorepo Live Story Monitor",
    activeUniverse: "ENGINEER",
  },
  {
    id: "spec-init-3",
    timestamp: "12:16 AM",
    source: "LANGFUSE",
    content: "Trace: Loaded specification documents dynamically into context pipeline",
    activeUniverse: "STORY_ENGINE",
  },
  {
    id: "spec-init-4",
    timestamp: "12:18 AM",
    source: "REFLECTION",
    content: "Our workspace records every developer effort as a narrative pulse.",
    activeUniverse: "CEREMONY",
  }
];
