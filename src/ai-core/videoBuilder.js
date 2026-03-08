import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";

/* =================================
   PATH SETUP
================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, "temp");

/* =================================
   ENSURE TEMP DIRECTORY EXISTS
================================= */

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/* =================================
   VIDEO BUILDER FUNCTION
================================= */

export function buildVideo(images) {

  const audioPath = path.join(tempDir, "voice.mp3");

  const videoName = `reel-${Date.now()}.mp4`;

  const outputPath = path.join(tempDir, videoName);

  const concatFile = path.join(tempDir, `concat-${Date.now()}.txt`);

  const sceneDuration = 10;

  /* =================================
     CREATE IMAGE VIDEO CLIPS
  ================================= */

  const clipPaths = [];

  images.forEach((img, index) => {

    const clip = path.join(tempDir, `clip_${index}.mp4`);

    clipPaths.push(clip);

  });

  /* =================================
     BUILD COMMANDS FOR EACH CLIP
  ================================= */

  const commands = clipPaths.map((clip, i) => {

    const img = images[i];

    return `"${ffmpegPath}" -y -loop 1 -i "${img}" -t ${sceneDuration} -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -pix_fmt yuv420p -c:v libx264 "${clip}"`;

  });

  /* =================================
     CREATE CONCAT FILE
  ================================= */

  const concatContent = clipPaths
    .map(p => `file '${p.replace(/\\/g, "/")}'`)
    .join("\n");

  fs.writeFileSync(concatFile, concatContent);

  /* =================================
     FINAL VIDEO COMMAND
  ================================= */

  const concatCommand =
    `"${ffmpegPath}" -y -f concat -safe 0 -i "${concatFile}" -i "${audioPath}" -c:v libx264 -c:a aac -shortest "${outputPath}"`;

  /* =================================
     RUN ALL COMMANDS
  ================================= */

  return new Promise((resolve, reject) => {

    const fullCommand = [...commands, concatCommand].join(" && ");

    console.log("Running FFmpeg pipeline:");
    console.log(fullCommand);

    exec(fullCommand, (error, stdout, stderr) => {

      if (error) {

        console.error("FFMPEG ERROR:");
        console.error(error);
        console.error(stderr);

        reject(error);
        return;

      }

      console.log("VIDEO CREATED:", videoName);

      resolve(videoName);

    });

  });

}