/**
 * Transform the result of an imported module from a story file into an array of story functions that can be used to render every story.
 * The imported module is an object containing every named export (story functions mostly) as well as the default export (metadata about the stories).
 *
 * @param {Object} importedModule the result of a story file import.
 * @param {Array} excludedStories the names of the stories to exclude. These names correspond to the names exported from the story file (for instance `defaultStory`).
 * @returns {Array} the story functions, minus the simulations and the excluded stories. These functions can be used to render each story.
 */
export const getStories = (importedModule, excludedStories = []) => {
  const allExcludedStories = [...(importedModule.default?.excludeStories ?? []), ...excludedStories];

  const filteredStories = Object.entries(importedModule)
    .filter(([name, exportItem]) => {
      const isNotExcludedStory = !allExcludedStories.includes(name);
      const isNotSimulation = !name.match(/simulation/i);
      const isFunction = typeof exportItem === 'function';
      return isNotExcludedStory && isNotSimulation && isFunction;
    })
    .map(([storyName, storyFunction]) => ({ storyName, storyFunction }));

  return filteredStories;
};
