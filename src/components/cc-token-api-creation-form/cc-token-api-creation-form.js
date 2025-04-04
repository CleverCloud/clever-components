import { LitElement, css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-input-date/cc-input-date.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';

const DEFAULT_EXPIRATION_DURATION = 'one-year';
/**
 */

/**
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormState} TokenApiCreationFormState
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationStep} TokenApiCreationStep
 * @typedef {import('./cc-token-api-creation-form.types.js').ExpirationDuration} ExpirationDuration
 * @typedef {import('../cc-select/cc-select.js').CcSelect} CcSelect
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 */

export class CcTokenApiCreationForm extends LitElement {
  static get properties() {
    return {
      apiTokenListHref: { type: String, attribute: 'api-token-list-href' },
      state: { type: Object },
      _activeStep: { type: String, state: true },
      _expirationDate: { type: Object, state: true },
      _expirationDuration: { type: String, state: true },
      _isExpirationDateActive: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {string} URL for the API token list screen. */
    this.apiTokenListHref = '';

    /** @type {TokenApiCreationFormState} Sets the state of the component. */
    this.state = { type: 'loading' };

    /** @type {TokenApiCreationStep} */
    this._activeStep = 'config';

    this._expirationDateErrorMessages = {
      badInput: i18n('cc-token-api-creation-form.config-step.form.expiration-date.invalid', {
        date: new Date(Date.now() + 31536000000).toISOString().replace('T', ' ').substring(0, 19),
      }),
      rangeUnderflow: i18n('cc-token-api-creation-form.config-step.form.expiration-date.range-underflow', {
        date: new Date(Date.now() + 30 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
      }),
    };

    /** @type {Date} */
    this._expirationDate = this._getExpirationDate(DEFAULT_EXPIRATION_DURATION);

    /** @type {ExpirationDuration} */
    this._expirationDuration = DEFAULT_EXPIRATION_DURATION;

    /** @type {boolean} */
    this._isExpirationDateActive = false;
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

  /** @returns {Array<{ label: string, value: ExpirationDuration}>} */
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
   * @param {Exclude<ExpirationDuration, 'custom'>} duration
   * @returns {Date}
   */
  _getExpirationDate(duration) {
    let durationAsNumberOfDays;

    switch (duration) {
      case 'seven-days':
        durationAsNumberOfDays = 7;
        break;
      case 'thirty-days':
        durationAsNumberOfDays = 30;
        break;
      case 'sixty-days':
        durationAsNumberOfDays = 60;
        break;
      case 'ninety-days':
        durationAsNumberOfDays = 90;
        break;
      case 'one-year':
        durationAsNumberOfDays = 365;
        break;
    }

    const now = new Date();
    const expirationDate = new Date(now.getTime() + durationAsNumberOfDays * 24 * 60 * 60 * 1000);
    return expirationDate;
  }

  /**
   * @param {TokenApiCreationStep} step
   * @returns {(event: Event) => void}
   */
  _onNavItemClick(step) {
    return (event) => {
      event.preventDefault();
      this._activeStep = step;
    };
  }

  _onConfigFormSubmit() {
    this._activeStep = 'validate';
  }

  /** @param {CustomEvent<ExpirationDuration>} event */
  _onExpirationDurationInput({ detail: value }) {
    this._expirationDuration = value;

    if (value !== 'custom') {
      this._expirationDate = this._getExpirationDate(value);
    }

    this._isExpirationDateActive = value === 'custom';
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
        ${this.state.type === 'idle' ? this._renderActiveStepContent(this._activeStep, this.state.isMfaEnabled) : ''}
      </cc-block>
    `;
  }

  /** @param {TokenApiCreationStep} activeStep */
  _renderStepsNav(activeStep) {
    // TODO: should only be clickable when step === "validate"
    const steps = /** @type {const} */ ([
      {
        name: 'config',
        text: i18n('cc-token-api-creation-form.config-step.nav.name'),
        isActive: activeStep === 'config',
      },
      {
        name: 'validate',
        text: i18n('cc-token-api-creation-form.validation-step.nav.name'),
        isActive: activeStep === 'validate',
      },
      {
        name: 'copy',
        text: i18n('cc-token-api-creation-form.copy-step.nav.name'),
        isActive: activeStep === 'copy',
      },
    ]);

    return html`
      <nav role="navigation" aria-label="TODO: find a name">
        <ul>
          ${steps.map(
            (step) => html`
              <li aria-current="${ifDefined(step.isActive ? 'step' : null)}">
                <a href="#" @click="${this._onNavItemClick(step.name)}"> ${step.text} </a>
              </li>
            `,
          )}
        </ul>
      </nav>
    `;
  }

  /**
   * @param {TokenApiCreationStep} activeStep
   * @param {boolean} isMfaEnabled
   */
  _renderActiveStepContent(activeStep, isMfaEnabled) {
    switch (activeStep) {
      case 'config':
      case 'validate':
        return this._renderForm(activeStep, isMfaEnabled);
      case 'copy':
        return this._renderCopyStep();
    }
  }

  _renderForm(activeStep, isMfaEnabled) {
    // TODO: focus when active step changes (may be done in willUpdate)
    return html`
      <form slot="content" ${formSubmit(this._onConfigFormSubmit.bind(this))} ?hidden=${activeStep !== 'config'}>
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
          .options=${this._getExpirationDurationOptions()}
          .value="${this._expirationDuration}"
          @cc-select:input=${this._onExpirationDurationInput}
        >
        </cc-select>
        <cc-input-date
          label="${i18n('cc-token-api-creation-form.config-step.form.label.expiration-date')}"
          name="expiration-date"
          ?required=${this._isExpirationDateActive}
          ?readonly=${!this._isExpirationDateActive}
          .value="${this._expirationDate}"
          .min="${new Date(Date.now() + 15 * 60 * 1000)}"
          .customErrorMessages=${this._expirationDateErrorMessages}
        ></cc-input-date>
        <a href="${this.apiTokenListHref}">
          ${i18n('cc-token-api-creation-form.config-step.form.api-token-list-link')}
        </a>
        <cc-button primary outlined type="submit">
          ${i18n('cc-token-api-creation-form.config-step.form.button.label.create')}
        </cc-button>
      </form>

      <form slot="content" ?hidden=${activeStep !== 'validate'}>
        <cc-input-text
          type="password"
          label="${i18n('cc-token-api-creation-form.config-step.form.label.password')}"
          name="password"
          required
        ></cc-input-text>
        ${isMfaEnabled
          ? html`
              <cc-input-text
                label="${i18n('cc-token-api-creation-form.config-step.form.label.mfa')}"
                name="mfa"
                required
              ></cc-input-text>
            `
          : ''}

        <a @click=${() => this._onNavItemClick('config')} href="#">
          ${i18n('cc-token-api-creation-form.config-step.form.api-token-list-link')}
        </a>
        <cc-button primary outlined type="submit">
          ${i18n('cc-token-api-creation-form.config-step.form.button.label.validate')}
        </cc-button>
      </form>
    `;
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
