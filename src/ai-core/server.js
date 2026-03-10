import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai"; 

// --- NEW IMPORTS FOR PHASE 3 ---
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import User from "./models/User.js";
import Chat from "./models/Chat.js";
import Reel from "./models/Reel.js";

import { generateImage } from "./imageGenerator.js";
import { generateVoice } from "./voiceGenerator.js";
import { buildVideo } from "./videoBuilder.js";

const app = express();

// --- CREATE HTTP SERVER & SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows your React frontend to connect
    methods: ["GET", "POST"]
  }
});

/* ===============================
MIDDLEWARE & DB CONNECTION
=============================== */
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.set("trust proxy", true);

const PORT = process.env.PORT || 10000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nexus")
  .then(() => console.log("📦 Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ===============================
GEMINI SETUP (Untouched)
=============================== */
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
app.use("/videos", express.static(tempDir));


/* ===============================
WEBSOCKETS: REAL-TIME CHAT & TIME TRACKING
=============================== */
const activeStudySessions = new Map(); // Tracks exactly when users log on

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // 1. EXACT TIME TRACKING
  socket.on("start_session", (data) => {
    // When React loads, it tells the server the user's Mongo ID
    if (data.userId) {
      activeStudySessions.set(socket.id, { 
        userId: data.userId, 
        startTime: Date.now() 
      });
      console.log(`⏱️ Started time tracking for user ${data.userId}`);
    }
  });

  // When they close the tab, calculate exact minutes and save to DB
  socket.on("disconnect", async () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    const session = activeStudySessions.get(socket.id);
    
    if (session && session.userId) {
      const timeSpentMs = Date.now() - session.startTime;
      const minutesSpent = Math.floor(timeSpentMs / 60000); // Convert to minutes
      
      if (minutesSpent > 0) {
        try {
          await User.findByIdAndUpdate(session.userId, {
            $inc: { totalMinutesStudied: minutesSpent }
          });
          console.log(`💾 Saved ${minutesSpent} mins for user ${session.userId}`);
        } catch (err) {
          console.error("Error saving time:", err);
        }
      }
    }
    activeStudySessions.delete(socket.id);
  });

  // 2. REAL-TIME CHAT
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`💬 User joined chat room: ${chatId}`);
  });

  socket.on("send_message", async (data) => {
    // data = { chatId, senderId, senderName, text }
    
    // Save to MongoDB instantly
    try {
      await Chat.findByIdAndUpdate(data.chatId, {
        $push: { 
          messages: {
            sender: data.senderId,
            senderName: data.senderName,
            text: data.text,
            timestamp: new Date()
          }
        }
      });

      // Broadcast the message to everyone else in that specific chat room
      io.to(data.chatId).emit("receive_message", data);
    } catch (err) {
      console.error("Chat saving error:", err);
    }
  });
});


/* ===============================
NEW REST API: PROFILES & NETWORK
=============================== */

// Sync Firebase UID to MongoDB when user logs in/signs up
app.post("/api/users/sync", async (req, res) => {
  try {
    const { firebaseUid, displayName, email } = req.body;
    let user = await User.findOne({ firebaseUid });
    
    if (!user) {
      user = await User.create({ firebaseUid, displayName, username: `@${displayName.replace(/\s+/g, '').toLowerCase()}` });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Profile (Includes exact hours studied)
app.get("/api/users/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.uid }).populate("connections", "displayName username avatar");
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // Convert minutes to hours for the frontend profile display
    const hours = (user.totalMinutesStudied / 60).toFixed(1);
    res.json({ ...user._doc, exactHoursStudied: hours });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ===============================
EXISTING BACKGROUND VIDEO JOBS
=============================== */
const videoUsage = {};
function getToday() { return new Date().toISOString().slice(0, 10); }

function cleanJSON(text) {
  try {
    text = text.replace(/```json/g, "").replace(/```/g, "");
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("Invalid JSON");
    return JSON.parse(text.substring(start, end + 1));
  } catch (err) {
    console.error("JSON ERROR:", err);
    return [];
  }
}

const jobs = new Map();

async function processVideoInBackground(jobId, topic, baseUrl, userId) {
  try {
    jobs.set(jobId, { status: "processing", progress: "Writing AI script..." });

    const scriptModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction: `Generate a short educational video. Rules: exactly 6 scenes. Return JSON array of objects with 'visual' and 'narration'. Combine narration to ~120 words total.`
    });

    const result = await scriptModel.generateContent(topic);
    const scenes = cleanJSON(result.response.text());
    
    while (scenes.length < 6) scenes.push(scenes[scenes.length - 1]);
    scenes.length = 6;
    let narration = ""; scenes.forEach(s => { narration += s.narration + " "; });

    jobs.set(jobId, { status: "processing", progress: "Generating images..." });
    const images = [];
    for (let i=0; i<6; i++) {
       const imgPath = await generateImage(scenes[i].visual, i);
       images.push(imgPath || path.join(__dirname, "fallback.png"));
    }

    jobs.set(jobId, { status: "processing", progress: "Generating voice..." });
    await generateVoice(narration);

    jobs.set(jobId, { status: "processing", progress: "Building final video..." });
    const videoName = await buildVideo(images);
    const videoUrl = `${baseUrl}/videos/${videoName}`;

    // NEW: Save the Reel to the Database!
    if (userId) {
      await Reel.create({
        author: userId,
        title: topic,
        description: narration.substring(0, 80) + '...',
        videoUrl: videoUrl
      });
    }

    jobs.set(jobId, { status: "completed", videoUrl, topic });
  } catch (err) {
    jobs.set(jobId, { status: "failed", error: "Video failed" });
  }
}

app.post("/generate-video", async (req, res) => {
  const ip = req.ip;
  const today = getToday();
  const { topic, userId } = req.body;

  if (!videoUsage[ip]) videoUsage[ip] = { date: today, count: 0 };
  if (videoUsage[ip].date !== today) videoUsage[ip] = { date: today, count: 0 };
  
  // NOTE: In the future, check User.isPremium here!
  if (videoUsage[ip].count >= 1) { 
    return res.status(429).json({ error: "Daily limit reached." });
  }

  videoUsage[ip].count++; 
  const jobId = crypto.randomUUID();
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  jobs.set(jobId, { status: "pending", progress: "Initializing task..." });
  processVideoInBackground(jobId, topic, baseUrl, userId);

  res.status(202).json({ jobId });
});

app.get("/job-status/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});


/* ===============================
TECHBOT
=============================== */
app.post("/techbot", async (req, res) => {
  try {
    const { message } = req.body;
    const botModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      systemInstruction: "You are TechBot, a friendly AI study assistant for the NEXUS platform."
    });
    const result = await botModel.generateContent(message);
    res.json({ reply: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: "TechBot server error." });
  }
});

/* ===============================
START SERVER
=============================== */
// IMPORTANT: Use server.listen instead of app.listen so WebSockets work!
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Nexus AI server running on port ${PORT}`);
});