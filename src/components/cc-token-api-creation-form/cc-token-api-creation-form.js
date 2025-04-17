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
const dateFormatter = new DateFormatter('datetime-iso', 'local');

/**
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormState} TokenApiCreationFormState
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormStateLoaded} TokenApiCreationFormStateLoaded
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormStateLoadedValidation} TokenApiCreationFormStateLoadedValidation
 * @typedef {import('./cc-token-api-creation-form.types.js').ExpirationDuration} ExpirationDuration
 * @typedef {import('../cc-select/cc-select.js').CcSelect} CcSelect
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 * @typedef {import('lit').PropertyValues<CcTokenApiCreationForm>} CcTokenApiCreationFormPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 */

/**
 * A component that provides a multi-step form for creating API tokens.
 *
 * This component guides users through a three-step process:
 * 1. Configuration - Set token name, description, and expiration date
 * 2. Validation - Authenticate with password and MFA (if enabled)
 * 3. Copy - View and copy the newly created token
 *
 * The component manages state transitions, form validation, and visual feedback
 * throughout the token creation process.
 *
 * @fires {CustomEvent<'configuration'|'validate'>} cc-token-api-creation-form:step-change - When a step navigation occurs
 * @fires {CustomEvent<{name: string, description?: string, expirationDate: string, password: string, mfaCode?: string}>} cc-token-api-creation-form:api-key-create - When the API token creation is requested
 */
