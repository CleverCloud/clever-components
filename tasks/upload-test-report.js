import { CellarClient } from './cellar-client.js';
import { getCurrentBranch } from './git-utils.js';

const cellar = new CellarClient({
  bucket: 'clever-test-flo-visual-regressions',
  accessKeyId: process.env.VISUAL_REGRESSIONS_CELLAR_KEY_ID,
  secretAccessKey: process.env.VISUAL_REGRESSIONS_CELLAR_SECRET_KEY,
});

cellar
  .putObject({
    key: `${getCurrentBranch()}/test-report.html`,
    filepath: 'test-reports/test-visual-regressions.report.html',
  })
  .catch((error) => console.log(error));
