// scripts/reconstruct-structure.js
const fs = require('fs');
const path = require('path');

const resultsDir = 'mochawesome/results';
const videosDir = 'mochawesome/videos';
const screenshotsDir = 'mochawesome/screenshots';

// Leer todos los JSONs
const jsonFiles = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json') && f !== 'merged.json');

jsonFiles.forEach(jsonFile => {
  const data = JSON.parse(fs.readFileSync(path.join(resultsDir, jsonFile), 'utf8'));
  
  // Extraer el path del spec desde el JSON
  const results = data.results || [];
  if (results.length === 0) return;
  
  const suite = results[0].suites[0];
  if (!suite || !suite.fullFile) return;
  
  // Ejemplo: "cypress/e2e/customerWeb/viewLeadMessagesAsAdmin.cy.js"
  const fullFile = suite.fullFile;
  
  // Extraer la subcarpeta (customerWeb o apiTests)
  const match = fullFile.match(/cypress\/e2e\/([^\/]+)\//);
  if (!match) return;
  
  const subfolder = match[1]; // "customerWeb" o "apiTests"
  const specName = path.basename(fullFile); // "viewLeadMessagesAsAdmin.cy.js"
  
  console.log(`Processing ${specName} → ${subfolder}/`);
  
  // Mover video
  const videoSrc = path.join(videosDir, `${specName}.mp4`);
  if (fs.existsSync(videoSrc)) {
    const videoDest = path.join(videosDir, subfolder);
    fs.mkdirSync(videoDest, { recursive: true });
    fs.renameSync(videoSrc, path.join(videoDest, `${specName}.mp4`));
    console.log(`  ✓ Video moved to ${subfolder}/`);
  }
  
  // Mover screenshots
  const screenshotSrc = path.join(screenshotsDir, specName);
  if (fs.existsSync(screenshotSrc)) {
    const screenshotDest = path.join(screenshotsDir, subfolder);
    fs.mkdirSync(screenshotDest, { recursive: true });
    fs.renameSync(screenshotSrc, path.join(screenshotDest, specName));
    console.log(`  ✓ Screenshots moved to ${subfolder}/`);
  }
});

console.log('\n✅ Structure reconstructed successfully');