import { kebabCase } from '../../src/lib/change-case.js';
import { CELLAR_HOST } from '../../tasks/cellar-client.js';
import { getCurrentBranch } from '../../tasks/git-utils.js';

/**
 * @typedef {'baseline' | 'diff' | 'changes'} ScreenshotType
 */

const CURRENT_BRANCH_NAME = getCurrentBranch();
export const BUCKET_NAME = 'clever-test-flo-visual-regressions';
const BASE_SCREENSHOT_URL = new URL(`${CURRENT_BRANCH_NAME}`, `https://${BUCKET_NAME}.${CELLAR_HOST}`);
const EXTENSION = '.png';

/**
 *
 * @param {object} _
 * @param {string} _.browser
 * @param {string} _.componentWithStoryName
 * @param {ScreenshotType} _.screenshotType
 * @returns {string}
 */
export function getScreenshotPath({ browser, componentWithStoryName, screenshotType }) {
  return (
    kebabCase(`${CURRENT_BRANCH_NAME}/${browser}/${componentWithStoryName}-${screenshotType}`).toLowerCase() + EXTENSION
  );
}

/**
 * Constructs a screenshot URL for a given browser, component, story, viewport, and screenshot type.
 *
 * @param {object} _ - The parameters for building the screenshot URL.
 * @param {string} _.browser - The name of the browser.
 * @param {string} _.componentTagName - The tag name of the component.
 * @param {string} _.storyName - The name of the story.
 * @param {'desktop'|'mobile'} _.viewportType - The type of viewport.
 * @param {ScreenshotType} _.screenshotType - The type of screenshot ('baseline', 'diff', or 'changes').
 * @returns {string|null} The constructed screenshot URL, or null if an error occurs.
 */
export function getScreenshotUrl({ browser, componentTagName, storyName, viewportType, screenshotType }) {
  try {
    return (
      BASE_SCREENSHOT_URL.href +
      kebabCase(`/${browser}/${componentTagName}-${storyName}-${viewportType}-${screenshotType}`).toLowerCase() +
      EXTENSION
    );
  } catch (error) {
    console.error('Failed to build the screenshot URL', error);
    return null;
  }
}
