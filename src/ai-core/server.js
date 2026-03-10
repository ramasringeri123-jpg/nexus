import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { generateImage } from "./imageGenerator.js";
import { generateVoice } from "./voiceGenerator.js";
import { buildVideo } from "./videoBuilder.js";

const app = express();

/* ===============================
MIDDLEWARE
=============================== */

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.set("trust proxy", true);

/* ===============================
PORT
=============================== */

const PORT = process.env.PORT || 10000;

/* ===============================
OPENAI CLIENT
=============================== */

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("❌ OPENAI_API_KEY missing");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

/* ===============================
PATH SETUP
=============================== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

app.use("/videos", express.static(tempDir));

/* ===============================
ROOT
=============================== */

app.get("/", (req, res) => {
  res.json({ status: "Nexus AI API running" });
});

/* ===============================
HEALTH CHECK
=============================== */

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ===============================
DAILY VIDEO LIMIT
=============================== */

const videoUsage = {};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/* ===============================
HELPERS
=============================== */

function cleanJSON(text) {
  try {
    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON");
    }

    return JSON.parse(text.substring(start, end + 1));
  } catch (err) {
    console.error("JSON PARSE ERROR:", err);
    return [];
  }
}

/* ===============================
IMAGE GENERATOR WITH RETRIES
=============================== */

async function generateImagesFast(scenes) {

  const images = [];

  for (let i = 0; i < scenes.length; i++) {

    const scene = scenes[i];
    let img = null;

    for (let retry = 0; retry < 5; retry++) {

      try {

        console.log(`Generating image ${i} attempt ${retry + 1}`);

        img = await generateImage(scene.visual, i);

        if (img) break;

      } catch {

        console.log(`Retry image ${i}`);
        await new Promise(r => setTimeout(r, 3000));

      }

    }

    if (!img) {

      const fallback = path.join(__dirname, "fallback.png");

      if (fs.existsSync(fallback)) {
        img = fallback;
      } else {
        throw new Error("Image generation failed");
      }

    }

    images.push(img);
  }

  return images;
}

/* ===============================
VIDEO GENERATOR
=============================== */

app.post("/generate-video", async (req, res) => {

  const ip = req.ip;
  const today = getToday();

  if (!videoUsage[ip]) {
    videoUsage[ip] = { date: today, count: 0 };
  }

  if (videoUsage[ip].date !== today) {
    videoUsage[ip] = { date: today, count: 0 };
  }

  if (videoUsage[ip].count >= 1) {
    return res.status(429).json({
      error: "Daily video limit reached. Try again tomorrow."
    });
  }

  videoUsage[ip].count++;

  try {

    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const completion = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content: `
Generate a short educational video.

Rules:
- exactly 6 scenes
- each scene contains visual + narration
- return JSON array
`
        },
        {
          role: "user",
          content: topic
        }
      ]

    });

    const scenes = cleanJSON(
      completion.choices?.[0]?.message?.content || ""
    );

    if (!scenes.length) {
      return res.status(500).json({
        error: "Failed to generate scenes"
      });
    }

    while (scenes.length < 6) {
      scenes.push(scenes[scenes.length - 1]);
    }

    scenes.length = 6;

    let narration = "";

    scenes.forEach(scene => {
      narration += scene.narration + " ";
    });

    const images = await generateImagesFast(scenes);

    await generateVoice(narration);

    const videoName = await buildVideo(images);

    const videoUrl =
      `${req.protocol}://${req.get("host")}/videos/${videoName}`;

    res.json({ videoUrl });

  } catch (err) {

    console.error("VIDEO ERROR:", err);

    res.status(500).json({
      error: "Video generation failed"
    });

  }

});

/* ===============================
SERVER START
=============================== */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Nexus AI server running on port ${PORT}`);
});