import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';
import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  iconRemixAddCircleFill as iconAdd,
  iconRemixDeleteBin_5Fill as iconBin,
  iconRemixKey_2Fill as iconKey,
} from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n.js';
import { sortBy } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const SKELETON_KEYS = [{
  state: 'idle',
  name: fakeString(15),
  fingerprint: fakeString(32),
}];

/**
 * @typedef {import('./cc-ssh-key-list.types.js').CreateSshKeyFormState} CreateSshKeyFormState
 * @typedef {import('./cc-ssh-key-list.types.js').KeyDataState} KeyDataState
 * @typedef {import('./cc-ssh-key-list.types.js').NewKey} NewKey
 * @typedef {import('./cc-ssh-key-list.types.js').SshKey} SshKey
 */

/**
 * A component that displays a list of SSH keys associated with your account and allows to add new ones.
 *
 * ## Details
 *
 * * The component displays a form to associate a new SSH key with your account.
 * * Then displays the list of personal keys currently associated with your account.
 * * Finally, displays the list of keys available from GitHub that you can associate with your account.
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<NewKey>} cc-ssh-key-list:create - Fires when clicking the creation form submit button.
 * @fires {CustomEvent<SshKey>} cc-ssh-key-list:delete - Fires when clicking a personal key deletion button.
 * @fires {CustomEvent<SshKey>} cc-ssh-key-list:import - Fires when clicking a GitHub key import button.
 */
export class CcSshKeyList extends LitElement {

  static get properties () {
    return {
      createSshKeyForm: { type: Object, attribute: 'create-ssh-key-form' },
      keyData: { type: Object, attribute: 'key-data' },
    };
  }

  static get CREATE_FORM_INIT_STATE () {
    return {
      state: 'idle',
      name: {
        value: '',
      },
      publicKey: {
        value: '',
      },
    };
  }

  constructor () {
    super();

    /** @type {CreateSshKeyFormState} creation form state */
    this.createSshKeyForm = CcSshKeyList.CREATE_FORM_INIT_STATE;

    /** @type {KeyDataState} personal and GitHub lists of registered SSH keys. */
    this.keyData = { state: 'loading' };

    /** @type {Ref<CcInputText>} */
    this._createFormNameRef = createRef();

    /** @type {Ref<CcInputText>} */
    this._createFormPublicKeyRef = createRef();

    new LostFocusController(this, '.key--personal', ({ suggestedElement }) => {
      if (suggestedElement == null) {
        this.shadowRoot.querySelector('#personal-keys-empty-msg')?.focus();
      }
      else {
        suggestedElement?.querySelector('cc-button').focus();
      }
    });
    new LostFocusController(this, '.key--github', ({ removedElement, suggestedElement }) => {
      if (suggestedElement == null) {
        this.shadowRoot.querySelector('#github-keys-empty-msg')?.focus();
      }
      else {
        suggestedElement?.querySelector('cc-button').focus();
      }
    });
  }

  _onCreateKey () {
    const rawName = this._createFormNameRef.value.value;
    const rawPublicKey = this._createFormPublicKeyRef.value.value;

    // removing trailing whitespaces
    const name = rawName.trim();
    const publicKey = rawPublicKey.trim();

    // looking for potential form errors
    const isNameFilled = name?.length > 0;
    const isPublicKeyFilled = publicKey?.length > 0;

    const mailError = isNameFilled ? null : 'required';
    let publicKeyError = isPublicKeyFilled ? null : 'required';

    const isPublicKeyPrivate = isPublicKeyFilled && rawPublicKey.toLowerCase().match(' private ');
    if (isPublicKeyPrivate) {
      publicKeyError = 'private-key';
    }

    // updating the model
    this.createSshKeyForm = {
      state: 'idle',
      name: {
        value: name,
        error: mailError,
      },
      publicKey: {
        value: publicKey,
        error: publicKeyError,
      },
    };

    const hasFormErrors = !isNameFilled || !isPublicKeyFilled || isPublicKeyPrivate;
    if (hasFormErrors) {
      // auto focus input on error
      if (this.createSshKeyForm.name.error != null) {
        this._createFormNameRef.value.focus();
      }
      else if (this.createSshKeyForm.publicKey.error != null) {
        this._createFormPublicKeyRef.value.focus();
      }
    }
    else {
      // trigger key creation if client form validation is successful
      /** @type {NewKey} */
      const newKey = { name, publicKey };
      dispatchCustomEvent(this, 'create', newKey);
    }
  }

  /** @param {SshKeyState} sshKeyState */
  _onDeleteKey (sshKeyState) {
    // removing state property that belongs to internal component implementation
    const { state, ...sshKey } = sshKeyState;
    dispatchCustomEvent(this, 'delete', sshKey);
  }

  /** @param {SshKeyState} sshKeyState */
  _onImportKey (sshKeyState) {
    // removing state property that belongs to internal component implementation
    const { state, ...sshKey } = sshKeyState;
    dispatchCustomEvent(this, 'import', sshKey);
  }

