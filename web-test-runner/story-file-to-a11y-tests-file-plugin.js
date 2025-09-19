/** @type {import('@web/test-runner').TestRunnerPlugin} */
export const storyFileToA11yTestsFilePlugin = {
  name: 'story-file-to-a11y-tests-file',
  async transformImport({ source, context }) {
    // if `.stories.js` is imported by WTR itself, then we change it to import the test file
    if (context.request.url.startsWith('/?wtr-session-id=') && source.includes('.stories.js?wtr-session')) {
      return source.replace('.stories.js', '.stories.test.js');
    }
  },
  async serve(context) {
    // test files are generated on the fly and they import story modules
    if (context.path.endsWith('.stories.test.js')) {
      const testFileContent = `
        import { runA11yTests } from '/test/helpers/a11y-tests.js';
        import * as storiesModule from '${context.path.replace('.stories.test.js', '.stories.js')}';

        runA11yTests(storiesModule);
      `;
      return testFileContent;
    }
  },
};
