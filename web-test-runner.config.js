import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { chromeLauncher, defaultReporter, summaryReporter } from '@web/test-runner';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { Buffer } from 'buffer';
import { globSync } from 'tinyglobby';
import { CellarClient } from './tasks/cellar-client.js';
import { getCurrentBranch } from './tasks/git-utils.js';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { testStoriesPlugin } from './wds/test-stories-plugin.js';
import { commonjsPluginWithConfig, esbuildBundlePluginWithConfig } from './wds/wds-common.js';

const MASTER_BRANCH_NAME = 'master';

// sets the language used by the headless browser
// normally we'd set it through the `chromeLauncher` options but it makes the debug mode crash
process.env.LANGUAGE = 'en';

const cellar = new CellarClient({
  bucket: 'clever-test-flo-visual-regressions',
  accessKeyId: process.env.VISUAL_REGRESSIONS_CELLAR_KEY_ID,
  secretAccessKey: process.env.VISUAL_REGRESSIONS_CELLAR_SECRET_KEY,
});

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
  browsers: [
    chromeLauncher({
      // Fixes random timeouts with Chrome > 127, see https://github.com/CleverCloud/clever-components/issues/1146 for more info
      concurrency: 1,
      async createPage({ context }) {
        const page = await context.newPage();
        //   // We need that for unit tests working with dates and timezones
        await page.emulateTimezone('Europe/Paris');
        return page;
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
    {
      name: 'unit',
      files: ['test/**/*.test.*'],
    },
    // Create a named group for every test file to enable running single tests. If a story file is `cc-example-component.stories.js`
    // then you can run `npm run test:group stories:cc-example-component` to run only that component's stories tests.
    // If a test file is `cc-example-component.test.js`, then you can run `npm run test:group test:cc-example-component to run only that component's unit tests.
    // adapted from https://github.com/shoelace-style/shoelace/blob/next/web-test-runner.config.js
    ...globSync(['src/components/**/*.stories.js', 'src/components/**/*.test.js']).map((path) => {
      const groups = path.match(/^.*\/(?<fileName>.*)\.(?<fileType>.*)\.js/).groups;
      return {
        name: `${groups.fileType}:${groups.fileName}`,
        files: path,
      };
    }),
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
    visualRegressionPlugin({
      update: process.argv.includes('--update-visual-baseline'), // should we force to target some component or all? need to test what happens when you update baseline and it's already ok?
      async getBaseline({ name }) {
        // search for baseline same branch
        // if we get it from baseline same branch, it means we have added new visuals
        // we can probably set some env var so that CI lists impacted components in a comment for review?
        // if not found => search for baseline master
        const branchName = getCurrentBranch();
        const cellarKeyForCurrentBranch = `${branchName}/${name}.png`;
        const cellarKeyForMaster = `${MASTER_BRANCH_NAME}/${name}.png`;

        const fileBufferFromCurrentBranch = await cellar
          .getImage({ key: cellarKeyForCurrentBranch })
          .then((response) => {
            return new Promise((resolve, reject) => {
              const data = [];
              response.Body.on('data', (chunk) => data.push(chunk));
              response.Body.on('end', () => resolve(Buffer.concat(data)));
              response.Body.on('error', reject);
            });
          })
          .catch((err) => {
            // TODO proper error filtering (some are ok to be silenced but others are not?)
            console.log('error getting baseline', cellarKeyForCurrentBranch, err);
          });

        const fileBufferFromMaster = await cellar
          .getImage({ key: cellarKeyForMaster })
          .then((response) => {
            return new Promise((resolve, reject) => {
              const data = [];
              response.Body.on('data', (chunk) => data.push(chunk));
              response.Body.on('end', () => resolve(Buffer.concat(data)));
              response.Body.on('error', reject);
            });
          })
          .catch((err) => {
            // TODO proper error filtering (some are ok to be silenced but others are not?)
            console.log('error getting baseline', cellarKeyForMaster, err);
          });

        // TODO: if we get it from current branch, it means we have a new baseline and there are new visuals so we should probably set some env var so that CI lists impacted components in a comment for review?

        return fileBufferFromCurrentBranch || fileBufferFromMaster;
      },
      async saveBaseline({ content, name }) {
        console.log('saving new baseline', name);
        const branchName = getCurrentBranch();
        const cellarKey = `${branchName}/${name}.png`;
        await cellar
          .putObject({
            key: cellarKey,
            body: content,
          })
          .catch((err) => {
            console.log('failed to save baseline', cellarKey, err);
          });
      },
      async saveDiff({ content, name }) {
        const branchName = getCurrentBranch();
        // should save to cellar + locally but only if failed?
        // if name split `/` [1] === 'failed' then we should also save locally for review?
        const cellarKey = `${branchName}/${name}.png`;
        await cellar
          .putObject({
            key: cellarKey,
            body: content,
          })
          .then((response) => {
            console.log('saved diff', cellarKey, name);
          })
          .catch((err) => {
            console.log('failed to save DIFF', name, err);
          });
      },
      saveFailed({ filePath, content, baseDir, name }) {
        console.log('SAVING FAILED', name);
      },
    }),
    testStoriesPlugin,
  ],
};