  _onNameInput ({ detail: name }) {
    this.createSshKeyForm = {
      ...this.createSshKeyForm,
      name: {
        ...this.createSshKeyForm.name,
        value: name,
      },
    };
  }

  _onPublicKeyInput ({ detail: publicKey }) {
    this.createSshKeyForm = {
      ...this.createSshKeyForm,
      publicKey: {
        ...this.createSshKeyForm.publicKey,
        value: publicKey,
      },
    };
  }

  render () {
    const state = this.keyData.state;

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-ssh-key-list.title')}</div>

        <!-- creation form -->
        <cc-block-section>
          <div slot="title">${i18n('cc-ssh-key-list.add.title')}</div>
          <div slot="info">${i18n('cc-ssh-key-list.add.info')}</div>

          ${this._renderCreateSshKeyForm()}
        </cc-block-section>

        <!-- personal keys -->
        <cc-block-section>
          <div slot="title">
            <span>${i18n('cc-ssh-key-list.personal.title')}</span>
            ${state === 'loaded' && this.keyData.personalKeys.length > 2 ? html`
              <cc-badge circle>${this.keyData.personalKeys.length}</cc-badge>
            ` : ''}
          </div>
          <div slot="info">${i18n('cc-ssh-key-list.personal.info')}</div>

          ${state === 'loading' ? html`
            ${this._renderKeyList('skeleton', SKELETON_KEYS)}
          ` : ''}

          ${state === 'loaded' ? html`
            ${this.keyData.personalKeys.length === 0 ? html`
              <p class="info-msg" id="personal-keys-empty-msg" tabindex="-1">${i18n('cc-ssh-key-list.personal.empty')}</p>
            ` : ''}
            ${this._renderKeyList('personal', this.keyData.personalKeys)}
          ` : ''}

          ${state === 'error' ? html`
            <cc-notice intent="warning" message="${i18n('cc-ssh-key-list.error.loading')}"></cc-notice>
          ` : ''}
        </cc-block-section>

        <!-- GitHub keys -->
        <cc-block-section>
          <div slot="title">
            <span>${i18n('cc-ssh-key-list.github.title')}</span>
            ${state === 'loaded' && this.keyData.isGithubLinked && this.keyData.githubKeys.length > 2 ? html`
              <cc-badge circle>${this.keyData.githubKeys.length}</cc-badge>
            ` : ''}
          </div>
          <div slot="info">${i18n('cc-ssh-key-list.github.info')}</div>

          ${state === 'loading' ? html`
            ${this._renderKeyList('skeleton', SKELETON_KEYS)}
          ` : ''}

          ${state === 'loaded' && !this.keyData.isGithubLinked ? html`
            <p class="info-msg">${i18n('cc-ssh-key-list.github.unlinked')}</p>
          ` : ''}

          ${state === 'loaded' && this.keyData.isGithubLinked ? html`
            ${this.keyData.githubKeys.length === 0 ? html`
              <p class="info-msg" id="github-keys-empty-msg" tabindex="-1">${i18n('cc-ssh-key-list.github.empty')}</p>
            ` : ''}
            ${this._renderKeyList('github', this.keyData.githubKeys)}
          ` : ''}

          ${state === 'error' ? html`
            <cc-notice intent="warning" message="${i18n('cc-ssh-key-list.error.loading')}"></cc-notice>
          ` : ''}
        </cc-block-section>

        <!-- documentation link -->
        <cc-block-section>
          <div class="align-end">
            ${i18n('cc-ssh-key-list.doc.info')}
          </div>
        </cc-block-section>
      </cc-block>
    `;
  }

  _renderCreateSshKeyForm () {

    return html`
      <div class="create-form">
        <cc-input-text
          ?disabled=${this.createSshKeyForm.state === 'creating'}
          @cc-input-text:input=${this._onNameInput}
          @cc-input-text:requestimplicitsubmit=${this._onCreateKey}
          .value="${this.createSshKeyForm.name?.value}"
          class="create-form__name"
          label=${i18n('cc-ssh-key-list.add.name')}
          required
          ${ref(this._createFormNameRef)}
        >
          ${this.createSshKeyForm.name.error === 'required' ? html`
            <p slot="error">${i18n('cc-ssh-key-list.error.required.name')}</p>
          ` : ''}
        </cc-input-text>
        <cc-input-text
          ?disabled=${this.createSshKeyForm.state === 'creating'}
          @cc-input-text:input=${this._onPublicKeyInput}
          @cc-input-text:requestimplicitsubmit=${this._onCreateKey}
          .value="${this.createSshKeyForm.publicKey?.value}"
          class="create-form__public-key"
          label=${i18n('cc-ssh-key-list.add.public-key')}
          required
          ${ref(this._createFormPublicKeyRef)}
        >
          ${this.createSshKeyForm.publicKey.error === 'required' ? html`
            <p slot="error">${i18n('cc-ssh-key-list.error.required.public-key')}</p>
          ` : ''}
          ${this.createSshKeyForm.publicKey.error === 'private-key' ? html`
            <p slot="error">${i18n('cc-ssh-key-list.error.private-key')}</p>
          ` : ''}
        </cc-input-text>
        <div class="create-form__footer">
          <cc-button
            @cc-button:click=${this._onCreateKey}
            class="create-form__add-btn"
            primary
            ?waiting=${this.createSshKeyForm.state === 'creating'}
          >
            ${i18n('cc-ssh-key-list.add.btn')}
          </cc-button>
        </div>
      </div>
    `;
  }

  /**
   * @param {"personal"|"github"|"skeleton"} type
   * @param {SshKeyState[]} keys
   */
  _renderKeyList (type, keys) {
    const sortedKeys = [...keys].sort(sortBy('name'));
    const skeleton = (type === 'skeleton');
    return html`
      <div class="key-list">

        ${repeat(sortedKeys, (key) => key.name, (key) => {
          const name = key.name;
          const isDisabled = !skeleton && key.state !== 'idle';
          const classes = {
            'key--personal': type === 'personal',
            'key--github': type === 'github',
            'key--skeleton': skeleton,
            'is-disabled': isDisabled,
          };

          return html`
            <div class="key ${classMap(classes)}">
              <div class="key__icon">
                <cc-icon .icon="${iconKey}" size="lg" ?skeleton=${skeleton}></cc-icon>
              </div>
              <div class="key__name">
                <span class=${classMap({ skeleton })}>${(name)}</span>
              </div>
              <div class="key__form">
                <div class="key__fingerprint ${classMap({ skeleton })}">${(key.fingerprint)}</div>

                ${type === 'personal' ? html`
                  <cc-button
                    @cc-button:click=${() => this._onDeleteKey(key)}
                    a11y-name="${i18n('cc-ssh-key-list.personal.delete.a11y', { name })}"
                    class="key__button key__button--personal"
                    .icon="${iconBin}"
                    ?disabled=${isDisabled}
                    danger
                    outlined
                    ?waiting=${isDisabled}>
                    ${i18n('cc-ssh-key-list.personal.delete')}
                  </cc-button>
                ` : ''}

                ${type === 'github' ? html`
                  <cc-button
                    @cc-button:click=${() => this._onImportKey(key)}
                    a11y-name="${i18n('cc-ssh-key-list.github.import.a11y', { name })}"
                    class="key__button key__button--github"
                    .icon="${iconAdd}"
                    ?disabled=${isDisabled}
                    ?waiting=${isDisabled}>
                    ${i18n('cc-ssh-key-list.github.import')}
                  </cc-button>
                ` : ''}

                ${type === 'skeleton' ? html`
                  <cc-button
                    class="key__button key__button--skeleton"
                    .icon="${iconAdd}"
                    skeleton
                  >
                    ${fakeString(10)}
                  </cc-button>
                ` : ''}

              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        /* region global */

        :host {
          --skeleton-color: #bbb;

          display: block;
        }
        /* endregion */

        /* region creation form */

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
        
        .create-form__public-key {
          --cc-input-font-family: var(--cc-ff-monospace);
        }

        .create-form__footer {
          margin-inline-start: auto;
        }
        /* endregion */

        /* region key list */

        .key-list {
          display: flex;
          flex-direction: column;
          gap: 2.5em;
        }
        /* endregion */

        /* region key item */

        .key {
          display: grid;
          gap: 0.5em 0.75em;
          grid-template-areas: 
            'key-icon key-name'
            '. key-form';
          grid-template-columns: min-content 1fr;
        }

        .key.is-disabled {
          cursor: default;
          opacity: var(--cc-opacity-when-disabled);
        }

        .key__icon {
          grid-area: key-icon;
        }

        .key__name {
          align-self: flex-end;
          font-size: 1.125em;
          font-weight: bold;
          grid-area: key-name;
          word-break: break-word;
        }

        .key__form {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 1em;
          grid-area: key-form;
        }

        /* TODO tokenize border & border-color */

        .key__fingerprint {
          flex-basis: min(100%, 21.25em);
          flex-grow: 1;
          padding: 0.5em 0.75em;
          background-color: var(--cc-color-bg-neutral);
          border-inline-start: 5px solid #a6a6a6;
          border-radius: 0.125em;
          font-family: var(--cc-ff-monospace);
          line-height: 1.5;
          word-break: break-word;
        }

        .key__button--personal {
          --cc-icon-size: 18px;
        }

        .key__button--github {
          --cc-icon-size: 20px;
        }

        .key__button--skeleton {
          --cc-icon-size: 20px;
        }
        /* endregion */

        /* region misc */
        /* TODO tokenize border & border-color */

        [slot='info'] code {
          display: inline-block;
          padding: 0.25em 0.75em;
          border: 1px solid var(--cc-color-border-neutral-weak, #eee);
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
          font-size: 0.9em;
          line-height: 2;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .key--skeleton .skeleton {
          background-color: var(--skeleton-color);
        }

        .info-msg {
          margin-top: 1em;
          margin-bottom: 0;
          color: var(--cc-color-text-weak);
          font-style: italic;
          line-height: 1.5;
        }

        .align-end {
          text-align: end;
        }
        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-ssh-key-list', CcSshKeyList);
