import fs from 'fs';
import sortItems from './cem/sort-items.js';
import removePrivateMembers from './cem/remove-private-members.js';
import identifyReadonlyMembers from './cem/identify-readonly-members.js';
import addGithubSourceInDescription from './cem/add-github-source-in-description.js';
import supportCssdisplayJsdoc from './cem/support-cssdisplay-jsdoc.js';
import supportTypedefJsdoc from './cem/support-typedef-jsdoc.js';
import listImages from './cem/list-images.js';

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
    supportCssdisplayJsdoc(),
    supportTypedefJsdoc(),
    addGithubSourceInDescription({ githubProject: 'CleverCloud/clever-components' }),
    listImages(),
  ],
};
