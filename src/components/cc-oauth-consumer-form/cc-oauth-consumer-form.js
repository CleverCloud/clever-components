import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { fakeString } from '../../lib/fake-strings.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { getFormDataMap } from '../../lib/form/form-utils.js';
import { Validation } from '../../lib/form/validation.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';
import {
  CcOauthConsumerChangeEvent,
  CcOauthConsumerCreateEvent,
  CcOauthConsumerDeleteEvent,
} from './cc-oauth-consumer-form.events.js';

const BREAKPOINTS = [450, 550, 750];

const OAUTH_CONSUMER_DOCUMENTATION = 'https://www.clever-cloud.com/developers/api/howto/#oauth1';

const URL_VALIDATOR = {
  /**
   * @param {string} value
   * @return {Validity}
   */
  validate: (value) => {
    try {
      new URL(value);
      return Validation.VALID;
    } catch {
      return Validation.invalid('invalidUrl');
    }
  },
};

/** @type {OauthConsumerWithoutKeyAndSecret} */
const SKELETON_OAUTH_CONSUMER_FORM_DATA = {
  name: '',
  description: '',
  url: '',
  picture: '',
  baseUrl: '',
  rights: {
    accessOrganisations: false,
    accessOrganisationsBills: false,
    accessOrganisationsConsumptionStatistics: false,
    accessOrganisationsCreditCount: false,
    accessPersonalInformation: false,
    manageOrganisations: false,
    manageOrganisationsApplications: false,
    manageOrganisationsMembers: false,
    manageOrganisationsServices: false,
    managePersonalInformation: false,
    manageSshKeys: false,
  },
};

/** @type {Array<keyof OauthConsumerRights & `access${string}`>} */
const ACCESS_RIGHT_KEYS = [
  'accessOrganisations',
  'accessOrganisationsBills',
  'accessOrganisationsConsumptionStatistics',
  'accessOrganisationsCreditCount',
  'accessPersonalInformation',
];

/** @type {Array<keyof OauthConsumerRights & `manage${string}`>} */
const MANAGE_RIGHT_KEYS = [
  'manageOrganisations',
  'manageOrganisationsApplications',
  'manageOrganisationsMembers',
  'manageOrganisationsServices',
  'managePersonalInformation',
  'manageSshKeys',
];

/**
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormState} OauthConsumerFormState
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerWithoutKeyAndSecret} OauthConsumerWithoutKeyAndSecret
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormData} OauthConsumerFormData
 * @typedef {import('../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js').OauthConsumer} OauthConsumer
 * @typedef {import('../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js').OauthConsumerRights} OauthConsumerRights
 * @typedef {import('lit').PropertyValues<CcOauthConsumerForm>} CcOauthConsumerFormPropertyValues
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLInputElement>} HTMLInputEvent
 * @typedef {import('../../lib/form/validation.types.js').Validity} Validity
 */

/**
 * A component displaying a form to create an OAuth Consumer and a form to update an OAuth Consumer with a delete zone.
 *
 * @cssdisplay block
 */
