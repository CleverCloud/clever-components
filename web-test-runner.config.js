import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { chromeLauncher } from '@web/test-runner-chrome';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { commonjsPluginWithConfig, esbuildBundlePluginWithConfig } from './wds/wds-common.js';

export default {
  files: ['test/**/*.test.*', 'src/components/**/*.test.*'],
  browsers: [
    chromeLauncher({
      launchOptions: {
        env: { LANGUAGE: 'en_US' },
      },
      async createPage({ context }) {
        const page = await context.newPage();
        // We need that for unit tests working with dates and timezones
        await page.emulateTimezone('Europe/Paris');
        return page;
      },
    }),
  ],
  nodeResolve: true,
  mimeTypes: {
    '**/*.json': 'js',
  },
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '10000',
    },
  },
  testRunnerHtml: (testFramework) => `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="src/styles/default-theme.css" >
        <script type="module" src="${testFramework}"></script>
      </head>
    </html>
  `,
  plugins: [cemAnalyzerPlugin, rollupAdapter(json()), esbuildBundlePluginWithConfig, commonjsPluginWithConfig],
};
