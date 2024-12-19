// @ts-nocheck
import { includeIgnoreFile } from '@eslint/compat';
import nodePlugin from 'eslint-plugin-n';
import globals from 'globals';
import path from 'node:path';
import i18nPlugin from './eslint/i18n/eslint-plugin-i18n.js';
import cleverCloudEsm from './eslint/javascript/eslint-config-clever-cloud-esm.js';
import litA11yCleverCloud from './eslint/lit-a11y/eslint-config-lit-a11y-clever-cloud.js';
import litCleverCloud from './eslint/lit/eslint-config-lit-clever-cloud.js';
import wcCleverCloud from './eslint/wc/eslint-config-wc-clever-cloud.js';

const gitignorePath = path.resolve('./', '.gitignore');

export default [
  // common ignores
  includeIgnoreFile(gitignorePath),
  {
    name: 'project-ignores',
    ignores: ['docs/**/*', '**/*.d.ts', 'src/assets/**/*'],
  },
  cleverCloudEsm,
  i18nPlugin.configs.recommended,
  wcCleverCloud,
  litCleverCloud,
  litA11yCleverCloud,
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
      'tasks/**/*.js',
      'rollup/**/*.js',
      'cem/**/*.js',
      'web-test-runner.config.js',
      'wds/**/*.js',
      '.storybook/**/*.js',
    ],
    rules: {
      'import/no-extraneous-dependencies': [
        'off',
        { devDependencies: true, optionalDependencies: false, peerDependencies: false },
      ],
    },
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
      'wds/**/*.js',
      'src/stories/lib/smart-auth-plugin.js',
      'test-mocha/**/*.*js',
      '.storybook/**/*.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      n: nodePlugin,
    },
    rules: {
      ...nodePlugin.configs['flat/recommended-script'].rules,
      'n/no-process-exit': 'off',
      'n/no-extraneous-import': 'off',
    },
  },
];
