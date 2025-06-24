import { writeFileSync } from 'node:fs';
import { globSync } from 'tinyglobby';
import { getCurrentBranch, getCurrentCommit } from './git-utils.js';

const CURRENT_BRANCH = getCurrentBranch();
const paths = globSync('test-reports/visual-regression-results*.json', { absolute: true });
let concatenatedResults = [];

const jsonModules = await Promise.all(paths.map((path) => import(path, { with: { type: 'json' } })));

jsonModules.map(({ default: results }) => {
  concatenatedResults = [...concatenatedResults, ...results];
});

const finalJsonReport = {
  baselineMetadata: {
    commitReference: process.env.BASE_SHA,
    lastUpdated: process.env.LAST_BASELINE_UPDATE,
  },
  changesMetadata: {
    commitReference: getCurrentCommit(),
    lastUpdated: new Date(),
  },
  workflowId: process.env.WORKFLOW_ID,
  prNumber: process.env.PR_NUMBER,
  branch: CURRENT_BRANCH,
  impactedComponents: concatenatedResults.map((result) => result.componentTagName),
  results: concatenatedResults,
};

const htmlReport = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>PR #${process.env.PR_NUMBER} - Branch ${CURRENT_BRANCH} - Visual Regression Report</title>
    <script type="module"></script>
    <script>
      const ccVisualChangesReporter = document.querySelector('cc-visual-changes-reporter');
      ccVisualChangesReporter.report = ${finalJsonReport};
    </script>
  </head>
  <body>
    <cc-visual-changes-reporter></cc-visual-changes-reporter>
  </body>
  </html>
`;

writeFileSync('test-reports/visual-regression-results.json', JSON.stringify(finalJsonReport), { encoding: 'utf-8' });
writeFileSync('test-reports/visual-regression-results.html', htmlReport, { encoding: 'utf-8' });
