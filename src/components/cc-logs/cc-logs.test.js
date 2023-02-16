/* eslint-env node, mocha */

import { testAccessibility } from '../../../test/helpers/accessibility.js';
import { getStories } from '../../../test/helpers/get-stories.js';
import * as storiesModule from './cc-logs.stories.js';

const storiesToExclude = ['dataLoadedWithFollow'];
const storiesToTest = getStories(storiesModule, storiesToExclude);

describe(`Component: ${storiesModule.default.component}`, function () {
  testAccessibility(storiesToTest);
});
