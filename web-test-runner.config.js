import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { defaultReporter, summaryReporter } from '@web/test-runner';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { testStoriesPlugin } from './wds/test-stories-plugin.js';
import { visualRegressionPluginWithConfig } from './wds/visual-regression-plugin.js';
import { commonjsPluginWithConfig, esbuildBundlePluginWithConfig } from './wds/wds-common.js';

// sets the language used by the headless browser
// normally we'd set it through the `chromeLauncher` options but it makes the debug mode crash
process.env.LANGUAGE = 'en';

export default {
  filterBrowserLogs: ({ args }) => {
    const logsToExclude = [
      'Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.',
      'Multiple versions of Lit loaded. Loading multiple versions is not recommended. See https://lit.dev/msg/multiple-versions for more information.',
      'ResizeObserver loop completed with undelivered notifications.',
    ];
    const logMessage = args[0];

    return logMessage != null && !logsToExclude.includes(logMessage);
  },
  nodeResolve: {
    exportConditions: ['production', 'default'],
  },
  concurrentBrowsers: 3,
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      createBrowserContext({ browser }) {
        return browser.newContext({ timezoneId: 'Europe/Paris', deviceScaleFactor: 1 });
      },
    }),
  ],
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
  groups: [
    // {
    //   name: 'unit',
    //   files: ['test/**/*.test.*'],
    // },
    // Create a named group for every test file to enable running single tests. If a story file is `cc-example-component.stories.js`
    // then you can run `npm run test:group stories:cc-example-component` to run only that component's stories tests.
    // If a test file is `cc-example-component.test.js`, then you can run `npm run test:group test:cc-example-component to run only that component's unit tests.
    // adapted from https://github.com/shoelace-style/shoelace/blob/next/web-test-runner.config.js
    // ...globSync(['src/components/**/*.stories.js', 'src/components/**/*.test.js']).map((path) => {
    //   const groups = path.match(/^.*\/(?<fileName>.*)\.(?<fileType>.*)\.js/).groups;
    //   return {
    //     name: `${groups.fileType}:${groups.fileName}`,
    //     files: path,
    //   };
    // }),
    {
      name: 'small',
      files: ['src/components/cc-button/*.stories.js'],
    },
  ],
  testRunnerHtml: (testFramework) => `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="src/styles/default-theme.css" >
        <script type="module" src="${testFramework}"></script>
        <script>
          window.process = {env: { NODE_ENV: "production" }}
        </script>
      </head>
    </html>
  `,
  plugins: [
    cemAnalyzerPlugin,
    rollupAdapter(json()),
    esbuildBundlePluginWithConfig,
    commonjsPluginWithConfig,
    visualRegressionPluginWithConfig,
    testStoriesPlugin,
  ],
};
