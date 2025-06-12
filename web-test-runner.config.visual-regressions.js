import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { globSync } from 'tinyglobby';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { testVisualStoriesPlugin } from './wds/test-visual-stories-plugin.js';
import { visualRegressionPluginWithConfig } from './wds/visual-regression-plugin.js';
import { commonjsPluginWithConfig, esbuildBundlePluginWithConfig } from './wds/wds-common.js';
import globalWtrConfig from './web-test-runner.config.js';

export default {
  ...globalWtrConfig,
  groups: [
    ...globSync(['src/components/**/*.stories.js']).map((path) => {
      const groups = path.match(/^.*\/(?<fileName>.*)\.(?<fileType>.*)\.js/).groups;
      return {
        name: `${groups.fileType}:${groups.fileName}`,
        files: path,
      };
    }),
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
