import { LitElement, html, css } from 'lit';
import { API_ZONES_RAW } from '../api/zones.js';
import './ct-label-with-icon.js';
import './ct-product-name.js';
import './ct-zone-picker.js';

export class CtForm extends LitElement {
  static get properties () {
    return {
      product: { type: Object },
    };
  };

  render () {
    return html`
      <ct-product-name></ct-product-name>
      <ct-zone-picker .zones=${API_ZONES_RAW}></ct-zone-picker>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          --ct-form-label--font-family: "Source Sans 3";
          --ct-form-label--font-size: 1.625em;
          --ct-form-label--font-weight: 500;
          --ct-form-input--font-size: 1.25em;
          
          display: flex;
          flex-direction: column;
          row-gap: 2.5em;
        }
      `,
    ];
  }
}

customElements.define('ct-form', CtForm);
