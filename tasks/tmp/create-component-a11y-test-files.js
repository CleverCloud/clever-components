import fs from 'fs';
import path from 'path';

const basePath = './src/components';
const ignoredPaths = [
  'cc-smart-container',
  'common.types.d.ts',
  'cc-expand',
  'cc-flex-gap',
  'cc-datetime-relative',
];

const ignoreColorContrast = ['cc-header-app', 'cc-overview', 'cc-tile-instances', 'cc-tile-scalability', 'cc-expand'];

/* eslint-disable no-useless-escape */
const generateTestContent = (componentName) => {
  return `/* eslint-env node, mocha */

import { testAccessibility } from '../../../test/helpers/accessibility.js';
import { getStories } from '../../../test/helpers/get-stories.js';
import * as storiesModule from './${componentName}.stories.js';

${componentName === 'cc-toaster' ? '\nconst storiesToExclude = [\'notAStory\'];' : ''}
const storiesToTest = getStories(${componentName === 'cc-toaster' ? 'storiesModule, storiesToExclude' : 'storiesModule'});

describe(\`Component: \$\{storiesModule.default.component\}\`, function () {
  ${ignoreColorContrast.includes(componentName) ? 'testAccessibility(storiesToTest, [\'color-contrast\'])' : 'testAccessibility(storiesToTest)'};
});
`;
};
/* eslint-enable no-useless-escape*/

fs.readdir('./src/components', function (err, files) {
  if (err) {
    throw err;
  }

  files
    .filter((file) => !ignoredPaths.includes(file))
    .forEach((file) => {
      const testFilePath = path.join(basePath, file, `${file}.test.js`);
      console.log('Generating: ', testFilePath);
      fs.appendFile(testFilePath, generateTestContent(file), function (err) {
        if (err) {
          throw err;
        }
      });
    });
});
