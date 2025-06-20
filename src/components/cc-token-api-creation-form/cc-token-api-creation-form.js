import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixArrowRightCircleLine as iconActiveStep,
  iconRemixCheckboxCircleLine as iconDoneStep,
  iconRemixArrowLeftLine as iconGoBack,
  iconRemixInformationFill as iconInfo,
} from '../../assets/cc-remix.icons.js';
import { DateFormatter } from '../../lib/date/date-formatter.js';
import { getRelativeDateFromNow, shiftDateField } from '../../lib/date/date-utils.js';
import { FormErrorFocusController } from '../../lib/form/form-error-focus-controller.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { cliCommandsStyles } from '../../styles/cli-commands.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-input-date/cc-input-date.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import { CcTokenCreateEvent } from './cc-token-api-creation-form.events.js';

const DEFAULT_EXPIRATION_DURATION = 'one-year';
const DATE_FORMATTER_SHORT = new DateFormatter('datetime-short', 'local');
const DATE_FORMATTER_ISO = new DateFormatter('datetime-iso', 'UTC');

/** @type {Map<ExpirationPreset['preset'], number>} */
const DURATION_TO_NB_OF_DAYS_MAP = new Map([
  ['seven-days', 7],
  ['thirty-days', 30],
  ['sixty-days', 60],
  ['ninety-days', 90],
  ['one-year', 365],
]);

/**
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormState} TokenApiCreationFormState
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormStateLoaded} TokenApiCreationFormStateLoaded
 * @typedef {import('./cc-token-api-creation-form.types.js').TokenApiCreationFormStateLoadedValidation} TokenApiCreationFormStateLoadedValidation
 * @typedef {import('./cc-token-api-creation-form.types.js').Expiration} Expiration
 * @typedef {import('./cc-token-api-creation-form.types.js').ExpirationPreset} ExpirationPreset
 * @typedef {import('./cc-token-api-creation-form.types.js').ExpirationDurationOptions} ExpirationDurationOptions
 * @typedef {import('./cc-token-api-creation-form.types.js').FormValues} FormValues
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('../cc-input-date/cc-input-date.js').CcInputDate} CcInputDate
 * @typedef {import('../../lib/events.types.js').EventWithTarget<CcInputText | CcInputDate>} EventWithCcFormControlTarget
 * @typedef {import('lit').PropertyValues<CcTokenApiCreationForm>} CcTokenApiCreationFormPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('lit/directives/ref.js').Ref<CcInputDate>} CcInputDateRef
 */

/**
 * A component that provides a multi-step form to create API tokens.
 *
 * This component guides users through a three-step process:
 *
 * 1. Configuration - Set token name, description (optional), and expiration date (or compute the expiration date based on the expiration duration preset),
 * 2. Validation - Authenticate with password and MFA (if enabled),
 * 3. Copy - View and copy the newly created token.
 *
 * The component manages state transitions, form validation, and visual feedback throughout the token creation process.
 */
export class CcTokenApiCreationForm extends LitElement {
  static get properties() {
    return {
      apiTokenListHref: { type: String, attribute: 'api-token-list-href' },
      state: { type: Object },
    };
  }

  static get DEFAULT_FORM_VALUES() {
    return /** @type {const} */ ({
      name: '',
      description: '',
      expiration: {
        type: 'preset',
        preset: DEFAULT_EXPIRATION_DURATION,
      },
      password: '',
      mfaCode: '',
    });
  }

  /**
   * @param {ExpirationPreset['preset']} durationPreset
   * @returns {string} computed expiration date (ISO format)
   */
  static computeExpirationDate(durationPreset) {
    const expirationDate = getRelativeDateFromNow('D', DURATION_TO_NB_OF_DAYS_MAP.get(durationPreset));
    return DATE_FORMATTER_ISO.format(expirationDate);
  }

