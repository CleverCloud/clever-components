import { LitElement, html, css } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixInstanceLine as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  LABEL: 'Your instance name',
};

export class CtProductName extends LitElement {
  static get properties () {
    return {
      instanceName: { type: Object, attribute: 'product-name' },
    };
  };

  constructor () {
    super();

    this._inputNameRef = createRef();
  }

  _onNameInputUpdated () {
    this.instanceName = this._inputNameRef.value.value;
    this._dispatchNameUpdateEvent(this.instanceName);
  }

  _dispatchNameUpdateEvent (value) {
    this.dispatchEvent(new CustomEvent('ct-product-name:name-updated', {
      detail: value,
      bubbles: true,
      composed: true,
    }));
  }

  async connectedCallback () {
    super.connectedCallback();

    const response = await fetch('https://makemeapassword.ligos.net/api/v1/passphrase/json?wc=4&pc=1&sp=y');
    const phrase = await response.json();
    this.instanceName = phrase.pws.join(' ').replaceAll(' ', '-');

    this._dispatchNameUpdateEvent(this.instanceName);
  }

  render () {
    return html`
      <ct-label-with-icon
        .icon="${labelIcon}"
        .label="${WORDING.LABEL}"
      >
        <cc-input-text
          required
          @cc-input-text:input=${this._onNameInputUpdated}
          .value="${this.instanceName}"
          ${ref(this._inputNameRef)}
        ></cc-input-text>
      </ct-label-with-icon>
    `;
  }

  static get styles () {
    return [
      css`
        cc-input-text {
          font-size: var(--ct-form-input--font-size);
        }
      `,
    ];
  }
}

customElements.define('ct-product-name', CtProductName);
