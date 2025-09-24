import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { globSync } from 'tinyglobby';
import {
  BRANCH_NAME,
  VISUAL_TESTS_FINAL_REPORT_NAME,
  VISUAL_TESTS_RAW_REPORT_NAME,
  VISUAL_TESTS_REPORTS_DIR,
} from '../../web-test-runner/visual-tests/visual-tests-utils.js';

const paths = globSync(`${VISUAL_TESTS_REPORTS_DIR}/**/${VISUAL_TESTS_RAW_REPORT_NAME}`, { absolute: true });

/** @type {import('../../src/components/cc-visual-tests-report/visual-tests-report.types.js').VisualTestResult[]} */
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

/** @type {import('../../src/components/cc-visual-tests-report/visual-tests-report.types.js').VisualTestsReport} */
const finalJsonReport = {
  expectationMetadata: {
    commitReference: process.env.BASE_COMMIT_SHA,
    lastUpdated: process.env.LAST_EXPECTATION_UPDATE,
  },
  actualMetadata: {
    commitReference: process.env.HEAD_COMMIT_SHA,
    lastUpdated: process.env.LAST_ACTUAL_UPDATE,
  },
  workflowId: process.env.WORKFLOW_ID,
  prNumber: process.env.PR_NUMBER,
  branchName: BRANCH_NAME,
  repositoryName: process.env.REPOSITORY_NAME,
  repositoryOwner: process.env.REPOSITORY_OWNER,
  impactedComponents: [...new Set(concatenatedResults.map((result) => result.componentTagName))],
  results: concatenatedResults,
};

mkdirSync(VISUAL_TESTS_REPORTS_DIR, { recursive: true });
writeFileSync(`${VISUAL_TESTS_REPORTS_DIR}/${VISUAL_TESTS_FINAL_REPORT_NAME}`, JSON.stringify(finalJsonReport), {
  encoding: 'utf-8',
});

if (process.env.GITHUB_OUTPUT != null) {
  appendFileSync(process.env.GITHUB_OUTPUT, `nb-of-impacted-components=${finalJsonReport.impactedComponents.length}\n`);
  const impactedComponentsMarkdownList = finalJsonReport.impactedComponents.map(
    (impactedComponent) => `- ${impactedComponent},\n`,
  );
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `impacted-components-md<<EOF${EOL}${impactedComponentsMarkdownList.join('')}${EOL}EOF${EOL}`,
  );
}

console.log(`Generated final JSON visual tests report: ${VISUAL_TESTS_REPORTS_DIR}/${VISUAL_TESTS_FINAL_REPORT_NAME}`);
