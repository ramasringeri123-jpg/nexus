import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/* ============================
   PATH SETUP
============================ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/* ============================
   VIDEO BUILDER
============================ */

export function buildVideo(images) {

  return new Promise((resolve, reject) => {

    const audio = path.join(tempDir, "voice.mp3");

    const videoName = `reel-${Date.now()}.mp4`;

    const output = path.join(tempDir, videoName);

    const sceneDuration = 10;

    /* ============================
       BUILD INPUTS
    ============================ */

    let inputs = "";

    images.forEach((img) => {
      inputs += ` -loop 1 -t ${sceneDuration} -i "${img}"`;
    });

    inputs += ` -i "${audio}"`;

    /* ============================
       FILTER GRAPH
    ============================ */

    let filters = "";

    images.forEach((img, i) => {

      filters += `[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2[v${i}];`;

    });

    const concatInputs = images.map((_, i) => `[v${i}]`).join("");

    filters += `${concatInputs}concat=n=${images.length}:v=1:a=0[v]`;

    const audioIndex = images.length;

    /* ============================
       FINAL COMMAND
    ============================ */

    const command =
      `ffmpeg -y ${inputs} ` +
      `-filter_complex "${filters}" ` +
      `-map "[v]" -map ${audioIndex}:a ` +
      `-shortest -c:v libx264 -pix_fmt yuv420p -preset veryfast -c:a aac "${output}"`;

    console.log("FFMPEG COMMAND:");
    console.log(command);

    exec(command, (error, stdout, stderr) => {

      if (error) {

        console.error("FFMPEG ERROR:", error);
        console.error(stderr);

        reject(error);
        return;

      }

      console.log("VIDEO CREATED:", videoName);

      resolve(videoName);

    });

  });

}