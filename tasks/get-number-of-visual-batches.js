import { getStoriesGroups } from '../test/helpers/generate-stories-batches.js';

const result = getStoriesGroups().map((_, index) => `batch-${index + 1}`);
console.log(JSON.stringify(result));
