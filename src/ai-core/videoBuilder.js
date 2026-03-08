import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, "temp");

/* ensure temp folder exists */
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/* tell fluent-ffmpeg where ffmpeg is */
ffmpeg.setFfmpegPath(ffmpegPath);

export function buildVideo(images) {

  return new Promise((resolve, reject) => {

    const audioPath = path.join(tempDir, "voice.mp3");

    const outputName = `reel-${Date.now()}.mp4`;

    const outputPath = path.join(tempDir, outputName);

    const sceneDuration = 10;

    /* build ffmpeg command */

    let command = ffmpeg();

    images.forEach(img => {
      command = command.input(img).loop(sceneDuration);
    });

    command
      .input(audioPath)
      .complexFilter([
        images.map((_, i) =>
          `[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2[v${i}]`
        ).join(";"),
        `${images.map((_, i) => `[v${i}]`).join("")}concat=n=${images.length}:v=1:a=0[v]`
      ])
      .outputOptions([
        "-map [v]",
        `-map ${images.length}:a`,
        "-shortest",
        "-c:v libx264",
        "-pix_fmt yuv420p",
        "-preset veryfast",
        "-c:a aac"
      ])
      .save(outputPath)

      .on("start", cmd => {
        console.log("FFMPEG START:", cmd);
      })

      .on("end", () => {
        console.log("VIDEO CREATED:", outputName);
        resolve(outputName);
      })

      .on("error", err => {
        console.error("FFMPEG ERROR:", err);
        reject(err);
      });

  });

}