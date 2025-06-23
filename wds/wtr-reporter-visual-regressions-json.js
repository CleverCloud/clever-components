import { mkdirSync, writeFileSync } from 'node:fs';
import { getBranchBaseCommit, getCurrentBranch, getCurrentCommit } from '../tasks/git-utils.js';
import { getScreenshotUrl } from '../test/helpers/get-screenshot-path.js';

/**
 * @typedef {import('@web/test-runner').Reporter} Reporter
 * @typedef {import('@web/test-runner').TestSuiteResult} TestSuiteResult
 * @typedef {import('@web/test-runner-core/src/reporter/Reporter').TestRunFinishedArgs} TestRunFinishedArgs
 * @typedef {import('./wtr-reporter-visual-regressions-json.types.js').VisualRegressionTestResult} VisualRegressionTestResult
 * @typedef {import('./wtr-reporter-visual-regressions-json.types.js').TestsByStories} TestsByStories
 * @typedef {import('./wtr-reporter-visual-regressions-json.types.js').TestsByViewportType} TestsByViewportType
 * @typedef {import('./wtr-reporter-visual-regressions-json.types.js').ResultByComponent} ResultByComponent
 * @typedef {import('./wtr-reporter-visual-regressions-json.types.js').ViewportType} ViewportType
 * @typedef {import('./wtr-reporter-visual-regressions-json.types.js').TestFailure} TestFailure
 */

/** @returns {Reporter} */
export function visualRegressionsReporter({ reportResults = true, reportProgress = false } = {}) {
  return {
    /**
     * Called when a test run is finished. Each file change in watch mode
     * triggers a test run. This can be used to report the end of a test run,
     * or to write a test report to disk in watch mode for each test run.
     */
    onTestRunFinished({ sessions }) {
      if (process.argv.includes('--update-visual-baseline')) {
        console.log('Baseline update detected: Skipping report');
        return;
      }

      /** @type {ResultByComponent} */
      const resultsByComponent = {};

      for (const { browser, testResults } of sessions) {
        const browserName = browser.name;
        for (const { name: componentTagName, suites: componentSuites } of testResults.suites) {
          for (const { name: storyName, suites: storySuites } of componentSuites) {
            for (const {
              name: viewportType,
              tests: [visualRegressionTest],
            } of /** @type {Array<TestSuiteResult & { name: ViewportType }>} */ (storySuites)) {
              if (visualRegressionTest.passed) {
                continue;
              }

              /** @type {TestFailure} */
              const testResult = {
                baselineScreenshotUrl: getScreenshotUrl({
                  browser: browserName,
                  componentTagName,
                  storyName,
                  viewportType,
                  screenshotType: 'baseline',
                }),
                changesScreenshotUrl: getScreenshotUrl({
                  browser: browserName,
                  componentTagName,
                  storyName,
                  viewportType,
                  screenshotType: 'changes',
                }),
                diffScreenshotUrl: getScreenshotUrl({
                  browser: browserName,
                  componentTagName,
                  storyName,
                  viewportType,
                  screenshotType: 'diff',
                }),
              };

              mergeVisualRegressionResult(
                resultsByComponent,
                componentTagName,
                storyName,
                viewportType,
                browserName,
                testResult,
              );
            }
          }
        }
      }

      /** @type {VisualRegressionTestResult[]} */
      const visualRegressionResults = Object.entries(resultsByComponent).map(
        ([componentTagName, { fileName, stories }]) => ({
          componentTagName,
          fileName,
          stories: Object.entries(stories).map(([storyName, viewports]) => ({
            storyName,
            viewports: Object.entries(viewports).map(([viewportType, browsers]) => ({
              viewportType: /** @type {ViewportType} */ (viewportType),
              tests: Object.entries(browsers).map(([browserName, testResult]) => ({
                browserName,
                testResult,
              })),
            })),
          })),
        }),
      );

      const jsonReport = {
        baseCommit: getBranchBaseCommit(),
        headCommit: getCurrentCommit(),
        branchName: getCurrentBranch(),
        lastRunDate: new Date().toISOString(),
        results: visualRegressionResults,
      };

      mkdirSync('test-reports', { recursive: true });
      writeFileSync('test-reports/visual-regression-results.json', JSON.stringify(jsonReport, null, 2), 'utf-8');
      console.log('Generated visual regression report in "test-reports/visual-regression-results.json"');
    },
  };
}

/**
 * Helper to merge a visual regression test result into the nested results structure.
 * @param {ResultByComponent} resultsByComponent
 * @param {string} componentTagName
 * @param {string} storyName
 * @param {ViewportType} viewportType
 * @param {string} browserName
 * @param {import('./wtr-reporter-visual-regressions-json.types.js').TestFailure} testResult
 */
function mergeVisualRegressionResult(
  resultsByComponent,
  componentTagName,
  storyName,
  viewportType,
  browserName,
  testResult,
) {
  if (resultsByComponent[componentTagName] == null) {
    resultsByComponent[componentTagName] = {
      fileName: 'TODO: flo', // or actual fileName if available
      stories: {},
    };
  }

  const componentResults = resultsByComponent[componentTagName];

  if (componentResults.stories[storyName] == null) {
    componentResults.stories[storyName] = {};
  }

  const storyResults = componentResults.stories[storyName];

  if (!storyResults[viewportType]) {
    storyResults[viewportType] = {};
  }

  const viewportResults = storyResults[viewportType];

  // Now add/update the browser result
  viewportResults[browserName] = testResult;
}
