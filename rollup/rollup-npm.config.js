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
  preserveModules: true,
  plugins: [
    clearPlugin({ outputDir }),
    json(),
    importMetaUrlAssetsPlugin(),
    terserPlugin(),
    babelPlugin(),
    copy({
      targets: [
        {
          src: 'src/styles/default-theme.css',
          dest: 'dist/styles',
          transform: (stylesheet) => minifyStylesheet(stylesheet),
        },
      ],
    }),
    visualizerPlugin({ outputDir }),
  ],
};