  constructor() {
    super();

    /** @type {string} URL for the API token list screen */
    this.apiTokenListHref = '';

    /** @type {TokenApiCreationFormState} Sets the state of the component */
    this.state = { type: 'loading' };

    /** @type {HTMLFormElementRef} */
    this._configurationFormRef = createRef();

    /** @type {CcInputDateRef} */
    this._expirationDateInputRef = createRef();

    this._expirationDateErrorMessages = {
      badInput: () =>
        i18n('cc-token-api-creation-form.configuration-step.form.expiration-date.error.invalid', {
          date: DATE_FORMATTER_SHORT.format(shiftDateField(new Date(), 'Y', 1)),
        }),
      rangeUnderflow: () =>
        i18n('cc-token-api-creation-form.configuration-step.form.expiration-date.error.range-underflow', {
          date: DATE_FORMATTER_SHORT.format(shiftDateField(new Date(), 'm', 30)),
        }),
      rangeOverflow: () =>
        i18n('cc-token-api-creation-form.configuration-step.form.expiration-date.error.range-overflow', {
          date: DATE_FORMATTER_SHORT.format(shiftDateField(new Date(), 'Y', 1)),
        }),
    };

    /** @type {HTMLFormElementRef} */
    this._validationFormRef = createRef();

    new FormErrorFocusController(this, this._validationFormRef, () =>
      this.state.type === 'loaded' && this.state.activeStep === 'validation' ? this.state.credentialsError : null,
    );
  }

  /**
   * @param {TokenApiCreationFormStateLoaded['activeStep']} activeStep
   * @returns {string}
   */
  _getMainHeading(activeStep) {
    switch (activeStep) {
      case 'configuration':
        return i18n('cc-token-api-creation-form.configuration-step.main-heading');
      case 'validation':
        return i18n('cc-token-api-creation-form.validation-step.main-heading');
      case 'copy':
        return i18n('cc-token-api-creation-form.copy-step.main-heading');
    }
  }

  /** @returns {Array<{ label: string, value: ExpirationDurationOptions}>} */
  _getExpirationDurationOptions() {
    return [
      {
        label: i18n('cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.seven-days'),
        value: 'seven-days',
      },
      {
        label: i18n('cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.thirty-days'),
        value: 'thirty-days',
      },
      {
        label: i18n('cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.sixty-days'),
        value: 'sixty-days',
      },
      {
        label: i18n('cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.ninety-days'),
        value: 'ninety-days',
      },
      {
        label: i18n('cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.one-year'),
        value: 'one-year',
      },
      {
        label: i18n('cc-token-api-creation-form.configuration-step.form.expiration-duration.option-label.custom'),
        value: 'custom',
      },
    ];
  }

  /** @param {Event} event */
  _onConfigLinkClick(event) {
    event.preventDefault();
    // to make sure the console router doesn't pick this event as a navigation
    event.stopPropagation();
    this.state = /** @type {TokenApiCreationFormStateLoaded} */ ({
      ...this.state,
      activeStep: 'configuration',
    });
  }

  _onConfigFormSubmit() {
    this.state = {
      ...this.state,
      activeStep: 'validation',
    };
  }

  /**
   * @param {Expiration} expiration
   * @returns {ExpirationPreset['preset']|null}
   */
  _getCurrentExpirationPreset(expiration) {
    return expiration.type === 'preset' ? expiration.preset : null;
  }

  /**
   * @param {Expiration} expiration
   * @returns {string} the expiration date (ISO format)
   */
  _getExpirationDate(expiration) {
    if (expiration.type === 'custom') {
      return expiration.date;
    }

    return CcTokenApiCreationForm.computeExpirationDate(expiration.preset);
  }

  _onValidationFormSubmit() {
    if (this.state.type !== 'loaded' || this.state.activeStep !== 'validation') {
      return;
    }

    // clean up potential error messages related to credentials
    this.state = {
      ...this.state,
      credentialsError: null,
    };

    const newToken = {
      name: this.state.values.name,
      description: this.state.values.description,
      expirationDate: this._getExpirationDate(this.state.values.expiration),
      password: this.state.values.password,
      mfaCode: this.state.values.mfaCode,
      isMfaEnabled: this.state.isMfaEnabled,
    };

    this.dispatchEvent(new CcTokenCreateEvent(newToken));
  }

  /** @param {CcTokenApiCreationFormPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (
      changedProperties.has('state') &&
      this.state.type === 'loaded' &&
      this.state.values.expiration.type === 'preset'
    ) {
      // clear potential error messages that are no longer relevant since the input becomes readonly
      this.updateComplete.then(() => {
        this._expirationDateInputRef.value.reportInlineValidity();
      });
    }
  }

  /** @param {CcTokenApiCreationFormPropertyValues} changedProperties */
  updated(changedProperties) {
    if (changedProperties.has('state') && this.state.type === 'loaded') {
      // Handle focus in case `prefers-reduced-motion: reduce` is active because `transitionend` event is not triggered
      if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        return;
      }

      const activeElement = this.shadowRoot.activeElement;
      const activeStepElement = this.shadowRoot.querySelector('.steps-content__step-item--active');
      if (!activeStepElement.contains(activeElement)) {
        /** @type {CcInputText} */
        const firstActiveCcInputText = activeStepElement.querySelector('cc-input-text');
        firstActiveCcInputText.focus();
      }
    }
  }

  /** @param {EventWithCcFormControlTarget & { detail: string }} event */
  _onInput(event) {
    if (this.state.type !== 'loaded' || this.state.activeStep === 'copy') {
      return;
    }

    if (event.target.name === 'expirationDate') {
      this.state = {
        ...this.state,
        values: {
          ...this.state.values,
          expiration: {
            type: 'custom',
            date: event.detail,
          },
        },
      };
    } else {
      this.state = {
        ...this.state,
        values: {
          ...this.state.values,
          [event.target.name]: event.detail,
        },
      };
    }
  }

  /** @param {CcSelectEvent<ExpirationDurationOptions>} detail */
  _onSelect({ detail: value }) {
    if (this.state.type !== 'loaded' || this.state.activeStep === 'copy') {
      return;
    }

    const currentExpirationPreset = this._getCurrentExpirationPreset(this.state.values.expiration);

    this.state = {
      ...this.state,
      values: {
        ...this.state.values,
        expiration:
          value === 'custom'
            ? {
                type: 'custom',
                date: CcTokenApiCreationForm.computeExpirationDate(currentExpirationPreset),
              }
            : {
                type: 'preset',
                preset: value,
              },
      },
    };
  }

  /**
   * Handle focus after transition (will only be triggered if `prefers-reduced-motion: no-preference`)
   * It is important to only move focus after the transition is complete because moving focus before that makes the transition fail
   *
   * @param {TransitionEvent & { currentTarget: HTMLDivElement }} event
   */
  _onTransitionEnd(event) {
    if (event.propertyName === 'visibility') {
      /** @type {CcInputText} */
      const firstActiveCcInputText = event.currentTarget.querySelector(
        '.steps-content__step-item--active cc-input-text',
      );
      firstActiveCcInputText.focus();
    }
  }

  render() {
    const activeStep =
      this.state.type === 'loaded' || this.state.type === 'creating' ? this.state.activeStep : 'configuration';
    const isMfaEnabled =
      this.state.type === 'loaded' || this.state.type === 'creating' ? this.state.isMfaEnabled : true;
    const credentialsError =
      this.state.type === 'loaded' && this.state.activeStep === 'validation' ? this.state.credentialsError : null;
    const token = this.state.type === 'loaded' && this.state.activeStep === 'copy' ? this.state.token : '';
    const formValues =
      this.state.type === 'loaded' || this.state.type === 'creating'
        ? this.state.values
        : CcTokenApiCreationForm.DEFAULT_FORM_VALUES;

    return html`
      <cc-block>
        <div slot="header-title">${this._getMainHeading(activeStep)}</div>
        <div slot="content">
          ${this._renderStepsNav(activeStep, this.state.type)}
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
                formValues,
              })
            : ''}
        </div>
        <cc-block-details slot="footer-left">
          <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
          <cc-link
            slot="link"
            href="https://www.clever-cloud.com/developers/api/howto/#request-the-api"
            .icon="${iconInfo}"
          >
            <span>${i18n('cc-token-api-creation-form.link.doc')}</span>
          </cc-link>
          <div slot="content">${i18n('cc-token-api-creation-form.cli.content')}</div>
        </cc-block-details>
      </cc-block>
    `;
  }

  /**
   * @param {TokenApiCreationFormStateLoaded['activeStep']} activeStep
   * @param {TokenApiCreationFormState['type']} stateType
   */
  _renderStepsNav(activeStep, stateType) {
    const steps = /** @type {const} */ ([
      {
        name: 'configuration',
        text: i18n('cc-token-api-creation-form.configuration-step.nav.label'),
        isLoading: stateType === 'loading',
        isActive: activeStep === 'configuration',
        isClickable: activeStep === 'validation',
        isDone: activeStep !== 'configuration',
      },
      {
        name: 'validation',
        text: i18n('cc-token-api-creation-form.validation-step.nav.label'),
        isLoading: stateType === 'creating',
        isActive: activeStep === 'validation',
        isClickable: false,
        isDone: activeStep === 'copy',
      },
      {
        name: 'copy',
        text: i18n('cc-token-api-creation-form.copy-step.nav.label'),
        isLoading: false,
        isActive: activeStep === 'copy',
        isClickable: false,
        isDone: false,
      },
    ]);

    return html`
      <nav role="navigation" aria-label="${i18n('cc-token-api-creation-form.nav.aria-label')}">
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
                ${step.isLoading ? html`<cc-loader class="creation-steps-nav__step-item__loader"></cc-loader>` : ''}
                ${step.isActive && !step.isLoading ? html`<cc-icon .icon=${iconActiveStep} size="lg"></cc-icon>` : ''}
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
   * @param {FormValues} _.formValues
   */
  _renderMainContent({ skeleton, activeStep, isMfaEnabled, isWaiting, credentialsError, token, formValues }) {
    /**
     * Note: Every step is rendered at the same time, even though only one step is displayed.
     * This is essential to allow transitions / animations between steps.
     * We may be able to remove this behavior once `viewTransition` is supported (at least newly available).
     * The `steps-content__step-item--active` class is not used for CSS but in JS to make it easier to focus
     * the first input after changing the active step.
     */
    return html`
      <!-- FIXME: replace cc-expand with interpolate-size (CSS) once it's newly available -->
      <cc-expand>
        <div class="steps-content" @transitionend="${this._onTransitionEnd}">
          <div
            class="steps-content__step-item ${classMap({
              'steps-content__step-item--active': activeStep === 'configuration',
              'steps-content__step-item--out-left': activeStep !== 'configuration',
            })}"
          >
            ${this._renderConfigurationForm({
              name: formValues.name,
              description: formValues.description,
              expiration: formValues.expiration,
              skeleton,
            })}
          </div>
          <div
            class="steps-content__step-item ${classMap({
              'steps-content__step-item--active': activeStep === 'validation',
              'steps-content__step-item--out-right': activeStep === 'configuration',
              'steps-content__step-item--out-left': activeStep === 'copy',
            })}"
          >
            ${this._renderValidationForm({
              password: formValues.password,
              mfaCode: formValues.mfaCode,
              isMfaEnabled,
              isWaiting,
              credentialsError: credentialsError,
            })}
          </div>
          <div
            class="steps-content__step-item ${classMap({
              'steps-content__step-item--active': activeStep === 'copy',
              'steps-content__step-item--out-right': activeStep !== 'copy',
            })}"
          >
            ${this._renderCopyStep(token)}
          </div>
        </div>
      </cc-expand>
    `;
  }

  /**
   *
   * @param {object} _
   * @param {string} _.name
   * @param {string} _.description
   * @param {Expiration} _.expiration
   * @param {boolean} _.skeleton
   */
  _renderConfigurationForm({ name, description, expiration, skeleton }) {
    const isExpirationDurationCustom = expiration.type === 'custom';
    const expirationDuration = expiration.type === 'preset' ? expiration.preset : expiration.type;
    const expirationDate = this._getExpirationDate(expiration);

    return html`
      <form
        name="configuration-form"
        class="form"
        ${formSubmit(this._onConfigFormSubmit.bind(this))}
        ${ref(this._configurationFormRef)}
        @cc-input="${this._onInput}"
        @cc-select="${this._onSelect}"
      >
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.configuration-step.form.name.label')}"
          required
          ?skeleton=${skeleton}
          name="name"
          value=${name}
        ></cc-input-text>
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.configuration-step.form.desc.label')}"
          ?skeleton=${skeleton}
          name="description"
          value=${description}
        ></cc-input-text>
        <div class="form__expiration">
          <cc-select
            label="${i18n('cc-token-api-creation-form.configuration-step.form.expiration-duration.label')}"
            name="expirationDuration"
            .options=${this._getExpirationDurationOptions()}
            value="${expirationDuration}"
            ?disabled=${skeleton}
          >
            ${isExpirationDurationCustom
              ? html`<p slot="help">
                  ${i18n('cc-token-api-creation-form.configuration-step.form.expiration-duration.help.custom')}
                </p>`
              : ''}
          </cc-select>
          <cc-input-date
            label="${i18n('cc-token-api-creation-form.configuration-step.form.expiration-date.label')}"
            name="expirationDate"
            ?required="${isExpirationDurationCustom}"
            ?readonly="${!isExpirationDurationCustom}"
            .value="${expirationDate}"
            .min="${shiftDateField(new Date(), 'm', 15)}"
            .max="${shiftDateField(new Date(), 'Y', 1)}"
            .customErrorMessages="${this._expirationDateErrorMessages}"
            timezone="local"
            ?skeleton="${skeleton}"
            ${ref(this._expirationDateInputRef)}
          >
            ${isExpirationDurationCustom
              ? html`
                  <p slot="help">
                    ${i18n('cc-token-api-creation-form.configuration-step.form.expiration-date.help.min-max')}
                  </p>
                `
              : ''}
          </cc-input-date>
        </div>
        <div class="form__actions">
          <div class="form__actions__link-container">
            <cc-link
              mode="subtle"
              href="${this.apiTokenListHref}"
              class="form__actions__link-container__link"
              .icon="${iconGoBack}"
            >
              <span>${i18n('cc-token-api-creation-form.configuration-step.form.link.back-to-list')}</span>
            </cc-link>
          </div>
          <cc-button class="form__actions__submit-button" primary type="submit" ?disabled=${skeleton}>
            ${i18n('cc-token-api-creation-form.configuration-step.form.submit-button.label')}
          </cc-button>
        </div>
      </form>
    `;
  }

  /**
   * @param {object} _
   * @param {string} _.password
   * @param {string} _.mfaCode
   * @param {boolean} _.isMfaEnabled
   * @param {boolean} _.isWaiting
   * @param {TokenApiCreationFormStateLoadedValidation['credentialsError']} _.credentialsError
   */
  _renderValidationForm({ password, mfaCode, isMfaEnabled, isWaiting, credentialsError }) {
    const passwordErrorMessage =
      credentialsError === 'password' ? i18n('cc-token-api-creation-form.validation-step.form.password.error') : null;
    const mfaErrorMessage =
      credentialsError === 'mfaCode' ? i18n('cc-token-api-creation-form.validation-step.form.mfa-code.error') : null;

    return html`
      <form
        name="validation-form"
        class="form"
        @cc-input="${this._onInput}"
        @cc-select="${this._onInput}"
        ${formSubmit(this._onValidationFormSubmit.bind(this))}
        ${ref(this._validationFormRef)}
      >
        <cc-input-text
          label="${i18n('cc-token-api-creation-form.validation-step.form.password.label')}"
          name="password"
          ?readonly=${isWaiting}
          required
          secret
          .errorMessage=${passwordErrorMessage}
          .value="${password}"
        ></cc-input-text>
        ${isMfaEnabled
          ? html`
              <cc-input-text
                label="${i18n('cc-token-api-creation-form.validation-step.form.mfa-code.label')}"
                name="mfaCode"
                ?readonly=${isWaiting}
                required
                .errorMessage=${mfaErrorMessage}
                .value="${mfaCode}"
              ></cc-input-text>
            `
          : ''}

        <div class="form__actions">
          <div class="form__actions__link-container">
            ${isWaiting
              ? html`
                  <div class="form__actions__link-container__link">
                    <cc-icon .icon=${iconGoBack}></cc-icon>
                    <span>${i18n('cc-token-api-creation-form.validation-step.form.link.back-to-configuration')}</span>
                  </div>
                `
              : ''}
            ${!isWaiting
              ? html`
                  <cc-link
                    mode="subtle"
                    class="form__actions__link-container__link"
                    @click="${this._onConfigLinkClick}"
                    href="#"
                    .icon="${iconGoBack}"
                  >
                    <span>${i18n('cc-token-api-creation-form.validation-step.form.link.back-to-configuration')}</span>
                  </cc-link>
                `
              : ''}
          </div>
          <cc-button class="form__actions__submit-button" primary type="submit" ?waiting=${isWaiting}>
            ${i18n('cc-token-api-creation-form.validation-step.form.submit-button.label')}
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
          label="${i18n('cc-token-api-creation-form.copy-step.form.token.label')}"
          name="token"
          readonly
          secret
          clipboard
          value=${token}
        ></cc-input-text>
        <cc-link class="token-list-link-cta" href="${this.apiTokenListHref}" mode="button">
          <span>${i18n('cc-token-api-creation-form.copy-step.link.back-to-list')}</span>
        </cc-link>
      </div>
    `;
  }

  static get styles() {
    return [
      cliCommandsStyles,
      css`
        :host {
          display: block;

          --transition-duration: 300ms;
        }

        @media (prefers-reduced-motion) {
          :host {
            --transition-duration: 0ms;
          }
        }

        /* FIXME: not great when viewport is reduced + should be handled by the cc-block component itself */
        cc-block {
          padding-top: 2em;
        }

        /* FIXME: not great when viewport is reduced + should be handled by the cc-block component itself */
        cc-block > [slot='content'] {
          padding-bottom: 1em;
          padding-inline: 3em;
        }

        /* FIXME: not great when viewport is reduced + should be handled by the cc-block component itself */
        [slot='header-title'] {
          padding-inline: 1.5em;
        }

        [slot='link'] {
          --cc-icon-color: var(--cc-color-text-primary-highlight);

          text-decoration: none;
        }

        .block-intro {
          margin: 0;
        }

        .creation-steps-nav {
          column-gap: 2em;
          display: flex;
          flex-wrap: wrap;
          list-style: none;
          margin: 0;
          margin-block: 1em;
          padding: 0;
          row-gap: 1em;
        }

        .creation-steps-nav__step-item {
          --cc-icon-size: 1.3em;

          align-items: center;
          border-top: 3px solid currentcolor;
          color: var(--cc-color-text-weak);
          display: flex;
          flex: 1 1 10em;
          gap: 0.5em;
          line-height: 1.3em;
          padding-block: 1em;
          position: relative;
          transition: all var(--transition-duration) ease-in-out;
        }

        .creation-steps-nav__step-item a {
          color: inherit;
          text-decoration: none;
        }

        .creation-steps-nav__step-item--active {
          color: var(--cc-color-text-primary);
          transition: all var(--transition-duration) ease-in-out;
        }

        .creation-steps-nav__step-item--done {
          color: var(--cc-color-text-success);
          transition: all var(--transition-duration) ease-in-out;
        }

        .creation-steps-nav__step-item__loader {
          height: 1.3em;
          width: 1.3em;
        }

        .steps-content {
          display: grid;
          grid-template-areas: 'step';
        }

        cc-expand {
          margin-inline: -1em;
          padding: 1em;
          transition: all var(--transition-duration) ease-in-out;
        }

        .steps-content__step-item {
          display: block;
          grid-area: step;
          height: auto;
          opacity: 1;
          transform: translateX(0);
          transition:
            transform var(--transition-duration) ease-in-out,
            opacity var(--transition-duration) ease-in-out;
          visibility: visible;
        }

        .steps-content__step-item--out-left {
          height: 0;
          opacity: 0;
          transform: translateX(-110%);
          transition:
            transform var(--transition-duration) ease-in-out,
            opacity var(--transition-duration) ease-in-out,
            visibility var(--transition-duration) ease-in-out var(--transition-duration);
          visibility: hidden;
        }

        .steps-content__step-item--out-right {
          height: 0;
          opacity: 0;
          transform: translateX(110%);
          transition:
            transform var(--transition-duration) ease-in-out,
            opacity var(--transition-duration) ease-in-out,
            visibility var(--transition-duration) ease-in-out var(--transition-duration);
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
          flex-wrap: wrap;
          gap: 1.5em;
          justify-content: flex-end;
          margin-top: 1em;
        }

        .form__actions__submit-button {
          flex: 1 0 min(100%, 12.5em);
        }

        .copy-step-wrapper {
          display: grid;
          gap: 1.5em;
        }

        .copy-step-wrapper cc-input-text {
          order: -1;
        }

        .token-list-link-cta {
          justify-self: flex-end;
        }

        .form__actions__link-container {
          display: grid;
          flex: 100 1 auto;
          justify-content: flex-end;
        }

        .form__actions__link-container__link {
          align-items: center;
          color: var(--cc-color-text-weak);
          cursor: pointer;
          display: flex;
          gap: 0.5em;
          padding: 0.25em 0.5em;
          text-decoration: none;
        }

        .form__actions__link-container__link:visited,
        .form__actions__link-container__link:active {
          color: var(--cc-color-text-weak);
        }

        .form__actions__link-container__link:focus-visible {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .form__actions__link-container__link cc-icon {
          flex: 0 0 auto;
        }
      `,
    ];
  }
}

window.customElements.define('cc-token-api-creation-form', CcTokenApiCreationForm);
