# 🚀 Cypress Test Automation Framework

A comprehensive test automation framework built with **Cypress**, implementing best practices for E2E and API testing. This project demonstrates modern testing architectures with **Page Object Model (POM)**, **Builder Pattern**, **API Service Layer** and optimized configurations for parallel execution.

## 📋 Key Features

### 🎯 **Hybrid Architecture**
- **Native API Testing**: Using `cy.api()` for REST service testing
- **E2E with POM**: Page Object Model for maintainable UI testing
- **API Abstraction Layer**: Services organized by endpoints
- **Builders & Helpers**: Patterns for test data generation

### ⚡ **Technologies & Optimizations**
- **ESBuild Preprocessor**: Ultra-fast test file compilation
- **Biome + ESLint**: Code linting and formatting with modern standards
- **Faker.js**: Random data generation for tests
- **JSON Schema Validation**: API contract validation
- **Parallel Execution**: Execution time optimization with cypress-split

### 📊 **Reporting & Monitoring**
- **Mochawesome Reports**: Detailed HTML reports with screenshots
- **Network Idle Detection**: UI wait optimization
- **Schema Validation**: Automatic API response validation

## 🏗️ Project Architecture

```
cypress/
├── apiTests/                          # Pure API tests
│   ├── createRoom.cy.js              # Native API testing
│   └── createRoomAS.cy.js            # API testing with services
├── e2e/                              # End-to-End tests
│   └── customerWeb/
│       ├── viewLeadMessagesAsAdmin.cy.js     # Native E2E
│       └── viewLeadMessagesAsAdminPOM.cy.js  # E2E with POM
├── schemas/                          # JSON schemas for validation
│   └── room/
│       └── room.json
├── src/
│   ├── api/                         # API service layer
│   │   ├── core.js                 # Base API class
│   │   ├── auth/
│   │   │   └── auth.js            # Authentication service
│   │   └── room/
│   │       └── room.js            # Room service
│   └── pageObjects/                # Page Object Models
│       ├── InternalWeb/
│       │   ├── loginPage.js       # Admin login POM
│       │   └── menu.js            # Admin menu POM
│       └── customerWeb/
│           ├── landingPage.js     # Landing page POM
│           └── menu.js            # Customer menu POM
└── support/
    ├── utils/
    │   ├── roomDataBuilder.js     # Room data builder
    │   └── roomHelper.js          # Room operation helpers
    └── token.js                   # Authentication token management
```

## 🚀 Installation and Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone https://github.com/Jhonatan-Lujan/base-ui-api.git
cd base-ui-api
npm install
```

### Environment Variables
Create `.env` file in project root:
```env
CYPRESS_ADMIN_PASSWORD=password
```

## 🎮 Available Commands

### Test Execution
```bash
# Open Cypress in interactive mode
npm run cypress:open

# Run all tests in headless mode
npm run cypress:run

# Generate reports
npm run report:merge
npm run report:generate
```

### Code Quality & Linting
```bash
# Check code with Biome and ESLint
npm run lint

# Auto-fix issues
npm run lint:fix

