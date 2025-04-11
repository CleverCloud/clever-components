import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { getFormDataMap } from '../../lib/form/form-utils.js';
import { Validation } from '../../lib/form/validation.js';
import { i18n } from '../../lib/i18n/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';

/**
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormState} OAuthConsumerFormState
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateDeleting} OAuthConsumerFormStateDeleting
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumer} OauthConsumer
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerRights} OauthConsumerRights
 * @typedef {import('./cc-oauth-consumer-form.types.js').RawUpdatedOauthConsumer} RawUpdatedOauthConsumer
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLInputElement|HTMLTextAreaElement>} HTMLInputOrTextareaEvent
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 * @typedef {import('../../lib/form/validation.types.js').Validity} Validity
 */

// const OAUTH_CONSUMER_RIGHTS = [
//   { name: 'access_organisations', label: 'access_organisations', section: 'access' },
//   { name: 'access_organisations_bills', label: 'access_organisations_bills', section: 'access' },
//   {
//     name: 'access_organisations_consumption_statistics',
//     label: 'access_organisations_consumption_statistics',
//     section: 'access',
//   },
//   {
//     name: 'access_organisations_credit_count',
//     label: 'access_organisations_credit_count',
//     section: 'access',
//   },
//   { name: 'access_personal_information', label: 'access_personal_information', section: 'access' },
//   { name: 'manage_organisations', label: 'manage_organisations', section: 'manage' },
//   {
//     name: 'manage_organisations_applications',
//     label: 'manage_organisations_applications',
//     section: 'manage',
//   },
//   { name: 'manage_organisations_members', label: 'manage_organisations_members', section: 'manage' },
//   { name: 'manage_organisations_services', label: 'manage_organisations_services', section: 'manage' },
//   { name: 'manage_personal_information', label: 'manage_personal_information', section: 'manage' },
//   { name: 'manage_ssh_keys', label: 'manage_ssh_keys', section: 'manage' },
// ];

const URL_VALIDATOR = {
  /**
   * @param {string} value
   * @return {Validity}
   */
  validate: (value) => {
    try {
      new URL(value);
      return Validation.VALID;
    } catch (error) {
      return Validation.invalid('invalidUrl');
    }
  },
};

/**
 * @fires {CustomEvent<OauthConsumer>} cc-oauth-consumer-form:create - Fires when clicking the creation form submit button.
 * @fires {CustomEvent<OauthConsumer>} cc-oauth-consumer-form:update - Fires when clicking the update form submit button.
 * @fires {CustomEvent} cc-oauth-consumer-form:delete - Fires whenever the delete button is clicked.
 */
