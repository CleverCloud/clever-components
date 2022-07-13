import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import {
  babelPlugin,
  clearPlugin,
  importMetaUrlAssetsPlugin,
  inputs,
  manualChunkOptions,
  minifyStylesheet,
  shimShadyRender,
  terserPlugin,
  treeshakeOptions,
  visualizerPlugin,
} from './rollup-common.js';
import { depsManifestPlugin } from './rollup-plugin-deps-manifest.js';
import { stylesAssetsPlugin } from './rollup-plugin-styles-assets.js';

const packageVersion = getVersion();

const sourceDir = 'src';
const outputDir = 'dist-cdn';

export default {
  input: inputs(sourceDir, (file) => {
    const { name: entryPath } = path.parse(file);
    return [entryPath, file];
  }),
  output: {
    dir: outputDir,
    sourcemap: true,
    entryFileNames: '[name]-[hash].js',
    manualChunks: manualChunkOptions,
    hoistTransitiveImports: false,
  },
  treeshake: treeshakeOptions,
  preserveModules: false,
  plugins: [
    clearPlugin({ outputDir }),
    json(),
    importMetaUrlAssetsPlugin(),
    shimShadyRender(),
    commonjs(),
    resolve(),
    terserPlugin(),
    babelPlugin(),
    stylesAssetsPlugin({
      transform: (stylesheet) => minifyStylesheet(stylesheet),
    }),
    depsManifestPlugin({ packageVersion }),
    visualizerPlugin({ outputDir, packageVersion }),
  ],
};

function getVersion () {
  const gitTag = process.env.GIT_TAG_NAME;
  if (gitTag == null) {
    throw new Error('Could not read version from git tag!');
  }
  return gitTag.trim();
}
