import { defineConfig } from 'cypress'
import plugins from "./cypress/support/plugins.js"
import tasks from "./cypress/support/tasks.js"
import esbuildPreprocessor from "./cypress/support/esbuild-preprocessor.js"
import 'dotenv/config' 

export default defineConfig({
  e2e: {
    async setupNodeEvents(cypressOn, config) {
      const { default: onFix } = await import('cypress-on-fix')
      const on = onFix(cypressOn)
      esbuildPreprocessor(on)
      tasks(on)
      const pluginsConfig = await plugins(on, config)
      return {
        ...config,
        ...pluginsConfig,}
    },
    baseUrl: "https://automationintesting.online/",
    reporter: 'mochawesome',
    reporterOptions: {
      useInlineDiffs: true,
      embeddedScreenshots: true,
      reportDir: 'cypress/results',
      reportFilename: '[name].html',
      overwrite: true,
      html: true,
      json: true,
    },
    experimentalRunAllSpecs: true,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    env: {
      BASE_URL_API: "https://automationintesting.online/api/",
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: process.env.CYPRESS_ADMIN_PASSWORD
    }
  },
})
