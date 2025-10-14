import fs from 'fs';
import addGithubSourceInDescription from './cem/add-github-source-in-description.js';
import identifyReadonlyMembers from './cem/identify-readonly-members.js';
import listImages from './cem/list-images.js';
import removePrivateMembers from './cem/remove-private-members.js';
import sortItems from './cem/sort-items.js';
import supportCcEvents from './cem/support-cc-events.js';
import supportCssdisplayJsdoc from './cem/support-cssdisplay-jsdoc.js';
import supportTypedefJsdoc from './cem/support-typedef-jsdoc.js';

// Temporary for now
fs.mkdirSync('dist', { recursive: true });

export default {
  globs: ['src/components/**/cc-*.js'],
  exclude: ['src/**/*.stories.js', 'src/**/*.events.js', 'src/**/*.smart.js', 'src/**/*.abstract.js'],
  litelement: true,
  // dev: true,
  // watch: true,

  overrideModuleCreation: ({ ts, globs }) => {
    console.log('[config] Creating TypeScript program with globs:', globs);

    // Create TypeScript program with compiler options matching the project
    const program = ts.createProgram(globs, {
      target: ts.ScriptTarget.ES2022,
      lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
      module: ts.ModuleKind.NodeNext,
      checkJs: true, // Required for type information from JSDoc
      allowJs: true,
      noEmit: true,
      skipLibCheck: true,
    });

    const typeChecker = program.getTypeChecker();

    // Store the typeChecker and program so plugins can access them
    global.__CEM_TYPE_CHECKER__ = typeChecker;
    global.__CEM_PROGRAM__ = program;

    const sourceFiles = program.getSourceFiles().filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
    console.log('[config] TypeScript program ready with', sourceFiles.length, 'source files');

    return sourceFiles;
  },

  plugins: [
    supportCcEvents(),
    sortItems(),
    removePrivateMembers(),
    identifyReadonlyMembers(),
    supportCssdisplayJsdoc(),
    // addDependenciesInDescription(),
    addGithubSourceInDescription({ githubProject: 'CleverCloud/clever-components' }),
    listImages(),
    supportTypedefJsdoc(),
  ],
};
