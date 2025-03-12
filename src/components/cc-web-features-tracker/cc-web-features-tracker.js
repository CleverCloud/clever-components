import { LitElement, html, css } from 'lit';
// @ts-ignore
import webAndBcdFeatures from './web-features.json';

/**
 * Component for web trackers features.
 *
 * @cssdisplay block
 */
export class CcWebFeaturesTracker extends LitElement {
  static get properties() {
    return {
      _features: { type: Array, state: true }
    };
  }

  constructor() {
    super();
  }

  render () {
    return html`
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Support</th>
        </tr>
      </thead>
      <tbody>
        ${webAndBcdFeatures.webFeatures.map(
          ({ featureId, requiredStatus }) => this._renderFeatureRow(featureId, requiredStatus)
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
