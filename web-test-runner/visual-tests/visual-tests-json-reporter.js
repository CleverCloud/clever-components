import { mkdirSync, writeFileSync } from 'node:fs';
import { kebabCase } from '../../src/lib/change-case.js';
import {
  VISUAL_TESTS_RAW_REPORT_NAME,
  VISUAL_TESTS_REPORTS_DIR,
  VISUAL_TESTS_UPDATE_FLAG,
  getScreenshotUrl,
} from './visual-tests-utils.js';

/**
 * @typedef {import('@web/test-runner').Reporter} Reporter
 * @typedef {import('@web/test-runner').TestSuiteResult} TestSuiteResult
 * @typedef {import('../../src/components/cc-visual-tests-report/visual-tests-report.types.js').VisualTestResult} VisualTestResult
 * @typedef {import('../../src/components/cc-visual-tests-report/visual-tests-report.types.js').BrowserName} BrowserName
 * @typedef {import('../../src/components/cc-visual-tests-report/visual-tests-report.types.js').ViewportType} ViewportType
 */

/** @returns {Reporter} */
export function visualTestsJsonReporter() {
  return {
    onTestRunFinished({ sessions }) {
      if (process.argv.includes(VISUAL_TESTS_UPDATE_FLAG)) {
        console.log('Expectation update detected: Skipping report');
        return;
      }

      /** @type {VisualTestResult[]} */
      const visualTestsResults = [];

      for (const { browser, testResults } of sessions) {
        const browserName = /** @type {BrowserName} */ (browser.name.toLocaleLowerCase());
        for (const { name: componentTagName, suites: componentSuites } of testResults.suites) {
          for (const { name: storyName, suites: storySuites } of componentSuites) {
            for (const {
              name: viewportType,
              tests: [visualRegressionTest],
            } of /** @type {Array<TestSuiteResult & { name: ViewportType }>} */ (storySuites)) {
              if (visualRegressionTest == null || visualRegressionTest.passed) {
                continue;
              }

              const commonGetScreenshotUrlArgs = {
                browser: browserName,
                componentTagName,
                storyName,
                viewportType,
              };

              /** @type {VisualTestResult} */
              const visualTestResult = {
                id: kebabCase(`${componentTagName}-${storyName}-${viewportType}-${browserName}`),
                browserName,
                componentTagName,
                storyName,
                viewportType,
                screenshots: {
                  expectationScreenshotUrl: getScreenshotUrl({
                    ...commonGetScreenshotUrlArgs,
                    screenshotType: 'expectation',
                  }),
                  actualScreenshotUrl: getScreenshotUrl({
                    ...commonGetScreenshotUrlArgs,
                    screenshotType: 'actual',
                  }),
                  diffScreenshotUrl: getScreenshotUrl({
                    ...commonGetScreenshotUrlArgs,
                    screenshotType: 'diff',
                  }),
                },
              };
              visualTestsResults.push(visualTestResult);
            }
          }
        }
      }

      mkdirSync(VISUAL_TESTS_REPORTS_DIR, { recursive: true });
      writeFileSync(
        `${VISUAL_TESTS_REPORTS_DIR}/${VISUAL_TESTS_RAW_REPORT_NAME}`,
        JSON.stringify({ results: visualTestsResults }, null, 2),
        'utf-8',
      );
      console.log(`Generated visual tests report in "${VISUAL_TESTS_REPORTS_DIR}/${VISUAL_TESTS_RAW_REPORT_NAME}"`);
    },
  };
}
