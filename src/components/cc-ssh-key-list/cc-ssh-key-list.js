import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  iconRemixAddCircleFill as iconAdd,
  iconRemixDeleteBin_5Fill as iconBin,
  iconRemixInformationFill as iconInfo,
  iconRemixKey_2Fill as iconKey,
} from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { focusBySelector } from '../../lib/focus-helper.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { Validation } from '../../lib/form/validation.js';
import { sortBy } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';
import { CcSshKeyCreateEvent, CcSshKeyDeleteEvent, CcSshKeyImportEvent } from './cc-ssh-key-list.events.js';

const SSH_KEY_DOCUMENTATION = getDocUrl('/account/ssh-keys-management');

/**
 * @type {SshKeyState[]}
 */
const SKELETON_KEYS = [
  {
    type: 'idle',
    name: fakeString(15),
    fingerprint: fakeString(32),
  },
];

class SshPublicKeyValidator {
  /**
   * @param {string} value
   * @param {Object} _formData
   * @return {Validity}
   */
  validate(value, _formData) {
    if (value.toLowerCase().match(' private ')) {
      return Validation.invalid('private-key');
    }
    return Validation.VALID;
  }
}

/**
 * @import { SshKeyListState, SshKeyState, GithubSshKeyState, CreateSshKeyFormState } from './cc-ssh-key-list.types.js'
 * @import { FormDataMap } from '../../lib/form/form.types.js'
 * @import { Validity } from '../../lib/form/validation.types.js'
 * @import { TemplateResult } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
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
 */
