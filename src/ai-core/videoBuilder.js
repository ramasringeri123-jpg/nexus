import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =================================
   FFmpeg binary (works on Render)
================================= */

const ffmpeg = ffmpegPath;

/* =================================
   VIDEO BUILDER
================================= */

export function buildVideo(images) {

  const tempDir = path.join(__dirname, "temp");

  const audio = path.join(tempDir, "voice.mp3");

  const videoName = `reel-${Date.now()}.mp4`;

  const output = path.join(tempDir, videoName);

  const sceneDuration = 10; // seconds per scene

  /* ================================
     BUILD INPUT ARGUMENTS
  ================================= */

  let inputs = "";

  images.forEach((img) => {
    inputs += ` -loop 1 -t ${sceneDuration} -i "${img}"`;
  });

  inputs += ` -i "${audio}"`;

  /* ================================
     BUILD FILTER COMPLEX
  ================================= */

  let filters = "";

  images.forEach((img, i) => {

    filters +=
      `[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,` +
      `pad=1080:1920:(ow-iw)/2:(oh-ih)/2[v${i}];`;

  });

  const concatInputs = images.map((_, i) => `[v${i}]`).join("");

  filters += `${concatInputs}concat=n=${images.length}:v=1:a=0[v]`;

  const audioIndex = images.length;

  /* ================================
     FINAL COMMAND
  ================================= */

  const command =
    `"${ffmpeg}" -y ${inputs} ` +
    `-filter_complex "${filters}" ` +
    `-map "[v]" -map ${audioIndex}:a ` +
    `-shortest ` +
    `-c:v libx264 -pix_fmt yuv420p -preset veryfast ` +
    `-c:a aac ` +
    `"${output}"`;

  console.log("FFMPEG COMMAND:", command);

  /* ================================
     EXECUTE FFMPEG
  ================================= */

  return new Promise((resolve, reject) => {

    exec(command, (err, stdout, stderr) => {

      if (err) {

        console.error("FFMPEG ERROR:", err);
        console.error(stderr);

        reject(err);
        return;

      }

      console.log("VIDEO CREATED:", videoName);

      resolve(videoName);

    });

  });

}