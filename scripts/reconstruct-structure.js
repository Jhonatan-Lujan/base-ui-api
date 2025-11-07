// Robust but concise. Recursively searches fullFile and moves videos/screenshots.
// - Does not assume fullFile is in a fixed position
// - Checks for existence before operating
// - Avoids overwriting: if dest exists, adds an incremental suffix

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const resultsDir = path.join(__dirname, '..', 'mochawesome', 'results')
const videosRoot = path.join(__dirname, '..', 'mochawesome', 'videos')
const screenshotsRoot = path.join(__dirname, '..', 'mochawesome', 'screenshots')

const safeReaddir = dir => {
  try { return fs.readdirSync(dir) } catch { return [] }
}
const ensureDir = dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }

// findFullFile: traverses objects/suites/tests to locate first fullFile
function findFullFile(node) {
  if (!node || typeof node !== 'object') return null
  if (typeof node.fullFile === 'string' && node.fullFile) return node.fullFile

  // iterate through common arrays and objects
  for (const key of ['suites', 'tests', 'root', 'suites']) {
    if (Array.isArray(node[key])) {
      for (const child of node[key]) {
        const found = findFullFile(child)
        if (found) return found
      }
    }
  }
  // also iterate through generic properties in case the structure differs
  for (const [k, v] of Object.entries(node)) {
    if (v && typeof v === 'object') {
      const f = findFullFile(v)
      if (f) return f
    }
  }
  return null
}

// ---- move helpers ----
function safeMove(src, dest) {
  if (!fs.existsSync(src)) return false
  ensureDir(path.dirname(dest))
  // if dest exists, create new dest with incremental suffix
  if (fs.existsSync(dest)) {
    const ext = path.extname(dest)
    const base = dest.slice(0, -ext.length)
    let i = 1
    let candidate
    do {
      candidate = `${base}(${i})${ext}`
      i++
    } while (fs.existsSync(candidate))
    fs.renameSync(src, candidate)
    console.log(`   ↳ moved (renamed to avoid overwrite): ${path.relative('.', candidate)}`)
    return true
  } else {
    fs.renameSync(src, dest)
    console.log(`   ↳ moved: ${path.relative('.', dest)}`)
    return true
  }
}

function findMp4ByName(root, filename) {
  // try direct route
  const candidate = path.join(root, filename)
  if (fs.existsSync(candidate)) return candidate
  // fast recursive search (first exact match)
  const found = []
  (function walk(dir) {
    for (const e of safeReaddir(dir)) {
      const p = path.join(dir, e)
      try {
        const st = fs.statSync(p)
        if (st.isDirectory()) walk(p)
        else if (st.isFile() && e.toLowerCase() === path.basename(filename).toLowerCase()) found.push(p)
      } catch (err) { /* ignore permission errors */ }
    }
  })(root)
  return found.length ? found[0] : null
}

// ---- main ----
(function main() {
  console.log('Reconstruct structure - start')

  if (!fs.existsSync(resultsDir)) {
    console.error('Results dir missing:', resultsDir)
    process.exit(1)
  }

  const jsonFiles = safeReaddir(resultsDir).filter(f => f.endsWith('.json') && f !== 'merged.json')
  if (jsonFiles.length === 0) {
    console.log('No JSONs found, nothing to do.')
    return
  }

  for (const jf of jsonFiles) {
    const p = path.join(resultsDir, jf)
    try {
      const raw = fs.readFileSync(p, 'utf8')
      const data = JSON.parse(raw)

      const fullFile = findFullFile(data)
      if (!fullFile) {
        console.warn(`- ${jf}: fullFile not found — skipping`)
        continue
      }

      const normalized = fullFile.replace(/\\/g, '/')
      const submatch = normalized.match(/cypress\/e2e\/([^/]+)\//) || normalized.match(/e2e\/([^/]+)\//)
      if (!submatch) {
        console.warn(`- ${jf}: can't extract subfolder from "${normalized}" — skipping`)
        continue
      }
      const subfolder = submatch[1]
      const specName = path.basename(normalized) // e.g. viewLeadMessagesAsAdminPOM.cy.js
      console.log(`- ${jf}: spec=${specName} subfolder=${subfolder}`)

      // VIDEO: look for "<specName>.mp4" under videosRoot (direct or recursive)
      const videoFilename = `${specName}.mp4`
      const foundVideo = findMp4ByName(videosRoot, videoFilename)
      if (foundVideo) {
        const dest = path.join(videosRoot, subfolder, videoFilename)
        safeMove(foundVideo, dest)
      } else {
        console.log(`   (no video found for ${specName})`)
      }

      // SCREENSHOTS: common case is folder screenshotsRoot/<specName>
      const screenshotsFolder = path.join(screenshotsRoot, specName)
      if (fs.existsSync(screenshotsFolder) && fs.statSync(screenshotsFolder).isDirectory()) {
        const dest = path.join(screenshotsRoot, subfolder, specName)
        safeMove(screenshotsFolder, dest)
      } else {
        // fallback: search for files containing spec basename (do not throw error)
        const specNoExt = specName.replace(path.extname(specName), '').toLowerCase()
        let movedAny = false
        (function walk(dir) {
          for (const e of safeReaddir(dir)) {
            const p = path.join(dir, e)
            let st
            try { st = fs.statSync(p) } catch { continue }
            if (st.isDirectory()) {
              walk(p)
            } else if (st.isFile()) {
              if (e.toLowerCase().includes(specNoExt)) {
                const rel = path.relative(screenshotsRoot, p)
                const dest = path.join(screenshotsRoot, subfolder, rel)
                ensureDir(path.dirname(dest))
                try {
                  fs.renameSync(p, dest)
                  console.log(`   ↳ moved screenshot file: ${rel} -> ${path.relative(screenshotsRoot, dest)}`)
                  movedAny = true
                } catch (err) {
                  console.warn('   ↳ failed move screenshot file', rel, err.message)
                }
              }
            }
          }
        })(screenshotsRoot)
        if (!movedAny) console.log('   (no screenshots found)')
      }

    } catch (err) {
      console.error('Error handling', jf, err && err.message ? err.message : err)
    }
  }

  console.log('Reconstruct structure - done')
})()
