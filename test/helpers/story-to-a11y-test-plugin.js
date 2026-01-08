import fs from 'node:fs';

/**
 * Vite plugin that transforms .stories.js files into a11y test files.
 * Mirrors the pattern from web-test-runner/visual-tests/story-file-to-visual-tests-file-plugin.js
 *
 * When Vitest loads a .stories.js file (from the include pattern), this plugin:
 * 1. Intercepts the load and returns a test wrapper instead
 * 2. The test wrapper imports the original story via ?original query
 * 3. Calls runA11yTests with the story module
 */

/** @returns {import('vite').Plugin} */
export function storyToA11yTestPlugin() {
  return {
    name: 'story-to-a11y-test',

    load(id) {
      // When loading a .stories.js file, return test wrapper
      // (but not when loading the original via ?original query)
      if (id.endsWith('.stories.js') && !id.includes('?original')) {
        return `
          import { runA11yTests } from '/test/helpers/a11y-tests.js';
          import * as storiesModule from '${id}?original';

          runA11yTests(storiesModule);
        `;
      }

      // When loading ?original, return actual file content
      if (id.includes('.stories.js?original')) {
        const realPath = id.replace('?original', '');
        return fs.readFileSync(realPath, 'utf-8');
      }
    },
  };
}
