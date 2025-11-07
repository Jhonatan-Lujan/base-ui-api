// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'
import 'cypress-plugin-api'
import addContext from 'mochawesome/addContext'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
	// failing the test
  return false
})

const titleToFileName = (title) => {
  return title
    .replace(/[:\/\\]/g, '')
    .replace(/[<>:"|?*]/g, '')
    .trim()
}

/**
  * Gets the correct path based on how Cypress ACTUALLY stores assets.
  * 
  * Cypress.spec.relative can be:
  * - “cypress/e2e/customerWeb/test.cy.js” (in the hook)
  *
  * But Cypress saves it in:
  * - cypress/videos/customerWeb/test.cy.js.mp4 (removes “cypress/e2e/”)
  *
  * We need to remove BOTH prefixes.
*/
const getAssetPath = () => {
  let specPath = Cypress.spec.relative
  
  if (specPath.startsWith('cypress/')) {
    specPath = specPath.substring(8)
  }
  
  if (specPath.startsWith('e2e/')) {
    specPath = specPath.substring(4)
  }
  
  return specPath
}

Cypress.on('test:after:run', (test, runnable) => {
  const specPath = getAssetPath()
  
  if (test.state === 'failed') {
    let parent = runnable.parent
    let filename = ''
    
    while (parent && parent.title) {
      filename = `${titleToFileName(parent.title)} -- ${filename}`
      parent = parent.parent
    }
    filename += `${titleToFileName(test.title)} (failed).png`
    
    addContext({ test }, `../screenshots/${specPath}/${filename}`)
  }
  
  addContext({ test }, `../videos/${specPath}.mp4`)
})
