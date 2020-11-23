import path from 'path';
import { inputs, plugins } from './rollup-common.js';

const SOURCE_DIR = 'src';
const OUTPUT_DIR = `dist`;

export default {
  input: inputs(SOURCE_DIR, (file) => {
    const { name: entryPath } = path.parse(file);
    return [entryPath, file];
  }),
  output: {
    dir: OUTPUT_DIR,
    sourcemap: true,
    // We don't need the hash in this situation
    assetFileNames: 'assets/[name].[ext]',
  },
  preserveModules: true,
  plugins: [
    ...plugins(SOURCE_DIR, OUTPUT_DIR),
  ],
};
