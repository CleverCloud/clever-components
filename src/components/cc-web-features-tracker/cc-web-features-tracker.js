import { LitElement, html, css } from 'lit';
import { Task } from '@lit/task';
// @ts-ignore
import untypedWebFeatures from './web-features.json';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';

/** @type {WebFeatures} */
const webFeatures = untypedWebFeatures;

/**
 * @typedef {import('./cc-web-features.types.js').WebFeatures} WebFeatures
 * @typedef {import('./cc-web-features.types.js').BaselineFeatureData} BaselineFeatureData
 * @typedef {import('./cc-web-features.types.js').BcdFeatureCompatInfo} BcdFeatureCompatInfo
 * @typedef {import('./cc-web-features.types.js').BcdBrowserInfo} BcdBrowserInfo
 * @typedef {import('./cc-web-features.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('./cc-web-features.types.js').Browser} Browser
 * @typedef {import('./cc-web-features.types.js').BrowserUnsupported} BrowserUnsupported
 * @typedef {import('./cc-web-features.types.js').BrowserSupported} BrowserSupported
 * @typedef {import('./cc-web-features.types.js').FeatureStatus} FeatureStatus
 */

/**
 * Component to display web tracked features.
 *
 * @cssdisplay block
 */
export class CcWebFeaturesTracker extends LitElement {
  static get properties() {
    return {};
  }

  constructor() {
    super();

    this._featuresTask = new Task(this, {
      task: async ([], { signal }) => {
        const baselineFeaturesUrl = webFeatures.baselineFeatures.map(
          (baselineFeature) => `https://api.webstatus.dev/v1/features/${baselineFeature.featureId}`,
        );

        const bcdResponse = await fetch('https://unpkg.com/@mdn/browser-compat-data/data.json', { signal });
        /** @type {BaselineFeatureData[]} */
        const rawBaselineFeatures = await Promise.all(
          baselineFeaturesUrl.map(async (url) => {
            const response = await fetch(url, { signal });
            if (!response.ok) {
              throw new Error(response.status.toString());
            }
            return await response.json();
          }),
        );

        if (!bcdResponse.ok) {
          throw new Error(bcdResponse.status.toString());
        }
        const bcdData = await bcdResponse.json();
        const bcdBrowserInfos = bcdData.browsers;
        const rawBcdFeatures = this._retrieveBcdFeatures(bcdData);
        const formattedBcdFeatures = this._formatBcdFeatures(rawBcdFeatures, bcdBrowserInfos);
        const formattedBaselinesFeatures = this._formatBaselineFeatures(rawBaselineFeatures);

        return [...formattedBaselinesFeatures, ...formattedBcdFeatures];
      },
      args: () => [],
    });
  }

  /**
   *
   * @param {BaselineFeatureData[]} rawBaselineFeatures
   * @returns {Array<FormattedFeature>}
   */
  _formatBaselineFeatures(rawBaselineFeatures) {
    const formattedFeatures = rawBaselineFeatures.map((baselineFeature) => {
      const currentStatus = baselineFeature.baseline.status;
      const requiredStatus = webFeatures.baselineFeatures.find(
        (webFeature) => webFeature.featureId === baselineFeature.feature_id,
      ).requiredStatus;

      return {
        featureName: baselineFeature.name,
        currentStatus,
        requiredStatus,
        canBeUsed: this._getCanBeUsedStatus(currentStatus, requiredStatus),
        chromeSupport: this._computeBaselineFeatureStatus('chrome', baselineFeature),
        firefoxSupport: this._computeBaselineFeatureStatus('firefox', baselineFeature),
        safariSupport: this._computeBaselineFeatureStatus('safari', baselineFeature),
      };
    });

    return formattedFeatures;
  }

  /**
   * Format BCD features into FormattedFeature[]
   * @param {Array<BcdFeatureCompatInfo & { id: string }>} rawBcdFeatures
   * @param {BcdBrowserInfo} bcdBrowserInfos
   * @returns {Array<FormattedFeature>}
   */
  _formatBcdFeatures(rawBcdFeatures, bcdBrowserInfos) {
    const formattedFeatures = rawBcdFeatures.map((rawBcdFeature) => {
      const supportedBrowsers = {
        chrome: this._computeBcdFeatureStatus('chrome', rawBcdFeature, bcdBrowserInfos),
        firefox: this._computeBcdFeatureStatus('firefox', rawBcdFeature, bcdBrowserInfos),
        safari: this._computeBcdFeatureStatus('safari', rawBcdFeature, bcdBrowserInfos),
      };
      const supportedBrowsersAsArray = Object.values(supportedBrowsers);

      const requiredStatus = webFeatures.bcdFeatures.find(
        (webFeature) => webFeature.featureId === rawBcdFeature.id,
      ).requiredStatus;
      const currentStatus = this._getCurrentStatus(supportedBrowsersAsArray);

      /** @type {FormattedFeature} */
      const formattedFeature = {
        featureName: rawBcdFeature.description ?? rawBcdFeature.id,
        currentStatus,
        requiredStatus,
        canBeUsed: this._getCanBeUsedStatus(currentStatus, requiredStatus),
        chromeSupport: supportedBrowsers.chrome,
        firefoxSupport: supportedBrowsers.firefox,
        safariSupport: supportedBrowsers.safari,
      };
      return formattedFeature;
    });

    return formattedFeatures;
  }

