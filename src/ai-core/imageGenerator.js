import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup Temp Directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "temp");

export async function generateImages(prompts) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`🖼️ Generating ${prompts.length} free images via Pollinations...`);

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const imagePaths = [];

      // Loop through every prompt and download the image
      for (let i = 0; i < prompts.length; i++) {
        console.log(`Downloading image ${i + 1} of ${prompts.length}...`);

        // Format prompt for URL and set dimensions for vertical Reels (1080x1920)
        const safePrompt = encodeURIComponent(prompts[i]);
        const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=1080&height=1920&nologo=true`;

        // Fetch the image data natively
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to download image ${i}`);

        // Convert the data into a buffer we can save
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Save it to the temp folder
        const imagePath = path.join(tempDir, `image_${i}.jpg`);
        fs.writeFileSync(imagePath, buffer);
        
        imagePaths.push(imagePath);
      }

      console.log("✅ ALL FREE IMAGES SAVED!");
      resolve(imagePaths);

    } catch (error) {
      console.error("❌ Free Image Generation Error:", error);
      reject(error);
    }
  });
}