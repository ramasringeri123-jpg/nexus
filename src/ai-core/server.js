import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai"; 

import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

// --- MODELS (Renamed to nuke Git cache) ---
import User from "./models/UserModel.js";
import Chat from "./models/ChatModel.js"; 
import Reel from "./models/ReelModel.js";

// --- AI WORKER FILES ---
import { generateImage } from "./imageGenerator.js";
import { generateVoice } from "./voiceGenerator.js";
import { buildVideo } from "./videoBuilder.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

/* ===============================
MIDDLEWARE & FILE SYSTEM
=============================== */
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.set("trust proxy", true);

const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
app.use("/videos", express.static(tempDir));

/* ===============================
CRASH-PROOF MONGODB CONNECTION
=============================== */
if (!process.env.MONGODB_URI) {
  console.error("🚨 CRITICAL WARNING: MONGODB_URI is missing in Render Environment Variables!");
  console.error("🚨 The server will start, but database features will fail.");
} else {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("📦 Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err.message));
}

/* ===============================
GEMINI SETUP
=============================== */
if (!process.env.GEMINI_API_KEY) {
  console.error("🚨 CRITICAL WARNING: GEMINI_API_KEY is missing!");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ===============================
WEBSOCKETS: REAL-TIME & TIME TRACKING
=============================== */
const activeStudySessions = new Map();

io.on("connection", (socket) => {
  socket.on("start_session", (data) => {
    if (data.userId) {
      activeStudySessions.set(socket.id, { userId: data.userId, startTime: Date.now() });
    }
  });

  socket.on("disconnect", async () => {
    const session = activeStudySessions.get(socket.id);
    if (session && session.userId) {
      const minutesSpent = Math.floor((Date.now() - session.startTime) / 60000);
      if (minutesSpent > 0 && process.env.MONGODB_URI) {
        try {
          await User.findByIdAndUpdate(session.userId, { $inc: { totalMinutesStudied: minutesSpent } });
        } catch (err) { console.error("Time tracking error:", err.message); }
      }
    }
    activeStudySessions.delete(socket.id);
  });

  socket.on("join_chat", (chatId) => socket.join(chatId));

  socket.on("send_message", async (data) => {
    try {
      if (process.env.MONGODB_URI) {
        await Chat.findByIdAndUpdate(data.chatId, {
          $push: { messages: { sender: data.senderId, senderName: data.senderName, text: data.text } }
        });
      }
      io.to(data.chatId).emit("receive_message", data);
    } catch (err) { console.error("Chat error:", err.message); }
  });
});

/* ===============================
RESTORED: IMAGE GENERATOR API
=============================== */
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    
    // Calls your existing imageGenerator.js file
    const imagePath = await generateImage(prompt, "custom"); 
    res.json({ success: true, imagePath: `/videos/${path.basename(imagePath)}` });
  } catch (err) {
    console.error("Image Gen Error:", err.message);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

/* ===============================
RESTORED: USER REELS API
=============================== */
app.get("/reels", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!process.env.MONGODB_URI) return res.json([]); // Fail gracefully if no DB
    
    const filter = userId ? { author: userId } : {};
    const userReels = await Reel.find(filter).sort({ createdAt: -1 });
    res.json(userReels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
SOCIAL API: NETWORK & SEARCH
=============================== */
app.get("/api/network/search", async (req, res) => {
  try {
    const { query, state, country } = req.query;
    let filter = {};
    if (query) {
      filter.$or = [
        { displayName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ];
    }
    if (state) filter.state = { $regex: state, $options: "i" };
    if (country) filter.country = { $regex: country, $options: "i" };

    const users = await User.find(filter).limit(20).select("displayName username avatar state country totalMinutesStudied");
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/users/sync", async (req, res) => {
  try {
    const { firebaseUid, displayName, email } = req.body;
    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = await User.create({ 
        firebaseUid, 
        displayName, 
        username: `@${displayName.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random()*1000)}` 
      });
    }
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/users/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.uid });
    if (!user) return res.status(404).json({ error: "User not found" });
    const hours = (user.totalMinutesStudied / 60).toFixed(1);
    res.json({ ...user._doc, exactHoursStudied: hours });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===============================
GLOBAL REELS FEED
=============================== */
app.get("/api/global-reels", async (req, res) => {
  try {
    const reels = await Reel.find({ isGlobal: true }).populate("author", "displayName username avatar").sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ===============================
AI VIDEO PIPELINE
=============================== */
const jobs = new Map();

function cleanJSON(text) {
  try {
    text = text.replace(/```json/g, "").replace(/```/g, "");
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    return JSON.parse(text.substring(start, end + 1));
  } catch (err) { return []; }
}

async function processVideoInBackground(jobId, topic, baseUrl, userId) {
  try {
    jobs.set(jobId, { status: "processing", progress: "Writing AI script..." });
    const scriptModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await scriptModel.generateContent(`Generate 6 scene educational script for ${topic} in JSON array with 'visual' and 'narration'. Total words 110-125.`);
    const scenes = cleanJSON(result.response.text());

    jobs.set(jobId, { status: "processing", progress: "Generating media..." });
    const images = [];
    for (let i=0; i<6; i++) {
      const imgPath = await generateImage(scenes[i]?.visual || topic, i);
      images.push(imgPath || path.join(__dirname, "fallback.png"));
    }
    
    await generateVoice(scenes.map(s => s.narration).join(" "));
    const videoName = await buildVideo(images);
    const videoUrl = `${baseUrl}/videos/${videoName}`;

    if (userId && process.env.MONGODB_URI) {
      await Reel.create({ author: userId, title: topic, videoUrl, isGlobal: true });
    }

    jobs.set(jobId, { status: "completed", videoUrl, topic });
  } catch (err) { jobs.set(jobId, { status: "failed", error: err.message }); }
}

app.post("/generate-video", async (req, res) => {
  const { topic, userId } = req.body;
  const jobId = crypto.randomUUID();
  jobs.set(jobId, { status: "pending", progress: "Initializing..." });
  processVideoInBackground(jobId, topic, `${req.protocol}://${req.get("host")}`, userId);
  res.status(202).json({ jobId });
});

app.get("/job-status/:jobId", (req, res) => res.json(jobs.get(req.params.jobId) || { error: "Not found" }));

/* ===============================
TECHBOT
=============================== */
app.post("/techbot", async (req, res) => {
  try {
    const botModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await botModel.generateContent(req.body.message);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("TechBot Crash:", err.message);
    res.status(500).json({ error: "TechBot is currently experiencing issues. Please try again." });
  }
});

/* ===============================
START SERVER
=============================== */
server.listen(PORT, "0.0.0.0", () => console.log(`🚀 Nexus Server on port ${PORT}`));