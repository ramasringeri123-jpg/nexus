import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

import { generateImage } from "./imageGenerator.js";
import { generateVoice } from "./voiceGenerator.js";
import { buildVideo } from "./videoBuilder.js";

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
PORT (Render compatible)
=============================== */

const PORT = process.env.PORT || 10000;

/* ===============================
OPENAI
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

app.use("/videos", express.static(tempDir));

/* ===============================
ROOT ROUTE
=============================== */

app.get("/", (req, res) => {
  res.send("🚀 Nexus AI API is running");
});

/* ===============================
HEALTH CHECK
=============================== */

app.get("/healthz", (req, res) => {
  res.send("OK");
});

/* ===============================
MEMORY STORAGE
=============================== */

const reelLibrary = [];
const imageUsage = {};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/* ===============================
SAFE JSON PARSER
=============================== */

function cleanJSON(text) {

  text = text.replace(/```json/g, "");
  text = text.replace(/```/g, "");

  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON from AI");
  }

  return JSON.parse(text.substring(start, end + 1));

}

/* ===============================
FAST IMAGE GENERATOR
=============================== */

async function generateImagesFast(scenes) {

  const images = [];

  for (let i = 0; i < scenes.length; i++) {

    const scene = scenes[i];
    let img;

    for (let retry = 0; retry < 2; retry++) {

      try {

        img = await generateImage(scene.visual, i);
        break;

      } catch {

        console.log("Retry image...", i);
        await new Promise(r => setTimeout(r, 2000));

      }

    }

    if (!img) throw new Error("Image generation failed");

    images.push(img);

  }

  return images;

}

/* ===============================
VIDEO GENERATOR
=============================== */

app.post("/generate-video", async (req, res) => {

  try {

    const { topic } = req.body;

    const completion = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content: `
Generate a 60 second educational video.

Rules:
- Exactly 6 scenes
- Each scene ~10 seconds
- Each scene has visual + narration

Return JSON only.

Example:

[
 { "visual":"...", "narration":"..." }
]
`
        },
        {
          role: "user",
          content: topic
        }
      ]

    });

    const scenes = cleanJSON(
      completion.choices[0].message.content
    );

    if (scenes.length < 6) {
      while (scenes.length < 6) {
        scenes.push(scenes[scenes.length - 1]);
      }
    }

    if (scenes.length > 6) {
      scenes.length = 6;
    }

    let narration = "";

    scenes.forEach(scene => {
      narration += scene.narration + " ";
    });

    const images = await generateImagesFast(scenes);

    const voice = await generateVoice(narration);

    const videoName = await buildVideo(images, voice);

    const videoUrl =
      `${req.protocol}://${req.get("host")}/videos/${videoName}`;

    const reel = {
      id: Date.now(),
      topic,
      videoUrl,
      createdAt: new Date()
    };

    reelLibrary.push(reel);

    res.json({ videoUrl });

  } catch (error) {

    console.error("VIDEO ERROR:", error);

    res.status(500).json({
      error: "Video generation failed"
    });

  }

});

/* ===============================
REEL LIBRARY
=============================== */

app.get("/reels", (req, res) => {

  res.json({
    reels: reelLibrary.slice().reverse()
  });

});

/* ===============================
IMAGE GENERATOR
=============================== */

app.post("/generate-image", async (req, res) => {

  try {

    const { prompt } = req.body;

    const ip = req.ip;
    const today = getToday();

    if (!imageUsage[ip]) {
      imageUsage[ip] = { date: today, count: 0 };
    }

    if (imageUsage[ip].date !== today) {
      imageUsage[ip] = { date: today, count: 0 };
    }

    if (imageUsage[ip].count >= 10) {

      return res.json({
        error: "Daily free limit reached"
      });

    }

    imageUsage[ip].count++;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    });

    const image =
      `data:image/png;base64,${result.data[0].b64_json}`;

    res.json({ image });

  } catch (error) {

    console.error("IMAGE ERROR:", error);

    res.status(500).json({
      error: "Image generation failed"
    });

  }

});

/* ===============================
TECHBOT
=============================== */

app.post("/techbot", async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {
      return res.json({
        reply: "Ask me something!"
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: message
    });

    const reply = response.output_text || "No response.";

    res.json({ reply });

  } catch (error) {

    console.error("TECHBOT ERROR:", error);

    res.status(500).json({
      reply: "TechBot server error."
    });

  }

});

/* ===============================
SERVER START
=============================== */

app.listen(PORT, "0.0.0.0", () => {

  console.log(`🚀 Nexus AI server running on port ${PORT}`);

});