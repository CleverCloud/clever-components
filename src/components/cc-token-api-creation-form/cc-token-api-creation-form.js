import { LitElement, css, html } from 'lit';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';

/**
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormState} TokenApiCreationFormState
 * @typedef {import('./cc-token-api-creation-form.types.js').CreationStep} CreationStep
 */

export class CcTokenApiCreationForm extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _currentStep: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {TokenApiCreationFormState} Sets the state of the component. */
    this.state = { type: 'loading' };

    /** @type {CreationStep} */
    this._currentStep = 'config';
  }

  render() {
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-token-api-creation-form.main-heading')}</div>
      </cc-block>
    `;
  }

  _renderConfigStepForm() {
    return html``;
  }

  _renderValidateStepForm() {
    return html``;
  }

  _renderCopyStep() {
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

window.customElements.define('cc-token-api-creation-form', CcTokenApiCreationForm);
