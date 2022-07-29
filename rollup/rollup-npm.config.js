import path from 'path';
import json from '@rollup/plugin-json';
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
  input: Object.fromEntries(inputFilesPairs),
  output: {
    dir: outputDir,
    sourcemap: true,
    // We don't need the hash in this situation
    assetFileNames: 'assets/[name].[ext]',
    hoistTransitiveImports: false,
  },
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
        {
          src: 'src/styles/undefined-components.css',
          dest: 'dist/styles',
          transform: (stylesheet) => minifyStylesheet(stylesheet),
        },
      ],
    }),
    visualizerPlugin({ outputDir }),
  ],
};
