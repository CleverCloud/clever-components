import { LitElement, css, html } from 'lit';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';

/**
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormState} TokenApiCreationFormState
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationStep} TokenApiCreationStep
 * @typedef {import('../cc-select/cc-select.js').CcSelect} CcSelect
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
        return i18n('cc-token-api-creation-form.validation-step.main-heading');
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
        return i18n('cc-token-api-creation-form.validation-step.description');
      case 'copy':
        return i18n('cc-token-api-creation-form.copy-step.description');
    }
  }

  /** @returns {CcSelect['options']} */
  _getExpirationDurationOptions() {
    return [
      {
        label: i18n('cc-token-api-creation-form.config-step.expiration-duration.label.seven-days'),
        value: 'seven-days',
      },
      {
        label: i18n('cc-token-api-creation-form.config-step.expiration-duration.label.thirty-days'),
        value: 'thirty-days',
      },
      {
        label: i18n('cc-token-api-creation-form.config-step.expiration-duration.label.sixty-days'),
        value: 'sixty-days',
      },
      {
        label: i18n('cc-token-api-creation-form.config-step.expiration-duration.label.ninety-days'),
        value: 'ninety-days',
      },
      { label: i18n('cc-token-api-creation-form.config-step.expiration-duration.label.one-year'), value: 'one-year' },
      { label: i18n('cc-token-api-creation-form.config-step.expiration-duration.label.custom'), value: 'custom' },
    ];
  }

  /**
   * @param {TokenApiCreationStep} step
   */
  _onNavItemClick(step) {
    this._activeStep = step;
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
        ${this.state.type === 'idle' ? this._renderActiveStepContent(this._activeStep) : ''}
      </cc-block>
    `;
  }

  /** @param {TokenApiCreationStep} activeStep */
  _renderStepsNav(activeStep) {
    return html`
      <nav role="navigation" aria-label="TODO: find a name">
        <ul>
          <li aria-current="${activeStep === 'config'}">
            <a href="#" @click="${() => this._onNavItemClick('config')}">
              ${i18n('cc-token-api-creation-form.config-step.nav.name')}
            </a>
          </li>
          <li aria-current="${activeStep === 'validate'}">
            <a href="#" @click="${() => this._onNavItemClick('validate')}">
              ${i18n('cc-token-api-creation-form.validation-step.nav.name')}
            </a>
          </li>
          <li aria-current="${activeStep === 'copy'}">
            <a href="#" @click="${() => this._onNavItemClick('copy')}">
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
        return this._renderCopyStep();
    }
  }

  _renderConfigStepForm() {
    // TODO: refacto since common to all renders
    return html`
      <form slot="content">
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.config-step.form.label.name')}"
          required
          name="name"
        ></cc-input-text>
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.config-step.form.label.desc')}"
          name="desc"
        ></cc-input-text>
        <cc-select
          label="${i18n('cc-token-api-creation-form.config-step.form.label.expiration-duration')}"
          name="expiration-duration"
          .options=${this._getExpirationDurationOptions}
        >
        </cc-select>
      </form>
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
