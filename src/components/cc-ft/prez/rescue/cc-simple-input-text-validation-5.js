import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { dispatchCustomEvent } from '../../../../lib/events.js';
import { RequiredValidator } from '../../validation/validation.js';

export class CcSimpleInputText extends LitElement {
  static get properties () {
    return {
      disabled: { type: Boolean },
      label: { type: String },
      name: { type: String },
      value: { type: String },
      required: { type: Boolean },
      _errorMessage: { type: String, state: true },
    };
  }

  static get formAssociated () {
    return true;
  }

  constructor () {
    super();

    this.disabled = false;
    this.label = '';
    this.name = '';
    this.value = '';
    this.required = false;

    this._errorMessage = null;

    /** @type {Ref<HTMLInputElement>} */
    this._inputRef = createRef();
    /** @type {ElementInternals} */
    this._internals = this.attachInternals();
  }

  get validity () {
    return this._internals.validity;
  }

  get validationMessage () {
    return this._internals.validationMessage;
  }

  /**
   *
   * @param {boolean} report
   * @return {Validation}
   */
  validate (report) {
    const validator = new RequiredValidator(this.required);
    const validation = validator.validate(this.value);

    if (!validation.valid) {
      this._internals.setValidity(
        { valueMissing: true },
        validation.code,
        this._inputRef.value,
      );

      if (report) {
        this._errorMessage = validator.getErrorMessage(validation.code);
      }
    }
    else {
      this._internals.setValidity({});

      if (report) {
        this._errorMessage = null;
      }
    }

    return validation;
  }

  focus (options) {
    this._inputRef.value.focus(options);
  }

  _onInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  updated (changedProperties) {
    let needValidation = false;
    if (changedProperties.has('value')) {
      this._internals.setFormValue(this.value);
      needValidation = true;
    }
    if (changedProperties.has('required')) {
      needValidation = true;
    }

    if (needValidation) {
      this.validate(false);
    }
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
          ?required=${this.required}
          spellcheck="false"
          @input=${this._onInput}
        >
        ${this._errorMessage != null ? html`
          <div class="error">${this._errorMessage}</div>
        ` : ''}
      </div>
    `;
  }

  static get styles () {
    return css`
      
      :host {
        display: block;
      }
      
      .error {
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