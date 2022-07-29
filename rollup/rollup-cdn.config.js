import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import {
  babelPlugin,
  clearPlugin,
  getMainFiles,
  importMetaUrlAssetsPlugin,
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

const inputFilesPairs = getMainFiles(sourceDir).map((file) => {
  const entryPath = path.parse(file).name;
  return [entryPath, file];
});

export default {
  // defines the files to be included into the build: all components + smart manager + translations + i18n
  input: Object.fromEntries(inputFilesPairs),
  output: {
    dir: outputDir,
    sourcemap: true,
    // add a hash on every file
    entryFileNames: '[name]-[hash].js',
    // sometimes, chunks are so small that they become counterproductive. Here we force some modules to be grouped in the same chunk.
    manualChunks: manualChunkOptions,
    // Rollup's import hoisting is not really useful here as we're applying a more aggressive import hoisting strategy with the deps-manifest.json
    hoistTransitiveImports: false,
  },
  // fine-grained tree shaking options. Here we force tree shaking for leaflet and shoelace
  treeshake: treeshakeOptions,
  plugins: [
    // output directory cleanup
    clearPlugin({ outputDir }),
    // transform .json files into ES6 modules. (Used by statuses library). TODO: we should get rid of this library
    json(),
    // add (and optimize) svg files used in all new URL('...', import.meta.url) pattern.
    importMetaUrlAssetsPlugin(),
    // exclude IE11 compatibility shim that is provided by LitElement. TODO: to be removed when moving to Lit 2
    shimShadyRender(),
    // convert CommonJS modules to ESM
    commonjs(),
    // support resolving module using Node resolution algorithm. TODO: figure out why we need that
    resolve(),
    // minify JS
    terserPlugin(),
    // minify HTML and CSS inside components
    babelPlugin(),
    // add and minify default theme
    stylesAssetsPlugin({
      transform: (stylesheet) => minifyStylesheet(stylesheet),
    }),
    // generate the deps-manifest.json file that will help our CDN to be smart
    depsManifestPlugin({ packageVersion }),
    // help us visualize and analyze the bundle size
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
