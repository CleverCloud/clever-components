import fs from 'fs';
import addDependenciesInDescription from './cem/add-dependencies-in-description.js';
import addGithubSourceInDescription from './cem/add-github-source-in-description.js';
import identifyReadonlyMembers from './cem/identify-readonly-members.js';
import listImages from './cem/list-images.js';
import removePrivateMembers from './cem/remove-private-members.js';
import sortItems from './cem/sort-items.js';
import supportCssdisplayJsdoc from './cem/support-cssdisplay-jsdoc.js';
import supportTypedefJsdoc from './cem/support-typedef-jsdoc.js';

// Temporary for now
fs.mkdirSync('dist', { recursive: true });

export default {
  globs: ['src/components/**/cc-*.js', 'src/lib/form/cc-form-control-element.abstract.js'],
  exclude: ['src/**/*.stories.js'],
  litelement: true,
  // dev: true,
  // watch: true,
  plugins: [
    sortItems(),
    removePrivateMembers(),
    identifyReadonlyMembers(),
    supportCssdisplayJsdoc(),
    supportTypedefJsdoc(),
    addDependenciesInDescription(),
    addGithubSourceInDescription({ githubProject: 'CleverCloud/clever-components' }),
    listImages(),
  ],
};
