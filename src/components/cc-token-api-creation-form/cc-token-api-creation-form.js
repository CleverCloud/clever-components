import { LitElement, css, html } from 'lit';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-loader/cc-loader.js';

/**
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormState} TokenApiCreationFormState
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationStep} TokenApiCreationStep
 */

export class CcTokenApiCreationForm extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _activeStep: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {TokenApiCreationFormState} Sets the state of the component. */
    this.state = { type: 'loading' };

    /** @type {TokenApiCreationStep} */
    this._activeStep = 'config';
  }

  /**
   * @param {TokenApiCreationStep} activeStep
   * @returns {string}
   */
  _getMainHeading(activeStep) {
    switch (activeStep) {
      case 'config':
        return i18n('cc-token-api-creation-form.config-step.main-heading');
      case 'validate':
        return i18n('cc-token-api-creation-form.validate-step.main-heading');
      case 'copy':
        return i18n('cc-token-api-creation-form.copy-step.main-heading');
    }
  }

  /**
   * @param {TokenApiCreationStep} activeStep
   * @returns {string}
   */
  _getDescription(activeStep) {
    switch (activeStep) {
      case 'config':
        return i18n('cc-token-api-creation-form.config-step.description');
      case 'validate':
        return i18n('cc-token-api-creation-form.validate-step.description');
      case 'copy':
        return i18n('cc-token-api-creation-form.copy-step.description');
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-token-api-creation-form.error')}"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="header-title">${this._getMainHeading(this._activeStep)}</div>
        <p slot="content">${i18n('cc-token-api-creation-form.config-step.description')}</p>
        <div slot="content">${this._renderStepsNav(this._activeStep)}</div>
        ${this.state.type === 'loading' ? html` <cc-loader></cc-loader> ` : ''}
        ${this.state.type === 'idle'
          ? this._renderActiveStepContent(this._activeStep)
          : ''}
      </cc-block>
    `;
  }

  /** @param {TokenApiCreationStep} activeStep */
  _renderStepsNav(activeStep) {
    return html`
      <nav role="navigation" arial-label="TODO: find a name">
        <ul>
          <li aria-current="${activeStep === 'config'}">
            <a href="#" @click="${}">
              ${i18n('cc-token-api-creation-form.config-step.nav.name')}
            </a>
          </li>
          <li aria-current="${activeStep === 'validate'}">
            <a href="#" @click="${}">
              ${i18n('cc-token-api-creation-form.validate-step.nav.name')}
            </a>
          </li>
          <li aria-current="${activeStep === 'copy'}">
            <a href="#" @click="${}">
              ${i18n('cc-token-api-creation-form.copy-step.nav.name')}
            </a>
          </li>
        </ul>
      </nav>
    `;
  }

  /** @param {TokenApiCreationStep} activeStep */
  _renderActiveStepContent(activeStep) {
    switch (activeStep) {
      case 'config':
        return this._renderConfigStepForm();
      case 'validate':
        return this._renderValidateStepForm();
      case 'copy':
        return this._renderCopyStepForm();
    }
  }


  _renderConfigStepForm() {
    // TODO: refacto since common to all renders
    return html`
    `;
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
