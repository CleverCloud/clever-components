export const testVisualStoriesPlugin = {
  name: 'test-story-visual',
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
        import { testStories } from '/test/helpers/test-visual-regressions.js';
        import '/test/helpers/mock-date.js';
        import * as storiesModule from '${context.path.replace('.stories.test.js', '.stories.js')}';

        testStories(storiesModule);
      `;
      return testFileContent;
    }
  },
};
