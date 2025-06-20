import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { getStoriesGroups } from './test/helpers/generate-stories-batches.js';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { testVisualStoriesPlugin } from './wds/test-visual-stories-plugin.js';
import { visualRegressionPluginWithConfig } from './wds/visual-regression-plugin.js';
import { commonjsPluginWithConfig, esbuildBundlePluginWithConfig } from './wds/wds-common.js';
import globalWtrConfig from './web-test-runner.config.js';

console.log(getStoriesGroups()[0]);
export default {
  ...globalWtrConfig,
  reporters: [...globalWtrConfig.reporters],
  groups: [
    ...getStoriesGroups(),
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
    visualRegressionPluginWithConfig,
    testVisualStoriesPlugin,
  ],
};
