import { LitElement, html, css } from 'lit';
import { Task } from '@lit/task';
// @ts-ignore
import webAndBcdFeatures from './web-features.json';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { WebView } from 'storybook/internal/preview-api';

/**
 * Component for web trackers features.
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
        const webFeaturesUrls = webAndBcdFeatures.webFeatures.map(
          (webFeature) => `https://api.webstatus.dev/v1/features/${webFeature.featureId}`,
        );

        const bcdResponse = await fetch('https://unpkg.com/@mdn/browser-compat-data/data.json', { signal });
        const webFeatures = await Promise.all(
          webFeaturesUrls.map(async (url) => {
            const response = await fetch(url, { signal });
            if (!response.ok) {
              throw new Error(response.status);
            }
            return await response.json();
          }),
        );

        if (!bcdResponse.ok) {
          throw new Error(bcdResponse.status);
        }
        const bcdData = await bcdResponse.json();
        const formattedBcd = this._retrieveBcdFeatures(bcdData);
        console.log(formattedBcd);

        console.log({ webFeatures });
        console.log({ bcdData });
        return [...webFeatures, ...formattedBcd];
      },
      args: () => [],
    });
  }

  _retrieveBcdFeatures(rawBcd) {
    const bcdFeatures = webAndBcdFeatures.bcdFeatures;

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
          ${webAndBcdFeatures.webFeatures.map(({ featureId, requiredStatus }) =>
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