# Specific linting
npm run lint:biome
npm run lint:cypress
```

### Utilities
```bash
# Check for .only in tests
npm run stop-only
```

## 📋 Test Examples & Implementations

### API Testing Approaches
- **Native Approach**: [`createRoom.cy.js`](cypress/apiTests/createRoom.cy.js) - Direct `cy.api()` usage
- **Service Layer**: [`createRoomAS.cy.js`](cypress/apiTests/createRoomAS.cy.js) - Abstracted API services with builders

### E2E Testing Patterns
- **Direct Implementation**: [`viewLeadMessagesAsAdmin.cy.js`](cypress/e2e/customerWeb/viewLeadMessagesAsAdmin.cy.js) - Straightforward element interaction
- **Page Object Model**: [`viewLeadMessagesAsAdminPOM.cy.js`](cypress/e2e/customerWeb/viewLeadMessagesAsAdminPOM.cy.js) - Structured POM approach

## 🏛️ Design Patterns Implemented

### 1. **API Service Layer Pattern**
- **Base Class**: [`core.js`](cypress/src/api/core.js) - Foundation for all API services
- **Authentication**: [`auth.js`](cypress/src/api/auth/auth.js) - Centralized auth management
- **Room Service**: [`room.js`](cypress/src/api/room/room.js) - CRUD operations abstraction

### 2. **Builder Pattern**
- **Data Builder**: [`roomDataBuilder.js`](cypress/support/utils/roomDataBuilder.js) - Dynamic test data generation
- **Helper Utilities**: [`roomHelper.js`](cypress/support/utils/roomHelper.js) - Complex operation abstractions

### 3. **Page Object Model**
- **Login POM**: [`loginPage.js`](cypress/src/pageObjects/InternalWeb/loginPage.js) - Admin authentication
- **Landing POM**: [`landingPage.js`](cypress/src/pageObjects/customerWeb/landingPage.js) - Customer interactions
- **Menu POMs**: Navigation abstractions for different user roles

## ⚙️ Advanced Configurations

### ESBuild Preprocessor
Fast compilation with modern JavaScript support, configured in [`cypress.config.mjs`](cypress.config.mjs)

### Biome Configuration
Modern linting and formatting with [`biome.json`](biome.json):
- Tab indentation with 120 character line width
- Recommended rules with Cypress-specific overrides
- Automatic import organization

### Schema Validation
JSON schema validation for API responses using [`room.json`](cypress/schemas/room/room.json)

### Token Management
Centralized authentication token handling via [`token.js`](cypress/support/token.js)

## 📊 Quality Features

### ✅ **Best Practices Implemented**
- **Separation of Concerns**: APIs, POM, Helpers are separate
- **Code Reusability**: Base classes and builders
- **Token Management**: Centralized authentication handling
- **Dynamic Data**: Faker.js for unique data in each execution
- **Schema Validation**: Guaranteed API contracts
- **Smart Waits**: Network idle detection

### 🔧 **Development Configurations**
- **Hot Reload**: Instant changes with ESBuild
- **Dual Linting**: Biome for formatting + ESLint for Cypress
- **Visual Reports**: Automatic screenshots and videos
- **Parallel Execution**: Optimized execution times with cypress-split

## 🚦 CI/CD Integration

The framework is ready for continuous integration with **cypress-split** for parallel execution:

```yaml
# .github/workflows/e2e.yml
name: e2e tests
on: [push]
jobs:
  test:
    uses: ./.github/workflows/split-local.yml
    secrets:
      ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
    with:
      nE2E: 2                    # Number of parallel machines
      marge: true               # Merge reports
      browser: chrome
      before-run: npm run stop-only
      publish-summary: true
      split-file: timings.json  # Optimal test distribution
```

### Parallel Execution Benefits
- **cypress-split** by Gleb Bahmutov for intelligent test distribution
- Dynamic load balancing based on previous execution times
- Optimal resource utilization across CI runners

## 🎯 Demonstrated Use Cases

1. **Authentication & Session Management**
2. **CRUD Operations via API**
3. **JSON Schema Validation**
4. **Complex E2E Flows**
5. **Test Data Generation**
6. **UI + API Testing Integration**

## 📈 Framework Benefits

- **⚡ Speed**: ESBuild reduces compilation time by 80%
- **🧪 Maintainability**: POM and services facilitate updates
- **🔍 Traceability**: Detailed reports with visual evidence
- **🚀 Scalability**: Architecture ready for growth
- **📋 Quality**: Automatic linting and validations
- **🔄 Parallel Execution**: Optimal resource utilization with cypress-split

## 🤝 Professional Approach

This project represents a professional approach to test automation, combining multiple patterns and modern technologies to create a robust, maintainable, and scalable framework suitable for enterprise environments.

---

**Developed by:** Jhonatan Lujan  
**Technologies:** Cypress, ESBuild, Biome, ESLint, Faker.js, Mochawesome
**Patterns:** POM, Builder, Service Layer, Helper Pattern
