import { LitElement, html, css } from 'lit';
import webFeatures from './web-features.json';

/**
 * Component for web trackers features.
 *
 * @cssdisplay block
 */
export class CcWebFeaturesTrackers extends LitElement {
  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  render() {
    return html``;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }
}

window.customElements.define('cc-web-features-trackers', CcWebFeaturesTrackers);
