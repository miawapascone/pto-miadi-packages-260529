/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The three narrative universes / perspectives.
 */
export type UniverseType = "ENGINEER" | "CEREMONY" | "STORY_ENGINE";

/**
 * A single immersive narrative scene displayed in the Narrative Mirror.
 * Maps to NCP's Moment with embedded Storybeats.
 */
export interface StoryScene {
  /** Unique scene identifier (e.g., "eng-1", "cer-2") */
  id: string;

  /** Which universe this scene belongs to */
  universe: UniverseType;

  /** Scene title displayed in header */
  title: string;

  /** Immersive second-person narrative prose embedding the user */
  narrativeText: string;

  /** Physical or emotional tone descriptor (e.g., "Focused, Analytical") */
  emotionalResonance: string;

  /** Narrative tension level (0-100 scale) */
  tensionLevel: number;

  /** Active archetype (e.g., "The Builder", "The Keeper", "The Weaver") */
  archetype: string;

  /** Guiding questions from this universe's perspective */
  reflections: string[];

  /** Potential plot developments (for future continuity) */
  nextSeeds: string[];

  /** Optional: Source context that generated this scene */
  sourceContext?: string[];

  /** Optional: Timestamp of generation */
  generatedAt?: string;

  /** Optional: Session ID for tracking */
  sessionId?: string;
}

/**
 * Individual entries in the context ingestion stream.
 */
export interface ContextLog {
  /** Unique log identifier */
  id: string;

  /** Human-readable timestamp (e.g., "12:15 AM") */
  timestamp: string;

  /** Data source origin */
  source: "GITHUB" | "LANGFUSE" | "REFLECTION" | "SYSTEM";

  /** The log message content */
  content: string;

  /** Which universe context this relates to */
  activeUniverse: UniverseType;
}

/**
 * Ephemeral notification display.
 */
export interface ToastMessage {
  /** Unique toast identifier (typically timestamp-based) */
  id: string;

  /** Toast heading */
  title: string;

  /** Toast body text */
  description: string;

  /** Determines icon and color styling */
  type: "success" | "info" | "warning" | "error";
}

/**
 * Full theme style configuration.
 */
export interface ThemeStyles {
  accentBg: string;      // e.g., 'bg-cyan-500/20'
  accentText: string;    // e.g., 'text-cyan-300'
  accentBorder: string;  // e.g., 'border-cyan-500/30'
  barColor: string;      // e.g., 'bg-cyan-500'
  glowColor: string;     // e.g., 'bg-cyan-500/10'
  iconColor: string;     // e.g., 'text-cyan-400'
  buttonHover: string;   // e.g., 'hover:bg-cyan-500/20 shadow-cyan-500/10'
  baseColor: "cyan" | "purple" | "pink";
}

/**
 * System health and connection status.
 */
export interface SystemStatus {
  online: boolean;
  redisConnected: boolean;
  githubWebhookActive: boolean;
  langfuseConnected: boolean;
  lastEventAt?: string;
}
