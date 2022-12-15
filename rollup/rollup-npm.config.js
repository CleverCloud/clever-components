import path from 'path';
import copy from 'rollup-plugin-copy';
import {
  babelPlugin,
  clearPlugin,
  getAllSourceFiles,
  getMainFiles,
  importMetaUrlAssetsPlugin,
  minifyStylesheet,
  terserPlugin,
  visualizerPlugin,
} from './rollup-common.js';
import { createIconAssetsPlugin } from './rollup-plugin-icon.js';
import { indexGeneratorPlugin } from './rollup-plugin-index-generator.js';

const sourceDir = 'src';
const outputDir = 'dist';

const allSourceFiles = getAllSourceFiles(sourceDir);
const mainFiles = getMainFiles(sourceDir);

const inputFilesPairs = allSourceFiles.map((sourceDir, (file) => {

  const isMainFile = mainFiles.includes(file);
  const { dir, name } = path.parse(file);

  // main files go to the root
  // other files are kept in the same path
  const entryPath = isMainFile
    ? name
    : path.relative(sourceDir, path.join(dir, name));

  return [entryPath, file];
}));

export default {
  // defines the files to be included into the build: all components + smart manager + translations
  input: Object.fromEntries(inputFilesPairs),
  output: {
    dir: outputDir,
    sourcemap: true,
    // We don't need the hash in this situation
    assetFileNames: 'assets/[name].[ext]',
    hoistTransitiveImports: false,
  },
  plugins: [
    // output directory cleanup
    clearPlugin({ outputDir }),
    // add (and optimize) svg files used in all new URL('...', import.meta.url) pattern.
    importMetaUrlAssetsPlugin(),
    // deliver SVG icons in form of ES modules
    createIconAssetsPlugin(),
    // minify JS
    terserPlugin(),
    // minify HTML and CSS inside components
    babelPlugin(),
    // add and minify default theme
    copy({
      targets: [
        {
          src: `${sourceDir}/styles/default-theme.css`,
          dest: `${outputDir}/styles`,
          transform: (stylesheet) => minifyStylesheet(stylesheet),
        },
        {
          src: `${sourceDir}/styles/undefined-components.css`,
          dest: `${outputDir}/styles`,
          transform: (stylesheet) => minifyStylesheet(stylesheet),
        },
      ],
    }),
    indexGeneratorPlugin(mainFiles),
    // help us visualize and analyze the bundle size
    visualizerPlugin({ outputDir }),
  ],
};
