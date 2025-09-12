import path from 'path';
import copy from 'rollup-plugin-copy';
import {
  babelPlugin,
  clearPlugin,
  getAllSourceFiles,
  getMainFiles,
  importMetaUrlAssetsPlugin,
  minifyStylesheet,
  SOURCE_DIR,
  terserPlugin,
  visualizerPlugin,
} from './rollup-common.js';
import { indexGeneratorPlugin } from './rollup-plugin-index-generator.js';

const outputDir = 'dist';

const allSourceFiles = getAllSourceFiles();
const mainFiles = getMainFiles();

const inputFilesPairs = allSourceFiles.map(
  (SOURCE_DIR,
  (file) => {
    const isMainFile = mainFiles.includes(file);
    const { dir, name } = path.parse(file);

    // main files go to the root
    // other files are kept in the same path
    const entryPath = isMainFile ? name : path.relative(SOURCE_DIR, path.join(dir, name));

    return [entryPath, file];
  }),
);

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
    // minify JS
    terserPlugin(),
    // minify HTML and CSS inside components
    babelPlugin(),
    // add and minify default theme
    copy({
      targets: [
        {
          src: `${SOURCE_DIR}/styles/default-theme.css`,
          dest: `${outputDir}/styles`,
          transform: (stylesheet) => minifyStylesheet(stylesheet),
        },
        {
          src: `${SOURCE_DIR}/styles/undefined-components.css`,
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
