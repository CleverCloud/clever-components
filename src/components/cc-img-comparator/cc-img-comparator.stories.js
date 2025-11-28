import { visualTestsResults } from '../../stories/fixtures/visual-tests-results.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-img-comparator.js';

export default {
  tags: ['autodocs'],
  title: '🧐 Visual tests/<cc-img-comparator>',
  component: 'cc-img-comparator',
};

const conf = {
  component: 'cc-img-comparator',
};

/**
 * @import { CcImgComparator } from './cc-img-comparator.js'
 */

/**
 * @param {typeof visualTestsResults[number]['componentTagName']} componentTagName
 * @param {typeof visualTestsResults[number]['storyName']} storyName
 * @param {typeof visualTestsResults[number]['viewportType']} viewportType
 * @param {typeof visualTestsResults[number]['browserName']} browserName
 * @returns {Partial<CcImgComparator>}
 */
const getStoryData = (componentTagName, storyName, viewportType, browserName) => {
  const result = visualTestsResults.find(
    (visualTestResult) =>
      visualTestResult.componentTagName === componentTagName &&
      visualTestResult.storyName === storyName &&
      visualTestResult.viewportType === viewportType &&
      visualTestResult.browserName === browserName,
  );

  return {
    baseImgSrc: result.screenshots.expectationScreenshotUrl,
    baseImgText: `${result.componentTagName} - ${result.storyName} - ${result.viewportType} - ${result.browserName} - expectation`,
    comparisonImgSrc: result.screenshots.actualScreenshotUrl,
    comparisonImgText: `${result.componentTagName} - ${result.storyName} - ${result.viewportType} - ${result.browserName} - actual`,
  };
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcImgComparator>>} */
  items: [getStoryData('cc-addon-admin', 'defaultStory', 'desktop', 'chromium')],
});

export const exampleWithDomainManagement = makeStory(conf, {
  /** @type {Array<Partial<CcImgComparator>>} */
  items: [getStoryData('cc-domain-management', 'defaultStory', 'desktop', 'chromium')],
});

export const exampleWithAddonBackups = makeStory(conf, {
  /** @type {Array<Partial<CcImgComparator>>} */
  items: [getStoryData('cc-addon-backups', 'defaultStory', 'mobile', 'chromium')],
});
