import { appendFileSync } from 'node:fs';
import { CELLAR_HOST, CellarClient } from './cellar-client.js';
import { getCurrentBranch } from './git-utils.js';

const CURRENT_BRANCH = getCurrentBranch();
const BUCKET_NAME = 'clever-test-flo-visual-regressions';
const REMOTE_DIR = `${CURRENT_BRANCH}/test-reports`;
const cellar = new CellarClient({
  bucket: BUCKET_NAME,
  accessKeyId: process.env.VISUAL_REGRESSIONS_CELLAR_KEY_ID,
  secretAccessKey: process.env.VISUAL_REGRESSIONS_CELLAR_SECRET_KEY,
});

cellar
  .sync({ localDir: 'test-reports/', remoteDir: REMOTE_DIR, deleteRemoved: true })
  .catch((error) => console.log(error));

const reportUrl = new URL(`${REMOTE_DIR}/visual-regression-results.html`, `https://${BUCKET_NAME}.${CELLAR_HOST}`);
if (process.env.GITHUB_OUTPUT != null) {
  appendFileSync(process.env.GITHUB_OUTPUT, `report_url=${reportUrl.href}\n`);
} else {
  console.log('Report uploaded to: ' + reportUrl);
}
