import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { defaultReporter, summaryReporter } from '@web/test-runner';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { globSync } from 'tinyglobby';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { testStoriesPlugin } from './wds/test-stories-plugin.js';
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
  concurrentBrowsers: 1,
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      createBrowserContext({ browser }) {
        return browser.newContext({ timezoneId: 'Europe/Paris', deviceScaleFactor: 1, reducedMotion: 'reduce' });
      },
    }),
    playwrightLauncher({
      product: 'firefox',
      createBrowserContext({ browser }) {
        return browser.newContext({ timezoneId: 'Europe/Paris', deviceScaleFactor: 1, reducedMotion: 'reduce' });
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
        <style>

        @font-face {
          font-family: 'SourceSansPro';
          src: url('/public/fonts/sourcesanspro-bold-webfont.eot');
          src:
            url('.storybook/public/fonts/sourcesanspro-bold-webfont.eot?#iefix') format('embedded-opentype'),
            url('/public/fonts/sourcesanspro-bold-webfont.woff2') format('woff2'),
            url('/public/fonts/sourcesanspro-bold-webfont.woff') format('woff'),
            url('/public/fonts/sourcesanspro-bold-webfont.ttf') format('truetype'),
            url('/public/fonts/sourcesanspro-bold-webfont.svg#source_sans_probold') format('svg');
          font-weight: bold;
          font-style: normal;
        }

        @font-face {
          font-family: 'SourceSansPro';
          src: url('/public/fonts/sourcesanspro-bolditalic-webfont.eot');
          src:
            url('/public/fonts/sourcesanspro-bolditalic-webfont.eot?#iefix') format('embedded-opentype'),
            url('/public/fonts/sourcesanspro-bolditalic-webfont.woff2') format('woff2'),
            url('/public/fonts/sourcesanspro-bolditalic-webfont.woff') format('woff'),
            url('/public/fonts/sourcesanspro-bolditalic-webfont.ttf') format('truetype'),
            url('/public/fonts/sourcesanspro-bolditalic-webfont.svg#source_sans_probold_italic') format('svg');
          font-weight: italic;
          font-style: bold;
        }

        @font-face {
          font-family: 'SourceSansPro';
          src: url('/public/fonts/sourcesanspro-italic-webfont.eot');
          src:
            url('/public/fonts/sourcesanspro-italic-webfont.eot?#iefix') format('embedded-opentype'),
            url('/public/fonts/sourcesanspro-italic-webfont.woff2') format('woff2'),
            url('/public/fonts/sourcesanspro-italic-webfont.woff') format('woff'),
            url('/public/fonts/sourcesanspro-italic-webfont.ttf') format('truetype'),
            url('/public/fonts/sourcesanspro-italic-webfont.svg#source_sans_proitalic') format('svg');
          font-weight: normal;
          font-style: italic;
        }

        @font-face {
          font-family: 'SourceSansPro';
          src: url('/public/fonts/sourcesanspro-regular-webfont.eot');
          src:
            url('/public/fonts/sourcesanspro-regular-webfont.eot?#iefix') format('embedded-opentype'),
            url('/public/fonts/sourcesanspro-regular-webfont.woff2') format('woff2'),
            url('/public/fonts/sourcesanspro-regular-webfont.woff') format('woff'),
            url('/public/fonts/sourcesanspro-regular-webfont.ttf') format('truetype'),
            url('/public/fonts/sourcesanspro-regular-webfont.svg#source_sans_proregular') format('svg');
          font-weight: normal;
          font-style: normal;
        }

        @font-face {
          font-family: 'SourceSansPro';
          src: url('/public/fonts/sourcesanspro-extralight-webfont.eot');
          src:
            url('/public/fonts/sourcesanspro-extralight-webfont.eot?#iefix') format('embedded-opentype'),
            url('/public/fonts/sourcesanspro-extralight-webfont.woff2') format('woff2'),
            url('/public/fonts/sourcesanspro-extralight-webfont.woff') format('woff'),
            url('/public/fonts/sourcesanspro-extralight-webfont.ttf') format('truetype'),
            url('/public/fonts/sourcesanspro-extralight-webfont.svg#SourceSansPro') format('svg');
          font-weight: 100;
          font-style: normal;
        }

        @font-face {
          font-family: 'SourceSansPro';
          src: url('/public/fonts/sourcesanspro-extralightitalic-webfont.eot');
          src:
            url('/public/fonts/sourcesanspro-extralightitalic-webfont.eot?#iefix') format('embedded-opentype'),
            url('/public/fonts/sourcesanspro-extralightitalic-webfont.woff2') format('woff2'),
            url('/public/fonts/sourcesanspro-extralightitalic-webfont.woff') format('woff'),
            url('/public/fonts/sourcesanspro-extralightitalic-webfont.ttf') format('truetype'),
            url('/public/fonts/sourcesanspro-extralightitalic-webfont.svg#SourceSansPro') format('svg');
          font-weight: 100;
          font-style: italic;
        }

        @font-face {
          font-family: 'SourceSansPro';
          src: url('/public/fonts/sourcesanspro-light-webfont.eot');
          src:
            url('/public/fonts/sourcesanspro-light-webfont.eot?#iefix') format('embedded-opentype'),
            url('/public/fonts/sourcesanspro-light-webfont.woff2') format('woff2'),
            url('/public/fonts/sourcesanspro-light-webfont.woff') format('woff'),
            url('/public/fonts/sourcesanspro-light-webfont.ttf') format('truetype'),
            url('/public/fonts/sourcesanspro-light-webfont.svg#SourceSansPro') format('svg');
          font-weight: 300;
          font-style: normal;
        }

        @font-face {
          font-family: 'SourceSansPro';
          src: url('/public/fonts/sourcesanspro-lightitalic-webfont.eot');
          src:
            url('/public/fonts/sourcesanspro-lightitalic-webfont.eot?#iefix') format('embedded-opentype'),
            url('/public/fonts/sourcesanspro-lightitalic-webfont.woff2') format('woff2'),
            url('/public/fonts/sourcesanspro-lightitalic-webfont.woff') format('woff'),
            url('/public/fonts/sourcesanspro-lightitalic-webfont.ttf') format('truetype'),
            url('/public/fonts/sourcesanspro-lightitalic-webfont.svg#source_sans_prolight_italic') format('svg');
          font-weight: 300;
          font-style: italic;
        }
          html { font-family: 'SourceSansPro' }
        </style>
      </head>
    </html>
  `,
  plugins: [
    cemAnalyzerPlugin,
    rollupAdapter(json()),
    esbuildBundlePluginWithConfig,
    commonjsPluginWithConfig,
    testStoriesPlugin,
  ],
};
