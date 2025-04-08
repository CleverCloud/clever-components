import { LitElement, css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { dispatchCustomEvent } from '../../lib/events.js';
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
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormState} TokenApiCreationFormState
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationStep} TokenApiCreationStep
 * @typedef {import('./cc-token-api-creation-form.types.js').ExpirationDuration} ExpirationDuration
 * @typedef {import('../cc-select/cc-select.js').CcSelect} CcSelect
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 * @typedef {import('lit').PropertyValues<CcTokenApiCreationForm>} CcTokenApiCreationFormPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
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

    /** @type {HTMLFormElementRef} */
    this._configFormRef = createRef();

    /** @type {FormDataMap|null} */
    this._configFormData = null;

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

  /** @param {FormDataMap} formData */
  _onConfigFormSubmit(formData) {
    this._configFormData = formData;
    this._activeStep = 'validate';
  }

  /** @param {FormDataMap} formData */
  _onValidateFormSubmit(formData) {
    dispatchCustomEvent(this, 'api-key-create', {
      ...this._configFormData,
      ...formData,
    });
  }

  /** @param {CustomEvent<ExpirationDuration>} event */
  _onExpirationDurationInput({ detail: value }) {
    this._expirationDuration = value;

    if (value !== 'custom') {
      this._expirationDate = this._getExpirationDate(value);
    }

    this._isExpirationDateActive = value === 'custom';
  }

  /** @param {CcTokenApiCreationFormPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && this.state.type === 'created') {
      this._activeStep = 'copy';
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
        ${this.state.type === 'loading' ? html` <cc-loader slot="content"></cc-loader> ` : ''}
        ${this.state.type === 'idle' || this.state.type === 'creating'
          ? this._renderForm({
              activeStep: this._activeStep,
              isMfaEnabled: this.state.isMfaEnabled,
              isWaiting: this.state.type === 'creating',
            })
          : ''}
        ${this.state.type === 'created' ? this._renderCopyStep(this.state.token) : ''}
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

    // TODO: improve, not very readable
    return html`
      <nav role="navigation" aria-label="TODO: find a name">
        <ul>
          ${steps.map(
            (step) => html`
              <li aria-current="${ifDefined(step.isActive ? 'step' : null)}">
                ${activeStep === 'validate' && step.name === 'config'
                  ? html`<a href="#" @click="${this._onNavItemClick(step.name)}"> ${step.text} </a>`
                  : ''}
                ${activeStep !== 'validate' || step.name !== 'config' ? html`<span>${step.text}</span>` : ''}
              </li>
            `,
          )}
        </ul>
      </nav>
    `;
  }

  /**
   * Renders the correct form based on the active step.
   *
   * @param {object} options - Rendering options.
   * @param {TokenApiCreationStep} options.activeStep - The currently active step.
   * @param {boolean} options.isMfaEnabled - Whether Multi-Factor Authentication is enabled for the user.
   * @param {boolean} options.isWaiting - Whether the form is currently waiting for an operation to complete.
   */
  _renderForm({ activeStep, isMfaEnabled, isWaiting }) {
    // TODO: focus when active step changes (may be done in willUpdate)
    return html`
      <form
        slot="content"
        ?hidden=${activeStep !== 'config'}
        ${formSubmit(this._onConfigFormSubmit.bind(this))}
        ${ref(this._configFormRef)}
      >
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

      <!-- TODO: handle submit to dispatch for smart -->
      <form slot="content" ?hidden=${activeStep !== 'validate'} ${formSubmit(this._onValidateFormSubmit.bind(this))}>
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
        <cc-button primary outlined type="submit" ?waiting=${isWaiting}>
          ${i18n('cc-token-api-creation-form.config-step.form.button.label.validate')}
        </cc-button>
      </form>
    `;
  }

  /** @param {string} token */
  _renderCopyStep(token) {
    return html`
      <div class="copy-step-wrapper" slot="content">
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.copy-step.form.label.token')}"
          name="token"
          readonly
          secret
          clipboard
          value=${token}
        ></cc-input-text>
        <cc-notice intent="warning" .message=${i18n('cc-token-api-creation-form.copy-step.notice.message')}></cc-notice>
        <a class="token-list-link-cta" href="${this.apiTokenListHref}">
          ${i18n('cc-token-api-creation-form.copy-step.link.api-token-list')}
        </a>
      </div>
    `;
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
