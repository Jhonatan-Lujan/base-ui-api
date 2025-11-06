// scripts/reconstruct-structure.cjs
const fs = require('fs');
const path = require('path');

const resultsDir = path.resolve('mochawesome/results');
const videosRoot = path.resolve('mochawesome/videos');
const screenshotsRoot = path.resolve('mochawesome/screenshots');

function safeReaddir(p) {
  try { return fs.readdirSync(p); } catch (e) { return []; }
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// Recursively search suite tree for a fullFile value
function findFullFileFromSuite(node) {
  if (!node) return null;
  if (node.fullFile) return node.fullFile;
  if (Array.isArray(node.suites)) {
    for (const s of node.suites) {
      const found = findFullFileFromSuite(s);
      if (found) return found;
    }
  }
  return null;
}

// Find first sensible fullFile in a mochawesome JSON
function extractFullFile(data) {
  if (!data) return null;
  if (Array.isArray(data.results)) {
    for (const r of data.results) {
      // try r.suites, fallback deeper
      if (r.suites && r.suites.length) {
        const f = findFullFileFromSuite(r);
        if (f) return f;
      }
    }
  }
  // Some reporters may place suites at top-level:
  if (data.suites) {
    return findFullFileFromSuite(data);
  }
  return null;
}

// Derive subfolder from fullFile: prefer `cypress/e2e/<subfolder>/...`
function getSubfolderFromFullFile(fullFile) {
  if (!fullFile) return null;
  // Normalize slashes
  const normalized = fullFile.replace(/\\/g, '/');
  // Try common patterns
  let m = normalized.match(/cypress\/e2e\/([^\/]+)\//);
  if (m) return m[1];
  m = normalized.match(/e2e\/([^\/]+)\//);
  if (m) return m[1];
  m = normalized.match(/cypress\/([^\/]+)\//);
  if (m) return m[1];
  // fallback: parent folder of the spec file
  const parts = normalized.split('/');
  if (parts.length >= 2) return parts[parts.length - 2];
  return null;
}

function listAllMp4s(root) {
  const results = [];
  function walk(dir) {
    for (const entry of safeReaddir(dir)) {
      const p = path.join(dir, entry);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) walk(p);
      else if (stat.isFile() && entry.toLowerCase().endsWith('.mp4')) results.push(p);
    }
  }
  if (fs.existsSync(root)) walk(root);
  return results;
}

function findBestVideoMatch(mp4Files, specNameNoExt, specNameWithExt) {
  // priority:
  // 1) filename exactly equals specNameWithExt + '.mp4' OR specNameNoExt + '.mp4'
  // 2) filename includes specNameNoExt
  // 3) if only one mp4 in root (not in subfolders considered separately), use it
  // returns absolute path or null
  const lower = (s) => path.basename(s).toLowerCase();

  // exact matches
  let exact = mp4Files.find(f => lower(f) === `${specNameWithExt.toLowerCase()}.mp4`);
  if (exact) return exact;
  exact = mp4Files.find(f => lower(f) === `${specNameNoExt.toLowerCase()}.mp4`);
  if (exact) return exact;

  // includes
  const includes = mp4Files.find(f => lower(f).includes(specNameNoExt.toLowerCase()));
  if (includes) return includes;

  // fallback if only one mp4 total
  if (mp4Files.length === 1) return mp4Files[0];

  return null;
}

function moveFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.renameSync(src, dest);
}

function moveScreenshotsForSpec(subfolder, specName, specNameNoExt) {
  // screenshots might be saved as a folder named exactly spec file, or files named with spec base
  const candidates = [
    path.join(screenshotsRoot, specName),
    path.join(screenshotsRoot, specNameNoExt),
    path.join(screenshotsRoot, specName + ' (failed)'),
  ];
  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      const dest = path.join(screenshotsRoot, subfolder, path.basename(cand));
      ensureDir(path.dirname(dest));
      fs.renameSync(cand, dest);
      console.log(`  ✓ Screenshots moved: ${cand} -> ${dest}`);
      return true;
    }
  }

  // fallback: move any screenshots files that include the specNameNoExt in their filename (search recursively)
  function walkAndMove(dir) {
    for (const entry of safeReaddir(dir)) {
      const p = path.join(dir, entry);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) walkAndMove(p);
      else if (stat.isFile()) {
        if (entry.toLowerCase().includes(specNameNoExt.toLowerCase())) {
          const rel = path.relative(screenshotsRoot, p);
          const dest = path.join(screenshotsRoot, subfolder, rel);
          ensureDir(path.dirname(dest));
          fs.renameSync(p, dest);
          console.log(`  ✓ Screenshot file moved: ${p} -> ${dest}`);
        }
      }
    }
  }
  walkAndMove(screenshotsRoot);
  return false;
}

(function main() {
  console.log('Starting reconstruct-structure...');
  if (!fs.existsSync(resultsDir)) {
    console.error('Results dir not found:', resultsDir);
    process.exit(1);
  }

  const jsonFiles = safeReaddir(resultsDir).filter(f => f.endsWith('.json') && f !== 'merged.json');
  if (jsonFiles.length === 0) {
    console.log('No JSON results found, nothing to do.');
    return;
  }

  // pre-list all mp4s for faster matching
  let allMp4s = listAllMp4s(videosRoot);
  console.log(`Found ${allMp4s.length} mp4 files under ${videosRoot}`);

  for (const jsonFile of jsonFiles) {
    try {
      const filePath = path.join(resultsDir, jsonFile);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const fullFile = extractFullFile(data);
      if (!fullFile) {
        console.log(`Skipping ${jsonFile} — couldn't find fullFile`);
        continue;
      }

      const subfolder = getSubfolderFromFullFile(fullFile) || 'unknown';
      const specNameWithExt = path.basename(fullFile); // e.g. viewLeadMessagesAsAdmin.cy.js
      const specNameNoExt = specNameWithExt.replace(path.extname(specNameWithExt), '');

      console.log(`Processing ${jsonFile} -> spec ${specNameWithExt} -> subfolder ${subfolder}`);

      // Look for the video:
      // search among all mp4s for a best match
      allMp4s = listAllMp4s(videosRoot); // refresh in case previous iterations moved files
      const best = findBestVideoMatch(allMp4s, specNameNoExt, specNameWithExt);

      if (best) {
        const dest = path.join(videosRoot, subfolder, `${specNameWithExt}.mp4`);
        ensureDir(path.dirname(dest));
        fs.renameSync(best, dest);
        console.log(`  ✓ Moved video: ${path.relative(videosRoot, best)} -> ${path.relative(videosRoot, dest)}`);
      } else {
        console.warn(`  ⚠️ No matching mp4 found for ${specNameWithExt}. Skipping video move.`);
      }

      // Move screenshots
      const movedScreens = moveScreenshotsForSpec(subfolder, specNameWithExt, specNameNoExt);
      if (!movedScreens) {
        console.log(`  (no screenshots found for ${specNameWithExt})`);
      }
    } catch (err) {
      console.error('Error processing', jsonFile, err);
    }
  }

  console.log('\n✅ Structure reconstructed successfully');
})()
