import fs from "fs";
import path from "path";
import * as googleTTS from "google-tts-api";
import { fileURLToPath } from "url";

// Setup Temp Directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "temp");

export async function generateVoice(text) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🎙️ Generating free voiceover...");

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const outputPath = path.join(tempDir, "voice.mp3");

      // We use getAllAudioBase64 because the free API has a 200-character limit per request.
      // This automatically chunks your long script and translates it all!
      const audioChunks = await googleTTS.getAllAudioBase64(text, {
        lang: "en",
        slow: false,
        host: "https://translate.google.com",
        timeout: 10000,
      });

      // Convert all the base64 chunks back into actual audio data
      const buffers = audioChunks.map(chunk => Buffer.from(chunk.base64, "base64"));
      
      // Stitch all the audio chunks together into one seamless file
      const finalAudioBuffer = Buffer.concat(buffers);

      // Save it to disk for FFmpeg to use later
      fs.writeFileSync(outputPath, finalAudioBuffer);

      console.log("✅ FREE VOICE SAVED:", outputPath);
      resolve(outputPath);

    } catch (error) {
      console.error("❌ Free Voice Generation Error:", error);
      reject(error);
    }
  });
}