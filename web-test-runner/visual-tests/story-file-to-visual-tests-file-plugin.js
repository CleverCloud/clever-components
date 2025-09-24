/** @type {import('@web/test-runner').TestRunnerPlugin} */
export const storyFileToVisualTestsFilePlugin = {
  name: 'story-file-to-visual-test-file',
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
        import { runVisualTests } from '/test/helpers/visual-tests.js';
        import * as storiesModule from '${context.path.replace('.stories.test.js', '.stories.js')}';

        runVisualTests(storiesModule);
      `;
      return testFileContent;
    }
  },
};
