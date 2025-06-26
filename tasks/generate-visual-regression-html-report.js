import { html, render } from '@lit-labs/ssr';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { globSync } from 'tinyglobby';
import '../src/components/cc-badge/cc-badge.js';
import '../src/components/cc-visual-changes-menu/cc-visual-changes-menu.js';
import '../src/components/cc-visual-changes-report-entry/cc-visual-changes-report-entry.js';
import { getCurrentBranch, getCurrentCommit } from './git-utils.js';

const CURRENT_BRANCH = getCurrentBranch();

const paths = globSync(
<<<<<<< HEAD
  ['test-reports/**/visual-regression-results*.json', '!test-reports/**/visual-regression-results-merged.json'],
||||||| parent of ea5000f6 (feat: test comment)
const paths = globSync('test-reports/visual-regression-results*.json', { absolute: true });
=======
  ['test-reports/visual-regression-results*.json', '!test-reports/visual-regression-results-merged.json'],
>>>>>>> ea5000f6 (feat: test comment)
  { absolute: true },
);
let concatenatedResults = [];

const jsonModules = await Promise.all(
  paths.map((path) =>
    import(path, { with: { type: 'json' } })
      .then((jsonModule) => {
        console.log(`Import successful: ${path}`);
        return jsonModule;
      })
      .catch((error) => console.error(`Import failed: ${path}`, error)),
  ),
);

jsonModules.map(({ default: report }) => {
  concatenatedResults = [...concatenatedResults, ...report.results];
});

const finalJsonReport = {
  baselineMetadata: {
    commitReference: process.env.BASE_SHA,
    lastUpdated: process.env.LAST_BASELINE_UPDATE,
  },
  changesMetadata: {
    commitReference: getCurrentCommit(),
    lastUpdated: new Date().toISOString(),
  },
  workflowId: process.env.WORKFLOW_ID,
  prNumber: process.env.PR_NUMBER,
  branch: CURRENT_BRANCH,
  impactedComponents: [...new Set(concatenatedResults.map((result) => result.componentTagName))],
  results: concatenatedResults,
};

const htmlReportTemplate = html`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>PR ${process.env.PR_NUMBER} - Branch ${CURRENT_BRANCH} - Visual Regression Report</title>
      <link rel="stylesheet" href="https://components.clever-cloud.com/styles.css" />
      ${unsafeHTML(`
          <script>
            window.toto = ${JSON.stringify(finalJsonReport)};
          </script>
        `)}
      <style>
        body {
          display: flex;
          gap: 2em;
          padding: 0;
          margin: 0;
        }

        html,
        body,
        nav {
          height: 100%;
        }

        cc-visual-changes-menu {
          max-width: 20em;
          overflow: scroll;
        }

        main {
          flex: 1 1 0;
          padding: 1em;
        }
      </style>
      <script
        type="module"
        src="https://preview-components.clever-cloud.com/load.js?version=visual-changes-new-components&lang=en&components=cc-visual-changes-menu,cc-visual-changes-report-entry"
      ></script>
    </head>
    <body>
      <!-- TODO: logo en haut du menu, h1 et metadata? -->
      <nav aria-label="Visual changes tests results menu">
        <cc-visual-changes-menu></cc-visual-changes-menu>
      </nav>
      <main>
        <cc-visual-changes-report-entry></cc-visual-changes-report-entry>
      </main>
      <script type="module">
        // TODO: rely on CDN
        // import('/src/components/cc-visual-changes-menu/cc-visual-changes-menu.js');
        // import('/src/components/cc-visual-changes-report-entry/cc-visual-changes-report-entry.js');

        const entityDecoder = document.createElement('textarea');
        // TODO: should we sanitize just in case?!
        entityDecoder.innerHTML = document.getElementById('visual-changes-report').textContent;
        const decodedReport = entityDecoder.value;

        const report = JSON.parse(decodedReport);

        const ccVisualChangesReportEntry = document.querySelector('cc-visual-changes-report-entry');
        const ccVisualChangesMenu = document.querySelector('cc-visual-changes-menu');
        ccVisualChangesReportEntry.testResult = report.results[0];
        ccVisualChangesMenu.testResults = report.results;

        if (window.location.search.length > 0) {
          const currentLocationUrl = new URL(window.location);
          navigateTo(currentLocationUrl.searchParams.get('testResultId'));
        }

        document.addEventListener('click', (e) => {
          const linkElement = e.composedPath().find((element) => element.tagName === 'A');

          if (linkElement != null && linkElement.origin === window.location.origin) {
            e.preventDefault();
            const testResultId = linkElement.pathname.split('/').pop();

            ccVisualChangesReportEntry.testResult = report.results.find(({ id }) => id === testResultId);
            const url = new URL(window.location);
            url.searchParams.set('testResultId', testResultId);
            window.history.pushState({ testResultId }, '', url);
          }
        });

        window.addEventListener('popstate', (event) => {
          let testResultId;
          if (event.state && event.state.testResultId) {
            testResultId = event.state.testResultId;
          } else {
            testResultId = window.location.pathname.split('/').pop();
          }
          navigateTo(testResultId);
        });

        function navigateTo(testResultId) {
          const result = report.results.find(({ id }) => id === testResultId) ?? report.results[0];
          ccVisualChangesReportEntry.testResult = result;
        }
      </script>
      <script type="text/json" id="visual-changes-report">
        ${JSON.stringify(finalJsonReport)}
      </script>
    </body>
  </html>
`;
const ssrResult = render(htmlReportTemplate);

mkdirSync('test-reports', { recursive: true });
writeFileSync('test-reports/visual-regression-results-merged.json', JSON.stringify(finalJsonReport), {
  encoding: 'utf-8',
});
writeFileSync('test-reports/visual-regression-results.html', collectResultSync(ssrResult), { encoding: 'utf-8' });
