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
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerRight} OauthConsumerRight
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLInputElement|HTMLTextAreaElement>} HTMLInputOrTextareaEvent
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 * @typedef {import('../../lib/form/validation.types.js').Validity} Validity
 */

const OAUTH_CONSUMER_RIGHTS = [
  { name: 'access_organisations', label: 'access_organisations', section: 'access' },
  { name: 'access_organisations_bills', label: 'access_organisations_bills', section: 'access' },
  {
    name: 'access_organisations_consumption_statistics',
    label: 'access_organisations_consumption_statistics',
    section: 'access',
  },
  {
    name: 'access_organisations_credit_count',
    label: 'access_organisations_credit_count',
    section: 'access',
  },
  { name: 'access_personal_information', label: 'access_personal_information', section: 'access' },
  { name: 'manage_organisations', label: 'manage_organisations', section: 'manage' },
  {
    name: 'manage_organisations_applications',
    label: 'manage_organisations_applications',
    section: 'manage',
  },
  { name: 'manage_organisations_members', label: 'manage_organisations_members', section: 'manage' },
  { name: 'manage_organisations_services', label: 'manage_organisations_services', section: 'manage' },
  { name: 'manage_personal_information', label: 'manage_personal_information', section: 'manage' },
  { name: 'manage_ssh_keys', label: 'manage_ssh_keys', section: 'manage' },
];

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
      oauthConsumerFormState: { type: Object, attribute: false },
      _hasCheckboxGroupError: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {OAuthConsumerFormState} Sets the state of the component. */
    this.oauthConsumerFormState = { type: 'idle-create' };

    /** @type {HTMLFormElementRef} */
    this._formRef = createRef();

    this._customErrorMessages = { invalidUrl: i18n('cc-oauth-consumer-form.url.error.message') };

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
    const checkboxes = this.shadowRoot.querySelectorAll('.access-checkboxes');
    /** @type  */
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  }

  /**
   * @param {HTMLInputOrTextareaEvent} e
   */
  _selectAllManageCheckboxes(e) {
    const selectAllCheckbox = e.target;
    const checkboxes = this.shadowRoot.querySelectorAll('.manage-checkboxes');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  }

  /**
   * @param {FormDataMap} data
   */
  _onFormSubmit(data) {
    this._hasCheckboxGroupError = false;
    const oauthConsumer = {
      name: data.name,
      homePageUrl: data.homePageUrl,
      appBaseUrl: data.appBaseUrl,
      description: data.description,
      image: data.image,
      rights: Object.fromEntries(
        OAUTH_CONSUMER_RIGHTS.map((right) => {
          return [right.name, data?.manage?.includes(right.name) || data?.access?.includes(right.name)];
        }),
      ),
    };

    if (this.oauthConsumerFormState.type === 'idle-create') {
      this.oauthConsumerFormState = {
        type: 'idle-create',
        ...oauthConsumer,
      };
      dispatchCustomEvent(this, 'create', oauthConsumer);
    }
    if (this.oauthConsumerFormState.type === 'idle-update') {
      this.oauthConsumerFormState = {
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
    console.log(data);
    if (data.access == null && data.manage == null) {
      console.log('erreur');
      const selection1 = this.shadowRoot.querySelector('#access-options-container input[type="checkbox"][name]');
      const selection2 = this.shadowRoot.querySelector('#manage-options-container input[type="checkbox"][name]');

      selection1.setCustomValidity('error');
      selection2.setCustomValidity('error');
    } else {
      const selection1 = this.shadowRoot.querySelector('#access-options-container input[type="checkbox"][name]');
      const selection2 = this.shadowRoot.querySelector('#manage-options-container input[type="checkbox"][name]');

      selection1.setCustomValidity('');
      selection2.setCustomValidity('');

      console.log('ok');
    }
  }

  _onFormInvalid(validationResult) {
    console.log(validationResult);

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
   * @param {string} label
   * @param {string} name
   * @returns {string|null}
   */
  _getLabel(label, name) {
    switch (label) {
      case 'access':
        return 'access-${right.name}';
      case 'manage':
        return 'manage-${right.name}';
    }
  }

  render() {
    if (this.oauthConsumerFormState.type === 'error') {
      return html` <cc-notice slot="content" intent="warning" message="error"></cc-notice> `;
    }

    return html`
      <div class="wrapper">
        <cc-block>
          <div slot="header-title">New oAuth Consumer</div>

          ${this._renderOauthConsumerForm()}
        </cc-block>

        ${this.oauthConsumerFormState.type === 'idle-update' ||
        this.oauthConsumerFormState.type === 'updating' ||
        this.oauthConsumerFormState.type === 'deleting' ||
        this.oauthConsumerFormState.type === 'loading'
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
      this.oauthConsumerFormState.type === 'creating' ||
      this.oauthConsumerFormState.type === 'updating' ||
      this.oauthConsumerFormState.type === 'deleting';
    const isLoading = this.oauthConsumerFormState.type === 'loading';

    return html`
      <form
        slot="content"
        class="oauth-form"
        ${formSubmit(this._onFormSubmit.bind(this), this._onFormInvalid.bind(this))}
        ${ref(this._formRef)}
      >
        <cc-block-section class="info-block">
          <div slot="title">Informations</div>

          <cc-input-text
            name="name"
            label="Name"
            required
            placeholder="No value yet..."
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.name}
          ></cc-input-text>
          <cc-input-text
            name="homePageUrl"
            label="Home page url"
            required
            placeholder="No value yet..."
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.homePageUrl}
            .customValidator=${URL_VALIDATOR}
            .customErrorMessages=${this._customErrorMessages}
          ></cc-input-text>
          <cc-input-text
            name="appBaseUrl"
            label="App base url"
            required
            placeholder="No value yet..."
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.appBaseUrl}
            .customValidator=${URL_VALIDATOR}
            .customErrorMessages=${this._customErrorMessages}
          ></cc-input-text>
          <cc-input-text
            name="description"
            label="Description"
            required
            placeholder="No value yet..."
            multi
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.description}
          ></cc-input-text>
          <cc-input-text
            name="image"
            label="Image"
            required
            placeholder="No value yet..."
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.image}
            .customValidator=${URL_VALIDATOR}
            .customErrorMessages=${this._customErrorMessages}
          ></cc-input-text>
        </cc-block-section>

        <cc-block-section class="auth-block">
          <fieldset tabindex="-1" class="options-container">
            <legend slot="title">Authorisations</legend>
            <div class="error-message">${this._hasCheckboxGroupError ? 'erreur' : ''}</div>

            <fieldset id="access-options-container" @input="${this._validateCheckboxGroup}">
              <legend class="visually-hidden">Access</legend>
              <div class="select-all-option">
                <input
                  id="select-all-access"
                  type="checkbox"
                  ?disabled=${isWaiting || isLoading}
                  @click=${this._selectAllAccessCheckboxes}
                />
                <label for="select-all-access">Access all</label>
              </div>
              <div class="access-options">${this._renderRightsSection('access')}</div>
            </fieldset>
            <fieldset id="manage-options-container">
              <legend class="visually-hidden">Manage</legend>
              <div class="select-all-option">
                <input
                  id="select-all-manage"
                  type="checkbox"
                  ?disabled=${isWaiting || isLoading}
                  @click=${this._selectAllManageCheckboxes}
                />
                <label for="select-all-manage">Manage all</label>
              </div>
              <div class="manage-options">${this._renderRightsSection('manage')}</div>
            </fieldset>
          </fieldset>
        </cc-block-section>
        <div class="oauth-form-buttons">
          ${this.oauthConsumerFormState.type === 'idle-create' || this.oauthConsumerFormState.type === 'creating'
            ? html`
                <cc-button danger outlined type="reset" ?disabled=${isWaiting}>Cancel</cc-button>
                <cc-button primary type="submit" ?waiting="${this.oauthConsumerFormState.type === 'creating'}"
                  >Create</cc-button
                >
              `
            : ''}
          ${this.oauthConsumerFormState.type === 'idle-update' ||
          this.oauthConsumerFormState.type === 'updating' ||
          this.oauthConsumerFormState.type === 'deleting' ||
          this.oauthConsumerFormState.type === 'loading'
            ? html`
                <cc-button
                  simple
                  outlined
                  type="reset"
                  ?disabled=${isWaiting || this.oauthConsumerFormState.type === 'deleting'}
                  ?skeleton=${isLoading}
                  >Reset Change</cc-button
                >
                <cc-button
                  primary
                  type="submit"
                  ?disabled=${this.oauthConsumerFormState.type !== 'updating' &&
                  this.oauthConsumerFormState.type === 'deleting'}
                  ?waiting="${this.oauthConsumerFormState.type === 'updating'}"
                  ?skeleton=${isLoading}
                  >Update</cc-button
                >
              `
            : ''}
        </div>
      </form>
    `;
  }

  _renderDangerZone(oauthConsumer) {
    const isWaiting =
      this.oauthConsumerFormState.type === 'creating' ||
      this.oauthConsumerFormState.type === 'updating' ||
      this.oauthConsumerFormState.type === 'deleting';
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
          ?disabled=${(isWaiting && this.oauthConsumerFormState.type !== 'deleting') ||
          this.oauthConsumerFormState.type === 'loading'}
          ?waiting="${this.oauthConsumerFormState.type === 'deleting'}"
          @cc-button:click=${() => this._onDeleteOauthConsumer(oauthConsumer)}
          >Delete</cc-button
        >
      </cc-block>
    `;
  }

  /**
   * @param {'access' | 'manage'} section
   */
  _renderRightsSection(section) {
    const isWaiting =
      this.oauthConsumerFormState.type === 'creating' ||
      this.oauthConsumerFormState.type === 'updating' ||
      this.oauthConsumerFormState.type === 'deleting';
    const isLoading = this.oauthConsumerFormState.type === 'loading';
    const isUpdateMode =
      this.oauthConsumerFormState.type === 'idle-update' ||
      this.oauthConsumerFormState.type === 'updating' ||
      this.oauthConsumerFormState.type === 'deleting' ||
      this.oauthConsumerFormState.type === 'loading';

    return OAUTH_CONSUMER_RIGHTS.filter((right) => {
      return right.section === section;
    }).map((right) => {
      const isChecked =
        isUpdateMode &&
        (this.oauthConsumerFormState?.rights?.find((stateRight) => stateRight.name === right.name)?.isEnabled ?? false);
      return html`
        <div>
          <input
            type="checkbox"
            id="checkbox-right-${right.name}"
            class="${section}-checkboxes"
            name="${section}"
            ?disabled=${isWaiting || isLoading}
            .checked="${isChecked}"
            .value="${right.name}"
          />
          <!-- TODO: getLabel with switch (see cc-domain-management getErrorMessage)  -->
          <label for="checkbox-right-${right.name}">${right.label}</label>
        </div>
      `;
    });
  }

  static get styles() {
    return [
      linkStyles,
      accessibilityStyles,
      // language=CSS
      css`
        /* region global */

        /* :invalid {
          border: solid 2px red;
        } */

        :host {
          display: block;
          /* margin-inline: auto; */
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .oauth-form {
          margin-inline: 5em;
        }

        /* region information */

        .info-block {
          padding-inline: 5em;
        }

        /* region authorisation */

        .auth-block {
          padding-inline: 5em;
        }

        .options-container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 2em;
          justify-content: start;
        }

        .options-container > div {
          display: flex;
          flex-direction: column;
        }

        /* #access-options-container { */
        /*  display: flex; */
        /*  flex-direction: column; */
        /* } */

        /* #manage-options { */
        /*  display: flex; */
        /*  flex-direction: column; */
        /* } */

        .select-all-option {
        }

        .access-options {
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
