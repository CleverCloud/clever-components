import { fileURLToPath } from 'node:url'
import { defineConfig } from '@playwright/test'

const testDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  testDir,
  testMatch: /.*\.spec\.ts/,
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 6,
  fullyParallel: true,
  reporter:
    process.env.ARGOS_TOKEN || process.env.CI
      ? [['list'], ['@argos-ci/playwright/reporter']]
      : 'list',
  use: {
    baseURL: 'http://127.0.0.1:6006',
    contextOptions: { reducedMotion: 'reduce' },
  },
  webServer: process.env.ARGOS_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'python3 -m http.server 6006 -d ../storybook-static',
        url: 'http://127.0.0.1:6006/iframe.html',
        reuseExistingServer: true,
        timeout: 30_000,
      },
})
