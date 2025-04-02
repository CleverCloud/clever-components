import { LitElement, html, css } from 'lit';
import { Task } from '@lit/task';
import {
  iconRemixAlertFill as iconWarning,
  iconRemixCheckFill as iconSupported,
  iconRemixCloseFill as iconUnsupported,
  iconRemixHashtag as iconVersion,
  iconRemixCalendarLine as iconDate,
} from '../../assets/cc-remix.icons.js';
// @ts-ignore
import untypedWebFeatures from './web-features.json';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-icon/cc-icon.js';
import '../cc-toggle/cc-toggle.js';

const baselineLimitedSvg = new URL('../../assets/baseline-limited.svg', import.meta.url);
const baselineNewlySvg = new URL('../../assets/baseline-newly.svg', import.meta.url);
const baselineWidelySvg = new URL('../../assets/baseline-widely.svg', import.meta.url);

// TODO: finir style filtres & toggles
// TODO: doc contrib
// TODO: doc utilisation de ce composant / tableau

/** @type {WebFeatures} */
const webFeatures = untypedWebFeatures;

/**
 * @typedef {import('./cc-web-features.types.js').WebFeatures} WebFeatures
 * @typedef {import('./cc-web-features.types.js').BaselineFeatureData} BaselineFeatureData
 * @typedef {import('./cc-web-features.types.js').BcdFeatureCompatInfo} BcdFeatureCompatInfom
 * @typedef {import('./cc-web-features.types.js').BcdBrowserInfo} BcdBrowserInfo
 * @typedef {import('./cc-web-features.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('./cc-web-features.types.js').Browser} Browser
 * @typedef {import('./cc-web-features.types.js').BrowserUnsupported} BrowserUnsupported
 * @typedef {import('./cc-web-features.types.js').BrowserSupported} BrowserSupported
 * @typedef {import('./cc-web-features.types.js').FeatureStatus} FeatureStatus
 * @typedef {import('../cc-toggle/cc-toggle.js').CcToggle} CcToggle
 * @typedef {import('../../lib/events.types.js').EventWithTarget<CcToggle & { value: 'all' | 'can-be-used' }>} EventWithTargetCcToggleFeatureFilter
 * @typedef {import('../../lib/events.types.js').EventWithTarget<CcToggle & { value: 'compact' | 'detailed' }>} EventWithTargetCcToggleDisplayMode
 */

/**
 * Component to display web tracked features.
 *
 * @cssdisplay block
 */
export class CcWebFeaturesTracker extends LitElement {
  static get properties() {
    return {
      _tableDisplayMode: { type: String, state: true },
      _tableFeatureFilter: { type: String, state: true },
    };
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

    /** @type {'all'|'can-be-used'} */
    this._tableFeatureFilter = 'all';

    /** @type {'compact'|'detailed'} */
    this._tableDisplayMode = 'compact';
  }

  /**
   *
   * @param {Object} rawBcd
   * @returns {Array<BcdFeatureCompatInfo & { id: string }>}
   */
  _retrieveBcdFeatures(rawBcd) {
    const bcdFeatures = webFeatures.bcdFeatures;

    return bcdFeatures.map(({ featureId }) => {
      // example: javascript.classes.private_class_fields
      const theKey = featureId.split('.');
      let value = rawBcd;
      for (const key of theKey) {
        // @ts-ignore
        value = value[key];
      }
      // @ts-ignore
      return { id: featureId, ...value['__compat'] };
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
      const isProgressiveEnhancement = webFeatures.baselineFeatures.find(
        (webFeature) => webFeature.featureId === baselineFeature.feature_id,
      ).isProgressiveEnhancement;

      return {
        featureName: baselineFeature.name,
        currentStatus,
        isProgressiveEnhancement,
        canBeUsed: this._getCanBeUsedStatus({ currentStatus, isProgressiveEnhancement }),
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

      const isProgressiveEnhancement = webFeatures.bcdFeatures.find(
        (webFeature) => webFeature.featureId === rawBcdFeature.id,
      ).isProgressiveEnhancement;
      const currentStatus = this._getCurrentStatus(supportedBrowsersAsArray);

      /** @type {FormattedFeature} */
      const formattedFeature = {
        featureName: rawBcdFeature.description ?? rawBcdFeature.id,
        currentStatus,
        isProgressiveEnhancement: isProgressiveEnhancement,
        canBeUsed: this._getCanBeUsedStatus({ currentStatus, isProgressiveEnhancement }),
        chromeSupport: supportedBrowsers.chrome,
        firefoxSupport: supportedBrowsers.firefox,
        safariSupport: supportedBrowsers.safari,
      };
      return formattedFeature;
    });

    return formattedFeatures;
  }

  /**
   * @param {{ currentStatus: FeatureStatus, isProgressiveEnhancement: boolean }} params
   * @returns {boolean}
   */
  _getCanBeUsedStatus({ currentStatus, isProgressiveEnhancement }) {
    // Widely supported features can always be used
    if (currentStatus === 'widely') {
      return true;
    }

    // Progressive enhancement features can be used if they're newly supported
    return isProgressiveEnhancement && currentStatus === 'newly';
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
      (browser) => browser.isSupported && this._isOldEnoughToBeWidelySupported(browser.releaseDate),
    );

    return isWidely ? 'widely' : 'newly';
  }

