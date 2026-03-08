import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateVoice(text) {

  const speech = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: text
  });

  const buffer = Buffer.from(await speech.arrayBuffer());

  fs.writeFileSync("temp/voice.mp3", buffer);

  return "temp/voice.mp3";
}