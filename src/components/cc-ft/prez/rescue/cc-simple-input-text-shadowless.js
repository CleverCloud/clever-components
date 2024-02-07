import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { dispatchCustomEvent } from '../../../lib/events.js';

export class CcSimpleInputText extends LitElement {
  createRenderRoot () {
    return this;
  }

  static get properties () {
    return {
      disabled: { type: Boolean },
      label: { type: String },
      name: { type: String },
      value: { type: String },
    };
  }

  constructor () {
    super();

    this.disabled = false;
    this.label = '';
    this.name = '';
    this.value = '';

    /** @type {Ref<HTMLInputElement>} */
    this._inputRef = createRef();
  }

  focus (options) {
    this._inputRef.value.focus(options);
  }

  _onInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  render () {
    return html`
      <div class="wrapper">
        <label for="input">${this.label}</label>
        <input
          ${ref(this._inputRef)}
          id="input"
          type="text"
          name=${this.name}
          .value=${this.value}
          ?disabled=${this.disabled}
          spellcheck="false"
          @input=${this._onInput}
        >
        <slot name="error"></slot>
      </div>
    `;
  }

  static get styles () {
    return css`
      
      :host {
        display: block;
      }
      
      slot[name='error']::slotted(*) {
        color: var(--cc-color-text-danger);
      }
      
      .wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25em;
      }
    `;
  }
}

window.customElements.define('cc-simple-input-text', CcSimpleInputText);
