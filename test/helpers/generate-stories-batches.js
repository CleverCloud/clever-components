import { globSync } from 'tinyglobby';

const nbOfStoriesByBatch = 25;
/** @returns {Array<{ name: string, files: string[] }>} */
export function getStoriesGroups() {
  let groupIndex = 0;
  /** @type {{ [key: `batch-${number}`]: string[] }} */
  let groups = {};
  let arrayOfGroups;

  globSync(['src/components/**/*.stories.js']).forEach((path, index, listOfStories) => {
    if (index % nbOfStoriesByBatch === 0) {
      groupIndex++;
      groups[`batch-${groupIndex}`] = [];
    }

    groups[`batch-${groupIndex}`].push(path);

    if (index === listOfStories.length - 1) {
      arrayOfGroups = Object.entries(groups).map(([name, files]) => ({
        name,
        files,
      }));
    }
  });

  return arrayOfGroups;
}
