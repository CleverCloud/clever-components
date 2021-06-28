import fs from 'fs';
import sortItems from './cem/sort-items.js';

try {
  // Temporary for now
  fs.mkdirSync('dist');
}
catch (e) {
}

export default {
  globs: ['src/**/cc-*.js'],
  outdir: 'dist',
  // dev: true,
  // watch: true,
  plugins: [
    sortItems(),
  ],
};
