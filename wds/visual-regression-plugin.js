import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { kebabCase } from '../src/lib/change-case.js';
import { CellarClient } from '../tasks/cellar-client.js';
import { getCurrentBranch } from '../tasks/git-utils.js';

const CURRENT_BRANCH_NAME = getCurrentBranch();

const cellar = new CellarClient({
  bucket: 'clever-test-flo-visual-regressions',
  accessKeyId: process.env.VISUAL_REGRESSIONS_CELLAR_KEY_ID,
  secretAccessKey: process.env.VISUAL_REGRESSIONS_CELLAR_SECRET_KEY,
});

export const visualRegressionPluginWithConfig = visualRegressionPlugin({
  diffOptions: {
    alpha: 1,
    aaColor: [0, 255, 255],
    diffColor: [0, 255, 255],
  },
  update: process.argv.includes('--update-visual-baseline'), // should we force to target some component or all? need to test what happens when you update baseline and it's already ok?
  async getBaseline({ name }) {
    if (process.argv.includes('--update-visual-baseline')) {
      return null;
    }

    const nameWithKebabCase = kebabCase(name);
    const cellarKey = `${CURRENT_BRANCH_NAME}/${nameWithKebabCase}.png`;

    console.log('getting', cellarKey);
    const fileBufferFromCurrentBranch = await cellar
      .getImage({ key: cellarKey })
      .then((response) => {
        return new Promise((resolve, reject) => {
          const data = [];
          response.Body.on('data', (chunk) => data.push(chunk));
          response.Body.on('end', () => resolve(Buffer.concat(data)));
          response.Body.on('error', reject);
        });
      })
      .catch((err) => {
        // TODO proper error filtering (some are ok to be silenced but others are not?)
        console.log('error getting baseline from current branch', cellarKey, err);
      });

    return fileBufferFromCurrentBranch;
    // TODO: if we get it from current branch, it means we have a new baseline and there are new visuals so we should probably set some env var so that CI lists impacted components in a comment for review?
  },
  async saveBaseline({ content, name }) {
    const nameWithKebabCase = kebabCase(name);
    const cellarKey = `${CURRENT_BRANCH_NAME}/${nameWithKebabCase}.png`;
    // TODO: should we remove the whole baseline content first? => would probably need to be done elsewhere

    await cellar
      .putObject({
        key: cellarKey,
        body: content,
      })
      .catch((err) => {
        console.log('failed to save baseline', cellarKey, err);
      });
  },
  async saveDiff({ content, name }) {
    const nameWithKebabCase = kebabCase(name);
    const cellarKey = `${CURRENT_BRANCH_NAME}/${nameWithKebabCase}.png`;

    console.log('log', content);
    await cellar
      .putObject({
        key: cellarKey,
        body: content,
      })
      .then((response) => {
        // console.log('saved diff', cellarKey, name);
      })
      .catch((err) => {
        console.log('failed to save DIFF', name, err);
      });
  },
  async saveFailed({ content, name }) {
    const nameWithKebabCase = kebabCase(name);
    const cellarKey = `${CURRENT_BRANCH_NAME}/${nameWithKebabCase}.png`;

    console.log('log failed', content);
    await cellar
      .putObject({
        key: cellarKey,
        body: content,
      })
      .then((response) => {
        // console.log('saved failed', cellarKey, name);
      })
      .catch((err) => {
        console.log('failed to save FAILED', name, err);
      });
  },
});
