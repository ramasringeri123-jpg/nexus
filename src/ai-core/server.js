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

app.use(cors());
app.use(express.json());

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
HEALTH
=============================== */

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ===============================
JSON CLEANER
=============================== */

function cleanJSON(text) {

  try {

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    return JSON.parse(text.substring(start, end + 1));

  } catch (err) {

    console.error("JSON parse failed");
    return [];

  }

}

/* ===============================
VIDEO GENERATOR
=============================== */

app.post("/generate-video", async (req, res) => {

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
Generate a short educational video script.

Rules:
- exactly 6 scenes
- each narration must be around 8-10 seconds
- each scene contains:
  visual description
  narration text
Return JSON array.
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
        error: "Scene generation failed"
      });
    }

    let narration = "";

    scenes.forEach(scene => {
      narration += scene.narration + " ";
    });

    const images = [];

    for (let i = 0; i < scenes.length; i++) {

      console.log(`Generating image ${i}`);

      const img = await generateImage(scenes[i].visual, i);

      images.push(img);

    }

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