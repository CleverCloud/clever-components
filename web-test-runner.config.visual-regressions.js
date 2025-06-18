import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { setFixedTimePlugin } from './wds/set-fixed-time-plugin.js';
import { setPredictibleRandomPlugin } from './wds/set-predictible-random-plugin.js';
import { testVisualStoriesPlugin } from './wds/test-visual-stories-plugin.js';
import { visualRegressionPluginWithConfig } from './wds/visual-regression-plugin.js';
import { waitForNetworkIdlePlugin } from './wds/wait-for-network-idle-plugin.js';
import { commonjsPluginWithConfig, esbuildBundlePluginWithConfig } from './wds/wds-common.js';
import globalWtrConfig from './web-test-runner.config.js';
import { myHtmlReporter } from './wtr-reporter-visual-regressions-html.js';

export default {
  ...globalWtrConfig,
  reporters: [...globalWtrConfig.reporters, myHtmlReporter()],
  groups: [
    // ...globSync(['src/components/**/*.stories.js']).map((path) => {
    //   const groups = path.match(/^.*\/(?<fileName>.*)\.(?<fileType>.*)\.js/).groups;
    //   return {
    //     name: `${groups.fileType}:${groups.fileName}`,
    //     files: path,
    //   };
    // }),
    {
      name: 'small',
      files: 'src/components/cc-addon-credentials/cc-*.stories.js',
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
          // we need to patch random globally because stories rely on files that call this function through the randomString() helper when they are imported
          // this means that patching with typical onBefore / onAfter is too late, randomString are already generated
          Math.random = () => 0.5;
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
    waitForNetworkIdlePlugin(),
    setFixedTimePlugin(),
    setPredictibleRandomPlugin(),
    visualRegressionPluginWithConfig,
    testVisualStoriesPlugin,
  ],
};