export class CcOauthConsumerForm extends LitElement {
  static get properties() {
    return {
      state: { type: Object, attribute: false },
      _hasCheckboxGroupError: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {OAuthConsumerFormState} Sets the state of the component. */
    this.state = { type: 'idle-create' };

    /** @type {HTMLFormElementRef} */
    this._formRef = createRef();

    this._customErrorMessages = { invalidUrl: i18n('cc-oauth-consumer-form.info.url.error.message') };

    /** @type {Boolean} */
    this.hasCheckboxGroupError = false;
  }

  resetOauthConsumerForm() {
    this._formRef.value.reset();
  }

  /**
   * @param {HTMLInputOrTextareaEvent} e
   */
  _selectAllAccessCheckboxes(e) {
    const selectAllCheckbox = e.target;
    const checkboxes = this.shadowRoot.querySelectorAll('.access-rights-section .right');
    /** @type {HTMLInputElement} */
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  }

  /**
   * @param {HTMLInputOrTextareaEvent} e
   */
  _selectAllManageCheckboxes(e) {
    const selectAllCheckbox = e.target;
    const checkboxes = this.shadowRoot.querySelectorAll('.manage-rights-section .right');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  }

  /**
   *  @param {Object} data -
   *  * @param {string} data.name
   *  * @param {string} data.url
   *  * @param {string} data.baseUrl
   *  * @param {string} data.description
   *  * @param {string} data.picture
   *  * @param {Object.<string, boolean>} data.rights
   */
  _onFormSubmit(data) {
    this._hasCheckboxGroupError = false;

    /** @type {OauthConsumerRights} */
    const defaultRights = {
      almighty: false,
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
    };

    /** @type {OauthConsumerRights} */
    const rights = Object.fromEntries(
      Object.entries(defaultRights).map(([key, defaultValue]) => {
        const checkboxValue = data.rights?.[key];
        const isChecked = checkboxValue === true;
        return [key, isChecked ? true : defaultValue];
      }),
    );

    /** @type {RawUpdatedOauthConsumer} */
    const oauthConsumer = {
      name: data.name,
      url: data.url,
      baseUrl: data.baseUrl,
      description: data.description,
      picture: data.picture,
      rights,
    };

    if (this.state.type === 'idle-create') {
      this.state = {
        type: 'idle-create',
        ...oauthConsumer,
        key: this.state.key,
        secret: this.state.secret,
      };
      dispatchCustomEvent(this, 'create', oauthConsumer);
    }

    if (this.state.type === 'idle-update') {
      this.state = {
        type: 'idle-update',
        ...oauthConsumer,
      };
      dispatchCustomEvent(this, 'update', oauthConsumer);
    }
  }

  /** @param {OAuthConsumerFormStateDeleting} oauthConsumer */
  _onDeleteOauthConsumer(oauthConsumer) {
    dispatchCustomEvent(this, 'delete', oauthConsumer);
  }

  _validateCheckboxGroup() {
    const data = getFormDataMap(this._formRef.value);
    //console.log(data);
    const hasCheckedBox = Object.keys(data).some((key) => key.startsWith('access') || key.startsWith('manage'));

    //console.log('erreur');
    const selection1 = this.shadowRoot.querySelector('#access-options-container input[type="checkbox"][name]');
    const selection2 = this.shadowRoot.querySelector('#manage-options-container input[type="checkbox"][name]');

    if (!hasCheckedBox) {
      selection1.setCustomValidity('error');
      selection2.setCustomValidity('error');
    } else {
      selection1.setCustomValidity('');
      selection2.setCustomValidity('');
    }
  }

  _onFormInvalid(validationResult) {
    const isCheckboxGroupValid = validationResult.every(({ name, validity }) => {
      console.log(name);
      console.log(validity);
      return (name !== 'access' && name !== 'manage') || validity.valid;
    });
    if (isCheckboxGroupValid) {
      this._hasCheckboxGroupError = false;
    } else {
      this._hasCheckboxGroupError = true;
    }
    console.log(isCheckboxGroupValid);
  }

  firstUpdated() {
    this._validateCheckboxGroup();
  }

  /**
   * @param {keyof OauthConsumerRights} name
   * @returns {string|Node}
   */
  _getName(name) {
    switch (name) {
      case 'accessOrganisations':
        return i18n('cc-oauth-consumer-info.rights.access-organisations');
      case 'accessOrganisationsBills':
        return i18n('cc-oauth-consumer-info.rights.access-organisations-bills');
      case 'accessOrganisationsConsumptionStatistics':
        return i18n('cc-oauth-consumer-info.rights.access-organisations-consumption-statistics');
      case 'accessOrganisationsCreditCount':
        return i18n('cc-oauth-consumer-info.rights.access-organisations-credit-count');
      case 'accessPersonalInformation':
        return i18n('cc-oauth-consumer-info.rights.access-personal-information');
      case 'manageOrganisations':
        return i18n('cc-oauth-consumer-info.rights.manage-organisations');
      case 'manageOrganisationsApplications':
        return i18n('cc-oauth-consumer-info.rights.manage-organisations-applications');
      case 'manageOrganisationsMembers':
        return i18n('cc-oauth-consumer-info.rights.manage-organisations-members');
      case 'manageOrganisationsServices':
        return i18n('cc-oauth-consumer-info.rights.manage-organisations-services');
      case 'managePersonalInformation':
        return i18n('cc-oauth-consumer-info.rights.manage-personal-information');
      case 'manageSshKeys':
        return i18n('cc-oauth-consumer-info.rights.manage-ssh-keys');
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html` <cc-notice slot="content" intent="warning" message="error"></cc-notice> `;
    }

    return html`
      <div class="wrapper">
        <cc-block>
          <div slot="header-title" class="title">New oAuth Consumer</div>

          ${this._renderOauthConsumerForm()}
        </cc-block>

        ${this.state.type === 'idle-update' ||
        this.state.type === 'updating' ||
        this.state.type === 'deleting' ||
        this.state.type === 'loading'
          ? html`${this._renderDangerZone()}`
          : ''}
      </div>
    `;
  }

  /**
   * @return {TemplateResult}
   * @private
   */
  _renderOauthConsumerForm() {
    const isWaiting =
      this.state.type === 'creating' || this.state.type === 'updating' || this.state.type === 'deleting';
    const isLoading = this.state.type === 'loading';

    return html`
      <form
        slot="content"
        class="oauth-form"
        ${formSubmit(this._onFormSubmit.bind(this), this._onFormInvalid.bind(this))}
        ${ref(this._formRef)}
      >
        <cc-block-section class="info-block">
          <div slot="title">${i18n('cc-oauth-consumer-form.info.title')}</div>

          <cc-input-text
            name="name"
            label="${i18n('cc-oauth-consumer-form.info.name.label')}"
            required
            placeholder="${i18n('cc-oauth-consumer-form.info.place-holder')}"
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.state?.name}
          ></cc-input-text>
          <cc-input-text
            name="url"
            label="${i18n('cc-oauth-consumer-form.info.homepage-url.label')}"
            required
            placeholder="${i18n('cc-oauth-consumer-form.info.place-holder')}"
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.state?.url}
            .customValidator=${URL_VALIDATOR}
            .customErrorMessages=${this._customErrorMessages}
          ></cc-input-text>
          <cc-input-text
            name="baseUrl"
            label="${i18n('cc-oauth-consumer-form.info.base-url.label')}"
            required
            placeholder="${i18n('cc-oauth-consumer-form.info.place-holder')}"
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.state?.baseUrl}
            .customValidator=${URL_VALIDATOR}
            .customErrorMessages=${this._customErrorMessages}
          ></cc-input-text>
          <cc-input-text
            name="description"
            label="${i18n('cc-oauth-consumer-form.info.description.label')}"
            required
            placeholder="${i18n('cc-oauth-consumer-form.info.place-holder')}"
            multi
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.state?.description}
          ></cc-input-text>
          <cc-input-text
            name="picture"
            label="${i18n('cc-oauth-consumer-form.info.image.label')}"
            required
            placeholder="${i18n('cc-oauth-consumer-form.info.place-holder')}"
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.state?.picture}
            .customValidator=${URL_VALIDATOR}
            .customErrorMessages=${this._customErrorMessages}
          ></cc-input-text>
        </cc-block-section>

        <cc-block-section class="auth-block">
          <fieldset tabindex="-1" class="options-container">
            <legend slot="title">${i18n('cc-oauth-consumer-form.auth.title')}</legend>
            <div class="error-message">
              ${this._hasCheckboxGroupError ? i18n('cc-oauth-consumer-form.auth.options.error.message') : ''}
            </div>
            <div class="checkbox-container">
              <fieldset id="access-options-container" @input="${this._validateCheckboxGroup}">
                <legend class="visually-hidden">${i18n('cc-oauth-consumer-form.auth.legend.access')}</legend>
                <div class="select-all-option">
                  <input
                    id="select-all-access"
                    type="checkbox"
                    ?disabled=${isWaiting || isLoading}
                    @click=${this._selectAllAccessCheckboxes}
                  />
                  <label for="select-all-access">${i18n('cc-oauth-consumer-form.auth.access.select-all')}</label>
                </div>
                <div class="access-rights-section">
                  ${this._renderRight('accessOrganisations')} ${this._renderRight('accessOrganisationsBills')}
                  ${this._renderRight('accessOrganisationsConsumptionStatistics')}
                  ${this._renderRight('accessOrganisationsCreditCount')}
                  ${this._renderRight('accessPersonalInformation')}
                </div>
              </fieldset>
              <fieldset id="manage-options-container">
                <legend class="visually-hidden">${i18n('cc-oauth-consumer-form.auth.legend.manage')}</legend>
                <div class="select-all-option">
                  <input
                    id="select-all-manage"
                    type="checkbox"
                    ?disabled=${isWaiting || isLoading}
                    @click=${this._selectAllManageCheckboxes}
                  />
                  <label for="select-all-manage">${i18n('cc-oauth-consumer-form.auth.manage.select-all')}</label>
                </div>
                <div class="manage-rights-section">
                  ${this._renderRight('manageOrganisations')} ${this._renderRight('manageOrganisationsApplications')}
                  ${this._renderRight('manageOrganisationsMembers')} ${this._renderRight('manageOrganisationsServices')}
                  ${this._renderRight('managePersonalInformation')} ${this._renderRight('manageSshKeys')}
                </div>
              </fieldset>
            </div>
          </fieldset>
        </cc-block-section>
        <div class="oauth-form-buttons">
          ${this.state.type === 'idle-create' || this.state.type === 'creating'
            ? html`
                <cc-button danger outlined type="reset" ?disabled=${isWaiting}
                  >${i18n('cc-oauth-consumer-form.button.cancel')}</cc-button
                >
                <cc-button primary type="submit" ?waiting="${this.state.type === 'creating'}"
                  >${i18n('cc-oauth-consumer-form.button.create')}</cc-button
                >
              `
            : ''}
          ${this.state.type === 'idle-update' ||
          this.state.type === 'updating' ||
          this.state.type === 'deleting' ||
          this.state.type === 'loading'
            ? html`
                <cc-button
                  simple
                  outlined
                  type="reset"
                  ?disabled=${isWaiting || this.state.type === 'deleting'}
                  ?skeleton=${isLoading}
                  >${i18n('cc-oauth-consumer-form.button.reset')}</cc-button
                >
                <cc-button
                  primary
                  type="submit"
                  ?disabled=${this.state.type !== 'updating' && this.state.type === 'deleting'}
                  ?waiting="${this.state.type === 'updating'}"
                  ?skeleton=${isLoading}
                  >${i18n('cc-oauth-consumer-form.button.update')}</cc-button
                >
              `
            : ''}
        </div>
      </form>
    `;
  }

  /** @param {OauthConsumer} oauthConsumer */
  _renderDangerZone(oauthConsumer) {
    const isWaiting =
      this.state.type === 'creating' || this.state.type === 'updating' || this.state.type === 'deleting';
    return html`
      <cc-block class="danger-zone-block">
        <div slot="header-title" class="danger-title">Danger Zone</div>
        <div slot="content">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium, assumenda beatae cumque eaque eos
          error eveniet id illum iure laboriosam maxime natus nisi obcaecati pariatur possimus reprehenderit sint
          tempora.
        </div>
        <cc-button
          slot="footer"
          class="danger-button"
          danger
          outlined
          type="submit"
          ?disabled=${(isWaiting && this.state.type !== 'deleting') || this.state.type === 'loading'}
          ?waiting="${this.state.type === 'deleting'}"
          @cc-button:click=${() => this._onDeleteOauthConsumer(oauthConsumer)}
          >${i18n('cc-oauth-consumer-form.button.delete')}</cc-button
        >
      </cc-block>
    `;
  }

  /**
   * @param {keyof OauthConsumerRights} rightName
   */
  _renderRight(rightName) {
    const isWaiting =
      this.state.type === 'creating' || this.state.type === 'updating' || this.state.type === 'deleting';
    const isLoading = this.state.type === 'loading';

    const isChecked =
      (this.state.type === 'idle-update' ||
        this.state.type === 'updating' ||
        this.state.type === 'creating' ||
        this.state.type === 'deleting') &&
      this.state.rights?.[rightName] === true;

    return html`
      <div>
        <input
          type="checkbox"
          id="checkbox-right-${rightName}"
          class="right"
          name="${rightName}"
          ?disabled=${isWaiting || isLoading}
          .checked="${isChecked}"
          .value="${rightName}"
        />
        <label for="checkbox-right-${rightName}">${this._getName(rightName)}</label>
      </div>
    `;
  }

  static get styles() {
    return [
      linkStyles,
      accessibilityStyles,
      // language=CSS
      css`
        /* region global */

        :host {
          display: block;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .oauth-form {
          margin-inline: 5em;
        }

        .title {
          padding-left: 7.4em;
        }

        /* region information */

        .info-block {
          padding-left: 4em;
        }

        /* region authorisation */

        .auth-block {
          padding-left: 3.2em;
        }

        .options-container {
          border: none;
        }

        .checkbox-container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        #access-options-container,
        #manage-options-container {
          border: none;
          display: flex;
          flex-direction: column;
        }

        .error-message {
          color: var(--cc-color-text-danger);
          margin: 0.5em 0 0;
        }

        .select-all-option {
          margin-bottom: 0.2em;
        }

        .access-rights-section,
        .manage-rights-section {
          display: flex;
          flex-direction: column;
          gap: 0.2em;
          margin-left: 1em;
        }

        .manage-options {
          margin-left: 1em;
        }

        .oauth-form-buttons {
          display: flex;
          flex-direction: row;
          gap: 0.5em;
          justify-content: end;
          margin-top: 1em;
        }

        /* region danger zone */

        .danger-zone-block {
          border-color: var(--cc-color-border-danger);
        }

        .danger-title {
          color: var(--cc-color-text-danger);
        }

        .danger-button {
          margin-left: auto;
        }
      `,
    ];
  }
}

window.customElements.define('cc-oauth-consumer-form', CcOauthConsumerForm);
