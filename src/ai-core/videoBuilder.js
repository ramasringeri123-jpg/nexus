import { exec } from "child_process";
import path from "path";
import fs from "fs";
import ffmpegStatic from "ffmpeg-static";
import { fileURLToPath } from "url";

/* PATH SETUP */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

/* FIND FFMPEG */

function getFFmpeg() {

  if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
    console.log("Using ffmpeg-static:", ffmpegStatic);
    return `"${ffmpegStatic}"`;
  }

  console.log("Fallback to system ffmpeg");

  return "ffmpeg";
}

/* VIDEO BUILDER */

export function buildVideo(images) {

  return new Promise((resolve, reject) => {

    try {

      const ffmpeg = getFFmpeg();

      const audio = path.join(tempDir, "voice.mp3");

      const videoName = `reel-${Date.now()}.mp4`;

      const output = path.join(tempDir, videoName);

      const sceneDuration = 6;   // 6 seconds per scene → ~36s total

      /* INPUTS */

      let inputs = "";

      images.forEach((img) => {

        inputs += ` -loop 1 -t ${sceneDuration} -i "${img}"`;

      });

      inputs += ` -i "${audio}"`;

      /* FILTERS */

      let filters = "";

      images.forEach((img, i) => {

        filters +=
          `[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,` +
          `pad=1080:1920:(ow-iw)/2:(oh-ih)/2[v${i}];`;

      });

      const concatInputs = images.map((_, i) => `[v${i}]`).join("");

      filters += `${concatInputs}concat=n=${images.length}:v=1:a=0[v]`;

      const audioIndex = images.length;

      /* COMMAND */

      const command =
        `${ffmpeg} -y ${inputs} ` +
        `-filter_complex "${filters}" ` +
        `-map "[v]" -map ${audioIndex}:a ` +
        `-shortest -preset ultrafast ` +
        `-c:v libx264 -pix_fmt yuv420p -c:a aac "${output}"`;

      console.log("FFMPEG COMMAND:");
      console.log(command);

      exec(command, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {

        if (error) {

          console.error("FFMPEG ERROR:", error);
          console.error(stderr);

          reject(error);
          return;

        }

        console.log("VIDEO CREATED:", videoName);

        resolve(videoName);

      });

    } catch (err) {

      console.error("VIDEO BUILDER ERROR:", err);

      reject(err);

    }

  });

}