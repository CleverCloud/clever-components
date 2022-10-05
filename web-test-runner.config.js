import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { cemAnalyzerPlugin } from './wds/cem-analyzer-plugin.js';
import { commonjsPluginWithConfig, esbuildBundlePluginWithConfig } from './wds/wds-common.js';

export default {
  files: ['test/**/*.test.*', 'src/components/**/*.test.*'],
  nodeResolve: true,
  mimeTypes: {
    '**/*.json': 'js',
  },
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '6000',
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
  plugins: [
    cemAnalyzerPlugin,
    rollupAdapter(json()),
    esbuildBundlePluginWithConfig,
    commonjsPluginWithConfig,
  ],
};
