import { mkdirSync, writeFileSync } from 'node:fs';

import {
  VISUAL_TESTS_FINAL_REPORT_NAME,
  VISUAL_TESTS_REPORTS_DIR,
} from '../../web-test-runner/visual-tests/visual-tests-utils.js';

const { default: visualTestsFinalReport } = await import(
  `../../${VISUAL_TESTS_REPORTS_DIR}/${VISUAL_TESTS_FINAL_REPORT_NAME}`,
  {
    with: { type: 'json' },
  }
);

const html = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>PR ${visualTestsFinalReport.prNumber} - Visual tests Report</title>
      <link rel="stylesheet" href="https://components.clever-cloud.com/styles.css" />
      <script
        type="module"
        src="https://preview-components.clever-cloud.com/load.js?version=tests-visual-changes&lang=en&components=cc-visual-tests-report"
      ></script>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          font-family: 'Nunito Sans', 'Segoe UI', 'Ubuntu', 'Cantarell', 'Noto Sans', 'Liberation Sans', 'Arial', sans-serif;
        }
      </style>
    </head>
    <body>
      <cc-visual-tests-report></cc-visual-tests-report>
      <script type="module">
        const rawReport = window['visual-tests-report'].textContent;
        const report = JSON.parse(rawReport);

        const ccVisualTestsReport = document.querySelector('cc-visual-tests-report');
        ccVisualTestsReport.report = report;

        function getTestResultIdFromQueryParams() {
          const currentLocationUrl = new URL(window.location);
          return currentLocationUrl.searchParams.get('testResultId');
        }

        const testResultId = getTestResultIdFromQueryParams();

        if (testResultId != null) {
          navigateTo(testResultId);
        }

        document.addEventListener('click', (e) => {
          const linkElement = e.composedPath().find((element) => element instanceof HTMLAnchorElement);

          if (
            linkElement != null &&
            linkElement.origin === window.location.origin &&
            linkElement.pathname.startsWith('/test-result/')
          ) {
            e.preventDefault();
            const testResultId = linkElement.pathname.split('/').pop();

            const url = new URL(window.location);
            url.searchParams.set('testResultId', testResultId);
            window.history.pushState({ testResultId }, '', url);
            navigateTo(testResultId);
          }
        });

        // handle browser history API (backward / forward in history)
        window.addEventListener('popstate', (event) => {
          const testResultId = event.state?.testResultId;
          navigateTo(testResultId);
        });

        function navigateTo(testResultId) {
          const testResult = report.results.find((result) => result.id === testResultId);
          if (testResult != null) {
            document.title = testResult.componentTagName + ' ' + testResult.storyName + ' ' + testResult.viewportType + ' ' + testResult.browserName + ' | PR ' + report.prNumber + ' | ' + 'Visual Tests Report'
          }
          ccVisualTestsReport.activeTestResultId = testResultId;
        }
      </script>
      <script type="application/json" id="visual-tests-report">
        ${JSON.stringify(visualTestsFinalReport)}
      </script>
    </body>
  </html>
`;

mkdirSync(VISUAL_TESTS_REPORTS_DIR, { recursive: true });
writeFileSync(`${VISUAL_TESTS_REPORTS_DIR}/index.html`, html, { encoding: 'utf-8' });
