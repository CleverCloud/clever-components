import fs from 'fs';
import sortItems from './cem/sort-items.js';
import removePrivateMembers from './cem/remove-private-members.js';
import identifyReadonlyMembers from './cem/identify-readonly-members.js';
import addGithubSourceInDescription from './cem/add-github-source-in-description.js';
import supportCssdisplayJsdoc from './cem/support-cssdisplay-jsdoc.js';
import listImages from './cem/list-images.js';

// Temporary for now
fs.mkdirSync('dist', { recursive: true });

export default {
  globs: ['src/components/**/cc-*.js'],
  exclude: ['src/**/*.stories.js'],
  // dev: true,
  // watch: true,
  plugins: [
    sortItems(),
    removePrivateMembers(),
    identifyReadonlyMembers(),
    supportCssdisplayJsdoc(),
    // supportTypedefJsdoc(),
    addGithubSourceInDescription({ githubProject: 'CleverCloud/clever-components' }),
    listImages(),
  ],
};
