/* eslint-env node, mocha */

import { testAccessibility } from '../../../test/helpers/accessibility.js';
import { getStories } from '../../../test/helpers/get-stories.js';
import * as storiesModule from './cc-toaster.stories.js';

const storiesToExclude = ['notAStory'];
const storiesToTest = getStories(storiesModule, storiesToExclude);

describe(`Component: ${storiesModule.default.component}`, function () {
  testAccessibility(storiesToTest);
});
