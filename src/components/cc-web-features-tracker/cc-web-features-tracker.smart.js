import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-web-features-tracker.js';

/**
 * @import { CcWebFeaturesTracker } from './cc-web-features-tracker.js'
 * @import { WebFeatures, BcdFeatureCompatInfo, BcdBrowserInfo, BaselineFeatureData, FormattedFeature, Browser, BrowserSupported, BrowserUnsupported, FeatureStatus, FeatureJson, SkeletonWebFeature } from './cc-web-features-tracker.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-web-features-tracker',
  params: {
    trackedWebFeatures: { type: Object },
  },
  /** @param {OnContextUpdateArgs<CcWebFeaturesTracker>} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { trackedWebFeatures } = /** @type {{ trackedWebFeatures: WebFeatures }} */ (context);

    const api = new Api(trackedWebFeatures, signal);

    updateComponent('state', {
      type: 'loading',
      webFeatures: Object.values(trackedWebFeatures)
        .flat()
        .map(
          /**
           * @param {FeatureJson} webFeature
           * @returns {SkeletonWebFeature}
           */
          (webFeature) => ({
            featureId: webFeature.featureId,
            featureName: webFeature.featureId,
            comment: webFeature.comment,
            category: webFeature.category,
            canBeUsedWithPolyfill: webFeature.canBeUsedWithPolyfill,
            isProgressiveEnhancement: webFeature.isProgressiveEnhancement,
          }),
        ),
    });

    api
      .getWebFeaturesData()
      .then(({ rawBaselineFeatures, rawBcdFeatures, bcdBrowserInfos }) => {
        const formatter = new FeatureFormatter({
          trackedWebFeatures,
          rawBcdFeatures,
          rawBaselineFeatures,
          bcdBrowserInfos,
        });

        updateComponent('state', {
          type: 'loaded',
          webFeatures: formatter.getFormattedFeatures(),
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

class Api {
  /** @type {WebFeatures} webFeatures*/
  #trackedWebFeatures;

  /** @type {AbortSignal} signal */
  #signal;

  /**
   * @param {WebFeatures} trackedWebFeatures
   * @param {AbortSignal} signal
   */
  constructor(trackedWebFeatures, signal) {
    this.#trackedWebFeatures = trackedWebFeatures;
    this.#signal = signal;
  }

  /**
   * Fetches browser compatibility data from MDN's BCD dataset
   *
   * @throws {Error} If the response is not ok
   * @returns {Promise<{bcdBrowserInfos: BcdBrowserInfo, rawBcdFeatures: Array<BcdFeatureCompatInfo & { id: string }>}>} Object containing browser info and feature compatibility data
   */
  async #fetchBcd() {
    const bcdResponse = await fetch('https://unpkg.com/@mdn/browser-compat-data/data.json', { signal: this.#signal });
    if (!bcdResponse.ok) {
      throw new Error(bcdResponse.status.toString());
    }

    const bcdData = await bcdResponse.json();
    const bcdBrowserInfos = bcdData.browsers;
    const rawBcdFeatures = this.#retrieveBcdFeatures(bcdData);

    return { bcdBrowserInfos, rawBcdFeatures };
  }

  /**
   * @param {Object} rawBcd
   * @returns {Array<BcdFeatureCompatInfo & { id: string }>}
   */
  #retrieveBcdFeatures(rawBcd) {
    const bcdFeatures = this.#trackedWebFeatures.bcdFeatures;

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

  /** @returns {Promise<BaselineFeatureData[]>} */
  #fetchBaseline() {
    const baselineFeaturesUrl = this.#trackedWebFeatures.baselineFeatures.map(
      (baselineFeature) => `https://api.webstatus.dev/v1/features/${baselineFeature.featureId}`,
    );
    return Promise.all(
      baselineFeaturesUrl.map((url) =>
        fetch(url, { signal: this.#signal }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.status.toString());
        }),
      ),
    );
  }

  async getWebFeaturesData() {
    const { bcdBrowserInfos, rawBcdFeatures } = await this.#fetchBcd();
    const rawBaselineFeatures = await this.#fetchBaseline();
    return { bcdBrowserInfos, rawBcdFeatures, rawBaselineFeatures };
  }
}

class FeatureFormatter {
  /** @type {WebFeatures} */
  #trackedWebFeatures;

  /** @type {BaselineFeatureData[]} */
  #rawBaselineFeatures;

  /** @type {Array<BcdFeatureCompatInfo & { id: string }>} */
  #rawBcdFeatures;

  /** @type {BcdBrowserInfo} */
  #bcdBrowserInfos;

  /**
   * @param {object} _
   * @param {WebFeatures} _.trackedWebFeatures
   * @param {BaselineFeatureData[]} _.rawBaselineFeatures
   * @param {Array<BcdFeatureCompatInfo & { id: string }>} _.rawBcdFeatures
   * @param {BcdBrowserInfo} _.bcdBrowserInfos
   */
  constructor({ trackedWebFeatures, rawBaselineFeatures, rawBcdFeatures, bcdBrowserInfos }) {
    this.#trackedWebFeatures = trackedWebFeatures;
    this.#rawBaselineFeatures = rawBaselineFeatures;
    this.#rawBcdFeatures = rawBcdFeatures;
    this.#bcdBrowserInfos = bcdBrowserInfos;
  }

  getFormattedFeatures() {
    const formattedBaselineFeatures = this.#formatBaselineFeatures(this.#rawBaselineFeatures);
    const formattedBcdFeatures = this.#formatBcdFeatures(this.#rawBcdFeatures, this.#bcdBrowserInfos);
    return [...formattedBaselineFeatures, ...formattedBcdFeatures].toSorted((a, b) =>
      a.featureName.localeCompare(b.featureName),
    );
  }

  /**
   * @param {BaselineFeatureData[]} rawBaselineFeatures
   * @returns {Array<FormattedFeature>}
   */
  #formatBaselineFeatures(rawBaselineFeatures) {
    const formattedFeatures = rawBaselineFeatures.map((baselineFeature) => {
      const currentStatus = baselineFeature.baseline.status;
      const { featureId, isProgressiveEnhancement, canBeUsedWithPolyfill, comment, category } =
        this.#trackedWebFeatures.baselineFeatures.find(
          (webFeature) => webFeature.featureId === baselineFeature.feature_id,
        );

      return {
        featureId: featureId,
        featureName: baselineFeature.name,
        currentStatus,
        comment,
        category,
        isProgressiveEnhancement,
        canBeUsedWithPolyfill,
        canBeUsed: this.#getCanBeUsedStatus({ currentStatus, isProgressiveEnhancement, canBeUsedWithPolyfill }),
        chromeSupport: this.#getBaselineFeatureStatus('chrome', baselineFeature),
        firefoxSupport: this.#getBaselineFeatureStatus('firefox', baselineFeature),
        safariSupport: this.#getBaselineFeatureStatus('safari', baselineFeature),
      };
    });

    return formattedFeatures;
  }

  /**
   * Format BCD features into FormattedFeature[]
   *
   * @param {Array<BcdFeatureCompatInfo & { id: string }>} rawBcdFeatures
   * @param {BcdBrowserInfo} bcdBrowserInfos
   * @returns {Array<FormattedFeature>}
   */
  #formatBcdFeatures(rawBcdFeatures, bcdBrowserInfos) {
    const formattedFeatures = rawBcdFeatures.map((rawBcdFeature) => {
      const supportedBrowsers = {
        chrome: this.#getBcdBrowserSupport('chrome', rawBcdFeature, bcdBrowserInfos),
        firefox: this.#getBcdBrowserSupport('firefox', rawBcdFeature, bcdBrowserInfos),
        safari: this.#getBcdBrowserSupport('safari', rawBcdFeature, bcdBrowserInfos),
      };
      const supportedBrowsersAsArray = Object.values(supportedBrowsers);

      const { featureId, isProgressiveEnhancement, canBeUsedWithPolyfill, comment, category } =
        this.#trackedWebFeatures.bcdFeatures.find((webFeature) => webFeature.featureId === rawBcdFeature.id);
      const currentStatus = this.#getBcdFeatureCurrentStatus(supportedBrowsersAsArray);

      /** @type {FormattedFeature} */
      const formattedFeature = {
        featureId,
        featureName: rawBcdFeature.description ?? rawBcdFeature.id,
        currentStatus,
        comment,
        category,
        isProgressiveEnhancement,
        canBeUsedWithPolyfill,
        canBeUsed: this.#getCanBeUsedStatus({ currentStatus, isProgressiveEnhancement, canBeUsedWithPolyfill }),
        chromeSupport: supportedBrowsers.chrome,
        firefoxSupport: supportedBrowsers.firefox,
        safariSupport: supportedBrowsers.safari,
      };
      return formattedFeature;
    });

    return formattedFeatures;
  }

  /**
   * @param {{ currentStatus: FeatureStatus, isProgressiveEnhancement: boolean, canBeUsedWithPolyfill: boolean }} params
   * @returns {boolean}
   */
  #getCanBeUsedStatus({ currentStatus, isProgressiveEnhancement, canBeUsedWithPolyfill }) {
    // Widely supported features & features that are allowed with a polyfill can always be used
    if (currentStatus === 'widely' || canBeUsedWithPolyfill) {
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
  #getBaselineFeatureStatus(browser, rawBaselineFeature) {
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
  #getBcdBrowserSupport(browser, rawBcdFeature, browserInfos) {
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
  #getBcdFeatureCurrentStatus(supportedBrowsers) {
    const isLimited = supportedBrowsers.some((browser) => !browser.isSupported);

    if (isLimited) {
      return 'limited';
    }

    const isWidely = supportedBrowsers.every(
      (browser) => browser.isSupported && this.#isOldEnoughToBeWidelySupported(browser.releaseDate),
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
  #isOldEnoughToBeWidelySupported(releaseDate) {
    const now = Date.now();
    const twoYearsAndHalf = new Date();
    twoYearsAndHalf.setFullYear(twoYearsAndHalf.getFullYear() - 2);
    twoYearsAndHalf.setMonth(twoYearsAndHalf.getMonth() - 6);

    return now - releaseDate.getTime() >= now - twoYearsAndHalf.getTime();
  }
}
