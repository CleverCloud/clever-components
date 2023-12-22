import { LitElement, html, css } from 'lit';
import './ct-summary-product-name.js';
import './ct-summary-zone.js';

const WORDING = {
  CREATE: 'create instance',
  CANCEL: 'cancel',
};

export class CtSummary extends LitElement {
  static get properties () {
    return {
      form: { type: Object },
      product: { type: Object },
    };
  };

  render () {
    return html`
      <div class="header">
        <div class="header--logo">
          <cc-img src="${this.product.logoUrl}"></cc-img>
        </div>
        <div class="header--name">
          ${this.product.name}
        </div>
      </div>
      <div class="body">
        <ct-summary-product-name name="${this.form.instanceName}"></ct-summary-product-name>
        <ct-summary-zone .zone="${this.form.zone}"></ct-summary-zone>
      </div>
      <div class="footer">
        <cc-button class="btn-submit" primary>${WORDING.CREATE}</cc-button>
        <cc-button class="btn-cancel">${WORDING.CANCEL}</cc-button>
      </div>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
          border-radius: var(--cc-border-radius-default);
          overflow: hidden;
        }

        .btn-submit,
        .btn-cancel {
          --cc-button-text-transform: capitalize;
          --cc-button-font-weight: 500;
        }

        .header,
        .body,
        .footer {
          padding: 1em;
        }

        .body {
          border-left: 2px solid var(--cc-color-border-primary-weak);
          border-right: 2px solid var(--cc-color-border-primary-weak);
        }
        .footer {
          border-bottom: 2px solid var(--cc-color-border-primary-weak);
          border-left: 2px solid var(--cc-color-border-primary-weak);
          border-right: 2px solid var(--cc-color-border-primary-weak);
        }

        .header {
          display: flex;
          align-items: center;
          column-gap: 1em;
          color: var(--cc-color-text-inverted);
          background-color: var(--cc-color-bg-primary);
        }

        .header--logo {
          display: inline-flex;
          flex: 0 0 auto;
          border: 1px solid var(--cc-color-bg-primary-weak);
          border-radius: var(--cc-border-radius-default);
          overflow: hidden;
        }
        .header--name {
          flex: 1 1 auto;
          font-size: 2em;
          font-weight: 500;
          line-height: 1.125;
        }

        .header--logo cc-img {
          width: 3em;
          height: 3em;
        }
        
        .body {
          display: flex;
          flex-direction: column;
          row-gap: 1em;
        }
        
        .footer {
          display: flex;
          column-gap: 0.5em;
        }

        .footer cc-button {
          flex: 0 0 auto;
          font-size: 1.125em;
        }
      `,
    ];
  }
}

customElements.define('ct-summary', CtSummary);
