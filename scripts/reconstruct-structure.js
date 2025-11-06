// scripts/reconstruct-structure.js  (ESM)
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const resultsDir = path.join(__dirname, '..', 'mochawesome', 'results')
const videosRoot = path.join(__dirname, '..', 'mochawesome', 'videos')
const screenshotsRoot = path.join(__dirname, '..', 'mochawesome', 'screenshots')

function safeReaddir(p) {
  try { return fs.readdirSync(p) } catch (e) { return [] }
}
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

// Recurse suites tree to find the first fullFile value
function findFullFileFromSuite(node) {
  if (!node || typeof node !== 'object') return null
  if (node.fullFile) return node.fullFile
  if (Array.isArray(node.suites)) {
    for (const s of node.suites) {
      const found = findFullFileFromSuite(s)
      if (found) return found
    }
  }
  // sometimes tests are nested under 'tests' or other keys
  if (Array.isArray(node.tests)) {
    for (const t of node.tests) {
      if (t.fullFile) return t.fullFile
    }
  }
  return null
}

function extractFullFile(data) {
  if (!data) return null
  if (Array.isArray(data.results)) {
    for (const r of data.results) {
      const f = findFullFileFromSuite(r) || findFullFileFromSuite(r.suites?.[0])
      if (f) return f
    }
  }
  // fallback: top-level suites
  if (data.suites) {
    return findFullFileFromSuite(data)
  }
  return null
}

function moveVideoToSubfolder(specNameWithExt, subfolder) {
  // candidate locations:
  // 1) videosRoot/<specNameWithExt>.mp4
  // 2) videosRoot/**/<specNameWithExt>.mp4  (search recursively)
  const candidate = path.join(videosRoot, `${specNameWithExt}.mp4`)
  if (fs.existsSync(candidate)) {
    const dest = path.join(videosRoot, subfolder, `${specNameWithExt}.mp4`)
    ensureDir(path.dirname(dest))
    fs.renameSync(candidate, dest)
    console.log(`  ✓ Moved video: ${path.relative(videosRoot, candidate)} -> ${path.relative(videosRoot, dest)}`)
    return true
  }

  // recursive search for any mp4 that matches basenames
  const allMp4s = []
  (function walk(dir) {
    for (const entry of safeReaddir(dir)) {
      const p = path.join(dir, entry)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) walk(p)
      else if (stat.isFile() && entry.toLowerCase().endsWith('.mp4')) allMp4s.push(p)
    }
  })(videosRoot)

  const match = allMp4s.find(p => path.basename(p).toLowerCase() === `${specNameWithExt.toLowerCase()}.mp4`)
  if (match) {
    const dest = path.join(videosRoot, subfolder, `${specNameWithExt}.mp4`)
    ensureDir(path.dirname(dest))
    fs.renameSync(match, dest)
    console.log(`  ✓ Moved video (found recursively): ${path.relative(videosRoot, match)} -> ${path.relative(videosRoot, dest)}`)
    return true
  }

  // fallback: find any mp4 whose basename contains specNameWithoutExt
  const specNoExt = specNameWithExt.replace(path.extname(specNameWithExt), '')
  const fuzzy = allMp4s.find(p => path.basename(p).toLowerCase().includes(specNoExt.toLowerCase()))
  if (fuzzy) {
    const dest = path.join(videosRoot, subfolder, `${specNameWithExt}.mp4`)
    ensureDir(path.dirname(dest))
    fs.renameSync(fuzzy, dest)
    console.log(`  ✓ Moved video (fuzzy): ${path.relative(videosRoot, fuzzy)} -> ${path.relative(videosRoot, dest)}`)
    return true
  }

  console.warn(`  ⚠️ Video not found for ${specNameWithExt}`)
  return false
}

function moveScreenshotsToSubfolder(specNameWithExt, subfolder) {
  // typical: screenshotsRoot/<specNameWithExt> (a folder)
  const folderCandidate = path.join(screenshotsRoot, specNameWithExt)
  if (fs.existsSync(folderCandidate) && fs.statSync(folderCandidate).isDirectory()) {
    const dest = path.join(screenshotsRoot, subfolder, specNameWithExt)
    ensureDir(path.dirname(dest))
    fs.renameSync(folderCandidate, dest)
    console.log(`  ✓ Moved screenshots folder: ${path.relative(screenshotsRoot, folderCandidate)} -> ${path.relative(screenshotsRoot, dest)}`)
    return true
  }

  // recursive search for files that include the spec name
  const specNoExt = specNameWithExt.replace(path.extname(specNameWithExt), '')
  const moved = []
  (function walk(dir) {
    for (const entry of safeReaddir(dir)) {
      const p = path.join(dir, entry)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) walk(p)
      else if (stat.isFile()) {
        if (entry.toLowerCase().includes(specNoExt.toLowerCase())) {
          const rel = path.relative(screenshotsRoot, p)
          const dest = path.join(screenshotsRoot, subfolder, rel)
          ensureDir(path.dirname(dest))
          fs.renameSync(p, dest)
          moved.push({ from: rel, to: path.relative(screenshotsRoot, dest) })
        }
      }
    }
  })(screenshotsRoot)

  if (moved.length) {
    moved.forEach(m => console.log(`  ✓ Moved screenshot file: ${m.from} -> ${m.to}`))
    return true
  }

  console.log(`  (no screenshots found for ${specNameWithExt})`)
  return false
}

(function main() {
  console.log('Starting reconstruct-structure (ESM) ...')

  if (!fs.existsSync(resultsDir)) {
    console.error('Results dir missing:', resultsDir)
    process.exit(1)
  }

  const jsonFiles = safeReaddir(resultsDir).filter(f => f.endsWith('.json') && f !== 'merged.json')
  if (jsonFiles.length === 0) {
    console.log('No JSON result files found — nothing to do.')
    return
  }

  console.log(`Found ${jsonFiles.length} JSON result files.`)

  for (const jsonFile of jsonFiles) {
    try {
      const p = path.join(resultsDir, jsonFile)
      const raw = fs.readFileSync(p, 'utf8')
      const data = JSON.parse(raw)
      const fullFile = extractFullFile(data)
      if (!fullFile) {
        console.warn(`Skipping ${jsonFile} — could not find fullFile in JSON`)
        continue
      }

      const normalized = fullFile.replace(/\\/g, '/')
      const m = normalized.match(/cypress\/e2e\/([^/]+)\//) || normalized.match(/e2e\/([^/]+)\//)
      if (!m) {
        console.warn(`Skipping ${jsonFile} — could not extract subfolder from fullFile="${fullFile}"`)
        continue
      }
      const subfolder = m[1]
      const specName = path.basename(normalized) // e.g. viewLeadMessagesAsAdminPOM.cy.js

      console.log(`\nProcessing JSON: ${jsonFile}`)
      console.log(`  fullFile: ${fullFile}`)
      console.log(`  subfolder: ${subfolder}`)
      console.log(`  specName: ${specName}`)

      moveVideoToSubfolder(specName, subfolder)
      moveScreenshotsToSubfolder(specName, subfolder)
    } catch (err) {
      console.error('Error handling', jsonFile, err)
    }
  }

  console.log('\n✅ Structure reconstruction finished.\n')
})()
