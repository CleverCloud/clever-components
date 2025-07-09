import { kebabCase } from '../../src/lib/change-case.js';
import { CELLAR_HOST } from '../../tasks/cellar-client.js';
import { getCurrentBranch } from '../../tasks/git-utils.js';

/**
 * @typedef {'expectation' | 'diff' | 'actual'} ScreenshotType
 */

export const VISUAL_TESTS_CELLAR_CREDENTIALS = {
  bucket: process.env.VISUAL_TESTS_CELLAR_BUCKET_NAME ?? 'clever-components-visual-tests',
  accessKeyId: process.env.VISUAL_TESTS_CELLAR_KEY_ID,
  secretAccessKey: process.env.VISUAL_TESTS_CELLAR_SECRET_KEY,
};

export const VISUAL_TESTS_UPDATE_FLAG = '--update-expectation';
export const BRANCH_NAME = process.env.BRANCH_NAME ?? getCurrentBranch();
export const VISUAL_TESTS_CELLAR_BASE_URL = `https://${VISUAL_TESTS_CELLAR_CREDENTIALS.bucket}.${CELLAR_HOST}`;
export const VISUAL_TESTS_REPORTS_DIR = process.env.VISUAL_TESTS_REPORTS_DIR ?? 'visual-test-reports';
export const VISUAL_TESTS_RAW_REPORT_NAME = process.env.VISUAL_TESTS_RAW_REPORT_NAME ?? 'visual-tests-results.json';
export const VISUAL_TESTS_FINAL_REPORT_NAME = process.env.VISUAL_TESTS_FINAL_REPORT_NAME ?? 'visual-tests-report.json';
export const VISUAL_TESTS_REMOTE_REPORT_DIR = `${BRANCH_NAME}/${VISUAL_TESTS_REPORTS_DIR}`;
export const VISUAL_TESTS_REMOTE_REPORT_PATH = `${VISUAL_TESTS_REMOTE_REPORT_DIR}/${VISUAL_TESTS_FINAL_REPORT_NAME}`;

const BASE_SCREENSHOT_URL = new URL(`${BRANCH_NAME}`, VISUAL_TESTS_CELLAR_BASE_URL);
const EXTENSION = '.png';

/**
 * Constructs a screenshot path for a given browser, component with story, and screenshot type.
 *
 * @param {object} _ - The parameters for building the screenshot path.
 * @param {string} _.browser - The name of the browser.
 * @param {string} _.componentWithStoryName - The name of the component and its story.
 * @param {ScreenshotType} _.screenshotType - The type of screenshot.
 * @returns {string} The constructed screenshot path.
 */
export function getScreenshotPath({ browser, componentWithStoryName, screenshotType }) {
  const filename = `${componentWithStoryName}-${screenshotType}`;
  const fullPath = `${BRANCH_NAME}/${browser}/${filename}`;
  const kebabCasePath = kebabCase(fullPath);

  return kebabCasePath + EXTENSION;
}

/**
 * Constructs a screenshot URL for a given browser, component, story, viewport, and screenshot type.
 *
 * @param {object} _ - The parameters for building the screenshot URL.
 * @param {string} _.browser - The name of the browser.
 * @param {string} _.componentTagName - The tag name of the component.
 * @param {string} _.storyName - The name of the story.
 * @param {'desktop'|'mobile'} _.viewportType - The type of viewport.
 * @param {ScreenshotType} _.screenshotType - The type of screenshot.
 * @returns {string|null} The constructed screenshot URL, or null if an error occurs.
 */
export function getScreenshotUrl({ browser, componentTagName, storyName, viewportType, screenshotType }) {
  const filename = `${componentTagName}-${storyName}-${viewportType}-${screenshotType}`;
  const relativePath = `/${browser}/${filename}`;
  const kebabCasePath = kebabCase(relativePath);

  return BASE_SCREENSHOT_URL.href + kebabCasePath + EXTENSION;
}
