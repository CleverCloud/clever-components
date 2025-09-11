let assetsUrl = 'https://assets.clever-cloud.com';

/** @param {string} value */
export function setAssetsBaseUrl(value) {
  assetsUrl = value.replace(/\/$/, '');
}

/**
 * @param {string} path
 * @returns {string}
 */
export function getAssetUrl(path) {
  return path.startsWith('/') ? `${assetsUrl}${path}` : `${assetsUrl}/${path}`;
}
