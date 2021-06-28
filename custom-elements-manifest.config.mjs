import fs from 'fs';
import sortItems from './cem/sort-items.js';
import removePrivateMembers from './cem/remove-private-members.js';
import identifyReadonlyMembers from './cem/identify-readonly-members.js';

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
    removePrivateMembers(),
    identifyReadonlyMembers(),
  ],
};
