import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { chromeLauncher, defaultReporter, summaryReporter } from '@web/test-runner';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { Buffer } from 'buffer';
import { globSync } from 'tinyglobby';
import { CellarClient } from './tasks/cellar-client.js';
import { getCurrentBranch } from './tasks/git-utils.js';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { testStoryPlugin } from './wds/test-story-plugin.js';
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
        //   // We need that for unit tests working with dates and timezones
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
  groups: [
    {
      name: 'stories',
      files: 'src/components/**/*.stories.js',
    },
    {
      name: 'visual',
      files: 'src/components/**/cc-addon-admin.stories.js',
    },
    ...globSync('src/components/**/*.stories.js').map((path) => {
      const groupName = path.match(/^.*\/(?<fileName>.*)\.stories\.js/).groups.fileName;
      return {
        name: groupName,
        files: path,
      };
    }),
  ],
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
    testStoryPlugin,
  ],
};