  /**
   * Determines if a feature's release date is old enough to be considered widely supported.
   * Checks if the release date is at least 2.5 years old.
   * BCD doesn't specify the baseline status so we need this helper to compute the baseline ourselves based on
   * browser version release dates.
   *
   * @param {Date} releaseDate - The date when the feature was released
   * @returns {boolean} - True if the feature was released more than 2.5 years ago
   */
  _isOldEnoughToBeWidelySupported(releaseDate) {
    const now = Date.now();
    const twoYearsAndHalf = new Date();
    twoYearsAndHalf.setFullYear(twoYearsAndHalf.getFullYear() - 2);
    twoYearsAndHalf.setMonth(twoYearsAndHalf.getMonth() - 6);

    return now - releaseDate.getTime() >= now - twoYearsAndHalf.getTime();
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

  render() {
    return html`
      ${this._featuresTask.render({
        pending: () => html`<cc-loader></cc-loader>`,
        complete: (formattedFeatures) => this._renderFeaturesTable(formattedFeatures),
        error: (e) => html`<cc-notice .message="${e}"></cc-notice>`,
      })}
    `;
  }

  /** @param {EventWithTargetCcToggleFeatureFilter} event */
  _onFeatureFilterChange(event) {
    this._tableFeatureFilter = event.target.value;
  }

  /** @param {EventWithTargetCcToggleDisplayMode} event */
  _onDisplayModeChange(event) {
    this._tableDisplayMode = event.target.value;
  }

  /**
   * @param {readonly FormattedFeature[]} formattedFeatures
   */
  _renderFeaturesTable(formattedFeatures) {
    const filterFeatureChoices = [
      { label: 'All features', value: 'all' },
      { label: 'Can be used', value: 'can-be-used' },
    ];
    const displayModeChoices = [
      { label: 'Compact', value: 'compact' },
      { label: 'Detailed', value: 'detailed' },
    ];

    const filteredFeatures =
      this._tableFeatureFilter === 'all'
        ? formattedFeatures
        : formattedFeatures.filter((formattedFeature) => formattedFeature.canBeUsed);

    return html`
      <div class="">
        <cc-toggle
          .choices=${filterFeatureChoices}
          .value="${this._tableFeatureFilter}"
          @cc-toggle:input=${this._onFeatureFilterChange}
        ></cc-toggle>
        <cc-toggle
          .choices=${displayModeChoices}
          .value="${this._tableDisplayMode}"
          @cc-toggle:input=${this._onDisplayModeChange}
        ></cc-toggle>
      </div>
      <cc-notice intent="warning">
        <div slot="message">Features with the warning icons should be used for progressive enhancement only</div>
      </cc-notice>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Baseline</th>
            <th>Can be used</th>
            <th>Chrome</th>
            <th>Firefox</th>
            <th>Safari</th>
          </tr>
        </thead>
        <tbody>
          ${filteredFeatures.map((feature) => this._renderFeatureRow(feature))}
        </tbody>
      </table>
    `;
  }

  /** @param {FormattedFeature} _ */
  _renderFeatureRow({
    isProgressiveEnhancement,
    canBeUsed,
    chromeSupport,
    currentStatus,
    featureName,
    firefoxSupport,
    safariSupport,
  }) {
    const { alt, src } = this._getBaselineSvg(currentStatus);
    return html`
      <tr>
        <td>${featureName}</td>
        <td>
          <div class="current-status">
            <img
              class="current-status__icon"
              src="${src}"
              alt=${this._tableDisplayMode === 'compact' ? alt : ''}
              title=${this._tableDisplayMode === 'compact' ? alt : ''}
            />
            <span>${this._tableDisplayMode === 'detailed' ? alt : ''}</span>
          </div>
        </td>
        <td>
          <div class="can-be-used">
            ${canBeUsed ? 'Yes' : 'No'}
            ${isProgressiveEnhancement && canBeUsed
              ? html`<cc-icon
                  .icon=${iconWarning}
                  a11y-name="Progressive enhancement only"
                  title="Progressive enhancement only"
                ></cc-icon>`
              : ''}
          </div>
        </td>
        <td>${this._renderBrowserSupport(chromeSupport)}</td>
        <td>${this._renderBrowserSupport(firefoxSupport)}</td>
        <td>${this._renderBrowserSupport(safariSupport)}</td>
      </tr>
    `;
  }

  /**
   * @param {FeatureStatus} status
   */
  _getBaselineSvg(status) {
    switch (status) {
      case 'widely':
        return { src: baselineWidelySvg.href, alt: 'Widely supported' };
      case 'newly':
        return { src: baselineNewlySvg.href, alt: 'Newly supported' };
      case 'limited':
        return { src: baselineLimitedSvg.href, alt: 'Limited availability' };
    }
  }

  /**
   * @param {BrowserSupported|BrowserUnsupported} browserSupport
   */
  _renderBrowserSupport(browserSupport) {
    const className = browserSupport.isSupported ? 'supported' : 'unsupported';
    return html`
      <div class="browser-support">
        <cc-icon
          .icon=${browserSupport.isSupported ? iconSupported : iconUnsupported}
          class=${className}
          size="lg"
        ></cc-icon>
        ${browserSupport.isSupported && this._tableDisplayMode === 'detailed'
          ? html`
              <p><cc-icon .icon=${iconVersion} size="md"></cc-icon> <span>${browserSupport.version}</span></p>
              <p>
                <cc-icon .icon=${iconDate} size="md"></cc-icon>
                <span
                  >${browserSupport.releaseDate.toLocaleDateString('en-US', {
                    month: 'numeric',
                    year: 'numeric',
                  })}</span
                >
              </p>
            `
          : ''}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      p {
        margin: 0;
      }

      cc-notice {
        margin-bottom: 1em;
      }

      table {
        border-collapse: collapse;
        overflow: hidden;
        border-radius: var(--cc-border-radius-small, 0.15em);
        width: 100%;
      }

      th,
      td {
        padding: 0.5em 1em;
        text-align: left;
      }

      th {
        background-color: var(--cc-color-bg-neutral-alt, #eee);
        color: var(--cc-color-text-strongest);
      }

      td {
        background-color: var(--cc-color-bg-neutral, #ddd);
        color: var(--cc-color-text-default, #000);
      }

      tr:not(:last-child) td {
        border-bottom: 1px solid var(--cc-color-border-neutral-weak, #eee);
      }

      .current-status {
        display: flex;
        gap: 0.5em;
        align-items: center;
      }

      .current-status__icon {
        width: auto;
        height: 1.5em;
      }

      .supported {
        --cc-icon-color: var(--cc-color-text-success);
      }

      .unsupported {
        --cc-icon-color: var(--cc-color-text-danger);
      }

      .can-be-used {
        --cc-icon-color: var(--cc-color-text-warning);

        align-items: center;
        display: flex;
        gap: 0.5em;
      }

      .browser-support {
        display: grid;
        gap: 0.5em;
      }

      .browser-support p {
        display: flex;
        gap: 0.5em;
        align-items: center;
      }
    `;
  }
}

window.customElements.define('cc-web-features-tracker', CcWebFeaturesTracker);
