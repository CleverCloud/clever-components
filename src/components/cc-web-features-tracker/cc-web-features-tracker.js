import { LitElement, html, css } from 'lit';
import { Task } from '@lit/task';
import {
  iconRemixAlertFill as iconWarning,
  iconRemixCheckFill as iconSupported,
  iconRemixCloseFill as iconUnsupported,
  iconRemixHashtag as iconVersion,
  iconRemixCalendarLine as iconDate,
} from '../../assets/cc-remix.icons.js';
import {
  iconCleverBaselineLimited as iconBaselineLimited,
  iconCleverBaselineNewly as iconBaselineNewly,
  iconCleverBaselineWidely as iconBaselineWidely,
} from '../../assets/cc-clever.icons.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-icon/cc-icon.js';
import '../cc-toggle/cc-toggle.js';

// TODO: finir style filtres & toggles
// TODO: doc contrib
// TODO: doc utilisation de ce composant / tableau

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
 * @typedef {import('./cc-web-features.types.js').FeaturesListSource} FeaturesListSource
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
      featureListSource: { type: Object, attribute: 'feature-list-source' },
      _tableDisplayMode: { type: String, state: true },
      _tableFeatureFilter: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {FeaturesListSource} */
    this.featureListSource = null;

    /** @type {'all'|'can-be-used'} */
    this._tableFeatureFilter = 'all';

    /** @type {'compact'|'detailed'} */
    this._tableDisplayMode = 'compact';

    this._featuresTask = this._initializeFeaturesTask();
  }

  _initializeFeaturesTask() {
    return new Task(this, {
      task: async ([featureListSource], { signal }) => {
        /** @type {WebFeatures} */
        let webFeatures;

        switch (featureListSource.type) {
          case 'direct':
            webFeatures = featureListSource.data;
            break;
          case 'url':
            const sourceResponse = await fetch(featureListSource.url, { signal });
            if (!sourceResponse.ok) {
              throw new Error(`Failed to fetch features: ${sourceResponse.status}`);
            }
            webFeatures = await sourceResponse.json();
            break;
          case 'json-as-string':
            try {
              const jsonString = featureListSource.jsonString;
              webFeatures = JSON.parse(jsonString);
            } catch (error) {
              const message = error instanceof Error ? error.message : '';
              throw new Error(`Failed to parse JSON string: ${message}`);
            }
            break;
        }

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
        const rawBcdFeatures = this._retrieveBcdFeatures(bcdData, webFeatures);
        const formattedBcdFeatures = this._formatBcdFeatures(rawBcdFeatures, bcdBrowserInfos, webFeatures);
        const formattedBaselinesFeatures = this._formatBaselineFeatures(rawBaselineFeatures, webFeatures);

        return [...formattedBaselinesFeatures, ...formattedBcdFeatures];
      },
      args: () => [this.featureListSource],
    });
  }

  /**
   *
   * @param {Object} rawBcd
   * @param {WebFeatures} webFeatures
   * @returns {Array<BcdFeatureCompatInfo & { id: string }>}
   */
  _retrieveBcdFeatures(rawBcd, webFeatures) {
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
   * @param {WebFeatures} webFeatures
   * @returns {Array<FormattedFeature>}
   */
  _formatBaselineFeatures(rawBaselineFeatures, webFeatures) {
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
        chromeSupport: this._getBaselineFeatureStatus('chrome', baselineFeature),
        firefoxSupport: this._getBaselineFeatureStatus('firefox', baselineFeature),
        safariSupport: this._getBaselineFeatureStatus('safari', baselineFeature),
      };
    });

    return formattedFeatures;
  }

  /**
   * Format BCD features into FormattedFeature[]
   * @param {Array<BcdFeatureCompatInfo & { id: string }>} rawBcdFeatures
   * @param {BcdBrowserInfo} bcdBrowserInfos
   * @param {WebFeatures} webFeatures
   * @returns {Array<FormattedFeature>}
   */
  _formatBcdFeatures(rawBcdFeatures, bcdBrowserInfos, webFeatures) {
    const formattedFeatures = rawBcdFeatures.map((rawBcdFeature) => {
      const supportedBrowsers = {
        chrome: this._getBcdBrowserSupport('chrome', rawBcdFeature, bcdBrowserInfos),
        firefox: this._getBcdBrowserSupport('firefox', rawBcdFeature, bcdBrowserInfos),
        safari: this._getBcdBrowserSupport('safari', rawBcdFeature, bcdBrowserInfos),
      };
      const supportedBrowsersAsArray = Object.values(supportedBrowsers);

      const isProgressiveEnhancement = webFeatures.bcdFeatures.find(
        (webFeature) => webFeature.featureId === rawBcdFeature.id,
      ).isProgressiveEnhancement;
      const currentStatus = this._getBcdFeatureCurrentStatus(supportedBrowsersAsArray);

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
   * @param {Browser} browser
   * @param {BaselineFeatureData} rawBaselineFeature
   * @returns {BrowserSupported | BrowserUnsupported}
   */
  _getBaselineFeatureStatus(browser, rawBaselineFeature) {
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
  _getBcdBrowserSupport(browser, rawBcdFeature, browserInfos) {
    const browserVersion = rawBcdFeature.support[browser].version_added;

    // when a feature has not been implemented in a browser, `version_added` is `false`
    if (browserVersion === false) {
      return { isSupported: false };
    }

    return {
      isSupported: true,
      version: browserVersion,
      releaseDate: new Date(browserInfos[browser].releases[browserVersion].release_date),
    };
  }

  /**
   * Determines the current support status of a web feature based on browser support data.
   * Only used for BCD features since baseline feature already come with this data.
   *
   * This method examines an array of browser support objects and categorizes the feature as:
   * - 'limited': When at least one browser doesn't support the feature
   * - 'widely': When all browsers support the feature and the release date is old enough (2.5+ years)
   * - 'newly': When all browsers support the feature but it was released recently
   *
   * @param {Array<BrowserSupported|BrowserUnsupported>} supportedBrowsers - Array of browser support information objects
   * @returns {FeatureStatus} The feature's support status ('limited', 'widely', or 'newly')
   */
  _getBcdFeatureCurrentStatus(supportedBrowsers) {
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
   * @param {FeatureStatus} status
   */
  _getBaselineSvg(status) {
    switch (status) {
      case 'widely':
        return { icon: iconBaselineWidely, alt: 'Widely supported' };
      case 'newly':
        return { icon: iconBaselineNewly, alt: 'Newly supported' };
      case 'limited':
        return { icon: iconBaselineLimited, alt: 'Limited availability' };
    }
  }

  /** @param {EventWithTargetCcToggleFeatureFilter} event */
  _onFeatureFilterChange(event) {
    this._tableFeatureFilter = event.target.value;
  }

  /** @param {EventWithTargetCcToggleDisplayMode} event */
  _onDisplayModeChange(event) {
    this._tableDisplayMode = event.target.value;
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
            <th>Can be used</th>
            <th>Baseline</th>
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
    const { icon: baselineIcon, alt } = this._getBaselineSvg(currentStatus);
    return html`
      <tr>
        <td>${featureName}</td>
        <td>
          <div class="can-be-used">
            ${canBeUsed ? 'Yes' : 'No'}
            ${isProgressiveEnhancement && currentStatus === 'newly'
              ? html`<cc-icon
                  .icon=${iconWarning}
                  a11y-name="Progressive enhancement only"
                  title="Progressive enhancement only"
                ></cc-icon>`
              : ''}
          </div>
        </td>
        <td>
          <div class="current-status">
            <cc-icon
              class="current-status__icon"
              .icon=${baselineIcon}
              a11y-name=${this._tableDisplayMode === 'compact' ? alt : ''}
              title=${this._tableDisplayMode === 'compact' ? alt : ''}
            ></cc-icon>
            <span>${this._tableDisplayMode === 'detailed' ? alt : ''}</span>
          </div>
        </td>
        <td>${this._renderBrowserSupport(chromeSupport)}</td>
        <td>${this._renderBrowserSupport(firefoxSupport)}</td>
        <td>${this._renderBrowserSupport(safariSupport)}</td>
      </tr>
    `;
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
        border-radius: var(--cc-border-radius-small, 0.15em);
        overflow: hidden;
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
        align-items: center;
        display: flex;
        gap: 0.5em;
      }

      .current-status__icon {
        height: 1.5em;
        width: auto;
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
        align-items: center;
        display: flex;
        gap: 0.5em;
      }
    `;
  }
}

window.customElements.define('cc-web-features-tracker', CcWebFeaturesTracker);
