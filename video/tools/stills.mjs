// Render stills at given times (seconds) into a folder: node tools/stills.mjs out/stills 0.5 1.2 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [outDir, ...times] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const browserExecutable =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Video01", browserExecutable });
for (const s of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
  await renderStill({
    serveUrl,
    composition,
    frame,
    output: path.join(outDir, `t${Number(s).toFixed(2).padStart(6, "0")}.jpg`),
    imageFormat: "jpeg",
    jpegQuality: 85,
    browserExecutable,
    scale: 0.5,
  });
  process.stdout.write(".");
}
console.log(" done");
