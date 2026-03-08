import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
OPENAI CLIENT
=============================== */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "PASTE_YOUR_OPENAI_KEY_HERE"
});

/* ===============================
VOICE GENERATOR
=============================== */

export async function generateVoice(text) {

  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: text
  });

  const buffer = Buffer.from(await response.arrayBuffer());

  const voicePath = path.join(__dirname, "temp", "voice.mp3");

  fs.writeFileSync(voicePath, buffer);

  console.log("🎤 Voice created:", voicePath);

  return voicePath;

}