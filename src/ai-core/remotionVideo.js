import { renderMedia } from "@remotion/renderer";
import path from "path";

export async function buildVideo() {

  const entry = path.resolve("./src/ai-core/remotionEntry.jsx");

  const output = path.resolve("./src/ai-core/temp/reel.mp4");

  await renderMedia({
    composition: "StudyReel",
    serveUrl: entry,
    codec: "h264",
    outputLocation: output,
  });

  console.log("Video with audio created:", output);

  return output;
}