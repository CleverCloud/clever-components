import { playwrightLauncher } from '@web/test-runner-playwright';
import defaultWtrConfig from './web-test-runner.config.js';
import { getStoriesGroups } from './web-test-runner/get-story-files-groups.js';
import { storyFileToVisualTestsFilePlugin } from './web-test-runner/visual-tests/story-file-to-visual-tests-file-plugin.js';
import { visualRegressionPluginWithConfig } from './web-test-runner/visual-tests/visual-regression-plugin-with-config.js';
import { visualTestsJsonReporter } from './web-test-runner/visual-tests/visual-tests-json-reporter.js';

export default {
  ...defaultWtrConfig,
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      concurrency: 3,
      createBrowserContext({ browser }) {
        return browser.newContext({ timezoneId: 'Europe/Paris', deviceScaleFactor: 1, reducedMotion: 'reduce' });
      },
    }),
  ],
  reporters: [...defaultWtrConfig.reporters, visualTestsJsonReporter()],
  groups: await getStoriesGroups(),
  testRunnerHtml: (testFramework) => `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="src/styles/default-theme.css" >
        <script type="module" src="${testFramework}"></script>
        <script type="module" src="/test/helpers/global-mock-date.js"></script>
        <script type="module" src="/test/helpers/global-mock-random.js"></script>
        <script>
          window.process = {env: { NODE_ENV: "production" }}
        </script>
        <style>
        .story-shadow-container {
          padding: 1rem;
        }
        </style>
      </head>
    </html>
  `,
  plugins: [
    ...defaultWtrConfig.plugins.filter(({ name }) => name !== 'story-file-to-a11y-tests-file'),
    storyFileToVisualTestsFilePlugin,
    visualRegressionPluginWithConfig,
  ],
};
