// @ts-nocheck
import babelParser from '@babel/eslint-parser';
import { includeIgnoreFile } from '@eslint/compat';
import html from '@html-eslint/eslint-plugin';
import globals from 'globals';
import path from 'node:path';
import i18nPlugin from './eslint/i18n/eslint-plugin-i18n.js';
import litA11yCleverCloud from './eslint/lit-a11y/eslint-config-lit-a11y-clever-cloud.js';
import litCleverCloud from './eslint/lit/eslint-config-lit-clever-cloud.js';
import wcCleverCloud from './eslint/wc/eslint-config-wc-clever-cloud.js';

import { cleverCloud } from '@clevercloud/eslint-config';

const gitignorePath = path.resolve('./', '.gitignore');

export default [
  // common ignores
  includeIgnoreFile(gitignorePath),
  {
    name: 'cc-browser-config',
    files: ['**/*.js', '**/*.mjs'],
    ignores: ['docs/**/*', '**/*.d.ts', 'src/assets/**/*'],
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
    ...cleverCloud.configs.browser,
  },
  i18nPlugin.configs.recommended,
  wcCleverCloud,
  litCleverCloud,
  litA11yCleverCloud,
  {
    name: 'html-baseline',
    plugins: {
      '@html-eslint': html,
    },
    rules: { '@html-eslint/use-baseline': 'error' },
    files: ['src/components/*/*.js'],
  },
  {
    name: 'mocha-context',
    files: ['**/*.test.*js', 'test/**/*.js', 'test-mocha/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  {
    name: 'node-esm-context',
    files: [
      'tasks/**/*.js',
      'rollup/**/*.js',
      'cem/**/*.js',
      'web-test-runner.config.js',
      'web-test-runner.config*.js',
      'web-test-runner/**/*.js',
      'src/stories/lib/smart-auth-plugin.js',
      'test-mocha/**/*.*js',
      '.storybook/**/*.js',
      '.github/**/*.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    ...cleverCloud.configs.node,
  },
  // Allow importing dev dependencies for files that are related to build / stories / tooling / testing
  {
    name: 'allow-extraneous-imports',
    files: [
      '**/*.test.js',
      'test/**/*.*js',
      'test-mocha/**/*.*js',
      'src/stories/**/*.js',
      'eslint.config.js',
      'eslint/**/*.*js',
      'prettier.config.js',
      'prettier-rules/**/*.js',
      'tasks/**/*.js',
      'rollup/**/*.js',
      'cem/**/*.js',
      'web-test-runner.config.js',
      'web-test-runner.visual-tests.config.js',
      'web-test-runner/**/*.js',
      '.storybook/**/*.js',
      '.github/**/*.js',
    ],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true, optionalDependencies: false, peerDependencies: false },
      ],
    },
  },
  {
    name: 'allow-unresolved-import',
    files: ['**/*.js'],
    ignores: ['docs/**/*.js'],
    // FIXME: We have to do this due to a ESLint bug
    plugins: { 'import-x': cleverCloud.configs.browser.plugins['import-x'] },
    rules: {
      'import-x/no-unresolved': [
        'error',
        {
          ignore: ['custom-elements.json'],
        },
      ],
    },
  },
  {
    name: 'import-attributes',
    files: ['tasks/visual-tests/*.js'],
    languageOptions: {
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          configFile: false,
          babelrc: false,
          plugins: ['@babel/plugin-syntax-import-attributes'],
        },
      },
    },
  },
];
