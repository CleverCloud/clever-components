import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-web-features-tracker.js';

/**
 * @typedef {import('./cc-web-features-tracker.js').CcWebFeaturesTracker} CcWebFeaturesTracker
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcWebFeaturesTracker>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('./cc-web-features.types.js').WebFeatures} WebFeatures
 * @typedef {import('./cc-web-features.types.js').BcdFeatureCompatInfo} BcdFeatureCompatInfo
 * @typedef {import('./cc-web-features.types.js').BcdBrowserInfo} BcdBrowserInfo
 * @typedef {import('./cc-web-features.types.js').BaselineFeatureData} BaselineFeatureData
 */

console.log('smart file loaded');
defineSmartComponent({
  selector: 'cc-web-features-tracker',
  params: {
    webFeaturesAsJson: { type: Object },
  },
  /** @param {OnContextUpdateArgs} args */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is type with generics
  onContextUpdate({ container, component, context, onEvent, updateComponent, signal }) {
    const { webFeaturesAsJson } = context;

    // TODO: error if JSON is not correct

    const api = new Api(webFeaturesAsJson, signal);
    // Si on a pas le web features (erreur)
    // updateComponent => erreur

    // Soit on a le web features =>

    // get json from path
    api.getWebFeaturesData().then((rawWebFeaturesData) => console.log(rawWebFeaturesData));
  },
});

class Api {
  /** @type {WebFeatures} webFeatures*/
  #webFeatures;

  /**
   * @param {WebFeatures} webFeatures
   * @param {AbortSignal} signal
   */
  constructor(webFeatures, signal) {
    this.#webFeatures = webFeatures;
    this._signal = signal;
  }

  /**
   * Fetches browser compatibility data from MDN's BCD dataset
   * @throws {Error} If the response is not ok
   * @returns {Promise<{bcdBrowserInfos: BcdBrowserInfo, rawBcdFeatures: Array<BcdFeatureCompatInfo & { id: string }>}>} Object containing browser info and feature compatibility data
   */
  async #fetchBcd() {
    const bcdResponse = await fetch('https://unpkg.com/@mdn/browser-compat-data/data.json', { signal: this._signal });
    if (!bcdResponse.ok) {
      throw new Error(bcdResponse.status.toString());
    }

    const bcdData = await bcdResponse.json();
    const bcdBrowserInfos = bcdData.browsers;
    const rawBcdFeatures = this.#retrieveBcdFeatures(bcdData);

    return { bcdBrowserInfos, rawBcdFeatures };
  }

  /**
   *
   * @param {Object} rawBcd
   * @returns {Array<BcdFeatureCompatInfo & { id: string }>}
   */
  #retrieveBcdFeatures(rawBcd) {
    const bcdFeatures = this.#webFeatures.bcdFeatures;

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
    const baselineFeaturesUrl = this.#webFeatures.baselineFeatures.map(
      (baselineFeature) => `https://api.webstatus.dev/v1/features/${baselineFeature.featureId}`,
    );
    return Promise.all(
      baselineFeaturesUrl.map((url) =>
        fetch(url, { signal: this._signal }).then((response) => {
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
