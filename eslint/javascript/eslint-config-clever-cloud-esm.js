import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default {
  name: 'eslint-config-clever-cloud-esm',
  files: ['**/*.js', '**/*.mjs'],
  linterOptions: {
    reportUnusedDisableDirectives: 'warn',
  },
  languageOptions: {
    globals: {
      ...globals.browser,
    },
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        impliedStrict: true,
      },
    },
  },
  plugins: {
    import: importPlugin,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...importPlugin.flatConfigs.recommended.rules,
    'accessor-pairs': 'off',
    eqeqeq: ['error', 'always', { null: 'never' }],
    camelcase: ['error', { allow: ['_lp$'] }],
    curly: ['error', 'all'],
    'no-new': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }],
    // import plugin
    // some rules are disabled because TypeScript already handles it
    'import/no-unresolved': 'off',
    // quite a few false negative with this one
    'import/named': 'off',
    'import/extensions': 'off',
    'import/first': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: false, optionalDependencies: false, peerDependencies: false },
    ],
  },
};
