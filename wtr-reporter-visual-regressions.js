import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @typedef {import('@web/test-runner').Reporter} Reporter
 * @typedef {import('@web/test-runner-core/src/reporter/Reporter').TestRunFinishedArgs} TestRunFinishedArgs
 */

/** @returns {Reporter} */
export function myReporter({ reportResults = true, reportProgress = false } = {}) {
  return {
    /**
     * Called when a test run is finished. Each file change in watch mode
     * triggers a test run. This can be used to report the end of a test run,
     * or to write a test report to disk in watch mode for each test run.
     *
     * @param testRun the test run
     */
    onTestRunFinished({ testRun, sessions, testCoverage, focusedTestFile }) {
      function collectFailedTests(suite, parentPath = []) {
        const currentPath = [...parentPath, suite.name];
        const failedTests = suite.tests
          .filter((test) => test.passed === false)
          .map((test) => ({
            suitePath: currentPath,
            testName: test.name,
            error: test.error,
          }));
        const nestedFailed = (suite.suites || []).flatMap((childSuite) => collectFailedTests(childSuite, currentPath));
        return [...failedTests, ...nestedFailed];
      }

      // Group failed tests by component (1st suitepath), then story (2nd), then viewport (3rd)
      const components = {};

      const BASE_SCREENSHOT_URL = '/home/flo-pro/Projects/clever-components--gh-actions/screenshots/';

      sessions.forEach((session) => {
        const failedTests = (session.testResults?.suites || []).flatMap((suite) => collectFailedTests(suite));
        failedTests.forEach((test) => {
          const [component, story, viewport] = test.suitePath;
          if (!components[component]) components[component] = {};
          if (!components[component][story]) components[component][story] = {};
          if (!components[component][story][viewport]) components[component][story][viewport] = [];
          components[component][story][viewport].push({
            component,
            story,
            viewport,
            browser: session.browser?.name,
            testFile: session.testFile,
            suitePath: test.suitePath,
            testName: test.testName,
            error: test.error,
            screenshots: {
              baseline: `${BASE_SCREENSHOT_URL}${session.browser?.name}/baseline/${component}-${story}-${viewport}.png`,
              failed: `${BASE_SCREENSHOT_URL}${session.browser?.name}/failed/${component}-${story}-${viewport}.png`,
              diff: `${BASE_SCREENSHOT_URL}${session.browser?.name}/failed/${component}-${story}-${viewport}-diff.png`,
            },
          });
        });
      });

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const reportDir = path.join(__dirname, 'test-reports');
      const reportPath = path.join(reportDir, 'test-visual-regressions.report.json');
      const reportData = JSON.stringify({ testRun, components }, null, 2);

      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }

      fs.writeFileSync(reportPath, reportData, 'utf8');
      console.log(`Visual regression report saved to ${reportPath}`);
    },
  };
}
