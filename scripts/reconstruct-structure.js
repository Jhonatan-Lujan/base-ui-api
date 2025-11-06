import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const resultsDir = path.join(__dirname, '..', 'mochawesome/results')
const videosDir = path.join(__dirname, '..', 'mochawesome/videos')
const screenshotsDir = path.join(__dirname, '..', 'mochawesome/screenshots')

// Obtener todos los reportes JSON excepto merged.json
const jsonFiles = fs.readdirSync(resultsDir).filter(file =>
  file.endsWith('.json') && file !== 'merged.json'
)

for (const jsonFile of jsonFiles) {
  const jsonPath = path.join(resultsDir, jsonFile)
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))

  // Mochawesome → results → suites → fullFile
  const result = data.results?.[0]
  const suite = result?.suites?.[0]
  const fullFile = suite?.fullFile

  if (!fullFile) continue

  // Ej: cypress/e2e/customerWeb/test.cy.js → customerWeb
  const match = fullFile.replace(/\\/g, '/').match(/cypress\/e2e\/([^/]+)\//)
  if (!match) continue

  const subfolder = match[1]
  const specName = path.basename(fullFile)             // test.cy.js
  const specVideo = `${specName}.mp4`                  // test.cy.js.mp4
  const videoSrc = path.join(videosDir, specVideo)
  const screenshotsSrc = path.join(screenshotsDir, specName)

  const videoDestDir = path.join(videosDir, subfolder)
  const screenshotsDestDir = path.join(screenshotsDir, subfolder)

  fs.mkdirSync(videoDestDir, { recursive: true })
  fs.mkdirSync(screenshotsDestDir, { recursive: true })

  // Mover video
  if (fs.existsSync(videoSrc)) {
    fs.renameSync(videoSrc, path.join(videoDestDir, specVideo))
    console.log(`🎥 Moved: ${specVideo} → ${subfolder}/`)
  }

  // Mover screenshots
  if (fs.existsSync(screenshotsSrc)) {
    fs.renameSync(screenshotsSrc, path.join(screenshotsDestDir, specName))
    console.log(`📸 Moved screenshots of ${specName} → ${subfolder}/`)
  }
}

console.log('\n✅ Structure reconstructed cleanly.\n')