export class CcTokenApiCreationForm extends LitElement {
  static get properties() {
    return {
      apiTokenListHref: { type: String, attribute: 'api-token-list-href' },
      state: { type: Object },
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

    /** @type {HTMLFormElementRef} */
    this._configFormRef = createRef();

    /** @type {{ name: string, description?: string, 'expiration-duration': ExpirationDuration, 'expiration-date': string }|null} */
    this._configFormData = null;

    this._expirationDateErrorMessages = {
      badInput: i18n('cc-token-api-creation-form.config-step.form.expiration-date.invalid', {
        date: dateFormatter.format(shiftDateField(new Date(Date.now()), 'Y', 1)),
      }),
      rangeUnderflow: i18n('cc-token-api-creation-form.config-step.form.expiration-date.range-underflow', {
        date: dateFormatter.format(shiftDateField(new Date(Date.now()), 'm', 30)),
      }),
      rangeOverflow: i18n('cc-token-api-creation-form.config-step.form.expiration-date.range-overflow', {
        date: dateFormatter.format(shiftDateField(new Date(Date.now()), 'Y', 1)),
      }),
    };

    /** @type {Date} */
    this._expirationDate = this._getExpirationDate(DEFAULT_EXPIRATION_DURATION);

    /** @type {ExpirationDuration} */
    this._expirationDuration = DEFAULT_EXPIRATION_DURATION;

    /** @type {boolean} */
    this._isExpirationDateActive = false;

    /** @type {boolean} */
    this._isMfaEnabled = false;

    this._stepsContentRef = createRef();
  }

  /**
   * @param {TokenApiCreationFormStateLoaded['activeStep']} activeStep
   * @returns {string}
   */
  _getMainHeading(activeStep) {
    switch (activeStep) {
      case 'configuration':
        return i18n('cc-token-api-creation-form.config-step.main-heading');
      case 'validation':
        return i18n('cc-token-api-creation-form.validation-step.main-heading');
      case 'created':
        return i18n('cc-token-api-creation-form.copy-step.main-heading');
      default:
        return null;
    }
  }

  /**
   * @param {TokenApiCreationFormStateLoaded['activeStep']} activeStep
   * @returns {string}
   */
  _getDescription(activeStep) {
    switch (activeStep) {
      case 'configuration':
        return i18n('cc-token-api-creation-form.config-step.description');
      case 'validation':
        return i18n('cc-token-api-creation-form.validation-step.description');
      case 'created':
        return i18n('cc-token-api-creation-form.copy-step.description');
      default:
        return null;
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
    dispatchCustomEvent(this, 'step-change', 'configuration');
  }

  /** @param {{ name: string, description?: string, 'expiration-duration': ExpirationDuration, 'expiration-date': string }} formData */
  _onConfigFormSubmit(formData) {
    this._configFormData = formData;
    dispatchCustomEvent(this, 'step-change', 'validate');
  }

  /** @param {{ password: string, 'mfa-code': string}} formData */
  _onValidateFormSubmit(formData) {
    if (this.state.type !== 'loaded' || this.state.activeStep !== 'validation') {
      return;
    }

    // clean up potential error messages related to credentials
    this.state = {
      ...this.state,
      values: {
        name: this._configFormData.name,
        description: this._configFormData.description,
        expirationDuration: this._configFormData['expiration-duration'],
        expirationDate: this._configFormData['expiration-date'],
        password: formData.password,
        mfaCode: formData['mfa-code'],
      },
      credentialsError: null,
    };

    // TODO: change to camelCase
    dispatchCustomEvent(this, 'api-key-create', {
      name: this.state.values.name,
      description: this.state.values.description,
      expirationDate: this.state.values.expirationDate,
      password: this.state.values.password,
      mfaCode: this.state.values.mfaCode,
    });
  }

  /** @param {CustomEvent<ExpirationDuration>} event */
  _onExpirationDurationInput({ detail: value }) {
    this.state.values.expirationDuration = value;
    this._isExpirationDateActive = value === 'custom';
  }

  /** @param {CcTokenApiCreationFormPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && this.state.type === 'loaded') {
      this.state.values.expirationDate = this._getExpirationDate(this.state.values.expirationDuration);
    }
    // if (changedProperties.has('state') && this.state.type === 'idle') {
    //   this._isMfaEnabled = this.state.isMfaEnabled;
    // }
  }

  updated() {
    this._stepsContentRef?.value?.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') {
        this._stepsContentRef.value.querySelector('.steps-content__step-item--active cc-input-text').focus();
      }
    });
  }

  render() {
    const activeStep =
      this.state.type === 'loaded' || this.state.type === 'creating' ? this.state.activeStep : 'configuration';
    const isMfaEnabled =
      this.state.type === 'loaded' || this.state.type === 'creating' ? this.state.isMfaEnabled : true;
    const credentialsError =
      this.state.type === 'loaded' && this.state.activeStep === 'validation' ? this.state.credentialsError : null;
    const token = this.state.type === 'loaded' && this.state.activeStep === 'created' ? this.state.token : '';

    return html`
      <cc-block>
        <div slot="header-title">${this._getMainHeading(activeStep)}</div>
        <div slot="content">
          <p class="block-intro">${this._getDescription(activeStep)}</p>
          ${this._renderStepsNav(activeStep)}
          ${this.state.type === 'error'
            ? html`<cc-notice intent="warning" message="${i18n('cc-token-api-creation-form.error')}"></cc-notice>`
            : ''}
          ${this.state.type !== 'error'
            ? this._renderMainContent({
                skeleton: this.state.type === 'loading',
                activeStep,
                isMfaEnabled,
                isWaiting: this.state.type === 'creating',
                credentialsError,
                token,
              })
            : ''}
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
   * @param {TokenApiCreationFormStateLoaded['activeStep']} activeStep
   */
  _renderStepsNav(activeStep) {
    const steps = /** @type {const} */ ([
      {
        name: 'config',
        text: i18n('cc-token-api-creation-form.config-step.nav.name'),
        isActive: activeStep === 'configuration',
        isClickable: activeStep === 'validation',
        isDone: activeStep !== 'configuration',
      },
      {
        name: 'validate',
        text: i18n('cc-token-api-creation-form.validation-step.nav.name'),
        isActive: activeStep === 'validation',
        isClickable: false,
        isDone: activeStep === 'created',
      },
      {
        name: 'copy',
        text: i18n('cc-token-api-creation-form.copy-step.nav.name'),
        isActive: activeStep === 'created',
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
   * @param {object} _
   * @param {boolean} _.skeleton
   * @param {TokenApiCreationFormStateLoaded['activeStep']} _.activeStep
   * @param {boolean} _.isMfaEnabled
   * @param {boolean} _.isWaiting
   * @param {TokenApiCreationFormStateLoadedValidation['credentialsError']} _.credentialsError
   * @param {string} _.token
   */
  _renderMainContent({ skeleton, activeStep, isMfaEnabled, isWaiting, credentialsError, token }) {
    // TODO: focus when active step changes (may be done in willUpdate)
    // TODO: focus when error message is set (credentials)
    // TODO: xplain why we use hidden forms (animation (if no display:none) & formData no need to restore so no need for moving all of these to state)
    return html`
      <div class="steps-content" ${ref(this._stepsContentRef)}>
        <div
          class="steps-content__step-item ${classMap({
            'steps-content__step-item--out-left': activeStep !== 'configuration',
          })}"
        >
          ${this._renderConfigurationForm(skeleton)}
        </div>
        <div
          class="steps-content__step-item ${classMap({
            'steps-content__step-item--out-right': activeStep === 'configuration',
            'steps-content__step-item--out-left': activeStep === 'created',
          })}"
        >
          ${this._renderValidationForm({
            isMfaEnabled,
            isWaiting,
            credentialsError: credentialsError,
          })}
        </div>
        <div
          class="steps-content__step-item ${classMap({
            'steps-content__step-item--out-right': activeStep !== 'created',
          })}"
        >
          ${this._renderCopyStep(token)}
        </div>
      </div>
    `;
  }

  /** @param {boolean} skeleton */
  _renderConfigurationForm(skeleton) {
    return html`
      <form
        name="configuration-form"
        class="form"
        ${formSubmit(this._onConfigFormSubmit.bind(this))}
        ${ref(this._configFormRef)}
      >
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.config-step.form.label.name')}"
          required
          ?skeleton=${skeleton}
          name="name"
          .value=${this.state.values.name}
        ></cc-input-text>
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.config-step.form.label.desc')}"
          ?skeleton=${skeleton}
          name="description"
          .value=${this.state.values.description}
        ></cc-input-text>
        <div class="form__expiration">
          <cc-select
            label="${i18n('cc-token-api-creation-form.config-step.form.label.expiration-duration')}"
            name="expiration-duration"
            .options=${this._getExpirationDurationOptions()}
            .value="${this._expirationDuration}"
            ?disabled=${skeleton}
            .value=${this.state.values.expirationDuration}
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
            .value=${this.state.values.expirationDate}
            .min="${shiftDateField(new Date(Date.now()), 'm', 15)}"
            .max="${shiftDateField(new Date(Date.now()), 'Y', 1)}"
            .customErrorMessages=${this._expirationDateErrorMessages}
            timezone="local"
            ?skeleton=${skeleton}
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
          <cc-button primary type="submit" ?disabled=${skeleton}>
            ${i18n('cc-token-api-creation-form.config-step.form.button.label.continue')}
          </cc-button>
        </div>
      </form>
    `;
  }

  /**
   * @param {object} options - Rendering options.
   * @param {boolean} options.isMfaEnabled - Whether Multi-Factor Authentication is enabled for the user.
   * @param {boolean} options.isWaiting - Whether the form is currently waiting for an operation to complete.
   * @param {TokenApiCreationFormStateLoadedValidation['credentialsError']} options.credentialsError -
   */
  _renderValidationForm({ isMfaEnabled, isWaiting, credentialsError }) {
    const passwordErrorMessage =
      credentialsError === 'password'
        ? i18n('cc-token-api-creation-form.validation-step.form.error.credentials.password-only')
        : null;
    const mfaErrorMessage =
      credentialsError === 'mfaCode'
        ? i18n('cc-token-api-creation-form.validation-step.form.error.credentials.with-mfa')
        : null;

    return html`
      <form name="validation-form" class="form" ${formSubmit(this._onValidateFormSubmit.bind(this))}>
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.validation-step.form.label.password')}"
          name="password"
          ?readonly=${isWaiting}
          required
          secret
          .errorMessage=${passwordErrorMessage}
          .value="${this.state.values.password}"
        ></cc-input-text>
        ${isMfaEnabled
          ? html`
              <cc-input-text
                label="${i18n('cc-token-api-creation-form.validation-step.form.label.mfa')}"
                name="mfa-code"
                ?readonly=${isWaiting}
                required
                .errorMessage=${mfaErrorMessage}
                .value="${this.state.values.mfaCode}"
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
            ${i18n('cc-token-api-creation-form.config-step.form.button.label.create')}
          </cc-button>
        </div>
      </form>
    `;
  }

  /** @param {string} token */
  _renderCopyStep(token) {
    return html`
      <div class="copy-step-wrapper">
        <cc-notice intent="warning" .message=${i18n('cc-token-api-creation-form.copy-step.notice.message')}></cc-notice>
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.copy-step.form.label.token')}"
          name="token"
          readonly
          secret
          clipboard
          value=${token}
        ></cc-input-text>
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
          /* stylelint-disable-next-line property-no-unknown */
          interpolate-size: allow-keywords;

          --form-transition-duration: 300ms;
          --form-transition-timing: ease-in-out;
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
          transition: all 0.3s ease-in-out;
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
          transition: all 0.3s ease-in-out;
          width: 100%;
        }

        .creation-steps-nav__step-item a {
          color: inherit;
          text-decoration: none;
        }

        .creation-steps-nav__step-item--active {
          color: var(--cc-color-text-primary);
          transition: all 0.3s ease-in-out;
        }

        .creation-steps-nav__step-item--done {
          color: var(--cc-color-text-success);
          transition: all 0.3s ease-in-out;
        }

        .steps-content {
          display: grid;
          grid-template-areas: 'step';
        }

        .steps-content__step-item {
          display: block;
          grid-area: step;
          height: auto;
          opacity: 1;
          transform: translateX(0);
          transition:
            transform 0.3s ease-in-out,
            opacity 0.3s ease-in-out,
            height 0.3s ease-in-out;
          visibility: visible;
        }

        .steps-content__step-item--out-left {
          height: 0;
          opacity: 0;
          transform: translateX(-110%);
          transition:
            transform 0.3s ease-in-out,
            opacity 0.3s ease-in-out,
            height 0.3s ease-in-out 0.3s,
            visibility 0.3s ease-in-out 0.3s;
          visibility: hidden;
        }

        .steps-content__step-item--out-right {
          height: 0;
          opacity: 0;
          transform: translateX(110%);
          transition:
            transform 0.3s ease-in-out,
            opacity 0.3s ease-in-out,
            height 0.3s ease-in-out 0.3s,
            visibility 0.3s ease-in-out 0.3s;
          visibility: hidden;
        }

        .form {
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
          gap: 1.5em;
        }

        .copy-step-wrapper cc-input-text {
          order: -1;
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
          text-decoration: none;
        }
      `,
    ];
  }
}

window.customElements.define('cc-token-api-creation-form', CcTokenApiCreationForm);
