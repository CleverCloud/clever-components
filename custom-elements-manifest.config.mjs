import fs from 'fs';
import path from 'path';
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

// For our WDS plugin "cem-analyzer-plugin", we need to generate the CEM to a temporary dir.
// The CEM analyzer CLI doesn't have a command line param to override the outdir so we're using this env var hack.
const outdir = (process.env.CEM_OUT_DIR != null)
  ? path.relative(process.cwd(), process.env.CEM_OUT_DIR)
  : 'dist';

export default {
  globs: ['src/**/cc-*.js'],
  outdir,
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