export class CcOauthConsumerForm extends LitElement {
  static get properties() {
    return {
      state: { type: Object, attribute: false },
      _shouldDisplayCheckboxGroupError: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {OauthConsumerFormState} Sets the state of the component. */
    this.state = { type: 'idle-create' };

    /** @type {Boolean} */
    this._shouldDisplayCheckboxGroupError = false;

    /** @type {HTMLFormElementRef} */
    this._formRef = createRef();

    this._customErrorMessages = { invalidUrl: i18n('cc-oauth-consumer-form.info.url.error') };

    new ResizeController(this, {
      widthBreakpoints: BREAKPOINTS,
    });
  }

  /**
   * @param {HTMLInputEvent} e
   * @param {string} sectionSelector
   */
  _handleSelectAllClick(e, sectionSelector) {
    const selectAllCheckbox = e.target;
    /** @type {NodeListOf<HTMLInputElement>} */
    const checkboxes = this.shadowRoot.querySelectorAll(`${sectionSelector} .right`);
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  }

  /** @param {HTMLInputEvent} e */
  _handleSelectAllAccessClick(e) {
    this._handleSelectAllClick(e, '.access-rights-section');
  }

  /** @param {HTMLInputEvent} e */
  _handleSelectAllManageClick(e) {
    this._handleSelectAllClick(e, '.manage-rights-section');
  }

  /**
   * @param {string} sectionSelector
   * @param {string} selectAllId
   */
  _updateSelectAllCheckbox(sectionSelector, selectAllId) {
    /** @type {HTMLInputElement} */
    const selectAllCheckbox = this.shadowRoot.querySelector(`#${selectAllId}`);

    // Verify if at least one checkbox of the group is unchecked
    // If no checkbox is unchecked within the group, then we check the related selectAllCheckbox
    /** @type {NodeListOf<HTMLInputElement>} */
    const checkboxes = this.shadowRoot.querySelectorAll(`${sectionSelector} .right`);
    const hasAtLeastOneUnchecked = Array.from(checkboxes).some((checkbox) => !checkbox.checked);
    selectAllCheckbox.checked = !hasAtLeastOneUnchecked;
  }

  _updateSelectAllAccessCheckbox() {
    this._updateSelectAllCheckbox('.access-rights-section', 'select-all-access');
  }

  _updateSelectAllManageCheckbox() {
    this._updateSelectAllCheckbox('.manage-rights-section', 'select-all-manage');
  }

  /** @param {OauthConsumerFormData} data */
  _onFormSubmit(data) {
    if (this.state.type !== 'idle-create' && this.state.type !== 'idle-update') {
      return;
    }

    this._shouldDisplayCheckboxGroupError = false;

    /** @type {OauthConsumerRights} */
    const defaultRights =
      this.state.type === 'idle-update' ? this.state.values.rights : SKELETON_OAUTH_CONSUMER_FORM_DATA.rights;

    const oauthConsumerRightsAsArray = /** @type {[keyof OauthConsumerRights, boolean][]} */ (
      Object.entries(defaultRights)
    )
      .filter(([key]) => key !== 'almighty')
      .map(([key]) => {
        return [key, data.rights.includes(key)];
      });

    /** @type {OauthConsumerRights} */
    const rightsWithUpdatedData = Object.fromEntries(oauthConsumerRightsAsArray);

    /** @type {OauthConsumerWithoutKeyAndSecret} */
    const oauthConsumer = {
      name: data.name,
      url: data.url,
      baseUrl: data.baseUrl,
      description: data.description,
      picture: data.picture,
      rights: rightsWithUpdatedData,
    };

    if (this.state.type === 'idle-create') {
      this.dispatchEvent(new CcOauthConsumerCreateEvent(oauthConsumer));
    }

    if (this.state.type === 'idle-update') {
      this.state = {
        type: 'idle-update',
        values: oauthConsumer,
      };
      this.dispatchEvent(new CcOauthConsumerChangeEvent(oauthConsumer));
    }
  }

  _onDeleteOauthConsumer() {
    this.dispatchEvent(new CcOauthConsumerDeleteEvent());
  }

  // We only put the first checkbox of group validity on error
  // because there is no need to put all the checkboxes validity on error,
  // it would be redundant for screen reader
  _validateCheckboxGroup() {
    const data = getFormDataMap(this._formRef.value);
    const hasCheckedBox = Object.keys(data).some((formControlName) => formControlName === 'rights');
    const selection = /** @type {HTMLInputElement} */ (
      this.shadowRoot.querySelector('#access-rights-container input[type="checkbox"][name]')
    );

    if (!hasCheckedBox) {
      selection.setCustomValidity('error');
    } else {
      selection.setCustomValidity('');
    }
  }

  /**
   * @param {Array<{name: string, validity: {valid: boolean}}>} validationResult
   * @private
   */
  _onFormInvalid(validationResult) {
    const isCheckboxGroupValid = validationResult.every(({ name, validity }) => {
      return name !== 'rights' || validity.valid;
    });
    this._shouldDisplayCheckboxGroupError = !isCheckboxGroupValid;
  }

  /**
   * @param {keyof OauthConsumerRights} name
   * @returns {string|Node}
   */
  _getName(name) {
    switch (name) {
      case 'accessOrganisations':
        return i18n('cc-oauth-consumer-form.rights.access-organisations');
      case 'accessOrganisationsBills':
        return i18n('cc-oauth-consumer-form.rights.access-organisations-bills');
      case 'accessOrganisationsConsumptionStatistics':
        return i18n('cc-oauth-consumer-form.rights.access-organisations-consumption-statistics');
      case 'accessOrganisationsCreditCount':
        return i18n('cc-oauth-consumer-form.rights.access-organisations-credit-count');
      case 'accessPersonalInformation':
        return i18n('cc-oauth-consumer-form.rights.access-personal-information');
      case 'manageOrganisations':
        return i18n('cc-oauth-consumer-form.rights.manage-organisations');
      case 'manageOrganisationsApplications':
        return i18n('cc-oauth-consumer-form.rights.manage-organisations-applications');
      case 'manageOrganisationsMembers':
        return i18n('cc-oauth-consumer-form.rights.manage-organisations-members');
      case 'manageOrganisationsServices':
        return i18n('cc-oauth-consumer-form.rights.manage-organisations-services');
      case 'managePersonalInformation':
        return i18n('cc-oauth-consumer-form.rights.manage-personal-information');
      case 'manageSshKeys':
        return i18n('cc-oauth-consumer-form.rights.manage-ssh-keys');
      default:
        return fakeString(70);
    }
  }

  resetOauthConsumerForm() {
    this._formRef.value.reset();
  }

  /**
   * This is needed when we retrieve the data from the API on 'idle-update' state
   * @param {CcOauthConsumerFormPropertyValues} changedProperties
   */
  updated(changedProperties) {
    if (changedProperties.has('state') && (this.state.type === 'idle-update' || this.state.type === 'idle-create')) {
      this._validateCheckboxGroup();
      this._updateSelectAllAccessCheckbox();
      this._updateSelectAllManageCheckbox();
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`
        <cc-notice slot="content" intent="warning" message="${i18n('cc-oauth-consumer-form.load.error')}"></cc-notice>
      `;
    }
    const creatingContext = this.state.type === 'idle-create' || this.state.type === 'creating';
    const isWaiting =
      this.state.type === 'creating' || this.state.type === 'updating' || this.state.type === 'deleting';
    const skeleton = this.state.type === 'loading';
    let formValues = SKELETON_OAUTH_CONSUMER_FORM_DATA;

    if (this.state.type === 'idle-update' || this.state.type === 'updating' || this.state.type === 'deleting') {
      formValues = this.state.values;
    }

    return html`
      <div class="wrapper">
        <cc-block>
          ${creatingContext
            ? html`<div slot="header-title">${i18n('cc-oauth-consumer-form.create-title')}</div>`
            : html`<div slot="header-title">${i18n('cc-oauth-consumer-form.update-title')}</div>`}
          ${this._renderOauthConsumerForm(formValues, isWaiting, skeleton)}
          <div slot="footer-right">
            <cc-link href="${OAUTH_CONSUMER_DOCUMENTATION}" .icon=${iconInfo}>
              ${i18n('cc-oauth-consumer-form.documentation.text')}
            </cc-link>
          </div>
        </cc-block>

        ${this.state.type === 'idle-update' ||
        this.state.type === 'updating' ||
        this.state.type === 'deleting' ||
        this.state.type === 'loading'
          ? html`${this._renderDangerZone(isWaiting)}`
          : ''}
      </div>
    `;
  }

  /**
   * @param {OauthConsumerWithoutKeyAndSecret} formValues
   * @param {boolean} isWaiting
   * @param {boolean} skeleton
   * @return {TemplateResult}
   * @private
   */
  _renderOauthConsumerForm(formValues, isWaiting, skeleton) {
    const isSelectAllAccessCheckedByDefault = ACCESS_RIGHT_KEYS.every(
      (accessRightKey) => formValues.rights[accessRightKey],
    );
    const isSelectAllManageCheckedByDefault = MANAGE_RIGHT_KEYS.every(
      (manageRightKey) => formValues.rights[manageRightKey],
    );

    return html`
      <form
        slot="content"
        ${formSubmit(this._onFormSubmit.bind(this), this._onFormInvalid.bind(this))}
        ${ref(this._formRef)}
      >
        <cc-block-section class="info-block">
          <div slot="title" class="info-title">${i18n('cc-oauth-consumer-form.info.title')}</div>

          <cc-input-text
            name="name"
            label="${i18n('cc-oauth-consumer-form.info.name')}"
            placeholder="${i18n('cc-oauth-consumer-form.info.placeholder')}"
            required
            ?readonly=${isWaiting}
            ?skeleton=${skeleton}
            .value=${formValues.name}
            .resetValue=${formValues.name}
          >
            <p slot="help">${i18n('cc-oauth-consumer-form.info.name.help')}</p>
          </cc-input-text>
          <cc-input-text
            name="description"
            label="${i18n('cc-oauth-consumer-form.info.description-input')}"
            placeholder="${i18n('cc-oauth-consumer-form.info.placeholder')}"
            required
            multi
            ?readonly=${isWaiting}
            ?skeleton=${skeleton}
            .value=${formValues.description}
            .resetValue=${formValues.description}
          >
            <p slot="help">${i18n('cc-oauth-consumer-form.info.description.help')}</p>
          </cc-input-text>
          <cc-input-text
            name="url"
            label="${i18n('cc-oauth-consumer-form.info.homepage-url')}"
            placeholder="${i18n('cc-oauth-consumer-form.info.placeholder')}"
            required
            ?readonly=${isWaiting}
            ?skeleton=${skeleton}
            .value=${formValues.url}
            .resetValue=${formValues.url}
            .customValidator=${URL_VALIDATOR}
            .customErrorMessages=${this._customErrorMessages}
          >
            <p slot="help">${i18n('cc-oauth-consumer-form.info.homepage-url.help')}</p>
          </cc-input-text>
          <cc-input-text
            name="baseUrl"
            label="${i18n('cc-oauth-consumer-form.info.base-url')}"
            placeholder="${i18n('cc-oauth-consumer-form.info.placeholder')}"
            required
            ?readonly=${isWaiting}
            ?skeleton=${skeleton}
            .value=${formValues.baseUrl}
            .resetValue=${formValues.baseUrl}
            .customValidator=${URL_VALIDATOR}
            .customErrorMessages=${this._customErrorMessages}
          >
            <p slot="help">${i18n('cc-oauth-consumer-form.info.base-url.help')}</p>
          </cc-input-text>
          <cc-input-text
            name="picture"
            label="${i18n('cc-oauth-consumer-form.info.image')}"
            placeholder="${i18n('cc-oauth-consumer-form.info.placeholder')}"
            required
            ?readonly=${isWaiting}
            ?skeleton=${skeleton}
            .value=${formValues.picture}
            .resetValue=${formValues.picture}
            .customValidator=${URL_VALIDATOR}
            .customErrorMessages=${this._customErrorMessages}
          >
            <p slot="help">${i18n('cc-oauth-consumer-form.info.image.help')}</p>
          </cc-input-text>
        </cc-block-section>

        <cc-block-section>
          <fieldset tabindex="-1" class="rights-block" @input="${this._validateCheckboxGroup}">
            <legend slot="title" class="rights-title">${i18n('cc-oauth-consumer-form.auth.title')}</legend>
            <p class="description">${i18n('cc-oauth-consumer-form.rights.description')}</p>
            <div class="error-message">
              ${this._shouldDisplayCheckboxGroupError ? i18n('cc-oauth-consumer-form.rights.error') : ''}
            </div>
            <div class="rights-container">
              <fieldset id="access-rights-container">
                <legend class="visually-hidden">${i18n('cc-oauth-consumer-form.rights.legend-access')}</legend>
                <div>
                  <input
                    id="select-all-access"
                    type="checkbox"
                    .checked=${isSelectAllAccessCheckedByDefault}
                    .defaultChecked=${isSelectAllAccessCheckedByDefault}
                    ?disabled=${isWaiting || skeleton}
                    @click=${this._handleSelectAllAccessClick}
                  />
                  <label for="select-all-access">${i18n('cc-oauth-consumer-form.rights.access-all')}</label>
                </div>
                <div class="access-rights-section" @input="${this._updateSelectAllAccessCheckbox}">
                  ${ACCESS_RIGHT_KEYS.map((key) => this._renderRight(key, isWaiting, skeleton, formValues.rights[key]))}
                </div>
              </fieldset>
              <fieldset id="manage-rights-container">
                <legend class="visually-hidden">${i18n('cc-oauth-consumer-form.rights.legend-manage')}</legend>
                <div>
                  <input
                    id="select-all-manage"
                    type="checkbox"
                    .checked=${isSelectAllManageCheckedByDefault}
                    .defaultChecked=${isSelectAllManageCheckedByDefault}
                    ?disabled=${isWaiting || skeleton}
                    @click=${this._handleSelectAllManageClick}
                  />
                  <label for="select-all-manage">${i18n('cc-oauth-consumer-form.rights.manage-all')}</label>
                </div>
                <div class="manage-rights-section" @input="${this._updateSelectAllManageCheckbox}">
                  ${MANAGE_RIGHT_KEYS.map((key) => this._renderRight(key, isWaiting, skeleton, formValues.rights[key]))}
                </div>
              </fieldset>
            </div>
          </fieldset>
        </cc-block-section>
        <div class="oauth-form-buttons">
          ${this.state.type === 'idle-create' || this.state.type === 'creating'
            ? html`
                <cc-button class="buttons" primary type="submit" ?waiting="${this.state.type === 'creating'}"
                  >${i18n('cc-oauth-consumer-form.create-button')}
                </cc-button>
              `
            : ''}
          ${this.state.type === 'idle-update' ||
          this.state.type === 'updating' ||
          this.state.type === 'deleting' ||
          this.state.type === 'loading'
            ? html`
                <cc-button
                  class="buttons"
                  outlined
                  type="reset"
                  ?disabled=${isWaiting || this.state.type === 'deleting' || this.state.type === 'loading'}
                  >${i18n('cc-oauth-consumer-form.reset-button')}
                </cc-button>
                <cc-button
                  class="buttons"
                  primary
                  type="submit"
                  ?disabled=${(this.state.type !== 'updating' && this.state.type === 'deleting') ||
                  this.state.type === 'loading'}
                  ?waiting="${this.state.type === 'updating'}"
                  >${i18n('cc-oauth-consumer-form.update-button')}
                </cc-button>
              `
            : ''}
        </div>
      </form>
    `;
  }

  /**
   * @param {boolean} isWaiting
   */
  _renderDangerZone(isWaiting) {
    return html`
      <cc-block class="danger-zone-block">
        <div slot="content" class="danger-zone-wrapper">
          <div class="danger-title">${i18n('cc-oauth-consumer-form.danger-zone.title')}</div>
          <div class="danger-description">${i18n('cc-oauth-consumer-form.danger-zone.description')}</div>
          <div class="danger-button">
            <cc-button
              class="buttons"
              danger
              type="submit"
              ?disabled=${(isWaiting && this.state.type !== 'deleting') || this.state.type === 'loading'}
              ?waiting="${this.state.type === 'deleting'}"
              @cc-click=${this._onDeleteOauthConsumer}
              >${i18n('cc-oauth-consumer-form.delete-button')}</cc-button
            >
          </div>
        </div>
      </cc-block>
    `;
  }

  /**
   * @param {keyof OauthConsumerRights} formControlValue
   * @param {boolean} isWaiting
   * @param {boolean} skeleton
   * @param {boolean} isChecked
   */
  _renderRight(formControlValue, isWaiting, skeleton, isChecked) {
    return html`
      <div>
        <input
          type="checkbox"
          id="checkbox-right-${formControlValue}"
          class="right"
          name="rights"
          ?disabled=${isWaiting || skeleton}
          .defaultChecked="${isChecked}"
          .value="${formControlValue}"
        />
        <label for="checkbox-right-${formControlValue}">${this._getName(formControlValue)}</label>
      </div>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        /* region global */

        :host {
          display: block;
        }

        .wrapper {
          display: grid;
          gap: 1.5em;
        }

        .description {
          margin-top: 0;
        }

        /* endregion */

        /* region information */

        .info-block {
          padding-bottom: 1em;
        }

        .info-title {
          font-size: 1.1em;
        }

        /* endregion */

        /* region rights */

        fieldset {
          border: none;
          margin: 0;
          padding: 0;
        }

        .rights-block:focus-visible {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline-error);
          /* Specific case for large areas */
          outline-offset: 8px;
        }

        .rights-title {
          flex: 1 1 0;
          font-size: 1.1em;
          font-weight: bold;
          margin-bottom: 0.5em;
          padding-left: 0;
        }

        .rights-container {
          display: grid;
          gap: 3em;
          grid-template-columns: 1fr 1fr;
        }

        :host([w-lt-750]) .rights-container {
          gap: 1em;
          grid-template-columns: 1fr;
        }

        #access-rights-container,
        #manage-rights-container {
          border: none;
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .error-message {
          color: var(--cc-color-text-danger);
          margin: 0.5em 0;
        }

        .access-rights-section,
        .manage-rights-section {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          margin-left: 1em;
        }

        input[type='checkbox']:focus-visible {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        /* endregion */

        .oauth-form-buttons {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: end;
          margin-top: 1em;
        }

        :host([w-lt-450]) .oauth-form-buttons {
          justify-content: center;
        }

        .buttons {
          flex: 0 0 min(100%, 12.5em);
        }

        :host([w-lt-550]) .buttons {
          flex: 1 0 min(100%, 12.5em);
        }

        /* region danger zone */

        .danger-zone-wrapper {
          display: grid;
          gap: 0.5em 1em;
          grid-template-areas:
            'title button'
            'description button';
          grid-template-columns: 1fr minmax(12.5em, auto);
        }

        :host([w-lt-750]) .danger-zone-wrapper {
          grid-template-areas:
            'title'
            'description'
            'button';
          grid-template-columns: 1fr;
        }

        .danger-zone-block {
          border-color: var(--cc-color-border-danger);
        }

        .danger-title {
          color: var(--cc-color-text-danger);
          font-size: 1.2em;
          font-weight: bold;
          grid-area: title;
        }

        .danger-description {
          grid-area: description;
        }

        .danger-button {
          align-items: center;
          display: flex;
          grid-area: button;
        }

        :host([w-lt-750]) .danger-button {
          display: flex;
          justify-content: end;
        }

        :host([w-lt-450]) .danger-button {
          justify-content: center;
        }

        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-oauth-consumer-form', CcOauthConsumerForm);
