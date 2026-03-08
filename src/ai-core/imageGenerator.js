import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "PASTE_YOUR_OPENAI_KEY_HERE"
});

export async function generateImage(prompt, index) {

  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt: prompt,
    size: "1024x1024"
  });

  const imageBase64 = result.data[0].b64_json;
  const imageBuffer = Buffer.from(imageBase64, "base64");

  const filePath = path.join(__dirname, "temp", `scene_${index}.png`);

  fs.writeFileSync(filePath, imageBuffer);

  console.log("✅ Image created:", filePath);

  return filePath;

}