import { html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../../../lib/events.js';

export class CcSimpleButton extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean, reflect: true },
      type: { type: String },
    };
  }

  static get formAssociated () {
    return true;
  }

  constructor () {
    super();

    /** @type {boolean} Sets `disabled` attribute on inner native `<button>` element. */
    this.disabled = false;

    /** @type {'submit'|'reset'|'button'} button type. */
    this.type = 'button';

    /** @type {ElementInternals} */
    this._internals = this.attachInternals();
  }

  focus () {
    this.shadowRoot.querySelector('button').focus();
  }

  _onClick (e) {
    e.stopPropagation();

    if (this.type === 'submit') {
      this._internals.form?.requestSubmit();
    }

    if (this.type === 'reset') {
      this._internals.form?.reset();
    }

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
