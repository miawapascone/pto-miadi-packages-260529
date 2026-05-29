/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment configurations
dotenv.config();

// Import shared templates and types directly from our workspace
import { 
  SPECLANG_PORTAL_EVENTS, 
  SPECLANG_INITIAL_LOGS, 
  SPECLANG_PORTAL_SCENES 
} from "./packages/LiveStoryMonitor/templates.ts";
import { StoryScene, ContextLog, UniverseType } from "./packages/LiveStoryMonitor/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for live sessions
const activeLogs: ContextLog[] = [...SPECLANG_INITIAL_LOGS];
const archivedScenes: StoryScene[] = [];
let eventCursor = 0;

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY standard credential has not been configured in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Keep track of active SSE response objects to broadcast real-time workspace updates
const sseListeners: Set<express.Response> = new Set();

function broadcastLog(log: ContextLog) {
  const payload = `data: ${JSON.stringify(log)}\n\n`;
  for (const listener of sseListeners) {
    listener.write(payload);
  }
}

// Set up periodic simulated background events to mimic active developer workflows
setInterval(() => {
  if (SPECLANG_PORTAL_EVENTS.length === 0) return;

  const eventTemplate = SPECLANG_PORTAL_EVENTS[eventCursor];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });

  const newLog: ContextLog = {
    id: `log-sim-${Date.now()}-${eventCursor}`,
    timestamp: timeStr,
    source: eventTemplate.source,
    content: eventTemplate.content,
    activeUniverse: eventTemplate.universe,
  };

  activeLogs.push(newLog);
  // Keep logs under 100 for safety and cleanup
  if (activeLogs.length > 100) {
    activeLogs.shift();
  }

  broadcastLog(newLog);

  // Cycle through events infinitely to symbolize ongoing development waves
  eventCursor = (eventCursor + 1) % SPECLANG_PORTAL_EVENTS.length;
}, 10000); // Pulse every 10 seconds

// API: Connect SSE log stream
app.get("/api/live-story-monitor/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  // Keep connection open and send existing history first
  const bootstrapLogs = activeLogs.slice(-15);
  for (const log of bootstrapLogs) {
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  }

  sseListeners.add(res);

  req.on("close", () => {
    sseListeners.delete(res);
    res.end();
  });
});

// API: Feed a manual walking reflection into the active stream
app.post("/api/live-story-monitor/reflect", (req, res) => {
  const { content, universe } = req.body;
  if (!content) {
    res.status(400).json({ error: "Reflection text content is empty." });
    return;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });

  const customLog: ContextLog = {
    id: `log-custom-${Date.now()}`,
    timestamp: timeStr,
    source: "REFLECTION",
    content: content.trim(),
    activeUniverse: (universe as UniverseType) || "ENGINEER",
  };

  activeLogs.push(customLog);
  broadcastLog(customLog);

  res.status(200).json({ success: true, log: customLog });
});

