import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateImage(prompt, index) {

  try {

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024"
    });

    const imageBase64 = result.data[0].b64_json;

    const buffer = Buffer.from(imageBase64, "base64");

    const folder = "./temp";

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    const filePath = `${folder}/scene_${index}.png`;

    fs.writeFileSync(filePath, buffer);

    console.log("✅ Image created:", filePath);

    return filePath;

  } catch (error) {

    console.error("❌ Image generation failed:", error);

    throw error;

  }

}