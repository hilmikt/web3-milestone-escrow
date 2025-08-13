// eslint.config.cjs
const js = require('@eslint/js');
const pluginImport = require('eslint-plugin-import');
const globals = require('globals');

module.exports = [
  // default for all JS
  {
    files: ['**/*.{js,cjs,mjs}'],
    ignores: [
      'artifacts/**',
      'cache/**',
      'coverage/**',
      'node_modules/**',
      'frontend/.next/**',
      '**/ignition/**'
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node // console, process, etc.
      }
    },
    plugins: {
      import: pluginImport
    },
    rules: {
      ...js.configs.recommended.rules,
      'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },

  // tests: Mocha + Hardhat runtime
  {
    files: ['**/{test,tests,__tests__}/**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.mocha,   // describe, it, beforeEach, etc.
        ethers: 'readonly'  // hardhat runtime
      }
    }
  },

  // hardhat scripts (deploy, tasks, etc.)
  {
    files: ['**/scripts/**/*.{js,cjs,mjs}', '**/contracts/scripts/**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ethers: 'readonly'
      }
    }
  }
];
