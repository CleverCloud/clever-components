import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { testVisualStoriesPlugin } from './wds/test-visual-stories-plugin.js';
import { visualRegressionPluginWithConfig } from './wds/visual-regression-plugin.js';
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
      files: 'src/components/cc-button/cc-button.stories.js',
    },
  ],
  plugins: [
    cemAnalyzerPlugin,
    rollupAdapter(json()),
    esbuildBundlePluginWithConfig,
    commonjsPluginWithConfig,
    visualRegressionPluginWithConfig,
    testVisualStoriesPlugin,
  ],
};
