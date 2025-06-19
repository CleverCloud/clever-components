import { getStoriesGroups } from '../test/helpers/generate-stories-batches.js';

const result = getStoriesGroups().map((_, index) => index + 1);
console.log(JSON.stringify(result));
