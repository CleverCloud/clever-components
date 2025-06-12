import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';

const MASTER_BRANCH_NAME = 'master';

// const cellar = new CellarClient({
//   bucket: 'clever-test-flo-visual-regressions',
//   accessKeyId: process.env.VISUAL_REGRESSIONS_CELLAR_KEY_ID,
//   secretAccessKey: process.env.VISUAL_REGRESSIONS_CELLAR_SECRET_KEY,
// });

export const visualRegressionPluginWithConfig = visualRegressionPlugin({
  diffOptions: {
    alpha: 1,
    aaColor: [0, 255, 255],
    diffColor: [0, 255, 255],
  },
  update: process.argv.includes('--update-visual-baseline'), // should we force to target some component or all? need to test what happens when you update baseline and it's already ok?
  // async getBaseline({ name }) {
  //   if (process.argv.includes('--update-visual-baseline')) {
  //     return null;
  //   }

  //   // search for baseline same branch
  //   // if we get it from baseline same branch, it means we have added new visuals
  //   // we can probably set some env var so that CI lists impacted components in a comment for review?
  //   // if not found => search for baseline master
  //   const branchName = getCurrentBranch();
  //   const cellarKeyForCurrentBranch = `${branchName}/${name}.png`;
  //   const cellarKeyForMaster = `${MASTER_BRANCH_NAME}/${name}.png`;

  //   const fileBufferFromCurrentBranch = await cellar
  //     .getImage({ key: cellarKeyForCurrentBranch })
  //     .then((response) => {
  //       return new Promise((resolve, reject) => {
  //         const data = [];
  //         response.Body.on('data', (chunk) => data.push(chunk));
  //         response.Body.on('end', () => resolve(Buffer.concat(data)));
  //         response.Body.on('error', reject);
  //       });
  //     })
  //     .catch((err) => {
  //       // TODO proper error filtering (some are ok to be silenced but others are not?)
  //       console.log('error getting baseline from current branch', cellarKeyForCurrentBranch, err);
  //     });

  //   if (fileBufferFromCurrentBranch != null) {
  //     return fileBufferFromCurrentBranch;
  //   }

  //   const fileBufferFromMaster = await cellar
  //     .getImage({ key: cellarKeyForMaster })
  //     .then((response) => {
  //       return new Promise((resolve, reject) => {
  //         const data = [];
  //         response.Body.on('data', (chunk) => data.push(chunk));
  //         response.Body.on('end', () => resolve(Buffer.concat(data)));
  //         response.Body.on('error', reject);
  //       });
  //     })
  //     .catch((err) => {
  //       // TODO proper error filtering (some are ok to be silenced but others are not?)
  //       console.log('error getting baseline from master', cellarKeyForMaster, err);
  //     });
  //   return fileBufferFromMaster;

  //   // TODO: if we get it from current branch, it means we have a new baseline and there are new visuals so we should probably set some env var so that CI lists impacted components in a comment for review?
  // },
  // async saveBaseline({ content, name }) {
  //   const branchName = getCurrentBranch();
  //   const cellarKey = `${branchName}/${name}.png`;
  //   console.log('saving new baseline', cellarKey);
  //   await cellar
  //     .putObject({
  //       key: cellarKey,
  //       body: content,
  //     })
  //     .catch((err) => {
  //       console.log('failed to save baseline', cellarKey, err);
  //     });
  // },
  // async saveDiff({ content, name }) {
  //   const branchName = getCurrentBranch();
  //   // should save to cellar + locally but only if failed?
  //   // if name split `/` [1] === 'failed' then we should also save locally for review?
  //   const cellarKey = `${branchName}/${name}.png`;
  //   await cellar
  //     .putObject({
  //       key: cellarKey,
  //       body: content,
  //     })
  //     .then((response) => {
  //       console.log('saved diff', cellarKey, name);
  //     })
  //     .catch((err) => {
  //       console.log('failed to save DIFF', name, err);
  //     });
  // },
  // saveFailed({ filePath, content, baseDir, name }) {
  //   console.log('SAVING FAILED', name);
  // },
});
