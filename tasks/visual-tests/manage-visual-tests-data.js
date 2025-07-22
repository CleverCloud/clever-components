import { appendFileSync } from 'node:fs';
import { DateFormatter } from '../../src/lib/date/date-formatter.js';
import {
  BRANCH_NAME,
  VISUAL_TESTS_CELLAR_BASE_URL,
  VISUAL_TESTS_CELLAR_CREDENTIALS,
  VISUAL_TESTS_REMOTE_REPORT_DIR,
  VISUAL_TESTS_REMOTE_REPORT_PATH,
  VISUAL_TESTS_REPORTS_DIR,
} from '../../web-test-runner/visual-tests/visual-tests-utils.js';
import { CellarClient } from '../cellar-client.js';

const cellar = new CellarClient(VISUAL_TESTS_CELLAR_CREDENTIALS);

const expectedArgs = ['delete', 'upload', 'check-for-expectation-update'];
const actualArgs = process.argv.slice(2);

const invalidArgs = actualArgs.filter((arg) => !expectedArgs.includes(arg));
if (actualArgs.length === 0) {
  throw new Error('No args provided. Expected one of: ' + expectedArgs.join(', '));
}

if (invalidArgs.length > 0) {
  throw new Error(
    'Invalid arguments provided: ' + invalidArgs.join(', ') + '. Expected one of: ' + expectedArgs.join(', '),
  );
}

if (process.argv.includes('delete')) {
  await deleteReportAndAssociatedData();
}

if (process.argv.includes('upload')) {
  await uploadReport();
}

if (process.argv.includes('check-for-expectation-update')) {
  await checkForLastExpectationUpdate();
}

async function uploadReport() {
  await cellar
    .sync({
      localDir: VISUAL_TESTS_REPORTS_DIR,
      remoteDir: VISUAL_TESTS_REMOTE_REPORT_DIR,
      deleteRemoved: true,
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

  const reportUrl = new URL(VISUAL_TESTS_REMOTE_REPORT_DIR, VISUAL_TESTS_CELLAR_BASE_URL);
  if (process.env.GITHUB_OUTPUT != null) {
    appendFileSync(process.env.GITHUB_OUTPUT, `reports_url=${reportUrl}\n`);
  }
  console.log('Report uploaded to: ' + reportUrl);
}

async function deleteReportAndAssociatedData() {
  try {
    await cellar.deleteManyObjects({ prefix: BRANCH_NAME + '/' });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function checkForLastExpectationUpdate() {
  const dateFormatter = new DateFormatter('datetime-short', 'local');
  try {
    console.log('Fetching last report', VISUAL_TESTS_REMOTE_REPORT_PATH);
    const { expectationMetadata } = await cellar.getObject({
      key: VISUAL_TESTS_REMOTE_REPORT_PATH,
    });
    const baseCommitSha = process.env.BASE_COMMIT_SHA;

    console.log('Current base commit: ' + baseCommitSha);
    console.log('Last report expectation commit: ' + expectationMetadata.commitSha);
    console.log('Last report expectation update: ' + expectationMetadata.lastUpdated);

    const shouldUpdateExpectation = baseCommitSha !== expectationMetadata.commitSha;

    if (process.env.GITHUB_OUTPUT != null) {
      appendFileSync(process.env.GITHUB_OUTPUT, `should-update-expectation=${shouldUpdateExpectation}\n`);
      appendFileSync(process.env.GITHUB_OUTPUT, `last-expectation-update-utc=${expectationMetadata.lastUpdated}\n`);
      appendFileSync(
        process.env.GITHUB_OUTPUT,
        `last-expectation-update-local=${dateFormatter.format(new Date(expectationMetadata.lastUpdated))}\n`,
      );
    }
    console.log('Expectation should be updated: ' + shouldUpdateExpectation);
  } catch (error) {
    if (error instanceof Error && error.message === 'NoSuchKey') {
      console.log('No report found. Expectation should be updated');
      appendFileSync(process.env.GITHUB_OUTPUT, `should-update-expectation=true\n`);
    } else {
      console.error(error);
    }
  }
}
