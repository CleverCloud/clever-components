import { LitElement, html, css } from 'lit';
import './ct-form.js';
import './ct-summary.js';

export class CtContainer extends LitElement {
  static get properties () {
    return {
      form: { type: Object },
      product: { type: Object },
    };
  };

  constructor () {
    super();
    this.form = {};
  }

  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('ct-product-name:name-updated', this._onProductNameUpdated);
    this.addEventListener('ct-zone-picker:zone-updated', this._onZoneUpdated);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this.removeEventListener('ct-product-name:name-updated', this._onProductNameUpdated);
    this.removeEventListener('ct-zone-picker:zone-updated', this._onZoneUpdated);
  }

  _onProductNameUpdated (e) {
    this.form = {
      ...this.form,
      instanceName: e.detail,
    };
  }

  _onZoneUpdated (e) {
    this.form = {
      ...this.form,
      zone: e.detail,
    };
  }

  render () {
    return html`
      <ct-form
        class="form"
        .product="${this.product}">
      </ct-form>
      <ct-summary
        class="summary"
        .form="${this.form}"
        .product="${this.product}"
      ></ct-summary>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          --gap-block: 1em;
          --gap-inline: 2em;
          --gap: var(--gap-block) var(--gap-inline);

          display: flex;
          align-items: flex-start;
          padding-block: var(--gap);
        }
        :host .form {
          flex: 2 1 0;
        }
        :host .summary {
          flex: 1 1 0;
        }
        
        .form {
          padding: var(--gap);
        }

        .summary {
          position: sticky;
          top: var(--gap-block);
          margin: var(--gap);
          min-width: 20em;
        }
      `,
    ];
  }
}

customElements.define('ct-container', CtContainer);
