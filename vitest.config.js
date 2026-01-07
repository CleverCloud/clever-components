import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import BrowserCommands from './test/helpers/a11y-matcher.js';

export default defineConfig({
  test: {
    include: ['test/**/*.test.js'],
    exclude: ['src/components/**/*.test.js', 'test-mocha/**/*'],
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
    fileParallelism: false,
    testTimeout: 10000,
    setupFiles: ['./test/vitest-setup.js'],
  },
  resolve: {
    conditions: ['production', 'default'],
  },
  plugins: [BrowserCommands()],
});
