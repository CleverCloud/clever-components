// eslint-disable-next-line import-x/extensions
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { CellarClient } from '../../tasks/cellar-client.js';
import { VISUAL_TESTS_CELLAR_CREDENTIALS, VISUAL_TESTS_UPDATE_FLAG, getScreenshotPath } from './visual-tests-utils.js';

const cellar = new CellarClient(VISUAL_TESTS_CELLAR_CREDENTIALS);

export const visualRegressionPluginWithConfig = visualRegressionPlugin({
  // see https://github.com/mapbox/pixelmatch?tab=readme-ov-file#api for more info
  diffOptions: {
    threshold: 0.1, // matching threshold (0 to 1); smaller is more sensitive
    alpha: 0.3, // opacity of original image in diff output
    diffColor: [30, 30, 30], // color of different pixels in diff output
    diffColorAlt: [255, 0, 0], // whether to detect dark on light differences between img1 and img2 and set an alternative color to differentiate between the two
  },
  update: process.argv.includes(VISUAL_TESTS_UPDATE_FLAG),
  getBaselineName({ browser, name: componentWithStoryName }) {
    return getScreenshotPath({ browser, componentWithStoryName, screenshotType: 'expectation' });
  },
  getDiffName({ browser, name: componentWithStoryName }) {
    return getScreenshotPath({ browser, componentWithStoryName, screenshotType: 'diff' });
  },
  getFailedName({ browser, name: componentWithStoryName }) {
    return getScreenshotPath({ browser, componentWithStoryName, screenshotType: 'actual' });
  },
  async getBaseline({ name }) {
    if (process.argv.includes(VISUAL_TESTS_UPDATE_FLAG)) {
      return null;
    }

    return await cellar.getImage({ key: name }).catch((err) => {
      console.log('error getting expectation from current branch', name, err);
    });
  },
  async saveBaseline({ content, name }) {
    await cellar
      .putObject({
        key: name,
        body: content,
      })
      .catch((err) => {
        console.log('failed to save expectation', name, err);
      });
  },
  async saveDiff({ content, name }) {
    await cellar
      .putObject({
        key: name,
        body: content,
      })
      .catch((err) => {
        console.log('failed to save diff', name, err);
      });
  },
  async saveFailed({ content, name }) {
    await cellar
      .putObject({
        key: name,
        body: content,
      })
      .catch((err) => {
        console.log('failed to save actual', name, err);
      });
  },
});
