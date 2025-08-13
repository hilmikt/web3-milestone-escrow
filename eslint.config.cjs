// eslint.config.cjs
const js = require('@eslint/js');
const pluginImport = require('eslint-plugin-import');

module.exports = [
  {
    files: ['**/*.{js,cjs,mjs}'],
    ignores: [
      'artifacts/**',
      'cache/**',
      'coverage/**',
      'node_modules/**',
      'frontend/.next/**'
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs'
    },
    plugins: {
      import: pluginImport
    },
    rules: {
      ...js.configs.recommended.rules,
      'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
];
