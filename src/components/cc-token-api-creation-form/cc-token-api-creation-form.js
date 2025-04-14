import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixArrowRightCircleLine as iconActiveStep,
  iconRemixCheckboxCircleLine as iconDoneStep,
  iconRemixLogoutBoxRLine as iconLink,
} from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-detail/cc-block-details.js';
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

  _getPasswordAndMfaErrorMessage() {}

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
    if (this.state.type !== 'idle') {
      return;
    }

    // clean up potential error messages related to credentials
    this.state = {
      ...this.state,
      hasCredentialsError: false,
    };

    dispatchCustomEvent(this, 'api-key-create', {
      name: this._configFormData.name,
      description: this._configFormData.description,
      expirationDate: this._configFormData['expiration-date'],
      password: formData.password,
      mfaCode: formData['mfa-code'],
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
        <div slot="content">
          <p class="block-intro">${i18n('cc-token-api-creation-form.config-step.description')}</p>
          ${this._renderStepsNav(this._activeStep)}
          ${this.state.type === 'loading' ? html` <cc-loader></cc-loader> ` : ''}
          ${this.state.type === 'idle' || this.state.type === 'creating'
            ? this._renderForm({
                activeStep: this._activeStep,
                isMfaEnabled: this.state.isMfaEnabled,
                isWaiting: this.state.type === 'creating',
                hasCredentialsError: this.state.hasCredentialsError,
              })
            : ''}
          ${this.state.type === 'created' ? this._renderCopyStep(this.state.token) : ''}
        </div>
        <cc-block-details slot="footer-left">
          <div slot="button-text">Command line</div>
          <a slot="link" href="https://www.clever-cloud.com/developers/api/howto/#api-tokens"
            >See documentation <cc-icon .icon=${iconLink}></cc-icon
          ></a>
          <div slot="content">TODO: CLI command doc</div>
        </cc-block-details>
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
        isClickable: activeStep === 'validate',
        isDone: activeStep === 'validate',
      },
      {
        name: 'validate',
        text: i18n('cc-token-api-creation-form.validation-step.nav.name'),
        isActive: activeStep === 'validate',
        isClickable: false,
        isDone: activeStep === 'copy',
      },
      {
        name: 'copy',
        text: i18n('cc-token-api-creation-form.copy-step.nav.name'),
        isActive: activeStep === 'copy',
        isClickable: false,
        isDone: false,
      },
    ]);

    // TODO: improve, not very readable
    return html`
      <nav role="navigation" aria-label="TODO: find a name">
        <ul class="creation-steps-nav">
          ${steps.map(
            (step) => html`
              <li
                class="creation-steps-nav__step-item ${classMap({
                  'creation-steps-nav__step-item--active': step.isActive,
                  'creation-steps-nav__step-item--done': step.isDone,
                })}"
                aria-current="${ifDefined(step.isActive ? 'step' : null)}"
              >
                ${step.isActive ? html`<cc-icon .icon=${iconActiveStep} size="lg"></cc-icon>` : ''}
                ${step.isDone ? html`<cc-icon .icon=${iconDoneStep} size="lg"></cc-icon>` : ''}
                ${step.isClickable
                  ? html`<a href="#" @click="${this._onNavItemClick(step.name)}"> ${step.text} </a>`
                  : ''}
                ${!step.isClickable ? html`<span>${step.text}</span>` : ''}
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
   * @param {boolean} options.isWaiting - Whether the form is currently waiting for an operation to complete.
   * @param {boolean} options.hasCredentialsError -
   */
  _renderForm({ activeStep, isMfaEnabled, isWaiting, hasCredentialsError }) {
    // TODO: discuss error handling with Marion (maybe a message at the top could be better for such cases)
    const passwordAndMfaErrorMessage = hasCredentialsError
      ? i18n('cc-token-api-creation-form.validation-step.form.error.credentials')
      : null;

    // TODO: focus when active step changes (may be done in willUpdate)
    return html`
      <form
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
          name="description"
        ></cc-input-text>
        <div class="form__expiration">
          <cc-select
            label="${i18n('cc-token-api-creation-form.config-step.form.label.expiration-duration')}"
            name="expiration-duration"
            .options=${this._getExpirationDurationOptions()}
            .value="${this._expirationDuration}"
            @cc-select:input=${this._onExpirationDurationInput}
          >
            <p slot="help" ?hidden=${!this._isExpirationDateActive}>
              Specify the expiration date using the next form control
            </p>
          </cc-select>
          <cc-input-date
            label="${i18n('cc-token-api-creation-form.config-step.form.label.expiration-date')}"
            name="expiration-date"
            ?required=${this._isExpirationDateActive}
            ?readonly=${!this._isExpirationDateActive}
            .value="${this._expirationDate}"
            .min="${new Date(Date.now() + 15 * 60 * 1000)}"
            .customErrorMessages=${this._expirationDateErrorMessages}
          >
            ${this._isExpirationDateActive
              ? html`
                  <p slot="help">${i18n('cc-token-api-creation-form.config-step.form.help.expiration-date.min')}</p>
                `
              : ''}
            <p slot="help">${i18n('cc-token-api-creation-form.config-step.form.help.expiration-date.format')}</p>
          </cc-input-date>
        </div>
        <div class="form__actions">
          <a href="${this.apiTokenListHref}">
            ${i18n('cc-token-api-creation-form.config-step.form.api-token-list-link')}
          </a>
          <cc-button primary type="submit">
            ${i18n('cc-token-api-creation-form.config-step.form.button.label.create')}
          </cc-button>
        </div>
      </form>

      <form ?hidden=${activeStep !== 'validate'} ${formSubmit(this._onValidateFormSubmit.bind(this))}>
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.validation-step.form.label.password')}"
          name="password"
          .errorMessage=${passwordAndMfaErrorMessage}
          required
          secret
        ></cc-input-text>
        ${isMfaEnabled
          ? html`
              <cc-input-text
                label="${i18n('cc-token-api-creation-form.validation-step.form.label.mfa')}"
                name="mfa-code"
                required
                .errorMessage=${passwordAndMfaErrorMessage}
              ></cc-input-text>
            `
          : ''}

        <div class="form__actions">
          <a @click=${() => this._onNavItemClick('config')} href="#">
            ${i18n('cc-token-api-creation-form.config-step.form.api-token-list-link')}
          </a>
          <cc-button primary type="submit" ?waiting=${isWaiting}>
            ${i18n('cc-token-api-creation-form.config-step.form.button.label.validate')}
          </cc-button>
        </div>
      </form>
    `;
  }

  /** @param {string} token */
  _renderCopyStep(token) {
    return html`
      <div class="copy-step-wrapper">
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

      /* TODO: won't work for mobile */
      cc-block {
        padding-top: 2em;
      }

      /* TODO: won't work for mobile */
      cc-block > [slot='content'] {
        padding-bottom: 2em;
      }

      /* TODO: won't work for mobile */
      cc-block > [slot='content'],
      [slot='header-title'] {
        padding-inline: 3em;
      }

      .block-intro {
        margin: 0;
      }

      .creation-steps-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 2em;
        list-style: none;
        margin: 0;
        margin-block: 2em;
        padding: 0;
      }

      .creation-steps-nav__step-item {
        --cc-icon-size: 1.3em;

        align-items: center;
        color: var(--cc-color-text-weak);
        display: flex;
        flex: 1 1 auto;
        gap: 0.5em;
        line-height: 1.3em;
        padding-block: 1em;
        position: relative;
      }

      /* TODO: switch to border */
      .creation-steps-nav__step-item::before {
        background-color: currentcolor;
        border-radius: 40px;
        content: '';
        height: 3px;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }

      .creation-steps-nav__step-item a {
        color: inherit;
        text-decoration: none;
      }

      .creation-steps-nav__step-item--active {
        color: var(--cc-color-text-primary);
      }

      .creation-steps-nav__step-item--done {
        color: var(--cc-color-text-success);
      }

      form:not([hidden]) {
        display: grid;
        gap: 1em;
      }

      .form__expiration {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5em;
      }

      .form__expiration cc-input-date,
      .form__expiration cc-select {
        flex: 1 1 18em;
      }

      .form__actions {
        align-items: center;
        display: flex;
        gap: 1.5em;
        justify-content: flex-end;
        margin-top: 2em;
      }
    `;
  }
}

window.customElements.define('cc-token-api-creation-form', CcTokenApiCreationForm);
