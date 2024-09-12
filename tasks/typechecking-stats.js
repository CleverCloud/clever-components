import rawGlob from 'glob';
import json5 from 'json5';
import fs from 'node:fs/promises';
import { promisify } from 'node:util';

const globOne = promisify(rawGlob);

/**
 * @param {Array<string>} patterns
 * @returns {Promise<Array<string>>}
 */
async function globAll(patterns) {
  const positivePatterns = patterns.filter((p) => !p.startsWith('!'));
  const negativePatterns = patterns
    .filter((p) => p.startsWith('!'))
    .map((p) => {
      return p.replace(/^!/, '');
    });
  const doubleArray = await Promise.all(
    positivePatterns.map((p) => {
      return globOne(p, { ignore: negativePatterns });
    }),
  );
  return doubleArray.flat();
}

const categories = {
  Components: [
    'src/components/**/cc-*.js',
    '!src/components/**/*.smart.js',
    '!src/components/**/*.test.js',
    '!src/components/**/*.stories.js',
  ],
  'Components (smart)': ['src/components/**/*.smart.js'],
  'Components (test)': ['src/components/**/*.test.js'],
  'Components (stories)': ['src/components/**/cc-*.stories.js'],
  Controllers: ['src/controllers/**/*.js', '!src/controllers/**/*.stories.js'],
  'Controllers (stories)': ['src/controllers/**/*.stories.js'],
  Libs: ['src/lib/**/*.js'],
  Tasks: ['tasks/**/*.js'],
};

/**
 * @return {Promise<Array<string>>}
 */
async function getAllCheckedFiles() {
  const tsconfigJson = await fs.readFile('./tsconfig.ci.json', 'utf8');
  const tsconfig = json5.parse(tsconfigJson);

  /** @type {Array<string>} */
  const includePatterns = tsconfig.include;
  /** @type {Array<string>} */
  const excludePatterns = tsconfig.exclude;
  const patterns = includePatterns.concat(excludePatterns.map((p) => `!${p}`));

  return await globAll(patterns);
}

async function run() {
  const allCheckedFiles = await getAllCheckedFiles();

  const results = await Promise.all(
    Object.entries(categories).map(async ([categoryName, patterns]) => {
      const categoryFiles = await globAll(patterns);
      const categoryCheckedFiles = categoryFiles.filter((f) => allCheckedFiles.includes(f));
      return {
        CATEGORY: categoryName,
        CHECKED: categoryCheckedFiles.length,
        TOTAL: categoryFiles.length,
        PERCENTAGE: ((categoryCheckedFiles.length * 100) / categoryFiles.length).toFixed(2) + '%',
      };
    }),
  );

  console.table(results);
}

run().catch((e) => {
  console.error('[!] An error occurred!');
  console.error(e);
  process.exit(1);
});
