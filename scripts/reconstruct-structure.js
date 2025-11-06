import fs from "fs";
import path from "path";

const resultsDir = "mochawesome/results";
const videosDir = "mochawesome/videos";
const screenshotsDir = "mochawesome/screenshots";

for (const file of fs.readdirSync(resultsDir)) {
  if (!file.endsWith(".json") || file === "merged.json") continue;

  const json = JSON.parse(fs.readFileSync(path.join(resultsDir, file), "utf8"));
  const result = json.results?.[0]?.suites?.[0];
  if (!result?.fullFile) continue;

  const fullFile = result.fullFile; // cypress/e2e/customerWeb/viewLeadMessagesAsAdmin.cy.js
  const subfolder = fullFile.match(/e2e\/([^\/]+)\//)?.[1];
  const specName = path.basename(fullFile);

  if (!subfolder) continue;
  console.log(`→ ${specName} => ${subfolder}`);

  // VIDEO
  const videoSrc = path.join(videosDir, `${specName}.mp4`);
  const videoDestDir = path.join(videosDir, subfolder);
  if (fs.existsSync(videoSrc)) {
    fs.mkdirSync(videoDestDir, { recursive: true });
    fs.renameSync(videoSrc, path.join(videoDestDir, `${specName}.mp4`));
  }

  // SCREENSHOTS (only if exist)
  const screenshotSrc = path.join(screenshotsDir, specName);
  const screenshotDestDir = path.join(screenshotsDir, subfolder);
  if (fs.existsSync(screenshotSrc)) {
    fs.mkdirSync(screenshotDestDir, { recursive: true });
    fs.renameSync(screenshotSrc, path.join(screenshotDestDir, specName));
  }
}

console.log("\n✅ Structure normalization DONE");
