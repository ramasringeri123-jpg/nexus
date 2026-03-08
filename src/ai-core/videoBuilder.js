import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ffmpeg = "C:/Users/ramas/Downloads/ffmpeg-8.0.1-essentials_build/bin/ffmpeg.exe";

export function buildVideo(images) {

  const tempDir = path.join(__dirname, "temp");

  const audio = path.join(tempDir, "voice.mp3");

  const videoName = `reel-${Date.now()}.mp4`;
  const output = path.join(tempDir, videoName);

  const sceneDuration = 10; // 10 seconds per scene

  /* BUILD INPUTS */

  let inputs = "";

  images.forEach((img) => {
    inputs += ` -loop 1 -t ${sceneDuration} -i "${img}"`;
  });

  inputs += ` -i "${audio}"`;

  /* BUILD FILTERS */

  let filters = "";

  images.forEach((img, i) => {
    filters += `[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2[v${i}];`;
  });

  const concat = images.map((_, i) => `[v${i}]`).join("");

  filters += `${concat}concat=n=${images.length}:v=1:a=0[v]`;

  const audioIndex = images.length;

  /* FINAL COMMAND */

  const command =
    `"${ffmpeg}" -y ${inputs} ` +
    `-filter_complex "${filters}" ` +
    `-map "[v]" -map ${audioIndex}:a ` +
    `-shortest -c:v libx264 -pix_fmt yuv420p -c:a aac "${output}"`;

  return new Promise((resolve, reject) => {

    exec(command, (err) => {

      if (err) {
        console.error("FFMPEG ERROR:", err);
        reject(err);
        return;
      }

      console.log("VIDEO CREATED:", videoName);

      resolve(videoName);

    });

  });

}