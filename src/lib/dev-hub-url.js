/**
 * If you change the base URL here, you should probably also change it in places where it's still hard coded:
 * - README.md,
 * - CONTRIBUTING.md,
 * - sandbox/index.html,
 * - test/utils.test.js.
 */
let devHubBaseUrl = 'https://www.clever.cloud/developers';

/** @param {string} value */
export function setDevHubBaseUrl(value) {
  devHubBaseUrl = value.replace(/\/$/, '');
}

/**
 * Rely on this helper for every reference to the docs website
 *
 * @param {string} [path]
 * @returns {string} href
 */
export function getDocUrl(path = '') {
  const docsBaseUrl = devHubBaseUrl + '/doc';

  if (path === '') {
    return docsBaseUrl;
  }

  return path.startsWith('/') ? `${docsBaseUrl}${path}` : `${docsBaseUrl}/${path}`;
}

/**
 * Rely on this helper for every reference to the developer hub website
 *
 * @param {string} path
 * @returns {string}
 */
export function getDevHubUrl(path = '') {
  if (path === '') {
    return devHubBaseUrl;
  }

  return path.startsWith('/') ? `${devHubBaseUrl}${path}` : `${devHubBaseUrl}/${path}`;
}
