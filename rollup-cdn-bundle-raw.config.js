import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';
import { importMetaUrlAssets } from './rollup-plugin-import-meta-url-assets.js';

const OUTPUT_DIR = `cdn/bundle-raw`;

export default {
  input: [
    'src/index.js',
    'src/simple.js',
    'src/multiple-one.js',
    'src/multiple-two.js',
    'src/multiple-three.js',
  ],
  output: {
    dir: OUTPUT_DIR,
    sourcemap: true,
  },
  treeshake: false,
  plugins: [
    clear({
      targets: [OUTPUT_DIR],
    }),
    importMetaUrlAssets({
      // Let's assume we don't have import.meta.url assets in our deps to speed up things
      exclude: 'node_modules/**',
    }),
    json(),
    // teaches Rollup how to find external modules (bare imports)
    resolve(),
    // convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    commonjs(),
  ],
};
