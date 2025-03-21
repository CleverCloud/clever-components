import { LitElement, html, css } from 'lit';
import { Task } from '@lit/task';
// @ts-ignore
import untypedWebFeatures from './web-features.json';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';

// TODO:
// - if browser.version_added === false => KO do not use this feature (need to check for each browser) => limited
// - if browser.version_added === string (e.g: '40') => need to check if newly or widely (with _getStatusFromBcd)
// - do this for each browser to get the status of each one,
// - if 1 of browser has newly => newly
// - else => widely

/** @type {WebFeatures} */
const webFeatures = untypedWebFeatures;

/**
 * @typedef {import('./cc-web-features.types.js').WebFeatures} WebFeatures
 * @typedef {import('./cc-web-features.types.js').BaselineFeatureData} BaselineFeatureData
 * @typedef {import('./cc-web-features.types.js').BcdFeatureCompatInfo} BcdFeatureCompatInfo
 */

/**
 * Component to display web tracked features.
 *
 * @cssdisplay block
 */
export class CcWebFeaturesTracker extends LitElement {
  static get properties() {
    return {
      // _features: { type: Array, state: true },
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
        const rawBcdFeatures = this._retrieveBcdFeatures(bcdData);

        /*
         * {featureId, status}[]
         * Do we put all the infos for the component here?
         */
        return [...rawBaselineFeatures, ...rawBcdFeatures];
      },
      args: () => [],
    });
  }

  _getStatusFromBcd(browser, version, browsersInfos) {
    const releaseDate = new Date(browsersInfos[browser][version].release_date);
    const now = Date.now();
    const twoYearsAndHalf = new Date();
    twoYearsAndHalf.setFullYear(twoYearsAndHalf.getFullYear() - 2);
    twoYearsAndHalf.setMonth(twoYearsAndHalf.getMonth() - 6);

    return now - releaseDate.getTime() >= now - twoYearsAndHalf.getTime();
  }

  /**
   *
   * @param {Object} rawBcd
   * @returns {Array<BcdFeatureCompatInfo>}
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
      return value['__compat'];
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

  _renderFeaturesTable(formattedFeatures) {
    return html`
      <table>
        <thead>
          <tr>
            <th>Feature Id</th>
            <th>Feature</th>
            <th>Current Baseline</th>
            <th>Can be used in Clever Components</th>
          </tr>
        </thead>
        <tbody>
          ${webFeatures.baselineFeatures.map(({ featureId, requiredStatus }) =>
            this._renderFeatureRow(featureId, requiredStatus),
          )}
        </tbody>
      </table>
    `;
  }

  _renderFeatureRow(featureId, requiredStatus) {
    return html`
      <tr>
        <td>${featureId}</td>
        <td>${requiredStatus}</td>
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
