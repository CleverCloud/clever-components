import { init, parse } from 'es-module-lexer';
import { readFileSync } from 'node:fs';
import { globSync } from 'tinyglobby';

const MAX_NB_OF_GROUPS = 5;

/**
 * Counts the number of stories in a story file by parsing its exports with es-module-lexer
 * @param {string} filePath - Path to the story file
 * @returns {number} Number of stories in the file
 */
function countStoriesInFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const [_, exports] = parse(content);

    const namedExports = exports.filter(
      (exp) => exp.n !== 'default' && !exp.n.toLocaleLowerCase().startsWith('simulation'),
    );
    return namedExports.length;
  } catch (error) {
    console.warn(`Warning: Could not count stories in ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Groups story files by approximate story count using an optimized distribution algorithm
 * @returns {Promise<Array<{ name: string, files: string[], nbOfStories: number }>>}
 */
export async function getStoriesGroups() {
  await init;
  const storyFiles = globSync(['src/components/**/*.stories.js'], { absolute: true });

  // Create array of file info with story counts
  const filesWithCounts = storyFiles.map((filePath) => ({
    filePath,
    storyCount: countStoriesInFile(filePath),
  }));

  // Calculate total stories for logging
  const totalStories = filesWithCounts.reduce((sum, file) => sum + file.storyCount, 0);
  console.log(`Total stories found: ${totalStories} across ${storyFiles.length} files`);

  // Sort files by story count (descending) for better distribution
  filesWithCounts.sort((a, b) => b.storyCount - a.storyCount);

  // Initialize groups
  const groups = Array.from({ length: Math.min(MAX_NB_OF_GROUPS, storyFiles.length) }, (_, i) => ({
    name: `stories-group-${i + 1}`,
    files: [],
    nbOfStories: 0,
  }));

  // Use First Fit Decreasing algorithm for optimal distribution
  for (const fileWithCounts of filesWithCounts) {
    // Find the group with the least stories
    const targetGroup = groups.reduce((min, group) => (group.nbOfStories < min.nbOfStories ? group : min));

    targetGroup.files.push(fileWithCounts.filePath);
    targetGroup.nbOfStories += fileWithCounts.storyCount;
  }

  groups.forEach((group) => {
    console.log(`  ${group.name}: ${group.nbOfStories} stories (${group.files.length} files)`);
  });

  return groups;
}