// API: Dynamic Scene Generation (AI powered, with robust pre-crafted fallback)
app.post("/api/live-story-monitor/scene", async (req, res) => {
  const { universe, recentCount } = req.body;
  const targetUniverse = (universe as UniverseType) || "ENGINEER";
  
  // Extract recent context logs matching this universe format
  const count = Number(recentCount) || 5;
  const filterLogs = activeLogs
    .filter(log => log.activeUniverse === targetUniverse || log.source === "REFLECTION" || log.source === "SYSTEM")
    .slice(-count);

  const logsSummarized = filterLogs
    .map(log => `[${log.timestamp} - ${log.source}] ${log.content}`)
    .join("\n");

  try {
    // Attempt Gemini call
    const ai = getGeminiClient();
    
    const archetype = 
      targetUniverse === "ENGINEER" ? "The Builder" :
      targetUniverse === "CEREMONY" ? "The Keeper" : "The Weaver";

    const promptInstructions = `
You are an expert storytelling architect. Your task is to generate an immersive, poetic narrative scene in the second-person present tense ('You sit...', 'You examine...') where the user is the main protagonist.
The tone and voice must adjust to the following universe definitions:
- ENGINEER: Voice is technical, precise, clean slate, structural. Archetype is 'The Builder'.
- CEREMONY: Voice is warm, reverent, sacred space, intentional. Archetype is 'The Keeper'.
- STORY_ENGINE: Voice is epic, bold meta-narrative loops, plot-aware. Archetype is 'The Weaver'.

Use the following raw context logs representing actual recent events to weave a highly detailed, grounded scene:
${logsSummarized || "The silence of the terminal hums with latent potential."}

Return a JSON object conforming exactly to this structure:
{
  "title": "A highly creative title for the active scene",
  "narrativeText": "A luxurious 3-paragraph story prose describing the protagonist's active context, actions, and experience.",
  "emotionalResonance": "A tone descriptor pair, e.g., 'Contemplative, Analytical' or 'Epic, Reverent'",
  "tensionLevel": can be an integer between 10 and 95 based on the active log density,
  "archetype": "${archetype}",
  "reflections": ["Two guiding questions encouraging creative or ethical reflection on their craft"],
  "nextSeeds": ["Two plot development hints or choices and prospects for the next wave"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptInstructions,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            narrativeText: { type: Type.STRING },
            emotionalResonance: { type: Type.STRING },
            tensionLevel: { type: Type.INTEGER },
            archetype: { type: Type.STRING },
            reflections: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            nextSeeds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "narrativeText", "emotionalResonance", "tensionLevel", "archetype", "reflections", "nextSeeds"]
        },
        temperature: 0.8,
      }
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error("Empty response from AI engine.");
    }

    const sceneData = JSON.parse(bodyText);
    const newScene: StoryScene = {
      id: `${targetUniverse.toLowerCase()}-${Date.now()}`,
      universe: targetUniverse,
      title: sceneData.title,
      narrativeText: sceneData.narrativeText,
      emotionalResonance: sceneData.emotionalResonance,
      tensionLevel: sceneData.tensionLevel,
      archetype: sceneData.archetype,
      reflections: sceneData.reflections,
      nextSeeds: sceneData.nextSeeds,
      generatedAt: new Date().toISOString()
    };

    res.status(200).json({ success: true, scene: newScene, source: "gemini" });
  } catch (error: any) {
    // Graceful fallback to static high-fidelity SpecLang scenes
    const scenesSelection = SPECLANG_PORTAL_SCENES[targetUniverse];
    const randomIndex = Math.floor(Math.random() * scenesSelection.length);
    const selectedFallback = scenesSelection[randomIndex];

    // Rehydrate with a fresh unique ID and timestamp to maintain simulation accuracy
    const fallbackScene: StoryScene = {
      ...selectedFallback,
      id: `${targetUniverse.toLowerCase()}-fallback-${Date.now()}`,
      generatedAt: new Date().toISOString()
    };

    res.status(200).json({ 
      success: true, 
      scene: fallbackScene, 
      source: "fallback",
      errorInfo: error.message || "Using curated sandbox templates due to missing key."
    });
  }
});

// API: Archive scene into Walkmemory
app.post("/api/live-story-monitor/archive", (req, res) => {
  const { scene, reflection } = req.body;
  if (!scene) {
    res.status(400).json({ error: "No scene provided for archiving." });
    return;
  }

  const archiveEntry: StoryScene = {
    ...scene,
    id: `arch-${Date.now()}-${scene.id}`,
    generatedAt: new Date().toISOString(),
    // Embed custom user reflection into the archived seeds
    reflections: reflection ? [...scene.reflections, `Your reflection: "${reflection}"`] : scene.reflections
  };

  archivedScenes.push(archiveEntry);

  res.status(200).json({ success: true, key: `Story.live-monitor.${scene.universe.toLowerCase()}.${Date.now()}`, entry: archiveEntry });
});

// API: Get archived list
app.get("/api/live-story-monitor/archives", (req, res) => {
  res.status(200).json({ success: true, archives: archivedScenes });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Live Story Monitor Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
