import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import generateCem from './cem/generate-cem-vite-plugin.js';
import { storyToA11yTestPlugin } from './test/helpers/story-to-a11y-test-plugin.js';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright({
        contextOptions: {
          locale: 'en-US',
          timezoneId: 'Europe/Paris',
        },
      }),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
    fileParallelism: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['test/**/*.test.js', 'src/components/**/*.test.js'],
          exclude: ['test/node/**/*'],
          testTimeout: 10000,
          setupFiles: ['./test/vitest-setup.js'],
        },
      },
      {
        extends: true,
        plugins: [generateCem(), storyToA11yTestPlugin()],
        resolve: {
          alias: [
            {
              // Redirect CEM imports to virtual module (same as Storybook dev mode)
              find: /.*\/dist\/custom-elements\.json$/,
              replacement: 'virtual:custom-elements.json',
            },
          ],
        },
        test: {
          name: 'a11y',
          include: ['src/components/**/*.stories.js'],
          testTimeout: 30000,
          setupFiles: ['./test/vitest-a11y-setup.js'],
        },
      },
      {
        extends: true,
        test: {
          name: 'node',
          include: ['test/node/**/*.test.js'],
          browser: { enabled: false },
          environment: 'node',
        },
      },
    ],
  },
  resolve: {
    conditions: ['production', 'default'],
  },
});
