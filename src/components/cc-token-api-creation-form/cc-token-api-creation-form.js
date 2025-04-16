import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixArrowRightCircleLine as iconActiveStep,
  iconRemixCheckboxCircleLine as iconDoneStep,
  iconRemixLogoutBoxRLine as iconExternalLink,
  iconRemixArrowLeftLine as iconGoBack,
} from '../../assets/cc-remix.icons.js';
import { DateFormatter } from '../../lib/date/date-formatter.js';
import { shiftDateField } from '../../lib/date/date-utils.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-detail/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-input-date/cc-input-date.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';

const DEFAULT_EXPIRATION_DURATION = 'one-year';
const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
        date: this._dateFormatter.format(shiftDateField(new Date(Date.now()), 'Y', 1)),
      }),
      rangeUnderflow: i18n('cc-token-api-creation-form.config-step.form.expiration-date.range-underflow', {
        date: this._dateFormatter.format(shiftDateField(new Date(Date.now()), 'm', 30)),
      }),
      rangeOverflow: i18n('cc-token-api-creation-form.config-step.form.expiration-date.range-overflow', {
        date: this._dateFormatter.format(shiftDateField(new Date(Date.now()), 'Y', 1)),
      }),
    };

    /** @type {Date} */
    this._expirationDate = this._getExpirationDate(DEFAULT_EXPIRATION_DURATION);

    /** @type {ExpirationDuration} */
    this._expirationDuration = DEFAULT_EXPIRATION_DURATION;

    /** @type {boolean} */
    this._isExpirationDateActive = false;

    /** @type {DateFormatter} */
    this._dateFormatter = new DateFormatter('datetime-iso', 'local');
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
    const expirationDate = shiftDateField(now, 'D', durationAsNumberOfDays);
    return expirationDate;
  }

  /** @param {Event} event */
  _onConfigLinkClick(event) {
    event.preventDefault();
    this._activeStep = 'config';
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

    // TODO: i18n CLI
    return html`
      <cc-block>
        <div slot="header-title">${this._getMainHeading(this._activeStep)}</div>
        <div slot="content">
          <p class="block-intro">${this._getDescription(this._activeStep)}</p>
          ${this._renderStepsNav({ activeStep: this._activeStep, isWaiting: this.state.type === 'creating' })}
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
          <a slot="link" href="https://www.clever-cloud.com/developers/api/howto/#api-tokens">
            <span class="cc-link">${i18n('cc-token-api-creation-form.link.doc')}</span>
            <cc-icon .icon=${iconExternalLink}></cc-icon>
          </a>
          <div slot="content">TODO: CLI command doc</div>
        </cc-block-details>
      </cc-block>
    `;
  }

  /**
   * @param {object} _
   * @param {TokenApiCreationStep} _.activeStep
   * @param {boolean} _.isWaiting
   */
  _renderStepsNav({ activeStep, isWaiting }) {
    const steps = /** @type {const} */ ([
      {
        name: 'config',
        text: i18n('cc-token-api-creation-form.config-step.nav.name'),
        isActive: activeStep === 'config',
        isClickable: activeStep === 'validate' && !isWaiting,
        isDone: activeStep !== 'config',
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
        <ol class="creation-steps-nav">
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
                ${step.isClickable ? html`<a @click="${this._onConfigLinkClick}" href="#">${step.text}</a>` : ''}
                ${!step.isClickable ? html`<span>${step.text}</span>` : ''}
              </li>
            `,
          )}
        </ol>
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
    const credentialsErrorMessage = isMfaEnabled
      ? i18n('cc-token-api-creation-form.validation-step.form.error.credentials.with-mfa')
      : i18n('cc-token-api-creation-form.validation-step.form.error.credentials.password-only');
    // TODO: discuss error handling with Marion (maybe a message at the top could be better for such cases)
    // TODO: focus when active step changes (may be done in willUpdate)
    // TODO: focus when error message is set (credentials)
    // TODO: xplain why we use hidden forms (animation (if no display:none) & formData no need to restore so no need for moving all of these to state)
    return html`
      <form
        name="config-form"
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
            ${this._isExpirationDateActive
              ? html`<p slot="help">Specify the expiration date using the next form control</p>`
              : ''}
          </cc-select>
          <cc-input-date
            label="${i18n('cc-token-api-creation-form.config-step.form.label.expiration-date')}"
            name="expiration-date"
            ?required=${this._isExpirationDateActive}
            ?readonly=${!this._isExpirationDateActive}
            .value="${this._expirationDate}"
            .min="${shiftDateField(new Date(Date.now()), 'm', 15)}"
            .max="${shiftDateField(new Date(Date.now()), 'Y', 1)}"
            .customErrorMessages=${this._expirationDateErrorMessages}
            timezone="local"
          >
            ${this._isExpirationDateActive
              ? html`
                  <p slot="help">${i18n('cc-token-api-creation-form.config-step.form.help.expiration-date.min-max')}</p>
                `
              : ''}
            <p slot="help">${i18n('cc-token-api-creation-form.config-step.form.help.expiration-date.format')}</p>
          </cc-input-date>
        </div>
        <div class="form__actions">
          <a href="${this.apiTokenListHref}" class="go-back-link">
            <cc-icon .icon=${iconGoBack}></cc-icon>
            <span>${i18n('cc-token-api-creation-form.config-step.form.api-token-list-link')}</span>
          </a>
          <cc-button primary type="submit">
            ${i18n('cc-token-api-creation-form.config-step.form.button.label.create')}
          </cc-button>
        </div>
      </form>

      <form
        name="validation-form"
        ?hidden=${activeStep !== 'validate'}
        ${formSubmit(this._onValidateFormSubmit.bind(this))}
      >
        ${hasCredentialsError
          ? html` <cc-notice intent="danger" message="${credentialsErrorMessage}" tabindex="-1"></cc-notice> `
          : ''}
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.validation-step.form.label.password')}"
          name="password"
          ?readonly=${isWaiting}
          required
          secret
        ></cc-input-text>
        ${isMfaEnabled
          ? html`
              <cc-input-text
                label="${i18n('cc-token-api-creation-form.validation-step.form.label.mfa')}"
                name="mfa-code"
                ?readonly=${isWaiting}
                required
              ></cc-input-text>
            `
          : ''}

        <div class="form__actions">
          ${isWaiting
            ? html`
                <div class="go-back-link">
                  <cc-icon .icon=${iconGoBack}></cc-icon>
                  <span>${i18n('cc-token-api-creation-form.validation-step.form.api-token-list-link')}</span>
                </div>
              `
            : ''}
          ${!isWaiting
            ? html`
                <a class="go-back-link" @click="${this._onConfigLinkClick}" href="#">
                  <cc-icon .icon=${iconGoBack}></cc-icon>
                  <span>${i18n('cc-token-api-creation-form.validation-step.form.api-token-list-link')}</span>
                </a>
              `
            : ''}
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
          <span>${i18n('cc-token-api-creation-form.copy-step.link.api-token-list')}</span>
        </a>
      </div>
    `;
  }

  static get styles() {
    return [
      linkStyles,
      css`
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
          padding-inline: 3em;
        }

        /* TODO: won't work for mobile */
        [slot='header-title'] {
          padding-inline: 1.5em;
        }

        [slot='link'] {
          --cc-icon-color: var(--cc-color-text-primary-highlight);

          text-decoration: none;
        }

        .cc-link {
          text-decoration: underline;
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
          gap: 1.5em;
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

        .copy-step-wrapper {
          display: grid;
          gap: 2.5em;
        }

        .token-list-link-cta {
          align-items: center;
          background-color: var(--cc-color-bg-primary, #fff);
          border: 1px solid var(--cc-color-bg-primary);
          border-radius: var(--cc-button-border-radius, 0.15em);
          box-sizing: border-box;
          color: var(--cc-color-text-inverted, #fff);
          cursor: pointer;
          display: flex;
          font-weight: var(--cc-button-font-weight, bold);
          justify-self: flex-end;
          min-height: 2em;
          padding: 0 0.5em;
          text-decoration: none;
          text-transform: var(--cc-button-text-transform, uppercase);
          user-select: none;
        }

        .token-list-link-cta span {
          font-size: 0.85em;
        }

        .go-back-link {
          align-items: center;
          color: var(--cc-color-text-weak);
          cursor: pointer;
          display: flex;
          gap: 0.5em;
          text-decoration: underline;
        }
      `,
    ];
  }
}

window.customElements.define('cc-token-api-creation-form', CcTokenApiCreationForm);
