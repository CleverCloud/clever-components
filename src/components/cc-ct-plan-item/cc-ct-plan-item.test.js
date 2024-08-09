/* eslint-env node, mocha */

import { testAccessibility } from '../../../test/helpers/accessibility.js';
import { getStories } from '../../../test/helpers/get-stories.js';
import * as storiesModule from './cc-ct-plan-item.js';

const storiesToTest = getStories(storiesModule);

describe(`Component: ${storiesModule.default.component}`, function () {
  testAccessibility(storiesToTest);
});