export class CcSshKeyList extends LitElement {
  static get properties() {
    return {
      createKeyFormState: { type: Object, attribute: false },
      keyListState: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();

    /** @type {CreateSshKeyFormState} create key form state. */
    this.createKeyFormState = { type: 'idle' };

    /** @type {SshKeyListState} personal and GitHub lists of registered SSH keys. */
    this.keyListState = { type: 'loading' };

    /** @type {Ref<HTMLFormElement>} */
    this._createFormRef = createRef();

    new LostFocusController(this, '.key--personal', ({ suggestedElement }) => {
      focusBySelector(this.shadowRoot, suggestedElement == null ? '#personal-keys-empty-msg' : 'cc-button');
    });
    new LostFocusController(this, '.key--github', ({ suggestedElement }) => {
      focusBySelector(this.shadowRoot, suggestedElement == null ? '#github-keys-empty-msg' : 'cc-button');
    });

    this._nameErrorMessages = {
      empty: () => i18n('cc-ssh-key-list.error.required.name'),
    };

    this._keyValidator = new SshPublicKeyValidator();
    this._keyErrorMessages = {
      empty: () => i18n('cc-ssh-key-list.error.required.public-key'),
      'private-key': () => i18n('cc-ssh-key-list.error.private-key'),
    };
  }

  resetCreateKeyForm() {
    this._createFormRef.value?.reset();
  }

  /**
   * @param {FormDataMap} formData
   */
  _onCreateKey(formData) {
    // trigger key creation if client form validation is successful
    if (typeof formData.name === 'string' && typeof formData.publicKey === 'string') {
      this.dispatchEvent(new CcSshKeyCreateEvent({ name: formData.name, publicKey: formData.publicKey }));
    }
  }

  /** @param {SshKeyState|GithubSshKeyState} sshKeyState */
  _onDeleteKey(sshKeyState) {
    // removing state property that belongs to internal component implementation
    const { type: state, ...sshKey } = sshKeyState;
    this.dispatchEvent(new CcSshKeyDeleteEvent({ name: sshKey.name }));
  }

  /** @param {GithubSshKeyState} sshKeyState */
  _onImportKey(sshKeyState) {
    // removing state property that belongs to internal component implementation
    const { type: state, ...sshKey } = sshKeyState;
    this.dispatchEvent(new CcSshKeyImportEvent(sshKey));
  }

  render() {
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-ssh-key-list.title')}</div>

        <!-- creation form -->
        <cc-block-section slot="content-body">
          <div slot="title">${i18n('cc-ssh-key-list.add.title')}</div>
          <div slot="info">${i18n('cc-ssh-key-list.add.info')}</div>

          ${this._renderCreateSshKeyForm()}
        </cc-block-section>

        <!-- personal keys -->
        <cc-block-section slot="content-body">
          <div slot="title">
            <span>${i18n('cc-ssh-key-list.personal.title')}</span>
            ${this.keyListState.type === 'loaded' && this.keyListState.personalKeys.length > 2
              ? html` <cc-badge circle>${this.keyListState.personalKeys.length}</cc-badge> `
              : ''}
          </div>
          <div slot="info">${i18n('cc-ssh-key-list.personal.info')}</div>

          ${this.keyListState.type === 'loading' ? html` ${this._renderKeyList('skeleton', SKELETON_KEYS)} ` : ''}
          ${this.keyListState.type === 'loaded'
            ? html`
                ${this.keyListState.personalKeys.length === 0
                  ? html`
                      <p class="info-msg" id="personal-keys-empty-msg" tabindex="-1">
                        ${i18n('cc-ssh-key-list.personal.empty')}
                      </p>
                    `
                  : ''}
                ${this._renderKeyList('personal', this.keyListState.personalKeys)}
              `
            : ''}
          ${this.keyListState.type === 'error'
            ? html` <cc-notice intent="warning" message="${i18n('cc-ssh-key-list.error.loading')}"></cc-notice> `
            : ''}
        </cc-block-section>

        <!-- GitHub keys -->
        <cc-block-section slot="content-body">
          <div slot="title">
            <span>${i18n('cc-ssh-key-list.github.title')}</span>
            ${this.keyListState.type === 'loaded' &&
            this.keyListState.isGithubLinked &&
            this.keyListState.githubKeys.length > 2
              ? html` <cc-badge circle>${this.keyListState.githubKeys.length}</cc-badge> `
              : ''}
          </div>
          <div slot="info">${i18n('cc-ssh-key-list.github.info')}</div>

          ${this.keyListState.type === 'loading' ? html` ${this._renderKeyList('skeleton', SKELETON_KEYS)} ` : ''}
          ${this.keyListState.type === 'loaded' && !this.keyListState.isGithubLinked
            ? html` <p class="info-msg">${i18n('cc-ssh-key-list.github.unlinked')}</p> `
            : ''}
          ${this.keyListState.type === 'loaded' && this.keyListState.isGithubLinked
            ? html`
                ${this.keyListState.githubKeys.length === 0
                  ? html`
                      <p class="info-msg" id="github-keys-empty-msg" tabindex="-1">
                        ${i18n('cc-ssh-key-list.github.empty')}
                      </p>
                    `
                  : ''}
                ${this._renderKeyList('github', this.keyListState.githubKeys)}
              `
            : ''}
          ${this.keyListState.type === 'error'
            ? html` <cc-notice intent="warning" message="${i18n('cc-ssh-key-list.error.loading')}"></cc-notice> `
            : ''}
        </cc-block-section>

        <div slot="footer-right">
          <cc-link href="${SSH_KEY_DOCUMENTATION}" .icon="${iconInfo}">
            ${i18n('cc-ssh-key-list.documentation.text')}
          </cc-link>
        </div>
      </cc-block>
    `;
  }

  /**
   * @return {TemplateResult}
   */
  _renderCreateSshKeyForm() {
    const isCreating = this.createKeyFormState.type === 'creating';

    return html`
      <form class="create-form" ${ref(this._createFormRef)} ${formSubmit(this._onCreateKey.bind(this))}>
        <cc-input-text
          name="name"
          ?readonly=${isCreating}
          class="create-form__name"
          label=${i18n('cc-ssh-key-list.add.name')}
          required
          .customErrorMessages=${this._nameErrorMessages}
        >
        </cc-input-text>
        <cc-input-text
          name="publicKey"
          ?readonly=${isCreating}
          class="create-form__public-key"
          label=${i18n('cc-ssh-key-list.add.public-key')}
          required
          .customErrorMessages=${this._keyErrorMessages}
          .customValidator=${this._keyValidator}
        >
        </cc-input-text>
        <div class="create-form__footer">
          <cc-button class="create-form__add-btn" primary type="submit" ?waiting=${isCreating}>
            ${i18n('cc-ssh-key-list.add.btn')}
          </cc-button>
        </div>
      </form>
    `;
  }

  /**
   * @param {"personal"|"github"|"skeleton"} type
   * @param {Array<SshKeyState|GithubSshKeyState>} keys
   * @return {TemplateResult}
   */
  _renderKeyList(type, keys) {
    const sortedKeys = keys.toSorted(sortBy('name'));
    const skeleton = type === 'skeleton';
    return html`
      <div class="key-list">
        ${repeat(
          sortedKeys,
          (key) => key.name,
          (key) => {
            const name = key.name;
            const isWaiting = !skeleton && key.type !== 'idle';
            const classes = {
              'key--personal': type === 'personal',
              'key--github': type === 'github',
              'key--skeleton': skeleton,
              'is-waiting': isWaiting,
            };

            return html`
              <div class="key ${classMap(classes)}">
                <div class="key__icon">
                  <cc-icon .icon="${iconKey}" size="lg" ?skeleton=${skeleton}></cc-icon>
                </div>
                <div class="key__name">
                  <span class=${classMap({ skeleton })}>${name}</span>
                </div>
                <div class="key__form">
                  <div class="key__fingerprint ${classMap({ skeleton })}">${key.fingerprint}</div>

                  ${type === 'personal'
                    ? html`
                        <cc-button
                          @cc-click=${() => this._onDeleteKey(key)}
                          a11y-name="${i18n('cc-ssh-key-list.personal.delete.a11y', { name })}"
                          class="key__button key__button--personal"
                          .icon="${iconBin}"
                          danger
                          outlined
                          ?waiting=${isWaiting}
                        >
                          ${i18n('cc-ssh-key-list.personal.delete')}
                        </cc-button>
                      `
                    : ''}
                  ${type === 'github'
                    ? html`
                        <cc-button
                          @cc-click=${() => this._onImportKey(/** @type GithubSshKeyState */ (key))}
                          a11y-name="${i18n('cc-ssh-key-list.github.import.a11y', { name })}"
                          class="key__button key__button--github"
                          .icon="${iconAdd}"
                          ?waiting=${isWaiting}
                        >
                          ${i18n('cc-ssh-key-list.github.import')}
                        </cc-button>
                      `
                    : ''}
                  ${type === 'skeleton'
                    ? html`
                        <cc-button class="key__button key__button--skeleton" .icon="${iconAdd}" skeleton>
                          ${fakeString(10)}
                        </cc-button>
                      `
                    : ''}
                </div>
              </div>
            `;
          },
        )}
      </div>
    `;
  }

  static get styles() {
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

        .key.is-waiting {
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
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          grid-area: key-form;
          justify-content: flex-end;
        }

        /* TODO tokenize border & border-color */

        .key__fingerprint {
          background-color: var(--cc-color-bg-neutral);
          border-inline-start: 5px solid #a6a6a6;
          border-radius: 0.125em;
          flex-basis: min(100%, 21.25em);
          flex-grow: 1;
          font-family: var(--cc-ff-monospace);
          line-height: 1.5;
          padding: 0.5em 0.75em;
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

        [slot='info'] {
          display: grid;
          gap: 1em;
          margin-top: 1.5em;
        }

        [slot='info'] code {
          background-color: var(--cc-color-bg-neutral);
          border: 1px solid var(--cc-color-border-neutral-weak, #eee);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: inline-block;
          font-family: var(--cc-ff-monospace);
          font-size: 0.9em;
          line-height: 2;
          padding: 0.25em 0.75em;
          white-space: pre-wrap;
          word-break: break-all;
        }

        [slot='info'] p {
          margin: 0;
        }

        .key--skeleton .skeleton {
          background-color: var(--skeleton-color);
        }

        .info-msg {
          color: var(--cc-color-text-weak);
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 0;
          margin-top: 1em;
        }

        /* endregion */

        [slot='footer-right'] cc-link {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ssh-key-list', CcSshKeyList);
