import { exec } from "child_process";
import path from "path";
import fs from "fs";
import ffmpegStatic from "ffmpeg-static";
import { fileURLToPath } from "url";

/* =========================
PATH SETUP
========================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/* =========================
GET FFMPEG
========================= */

function getFFmpeg() {
  if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
    console.log("Using ffmpeg-static:", ffmpegStatic);
    return `"${ffmpegStatic}"`;
  }

  console.log("Using system ffmpeg");
  return "ffmpeg";
}

/* =========================
VIDEO BUILDER
========================= */

export function buildVideo(images) {

  return new Promise((resolve, reject) => {

    try {

      const ffmpeg = getFFmpeg();
      const audio = path.join(tempDir, "voice.mp3");

      if (!fs.existsSync(audio)) {
        return reject(new Error("voice.mp3 not found"));
      }

      if (!images || images.length === 0) {
        return reject(new Error("No images provided"));
      }

      const videoName = `reel-${Date.now()}.mp4`;
      const output = path.join(tempDir, videoName);

      const sceneDuration = 9; // 9 sec per scene → ~54s total

      const clipFiles = [];
      let commands = "";

      /* =========================
      CREATE CLIPS
      ========================= */

      images.forEach((img, i) => {

        if (!fs.existsSync(img)) {
          throw new Error(`Image missing: ${img}`);
        }

        const clip = path.join(tempDir, `clip_${i}.mp4`);
        clipFiles.push(clip);

        commands +=
          `${ffmpeg} -y -loop 1 -i "${img}" ` +
          `-t ${sceneDuration} ` +
          `-vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" ` +
          `-preset ultrafast -pix_fmt yuv420p -c:v libx264 "${clip}" && `;
      });

      /* =========================
      CONCAT FILE
      ========================= */

      const concatFile = path.join(tempDir, `concat-${Date.now()}.txt`);

      const concatContent = clipFiles
        .map(file => `file '${file}'`)
        .join("\n");

      fs.writeFileSync(concatFile, concatContent);

      /* =========================
      FINAL MERGE
      ========================= */

      commands +=
        `${ffmpeg} -y ` +
        `-f concat -safe 0 -i "${concatFile}" ` +
        `-i "${audio}" ` +
        `-c:v libx264 -preset ultrafast -pix_fmt yuv420p ` +
        `-c:a aac -shortest "${output}"`;

      console.log("FFMPEG PIPELINE:");
      console.log(commands);

      exec(commands, { maxBuffer: 1024 * 1024 * 200 }, (error, stdout, stderr) => {

        if (error) {

          console.error("FFMPEG ERROR:", error);
          console.error(stderr);

          return reject(error);
        }

        if (!fs.existsSync(output)) {
          return reject(new Error("Video file not created"));
        }

        console.log("VIDEO CREATED:", videoName);

        /* =========================
        CLEAN TEMP FILES
        ========================= */

        clipFiles.forEach(file => {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        });

        if (fs.existsSync(concatFile)) fs.unlinkSync(concatFile);

        resolve(videoName);

      });

    } catch (err) {

      console.error("VIDEO BUILDER ERROR:", err);
      reject(err);

    }

  });

}