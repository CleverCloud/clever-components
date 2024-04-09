import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-notice/cc-notice.js';
import { css, html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';

/**
 * @typedef {import('../common.types.js').Addon} Addon
 */

/**
 * A component displaying the admin interface of an add-on to edit its name or delete the add-on.
 *
 * ## Details
 *
 * * When addon is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent} cc-addon-admin:delete-addon - Fires when the delete button is clicked.
 * @fires {CustomEvent<string>} cc-addon-admin:update-name - Fires the new name of the add-on when update name button is clicked.
 * @fires {CustomEvent<string[]>} cc-addon-admin:update-tags - Fires the new list of tags when update tags button is clicked.
 */
export class CcAddonAdmin extends LitElement {

  static get properties () {
    return {
      addon: { type: Object },
      error: { type: Boolean },
      noDangerZoneBackupText: { type: Boolean, attribute: 'no-danger-zone-backup-text' },
      noDangerZoneVmText: { type: Boolean, attribute: 'no-danger-zone-vm-text' },
      saving: { type: Boolean },
      _name: { type: String, state: true },
      _skeleton: { type: Boolean, state: true },
      _tags: { type: Array, state: true },
    };
  }

  constructor () {
    super();

    /** @type {Addon|null} Sets the add-on details (name and tags). */
    this.addon = null;

    /** @type {boolean} Sets the error state on the component. */
    this.error = false;

    /** @type {boolean} Hides the text about backups within the danger zone when set to `true` */
    this.noDangerZoneBackupText = false;

    /** @type {boolean} Hides the text about VM delay within the danger zone when set to `true` */
    this.noDangerZoneVmText = false;

    /** @type {boolean} Enables the saving state */
    this.saving = false;

    /** @type {string} */
    this._name = '';

    /** @type {boolean} */
    this._skeleton = false;

    /** @type {string[]} */
    this._tags = [];
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

  willUpdate (changedProperties) {

    if (changedProperties.has('addon')) {
      this._skeleton = (this.addon == null);
      this._name = this._skeleton ? '' : this.addon.name;
      this._tags = this._skeleton ? [] : this.addon.tags;
    }
  }

  render () {

    const isFormDisabled = this.error || this.saving;
    const loadingError = (this.error && !this.saving) || (this.error && this.addon == null);
    const shouldShowBackupsText = !this.noDangerZoneBackupText;
    const shouldShowVmText = !this.noDangerZoneVmText;

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-addon-admin.admin')}</div>

        ${!loadingError ? html`
          <cc-block-section>
            <div slot="title">${i18n('cc-addon-admin.heading.name')}</div>
            <div slot="info"></div>
            <div class="one-line-form">
              <cc-input-text
                label="${i18n('cc-addon-admin.input.name')}"
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
            <div slot="title">${i18n('cc-addon-admin.heading.tags')}</div>
            <div slot="info">${i18n('cc-addon-admin.tags-description')}</div>
            <div class="one-line-form">
              <cc-input-text
                label="${i18n('cc-addon-admin.input.tags')}"
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
            <div slot="info" class="danger-desc">
              <p>${i18n('cc-addon-admin.delete-disclaimer')}</p>
              ${shouldShowVmText ? html`<p>${i18n('cc-addon-admin.delete-vm')}</p>` : ''}
              ${shouldShowBackupsText ? html`<p>${i18n('cc-addon-admin.delete-backups')}</p>` : ''}
            </div>
            <div>
              <cc-button danger ?skeleton=${this._skeleton} ?disabled=${isFormDisabled} @cc-button:click=${this._onDeleteSubmit}>${i18n('cc-addon-admin.delete')}</cc-button>
            </div>
          </cc-block-section>
        ` : ''}

        ${loadingError ? html`
          <cc-notice intent="warning" message="${i18n('cc-addon-admin.error-loading')}"></cc-notice>
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
          flex: 1 1 10em;
          margin-right: 0.5em;
        }
        
        .one-line-form cc-button {
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }

        .danger-desc {
          display: grid;
          gap: 0.5em;
        }

        .danger-desc p {
          margin: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-admin', CcAddonAdmin);
