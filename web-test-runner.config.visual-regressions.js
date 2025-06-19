import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { globSync } from 'tinyglobby';
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
    ...globSync(['src/components/**/*.stories.js']).map((path) => {
      const groups = path.match(/^.*\/(?<fileName>.*)\.(?<fileType>.*)\.js/).groups;
      return {
        name: `${groups.fileType}:${groups.fileName}`,
        files: path,
      };
    }),
    // {
    //   name: 'small',
    //   files: 'src/components/cc-addon-credentials/cc-*.stories.js',
    // },
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
          .story-shadow-container {
            padding: 3rem;
          }
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
