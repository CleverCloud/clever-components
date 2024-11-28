import { css, html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../lib/events.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';

/**
 * @typedef {import('./cc-oauth-consumer-form.types.js').OAuthConsumerFormState} OAuthConsumerFormState
 * @typedef {import('./cc-oauth-consumer-form.types.js').OAuthConsumerFormStateDeleting} OAuthConsumerFormStateDeleting
 * @typedef {import('./cc-oauth-consumer-form.types.js').NewOauthConsumer} NewOauthConsumer
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLInputElement|HTMLTextAreaElement>} HTMLInputOrTextareaEvent
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 */

/**
 * @fires {CustomEvent<NewOauthConsumer>} cc-oauth-consumer-form:create - Fires when clicking the creation form submit button.
 * @fires {CustomEvent<NewOauthConsumer>} cc-oauth-consumer-form:update - Fires when clicking the update form submit button.
 * @fires {CustomEvent<OAuthConsumerFormStateDeleting>} cc-oauth-consumer-form:delete - Fires whenever the delete button is clicked.
 */
export class CcOauthConsumerForm extends LitElement {
  static get properties() {
    return {
      oauthConsumerFormState: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();

    /** @type {OAuthConsumerFormState} Sets the state of the component. */
    this.oauthConsumerFormState = { type: 'idle-create' };
  }

  // TODO: handle submit of the 2 forms
  _handleSubmit() {}

  /**
   * @param {FormData} formData
   */
  /*  _onCreateOauthConsumer(formData) {
    if (typeof formData.name === 'string' && typeof formData.publicKey === 'string') {
      const newOauthConsumer = {
        name: formData.name,
        homePageUrl: formData.homePageUrl,
        appBaseUrl: formData.appBaseUrl,
        description: formData.description,
        image: formData.image,
        options: formData.options,
      };
      dispatchEvent(this, 'create', newOauthConsumer);
    }
  } */
  /**
   * @param {HTMLInputOrTextareaEvent} e
   */
  _selectAllAccessCheckboxes(e) {
    const selectAllCheckbox = e.target;
    const checkboxes = this.shadowRoot.querySelectorAll('.access-checkboxes');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
    // for (let i = 0; i < checkboxes.length; i++) {
    //   checkboxes[i].checked = true;
    // }
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
    // TODO: fix to switch between 'idle-create' and 'idle-update'
    this.oauthConsumerFormState = {
      type: 'idle-create',
      values: data,
    };
    if (this.oauthConsumerFormState.type === 'idle-create') {
      dispatchCustomEvent(this, 'create', data);
    }
    if (this.oauthConsumerFormState.type === 'idle-update') {
      dispatchCustomEvent(this, 'update', data);
    }
  }

  /** @param {OAuthConsumerFormStateDeleting} oauthConsumer */
  _onDeleteOauthConsumer(oauthConsumer) {
    dispatchCustomEvent(this, 'delete', oauthConsumer);
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
        this.oauthConsumerFormState.type === 'deleting'
          ? html`${this._renderDangerZone()}`
          : ''}
      </div>
    `;
  }

  _renderOauthConsumerForm() {
    const isWaiting =
      this.oauthConsumerFormState.type === 'creating' ||
      this.oauthConsumerFormState.type === 'updating' ||
      this.oauthConsumerFormState.type === 'deleting';
    const isLoading = this.oauthConsumerFormState.type === 'loading';

    return html`
      <form slot="content" class="oauth-form" ${formSubmit(this._onFormSubmit.bind(this))}>
        <cc-block-section class="info-block">
          <div slot="title">Informations</div>

          <cc-input-text
            name="name"
            label="Name"
            required
            placeholder="No value yet..."
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.values?.name}
          ></cc-input-text>
          <cc-input-text
            name="homePageUrl"
            label="Home page url"
            required
            placeholder="No value yet..."
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.values?.homePageUrl}
          ></cc-input-text>
          <cc-input-text
            name="appBaseUrl"
            label="App base url"
            required
            placeholder="No value yet..."
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.values?.appBaseUrl}
          ></cc-input-text>
          <cc-input-text
            name="description"
            label="Description"
            required
            placeholder="No value yet..."
            multi
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.values?.description}
          ></cc-input-text>
          <cc-input-text
            name="image"
            label="Image"
            required
            placeholder="No value yet..."
            ?readonly=${isWaiting}
            ?skeleton=${isLoading}
            .value=${this.oauthConsumerFormState?.values?.image}
          ></cc-input-text>
        </cc-block-section>

        <cc-block-section class="auth-block">
          <div slot="title">Authorisations</div>

          <div class="options-container">
            <div id="access-options-container">
              <div class="select-all-option">
                <input
                  id="select-all-access"
                  type="checkbox"
                  name="access"
                  @click=${this._selectAllAccessCheckboxes}
                  ?disabled=${isWaiting}
                />
                <label for="select-all-access">Access all</label>
              </div>
              <div class="access-options">
                <div>
                  <input
                    type="checkbox"
                    id="option-access-credit"
                    class="access-checkboxes"
                    name="access-credit"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-access-credit">Access my organizations' credit count</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="option-access-organizations"
                    class="access-checkboxes"
                    name="access-organizations"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-access-organizations">Access my organizations</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="option-access-information"
                    class="access-checkboxes"
                    name="access-information"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-access-information">Access my personal information</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="option-access-consumption"
                    class="access-checkboxes"
                    name="access-consumption"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-access-consumption">Access my organizations' consumption statistics</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="access-bills"
                    class="access-checkboxes"
                    name="access-bills"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-access-bills">Access my organizations' bills</label>
                </div>
              </div>
            </div>
            <div id="manage-options-container">
              <div class="select-all-option">
                <input
                  id="select-all-manage"
                  type="checkbox"
                  name="manage"
                  @click=${this._selectAllManageCheckboxes}
                  ?disabled=${isWaiting}
                />
                <label for="select-all-manage">Manage all</label>
              </div>
              <div class="manage-options">
                <div>
                  <input
                    type="checkbox"
                    id="option-manage-organizations"
                    class="manage-checkboxes"
                    name="manage-organizations"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-manage-organizations">Manage my organizations</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="option-change-password"
                    class="manage-checkboxes"
                    name="change-password"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-change-password">Change my password</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="option-manage-applications"
                    class="manage-checkboxes"
                    name="manage-applications"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-manage-applications">Manage my organizations' applications</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="option-manage-informations"
                    class="manage-checkboxes"
                    name="manage-informations"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-manage-informations">Manage my personal informations</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="option-manage-members"
                    class="manage-checkboxes"
                    name="manage-members"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-manage-members">Manage my organizations' members</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="option-manage-ssh-keys"
                    class="manage-checkboxes"
                    name="manage-ssh-keys"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-manage-ssh-keys">Manage my ssh keys</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="option-manage-add-ons"
                    class="manage-checkboxes"
                    name="manage-add-ons"
                    ?disabled=${isWaiting}
                  />
                  <label for="option-manage-add-ons">Manage my organizations' add-ons</label>
                </div>
              </div>
            </div>
          </div>
        </cc-block-section>
        <div class="oauth-form-buttons">
          ${this.oauthConsumerFormState.type === 'idle-create' || this.oauthConsumerFormState.type === 'creating'
            ? html`
                <cc-button danger outlined type="reset" ?waiting=${isWaiting}>Cancel</cc-button>
                <cc-button primary type="submit" ?waiting="${isWaiting}">Create</cc-button>
              `
            : ''}
          ${this.oauthConsumerFormState.type === 'idle-update' ||
          this.oauthConsumerFormState.type === 'updating' ||
          this.oauthConsumerFormState.type === 'deleting'
            ? html`
                <cc-button simple outlined type="reset" ?waiting=${isWaiting}>Reset Change</cc-button>
                <cc-button primary type="submit" ?waiting="${isWaiting}">Update</cc-button>
              `
            : ''}
        </div>
      </form>
    `;
  }

  /**
   * @param {NewOauthConsumer} oauthConsumer
   */
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
          ?waiting=${isWaiting}
          @cc-button:click=${() => this._onDeleteOauthConsumer(oauthConsumer)}
          >Delete</cc-button
        >
      </cc-block>
    `;
  }

  static get styles() {
    return [
      linkStyles,
      // language=CSS
      css`
        /* region global */

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

        #access-options-container {
          display: flex;
          flex-direction: column;
        }

        #manage-options {
          display: flex;
          flex-direction: column;
        }

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
