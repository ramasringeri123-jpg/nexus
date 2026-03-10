import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";

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
    if (start === -1 || end === -1) throw new Error("Invalid JSON");
    return JSON.parse(text.substring(start, end + 1));
  } catch (err) {
    console.error("JSON PARSE ERROR:", err);
    return [];
  }
}

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
IN-MEMORY JOB QUEUE (Fixes 8-min timeout)
=============================== */
const jobs = new Map();

async function processVideoInBackground(jobId, topic, baseUrl) {
  try {
    jobs.set(jobId, { status: "processing", progress: "Writing AI script..." });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Generate a short educational video.
          Rules:
          - exactly 6 scenes
          - each scene contains "visual" and "narration"
          - CRITICAL: The TOTAL word count of all 6 "narration" fields combined MUST be strictly between 110 and 125 words. This guarantees the audio length exactly matches the video length without cutting off early.
          - return JSON array`
        },
        { role: "user", content: topic }
      ]
    });

    const scenes = cleanJSON(completion.choices?.[0]?.message?.content || "");

    if (!scenes.length) throw new Error("Failed to generate scenes");

    while (scenes.length < 6) scenes.push(scenes[scenes.length - 1]);
    scenes.length = 6;

    let narration = "";
    scenes.forEach(scene => { narration += scene.narration + " "; });

    jobs.set(jobId, { status: "processing", progress: "Generating images... (This takes a few minutes)" });
    const images = await generateImagesFast(scenes);

    jobs.set(jobId, { status: "processing", progress: "Generating voice..." });
    await generateVoice(narration);

    jobs.set(jobId, { status: "processing", progress: "Building final video..." });
    const videoName = await buildVideo(images);

    const videoUrl = `${baseUrl}/videos/${videoName}`;

    jobs.set(jobId, { 
      status: "completed", 
      videoUrl, 
      topic,
      description: narration.substring(0, 100) + '...'
    });

    console.log(`✅ Job ${jobId} completed!`);

  } catch (err) {
    console.error("VIDEO ERROR:", err);
    jobs.set(jobId, { status: "failed", error: "Video generation failed" });
  }
}

/* ===============================
ENDPOINTS
=============================== */
app.get("/", (req, res) => res.json({ status: "Nexus AI API running" }));
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/generate-video", async (req, res) => {
  const ip = req.ip;
  const today = getToday();

  if (!videoUsage[ip]) videoUsage[ip] = { date: today, count: 0 };
  if (videoUsage[ip].date !== today) videoUsage[ip] = { date: today, count: 0 };
  if (videoUsage[ip].count >= 1) { // You had this at 1 for daily limit
    return res.status(429).json({ error: "Daily video limit reached. Try again tomorrow." });
  }

  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic required" });

  videoUsage[ip].count++; // Deduct credit
  const jobId = crypto.randomUUID();
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  // Initialize job and Start background processing immediately
  jobs.set(jobId, { status: "pending", progress: "Initializing task..." });
  processVideoInBackground(jobId, topic, baseUrl);

  // Return instantly to prevent browser timeout
  res.status(202).json({ jobId });
});

app.get("/job-status/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

/* (Assuming you have this based on your frontend loadNext) */
app.get("/reels", (req, res) => {
  // Replace with your actual DB fetching logic
  res.json({ reels: [] }); 
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Nexus AI server running on port ${PORT}`);
});