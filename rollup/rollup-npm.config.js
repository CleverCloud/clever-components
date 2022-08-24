import path from 'path';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import {
  babelPlugin,
  clearPlugin,
  importMetaUrlAssetsPlugin,
  inputs,
  minifyStylesheet,
  terserPlugin,
  visualizerPlugin,
} from './rollup-common.js';

const sourceDir = 'src';
const outputDir = 'dist';

export default {
  // defines the files to be included into the build: all components + smart manager + translations
  input: inputs(sourceDir, (file) => {
    const { name: entryPath } = path.parse(file);
    return [entryPath, file];
  }),
  output: {
    dir: outputDir,
    sourcemap: true,
    // We don't need the hash in this situation
    assetFileNames: 'assets/[name].[ext]',
  },
  // We want to preserve modules
  preserveModules: true,
  plugins: [
    // output directory cleanup
    clearPlugin({ outputDir }),
    // transform .json files into ES6 modules. (Used by statuses library). TODO: we should get rid of this library
    json(),
    // add (and optimize) svg files used in all new URL('...', import.meta.url) pattern.
    importMetaUrlAssetsPlugin(),
    // minify JS
    terserPlugin(),
    // minify HTML and CSS inside components
    babelPlugin(),
    // add and minify default theme
    copy({
      targets: [
        {
          src: 'src/styles/default-theme.css',
          dest: 'dist/styles',
          transform: (stylesheet) => minifyStylesheet(stylesheet),
        },
      ],
    }),
    // help us visualize and analyze the bundle size
    visualizerPlugin({ outputDir }),
  ],
};
