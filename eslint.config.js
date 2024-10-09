// @ts-nocheck
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import importLinter from 'eslint-plugin-import-x';
import { configs as litPluginConfigs } from 'eslint-plugin-lit';
import globals from 'globals';
import path from 'node:path';
import i18nPlugin from './eslint-rules/i18n/eslint-i18n-plugin.js';
import litA11y from './eslint-rules/lit-a11y/lit-a11y.js';

const gitignorePath = path.resolve('./', '.gitignore');

export default [
  // common ignores
  includeIgnoreFile(gitignorePath),
  { ignores: ['docs/**/*'] },
  js.configs.recommended,
  // common custom config based on js.configs.recommended
  {
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
      importLinter,
    },
    rules: {
      // other rules
      'accessor-pairs': 'off',
      eqeqeq: ['error', 'always', { null: 'never' }],
      camelcase: ['error', { allow: ['_lp$'] }],
      curly: ['error', 'all'],
      'multiline-ternary': 'off',
      'no-new': 'off',
      'padded-blocks': 'off',
      'spaced-comment': ['error', 'always', { markers: ['#region', '#endregion'] }],
      'line-comment-position': ['error', { position: 'above' }],
      'importLinter/extensions': ['error', 'always'],
      'importLinter/first': ['error'],
      'importLinter/newline-after-import': ['error', { count: 1 }],
      'importLinter/no-useless-path-segments': ['error', { noUselessIndex: true }],
    },
  },
  // TODO: should we ignore test & node files?
  litPluginConfigs['flat/recommended'],
  litA11y.configs.recommended,
  i18nPlugin.configs.recommended,
  // mocha tests
  {
    files: ['**/**/*.test.js', 'test/**/*', 'test/**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  // node + ESM context
  {
    files: ['tasks/**/*.js', 'rollup/*', 'cem/**/*', 'web-test-runner.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
