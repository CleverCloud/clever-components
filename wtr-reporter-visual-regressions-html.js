import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { kebabCase } from './src/lib/change-case.js';
import { CELLAR_HOST, CellarClient } from './tasks/cellar-client.js';
import { getCurrentBranch } from './tasks/git-utils.js';

/**
 * @typedef {import('@web/test-runner').Reporter} Reporter
 * @typedef {import('@web/test-runner-core/src/reporter/Reporter').TestRunFinishedArgs} TestRunFinishedArgs
 */

const BUCKET_NAME = 'clever-test-flo-visual-regressions';
const cellar = new CellarClient({
  bucket: 'clever-test-flo-visual-regressions',
  accessKeyId: process.env.VISUAL_REGRESSIONS_CELLAR_KEY_ID,
  secretAccessKey: process.env.VISUAL_REGRESSIONS_CELLAR_SECRET_KEY,
});

const CURRENT_BRANCH_NAME = getCurrentBranch();
const BASE_SCREENSHOT_URL = new URL(`${BUCKET_NAME}/${CURRENT_BRANCH_NAME}`, `https://${CELLAR_HOST}`);

/** @returns {Reporter} */
export function myHtmlReporter({ reportResults = true, reportProgress = false } = {}) {
  return {
    /**
     * Called when a test run is finished. Each file change in watch mode
     * triggers a test run. This can be used to report the end of a test run,
     * or to write a test report to disk in watch mode for each test run.
     *
     * @param testRun the test run
     */
    onTestRunFinished({ testRun, sessions, testCoverage, focusedTestFile }) {
      // Group failed tests by component (1st suitepath), then story (2nd), then viewport (3rd)
      const components = {};

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
              baseline: `${BASE_SCREENSHOT_URL}/${session.browser?.name.toLowerCase()}/baseline/${component}-${kebabCase(story)}-${viewport}.png`,
              failed: `${BASE_SCREENSHOT_URL}/${session.browser?.name.toLowerCase()}/failed/${component}-${kebabCase(story)}-${viewport}.png`,
              diff: `${BASE_SCREENSHOT_URL}/${session.browser?.name.toLowerCase()}/failed/${component}-${kebabCase(story)}-${viewport}-diff.png`,
            },
          });
        });
      });

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Visual Regression Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2em; background: #f9f9f9; }
    h1 { color: #333; }
    .component-block { border: 2px solid #bbb; margin-bottom: 2em; background: #fff; padding: 1em; border-radius: 8px; }
    .story-block { border: 1px solid #ccc; margin: 1em 0; padding: 1em; border-radius: 6px; background: #f6f6f6; }
    .viewport-block { margin: 1em 0 2em 1em; padding: 1em; background: #f0f0f0; border-radius: 4px; }
    .test-entry { margin: 1em 0; padding: 1em; border: 1px solid #eee; border-radius: 4px; background: #fafafa; }
    .test-meta { margin-bottom: 0.5em; }
    .screenshots-flex-row { display: flex; flex-wrap: wrap; gap: 1em; margin-bottom: 0.5em; }
    .screenshot-col-half { flex: 1 1 0; min-width: 0; text-align: center; }
    .screenshot-col-full { flex: 1 1 100%; width: 100%; text-align: center; margin-top: 1em; }
    .screenshot-img-large { max-width: 100%; width: 100%; max-width: 500px; max-height: 400px; border: 1px solid #ccc; background: #fff; }
    .error-block { color: #b00; margin-top: 0.5em; }
    pre { background: #eee; padding: 0.5em; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Visual Regression Report</h1>
  <p><strong>Test Run:</strong> ${escapeHtml(testRun)}</p>
  ${Object.entries(components)
    .map(([component, stories]) => renderComponent(component, stories))
    .join('\n')}
</body>
</html>
      `;

      // const currentBranchName = getCurrentBranch();
      // FIXME: terrible, we cannot be async
      // we have to:
      // - create an issue & PR to make onTestRunFinished async,
      // - or write to disk (sync) & move this outside (in GH action),
      // - or use vitest because onFinished is async
      // cellar.putObject({
      //   key: `${currentBranchName}/test-report.html`,
      //   body: html,
      // });

      // Write HTML to disk
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const reportDir = path.join(__dirname, 'test-reports');
      const reportPath = path.join(reportDir, 'test-visual-regressions.report.html');

      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }

      fs.writeFileSync(reportPath, html, 'utf8');
    },
  };
}

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

// Generate HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderError(error) {
  if (!error) return '';
  if (typeof error === 'string') return `<pre>${escapeHtml(error)}</pre>`;
  if (error.message || error.stack) {
    return `<pre>${escapeHtml(error.message || '')}\n${escapeHtml(error.stack || '')}</pre>`;
  }
  return `<pre>${escapeHtml(JSON.stringify(error, null, 2))}</pre>`;
}

function renderTest(test) {
  return `
    <div class="test-entry">
      <div class="test-meta">
        <strong>Test:</strong> ${escapeHtml(test.testName)}<br>
        <strong>Browser:</strong> ${escapeHtml(test.browser || '')}<br>
        <strong>File:</strong> ${escapeHtml(test.testFile || '')}
      </div>
      <div class="screenshots-flex-row">
        <div class="screenshot-col-half">
          <span>Baseline</span><br>
          <img src="${test.screenshots.baseline}" alt="Baseline" class="screenshot-img-large">
        </div>
        <div class="screenshot-col-half">
          <span>Failed</span><br>
          <img src="${test.screenshots.failed}" alt="Failed" class="screenshot-img-large">
        </div>
      </div>
      <div class="screenshots-flex-row">
        <div class="screenshot-col-full">
          <span>Diff</span><br>
          <img src="${test.screenshots.diff}" alt="Diff" class="screenshot-img-large">
        </div>
      </div>
      <div class="error-block">
        <strong>Error:</strong>
        ${renderError(test.error)}
      </div>
    </div>
  `;
}

function renderViewport(viewport, tests) {
  return `
    <div class="viewport-block">
      <h4>Viewport: ${escapeHtml(viewport)}</h4>
      ${tests.map(renderTest).join('\n')}
    </div>
  `;
}

function renderStory(story, viewports) {
  return `
    <div class="story-block">
      <h3>Story: ${escapeHtml(story)}</h3>
      ${Object.entries(viewports)
        .map(([viewport, tests]) => renderViewport(viewport, tests))
        .join('\n')}
    </div>
  `;
}

function renderComponent(component, stories) {
  return `
    <div class="component-block">
      <h2>Component: ${escapeHtml(component)}</h2>
      ${Object.entries(stories)
        .map(([story, viewports]) => renderStory(story, viewports))
        .join('\n')}
    </div>
  `;
}
