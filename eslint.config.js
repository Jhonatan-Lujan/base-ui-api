// eslint.config.js
import cypress from 'eslint-plugin-cypress'

export default [
	{
		ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**', '.nyc_output/**', '*', '!cypress/**'],
	},

	// Cypress
	{
		files: ['cypress/**/*.{js,ts,jsx,tsx}'],
		plugins: {
			cypress,
		},
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				cy: 'readonly',
				Cypress: 'readonly',
				expect: 'readonly',
				assert: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				before: 'readonly',
				after: 'readonly',
				describe: 'readonly',
				context: 'readonly',
				it: 'readonly',
				specify: 'readonly',
			},
		},
		rules: {
			...cypress.configs.recommended.rules,
			'cypress/no-unnecessary-waiting': 'error',
			'cypress/no-pause': 'warn',
			'cypress/no-debug': 'warn',
			'cypress/assertion-before-screenshot': 'warn',
			'cypress/require-data-selectors': 'off',
			'cypress/no-async-tests': 'error',
			'cypress/no-async-before': 'error',
			'cypress/unsafe-to-chain-command': 'error',
			'cypress/no-force': 'warn',
			'cypress/no-assigning-return-values': 'error',
		},
	},
]
