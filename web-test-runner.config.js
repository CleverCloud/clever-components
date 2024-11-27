import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { defaultReporter, summaryReporter } from '@web/test-runner';
import { chromeLauncher } from '@web/test-runner-chrome';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { commonjsPluginWithConfig, esbuildBundlePluginWithConfig } from './wds/wds-common.js';

// sets the language used by the headless browser
// normally we'd set it through the `chromeLauncher` options but it makes the debug mode crash
process.env.LANGUAGE = 'en';

export default {
  files: ['test/**/*.test.*', 'src/components/**/*.test.*'],
  filterBrowserLogs: ({ args }) => {
    const logsToExclude = [
      'Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.',
      'Multiple versions of Lit loaded. Loading multiple versions is not recommended. See https://lit.dev/msg/multiple-versions for more information.',
    ];
    const logMessage = args[0];

    return logMessage != null && !logsToExclude.includes(logMessage);
  },
  browsers: [
    chromeLauncher({
      // Fixes random timeouts with Chrome > 127, see https://github.com/CleverCloud/clever-components/issues/1146 for more info
      concurrency: 1,
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
  reporters: [
    // mocha like report
    process.env.CI !== 'true' ? summaryReporter({ flatten: false }) : [],
    // report global tests progress
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
  ],
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
