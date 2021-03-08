import '../atoms/cc-input-text.js';
import '../atoms/cc-loader.js';
import '../molecules/cc-block-section.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';

/**
 * A component displaying the admin interface of an add-on to edit its name or delete the add-on
 *
 * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/addon/cc-addon-admin.js)
 *
 * ## Details
 *
 * * When addon is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * ## Type definitions
 *
 * ```js
 * interface Addon {
 *   name: String,
 *   tags: String[],
 * }
 * ```
 *
 * @prop {Addon} addon - Sets the add-on details (name and tags).
 * @prop {false|"saving"|"loading"} error - Sets the error state on the component.
 * @prop {Boolean} saving - Enables the saving state (form is disabled and blurred).
 *
 * @event {CustomEvent<String>} cc-addon-admin:update-name - Fires the new name of the add-on when update name button is clicked.
 * @event {CustomEvent<String[]>} cc-addon-admin:update-tags - Fires the new list of tags when update tags button is clicked.
 * @event {CustomEvent} cc-addon-admin:delete-addon - Fires when the delete button is clicked.
 */
export class CcAddonAdmin extends LitElement {

  static get properties () {
    return {
      addon: { type: Object },
      error: { type: String },
      saving: { type: Boolean },
      _name: { type: String, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
      _tags: { type: Array, attribute: false },
    };
  }

  constructor () {
    super();
    // lit-analyzer needs this
    this._skeleton = false;
    this.addon = null;
    this.error = false;
    this.saving = false;
  }

  set addon (addon) {
    this._skeleton = (addon == null);
    this._name = this._skeleton ? '' : addon.name;
    this._tags = this._skeleton ? [] : addon.tags;
  }

  _onNameInput ({ detail: name }) {
    this._name = name;
  }

  _onNameSubmit () {
    dispatchCustomEvent(this, 'update-name', { name: this._name });
  }

  _onTagsInput ({ detail: tags }) {
    this._tags = tags;
  }

  _onTagsSubmit () {
    dispatchCustomEvent(this, 'update-tags', { tags: this._tags });
  }

  _onDeleteSubmit () {
    dispatchCustomEvent(this, 'delete-addon');
  }

  _onDismissError () {
    this.error = false;
  }

  render () {

    const isFormDisabled = (this.error !== false) || this.saving;
    const loadingError = (this.error === 'loading');

    return html`

      <cc-block>
        <div slot="title">${i18n('cc-addon-admin.admin')}</div>

        ${!loadingError ? html`

          <cc-block-section>
            <div slot="title">${i18n('cc-addon-admin.addon-name')}</div>
            <div slot="info"></div>
            <div class="one-line-form">
              <cc-input-text
                  ?skeleton=${this._skeleton}
                  ?disabled=${isFormDisabled}
                  .value=${this._name}
                  @cc-input-text:input=${this._onNameInput}
                  @cc-input-text:requestimplicitsubmit=${this._onNameSubmit}
              ></cc-input-text>
              <cc-button primary ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} @cc-button:click=${this._onNameSubmit}>${i18n('cc-addon-admin.update')}</cc-button>
            </div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${i18n('cc-addon-admin.tags')}</div>
            <div slot="info">${i18n('cc-addon-admin.tags-description')}</div>
            <div class="one-line-form">
              <cc-input-text
                  ?skeleton=${this._skeleton}
                  ?disabled=${isFormDisabled}
                  .tags=${this._tags}
                  placeholder="${i18n('cc-addon-admin.tags-empty')}"
                  @cc-input-text:tags=${this._onTagsInput}
                  @cc-input-text:requestimplicitsubmit=${this._onTagsSubmit}
              ></cc-input-text>
              <cc-button primary ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} @cc-button:click=${this._onTagsSubmit}>${i18n('cc-addon-admin.tags-update')}</cc-button>
            </div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title" class="danger">${i18n('cc-addon-admin.danger-zone')}</div>
            <div slot="info">${i18n('cc-addon-admin.delete-description')}</div>
            <div>
              <cc-button danger ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} @cc-button:click=${this._onDeleteSubmit}>${i18n('cc-addon-admin.delete')}</cc-button>
            </div>
          </cc-block-section>
        ` : ''}

        ${loadingError ? html`
          <cc-error>${i18n('cc-addon-admin.error-loading')}</cc-error>
        ` : ''}

        ${this.saving ? html`
          <cc-loader slot="overlay"></cc-loader>
        ` : ''}

        ${this.error === 'saving' ? html`
          <div slot="overlay">
            <cc-error mode="confirm" @cc-error:ok=${this._onDismissError}>${i18n('cc-addon-admin.error-saving')}</cc-error>
          </div>
        ` : ''}
      </cc-block>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .one-line-form {
          display: flex;
        }

        .one-line-form cc-input-text {
          flex: 1 1 10rem;
          margin-right: 0.5rem;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-admin', CcAddonAdmin);