  /**
   * @param {FeatureStatus} currentStatus
   * @param {'newly' | 'widely'} requiredStatus
   * @returns
   */
  _getCanBeUsedStatus(currentStatus, requiredStatus) {
    if (currentStatus === 'widely') {
      return true;
    }

    return currentStatus === requiredStatus;
  }

  /**
   *
   * @param {Array<BrowserSupported|BrowserUnsupported>} supportedBrowsers
   * @returns {FeatureStatus}
   */
  _getCurrentStatus(supportedBrowsers) {
    const isLimited = supportedBrowsers.some((browser) => !browser.isSupported);

    if (isLimited) {
      return 'limited';
    }

    const isWidely = supportedBrowsers.every(
      (browser) => browser.isSupported && this._getStatusFromBcd(browser.releaseDate),
    );

    return isWidely ? 'widely' : 'newly';
  }

  /**
   * @param {Browser} browser
   * @param {BaselineFeatureData} rawBaselineFeature
   * @returns {BrowserSupported | BrowserUnsupported}
   */
  _computeBaselineFeatureStatus(browser, rawBaselineFeature) {
    const browserImplementation = rawBaselineFeature.browser_implementations?.[browser];
    if (browserImplementation == null) {
      return { isSupported: false };
    }

    return {
      isSupported: true,
      version: browserImplementation.version,
      releaseDate: new Date(browserImplementation.date),
    };
  }

  /**
   *
   * @param {Browser} browser
   * @param {BcdFeatureCompatInfo & { id: string }} rawBcdFeature
   * @param {BcdBrowserInfo} browserInfos
   * @returns {BrowserSupported|BrowserUnsupported}
   */
  _computeBcdFeatureStatus(browser, rawBcdFeature, browserInfos) {
    const rawBrowserSupport = rawBcdFeature.support[browser].version_added;

    if (rawBrowserSupport === false) {
      return { isSupported: false };
    }

    return {
      isSupported: true,
      version: rawBrowserSupport,
      releaseDate: new Date(browserInfos[browser].releases[rawBrowserSupport].release_date),
    };
  }

  /**
   * @TODO: rename this helper
   *
   * @param {Date} releaseDate
   * @returns {boolean}
   */
  _getStatusFromBcd(releaseDate) {
    const now = Date.now();
    const twoYearsAndHalf = new Date();
    twoYearsAndHalf.setFullYear(twoYearsAndHalf.getFullYear() - 2);
    twoYearsAndHalf.setMonth(twoYearsAndHalf.getMonth() - 6);

    return now - releaseDate.getTime() >= now - twoYearsAndHalf.getTime();
  }

  /**
   *
   * @param {Object} rawBcd
   * @returns {Array<BcdFeatureCompatInfo & { id: string }>}
   */
  _retrieveBcdFeatures(rawBcd) {
    const bcdFeatures = webFeatures.bcdFeatures;

    return bcdFeatures.map(({ featureId, requiredStatus }) => {
      // javascript.classes.private_class_fields
      const theKey = featureId.split('.');
      let value = rawBcd;
      for (const key of theKey) {
        value = value[key];
      }
      return { id: featureId, ...value['__compat'] };
    });
  }

  render() {
    return html`
      ${this._featuresTask.render({
        pending: () => html`<cc-loader></cc-loader>`,
        complete: (formattedFeatures) => this._renderFeaturesTable(formattedFeatures),
        error: (e) => html`<cc-notice .message="${e}"></cc-notice>`,
      })}
    `;
  }

  /**
   * @param {readonly FormattedFeature[]} formattedFeatures
   */
  _renderFeaturesTable(formattedFeatures) {
    return html`
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Required Status</th>
            <th>Current Baseline</th>
            <th>Can be used in Clever Components</th>
            <th>Chrome Support</th>
            <th>Firefox Support</th>
            <th>Safari Support</th>
          </tr>
        </thead>
        <tbody>
          ${formattedFeatures.map((formattedFeature) => this._renderFeatureRow(formattedFeature))}
        </tbody>
      </table>
    `;
  }

  /** @param {FormattedFeature} _ */
  _renderFeatureRow({
    requiredStatus,
    canBeUsed,
    chromeSupport,
    currentStatus,
    featureName,
    firefoxSupport,
    safariSupport,
  }) {
    return html`
      <tr>
        <td>${featureName}</td>
        <td>${requiredStatus}</td>
        <td>${currentStatus}</td>
        <td>${canBeUsed}</td>
        <td>${chromeSupport.isSupported}</td>
        <td>${firefoxSupport.isSupported}</td>
        <td>${safariSupport.isSupported}</td>
      </tr>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }
}

window.customElements.define('cc-web-features-tracker', CcWebFeaturesTracker);
