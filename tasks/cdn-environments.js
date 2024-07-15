import { CELLAR_HOST, CellarClient } from './cellar-client.js';

/**
 * A CdnEnvironment represents where and how a CDN is to be stored.
 */
class CdnEnvironment {
  /**
   *
   * @param {string} name - The name of the environment
   * @param {string} bucket - The Cellar bucket where the CDN are stored
   * @param {string} accessKeyId - The Cellar access key
   * @param {string} secretAccessKey - The Cellar secret key
   * @param {boolean} semver - Whether the CDN entry names must be valid version
   * @param {string} [customDomain] - Optional custom domain where the files in the Cellar can be reached.
   *                                  If not set, the default domain will be used: `${bucket}.${cellar-host}`.
   */
  constructor({ name, bucket, accessKeyId, secretAccessKey, semver, customDomain }) {
    /** @type {string} */
    this._name = name;
    /** @type {string} */
    this._bucket = bucket;
    /** @type {string} */
    this._accessKeyId = accessKeyId;
    /** @type {string} */
    this._secretAccessKey = secretAccessKey;
    /** @type {boolean} */
    this._semver = semver;
    /** @type {string} */
    this._domain = customDomain ?? `${bucket}.${CELLAR_HOST}`;
  }

  get name() {
    return this._name;
  }

  get semver() {
    return this._semver;
  }

  createCellarClient() {
    return new CellarClient({
      bucket: this._bucket,
      accessKeyId: this._accessKeyId,
      secretAccessKey: this._secretAccessKey,
    });
  }

  getIndexUrl() {
    return this.getUrl('index.html');
  }

  getListUrl() {
    return this.getUrl('list.html');
  }

  getCdnEntryUrl(cdnEntryName) {
    return this.getUrl(`index.html?version=${cdnEntryName}`);
  }

  getUrl(file) {
    return `https://${this._domain}/${file}`;
  }

  isImmutable() {
    return this._semver;
  }
}

/**
 * The supported environments where CDN are to be stored.
 * @type {{[p: 'release'|'preview'|'staging']: CdnEnvironment}}
 */
export const CDN_ENVIRONMENTS = Object.fromEntries(
  [
    new CdnEnvironment({
      name: 'release',
      bucket: 'components.clever-cloud.com',
      accessKeyId: process.env.SMART_CDN_CELLAR_KEY_ID,
      secretAccessKey: process.env.SMART_CDN_CELLAR_SECRET_KEY,
      semver: true,
      customDomain: 'components.clever-cloud.com',
    }),
    new CdnEnvironment({
      name: 'preview',
      bucket: 'preview-components.clever-cloud.com',
      accessKeyId: process.env.SMART_CDN_PREVIEW_CELLAR_KEY_ID,
      secretAccessKey: process.env.SMART_CDN_PREVIEW_CELLAR_SECRET_KEY,
      semver: false,
      customDomain: 'preview-components.clever-cloud.com',
    }),
    new CdnEnvironment({
      name: 'staging',
      bucket: 'staging-components.clever-cloud.com',
      accessKeyId: process.env.SMART_CDN_STAGING_CELLAR_KEY_ID,
      secretAccessKey: process.env.SMART_CDN_STAGING_CELLAR_SECRET_KEY,
      semver: true,
      customDomain: 'staging-components.clever-cloud.com',
    }),
  ].map((e) => [e.name, e]),
);
