import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import monoglob from 'glob';
import { copyFile, moveFileAndUpdateCodebase } from './move-file.js';

const otherGlobs = [
  'src/**/*.js',
  'stories/**/*.js',
  'test/**/*.js',
];

function glob (patternList, options) {
  if (typeof patternList === 'string') {
    return monoglob.sync(patternList, options);
  }
  return patternList.flatMap((pattern) => {
    return monoglob.sync(pattern, options);
  });
}

function getNewPath (oldPath) {

  const componentDir = path.parse(oldPath).name
    .replace(/\.stories.*$/, '')
    .replace(/\.smart.*$/, '');
  const componentFileName = path.parse(oldPath).base;

  if (oldPath.includes('/mixins/')) {
    return `src/mixins/${componentDir}/${componentFileName}`;
  }

  if (oldPath.includes('/templates/')) {
    return `src/templates/${componentDir}/${componentFileName}`;
  }

  return `src/components/${componentDir}/${componentFileName}`;
}

function run () {

  // Special situations for the file types
  const componentList = glob('src/**/cc-*.js', { absolute: true });
  for (const oldPath of componentList) {
    if (!oldPath.includes('smart')) {
      const oldDir = path.parse(oldPath).dir;
      const oldPathType = oldDir + '/types.d.ts';
      const newPathType = getNewPath(oldPath).replace('.js', '.types.d.ts');
      try {
        copyFile(oldPathType, newPathType);
      }
      catch {
      }
    }
  }

  moveFileAndUpdateCodebase('src/types.d.ts', 'src/components/common.types.d.ts', otherGlobs);

  const fileTypes = glob('src/**/types.d.ts', { absolute: true });
  for (const oldPath of fileTypes) {
    fs.rmSync(oldPath);
    console.log(`REMOVE FILE: ${chalk.blue(path.relative(process.cwd(), oldPath))}`);
  }

  const inputPatterns = [
    'src/**/cc-*.js',
    'src/mixins/*.js',
    'src/templates/*.js',
    'stories/**/cc-*.*',
    'stories/mixins/*.*',
    'stories/templates/*.*',
  ];

  const fileList = glob(inputPatterns, { absolute: true });
  const fileListUnique = Array.from(new Set(fileList));
  for (const oldPath of fileListUnique) {
    const newPath = getNewPath(oldPath);
    moveFileAndUpdateCodebase(oldPath, newPath, otherGlobs);
    // TODO types
  }

  moveFileAndUpdateCodebase('src/undefined-components.css', 'src/styles/undefined-components.css', otherGlobs);
  moveFileAndUpdateCodebase('stories/atoms/all-form-controls.js', 'src/stories/all-form-controls.js', otherGlobs);
  moveFileAndUpdateCodebase('stories/maps/fake-map-data.js', 'src/stories/fixtures/fake-map-data.js', otherGlobs);

  const storiesAssets = glob(['stories/assets/*.svg', 'stories/assets/*.png', 'stories/lib/*'], { absolute: true });
  for (const oldPath of storiesAssets) {
    const newPath = oldPath.replace('/stories/', '/src/stories/');
    moveFileAndUpdateCodebase(oldPath, newPath, otherGlobs);
  }

  const storiesFixtures = glob('stories/assets/*.js', { absolute: true });
  for (const oldPath of storiesFixtures) {
    const newPath = oldPath.replace('/stories/assets/', '/src/stories/fixtures/');
    moveFileAndUpdateCodebase(oldPath, newPath, otherGlobs);
  }

  // Rework types import paths
  const newComponentList = glob('src/components/**/cc-*.js', { absolute: true });
  for (const filepath of newComponentList) {
    const componentFileName = path.parse(filepath).name;
    const contents = fs.readFileSync(filepath, { encoding: 'utf8' });
    const newContents = contents
      .replaceAll(`@typedef {import('./types.js')`, `@typedef {import('./${componentFileName}.types.js')`)
      .replaceAll(`@typedef {import('../types.js')`, `@typedef {import('../common.types.js')`);
    fs.writeFileSync(filepath, newContents);
  }

  const directories = glob('**/*', {
    ignore: ['node_modules/**', 'dist-*/**'],
  });

  for (const dir of directories) {
    try {
      const files = fs.readdirSync(dir);
      if (files.length === 0) {
        console.log(`REMOVE DIR ${chalk.blue(dir)}`);
        fs.rmdirSync(dir);
      }
    }
    catch (e) {
    }
  }

}

run();
