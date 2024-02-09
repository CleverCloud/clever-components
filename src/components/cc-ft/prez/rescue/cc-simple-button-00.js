import { html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../../../lib/events.js';

export class CcSimpleButton extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean, reflect: true },
      type: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Sets `disabled` attribute on inner native `<button>` element. */
    this.disabled = false;

    /** @type {'submit'|'reset'|'button'} button type. */
    this.type = 'button';
  }

  focus () {
    this.shadowRoot.querySelector('button').focus();
  }

  _onClick (e) {
    e.stopPropagation();

    dispatchCustomEvent(this, 'click');
  }

  render () {
    return html`
      <button
        type="${this.type}"
        ?disabled=${this.disabled}
        @click=${this._onClick}
      >
        <slot></slot>
      </button>
    `;
  }
}

window.customElements.define('cc-simple-button', CcSimpleButton);
