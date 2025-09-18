import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixCloseLine as iconClose } from '../../assets/cc-remix.icons.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { Validation } from '../../lib/form/validation.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { CcAddonDeleteEvent, CcAddonNameChangeEvent, CcAddonTagsChangeEvent } from './cc-addon-admin.events.js';

/**
 * @typedef {import('./cc-addon-admin.types.js').AddonAdminState} AddonAdminState
 * @typedef {import('./cc-addon-admin.types.js').AddonAdminStateLoaded} AddonAdminStateLoaded
 * @typedef {import('./cc-addon-admin.types.js').AddonAdminStateLoading} AddonAdminStateLoading
 * @typedef {import('./cc-addon-admin.types.js').AddonAdminStateSaving} AddonAdminStateSaving
 * @typedef {import('../cc-input-text/cc-input-text.events.js').CcTagsChangeEvent} CcTagsChangeEvent
 * @typedef {import('lit').PropertyValues<CcAddonAdmin>} CcAddonAdminPropertyValues
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDialogElement>} HTMLDialogElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 */

/**
 * A component displaying the admin interface of an add-on to edit its name or delete the add-on.
 *
 * @cssdisplay block
 */
export class CcAddonAdmin extends LitElement {
  static get properties() {
    return {
      noDangerZoneBackupText: { type: Boolean, attribute: 'no-danger-zone-backup-text' },
      noDangerZoneVmText: { type: Boolean, attribute: 'no-danger-zone-vm-text' },
      state: { type: Object },
      _name: { type: String, state: true },
      _tags: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Hides the text about backups within the danger zone when set to `true` */
    this.noDangerZoneBackupText = false;

    /** @type {boolean} Hides the text about VM delay within the danger zone when set to `true` */
    this.noDangerZoneVmText = false;

    /** @type {AddonAdminState} Sets the state of the component */
    this.state = { type: 'loading' };

    /** @type {string|null} Sets the value of the `name` input field */
    this._name = null;

    /** @type {string[]|null} Sets the value of the `tags` input field */
    this._tags = null;

    /** @type {HTMLDialogElementRef} */
    this._confirmDeletionDialogRef = createRef();

    /** @type {HTMLFormElementRef} */
    this._confirmDeletionFormRef = createRef();

    this._addonNameConfirmationValidator = {
      /**
       * @param {string} value
       * @return {Validation}
       */
      validate: (value) => {
        if (this.state.type === 'loaded' && this.state.name === value) {
          return Validation.VALID;
        }

        return Validation.invalid('no-match');
      },
    };
  }

  _onDeleteRequest() {
    this._confirmDeletionDialogRef.value.showModal();
  }

  /** @private */
  _onDeleteSubmit() {
    if (this.state.type === 'loaded') {
      this.dispatchEvent(new CcAddonDeleteEvent({ id: this.state.id, name: this.state.name }));
    }
  }

  /**
   * @param {CcInputEvent} event
   * @private
   */
  _onNameInput({ detail: name }) {
    this._name = name;
  }

  /** @private */
  _onNameSubmit() {
    this.dispatchEvent(new CcAddonNameChangeEvent({ name: this._name }));
  }

  /**
   * @param {CcTagsChangeEvent} event
   * @private
   */
  _onTagsInput({ detail: tags }) {
    this._tags = tags;
  }

  /** @private */
  _onTagsSubmit() {
    this.dispatchEvent(new CcAddonTagsChangeEvent({ tags: this._tags }));
  }

  _onDialogClose() {
    this._confirmDeletionDialogRef.value.close();
  }

  /**
   * @param {CcAddonAdminPropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && 'name' in this.state) {
      this._name = this.state.name;
    }

    if (changedProperties.has('state') && 'tags' in this.state) {
      this._tags = this.state.tags;
    }
  }

  /** @param {CcAddonAdminPropertyValues} changedProperties */
  updated(changedProperties) {
    // when the add-on has been deleted, we need to close the dialog & reset the form
    const previousState = changedProperties.get('state');
    const wasDeleting = previousState?.type === 'deleting';
    const isNotDeleting = this.state.type !== 'deleting';
    if (wasDeleting && isNotDeleting) {
      this._confirmDeletionDialogRef.value?.close();
      this._confirmDeletionFormRef.value?.reset();
    }
  }

  render() {
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-admin.admin')}</div>

        ${this.state.type === 'error'
          ? html`
              <cc-notice slot="content" intent="warning" message="${i18n('cc-addon-admin.error-loading')}"></cc-notice>
            `
          : ''}
        ${this.state.type !== 'error' ? this._renderContent(this.state) : ''}
      </cc-block>
    `;
  }

  /**
   * @param {AddonAdminStateLoaded|AddonAdminStateLoading|AddonAdminStateSaving} state
   * @returns {TemplateResult}
   * @private
   */
  _renderContent(state) {
    const isSkeleton = state.type === 'loading';
    const isSaving = state.type === 'updating-tags' || state.type === 'updating-name' || state.type === 'deleting';
    const isFormDisabled = state.type === 'loading' || isSaving;
    const shouldShowBackupsText = !this.noDangerZoneBackupText;
    const shouldShowVmText = !this.noDangerZoneVmText;

    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-addon-admin.heading.name')}</div>
        <div slot="info"></div>
        <div class="one-line-form">
          <cc-input-text
            label="${i18n('cc-addon-admin.input.name')}"
            ?skeleton=${isSkeleton}
            ?readonly=${isFormDisabled}
            .value=${this._name}
            @cc-input=${this._onNameInput}
            @cc-request-submit=${this._onNameSubmit}
          ></cc-input-text>
          <cc-button
            primary
            ?skeleton=${isSkeleton}
            ?disabled=${isFormDisabled && state.type !== 'updating-name'}
            ?waiting=${state.type === 'updating-name'}
            @cc-click=${this._onNameSubmit}
            >${i18n('cc-addon-admin.update')}</cc-button
          >
        </div>
      </cc-block-section>

      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-addon-admin.heading.tags')}</div>
        <div slot="info">${i18n('cc-addon-admin.tags-description')}</div>
        <div class="one-line-form">
          <cc-input-text
            label="${i18n('cc-addon-admin.input.tags')}"
            ?skeleton=${isSkeleton}
            ?readonly=${isFormDisabled}
            .tags=${this._tags}
            placeholder="${i18n('cc-addon-admin.tags-empty')}"
            @cc-tags-change=${this._onTagsInput}
            @cc-request-submit=${this._onTagsSubmit}
          ></cc-input-text>
          <cc-button
            primary
            ?skeleton=${isSkeleton}
            ?disabled=${isFormDisabled && state.type !== 'updating-tags'}
            ?waiting=${state.type === 'updating-tags'}
            @cc-click=${this._onTagsSubmit}
            >${i18n('cc-addon-admin.tags-update')}</cc-button
          >
        </div>
      </cc-block-section>

      <cc-block-section slot="content-body">
        <div slot="title" class="danger">${i18n('cc-addon-admin.danger-zone')}</div>
        <div slot="info" class="danger-desc">
          <p>${i18n('cc-addon-admin.delete-disclaimer')}</p>
          ${shouldShowVmText ? html`<p>${i18n('cc-addon-admin.delete-vm')}</p>` : ''}
          ${shouldShowBackupsText ? html`<p>${i18n('cc-addon-admin.delete-backups')}</p>` : ''}
        </div>
        <div>
          <cc-button
            danger
            ?skeleton=${isSkeleton}
            ?disabled=${isFormDisabled && state.type !== 'deleting'}
            ?waiting=${state.type === 'deleting'}
            @cc-click=${this._onDeleteRequest}
            >${i18n('cc-addon-admin.delete')}</cc-button
          >
        </div>
      </cc-block-section>

      ${this.state.type === 'loaded' || this.state.type === 'deleting'
        ? this._renderDeleteConfirmationDialog(this.state.name, this.state.type === 'deleting')
        : ''}
    `;
  }

  /**
   * @param {string} addonName
   * @param {boolean} isDeleting
   */
  _renderDeleteConfirmationDialog(addonName, isDeleting) {
    const customErrorMessages = { 'no-match': i18n('cc-addon-admin.delete.dialog.error', { name: addonName }) };
    return html`
      <dialog
        aria-labelledby="dialog-heading"
        closedby="any"
        ${ref(this._confirmDeletionDialogRef)}
        slot="content-body"
      >
        <button class="dialog-close" @click=${this._onDialogClose} ?disabled="${isDeleting}">
          <span class="visually-hidden">${i18n('cc-addon-admin.delete.dialog.close')}</span>
          <cc-icon .icon="${iconClose}"></cc-icon>
        </button>
        <div class="dialog-heading" id="dialog-heading">${i18n('cc-addon-admin.delete.dialog.heading')}</div>
        <p class="dialog-desc">${i18n('cc-addon-admin.delete.dialog.desc')}</p>
        <form class="dialog-form" ${formSubmit(this._onDeleteSubmit.bind(this))} ${ref(this._confirmDeletionFormRef)}>
          <cc-input-text
            label="${i18n('cc-addon-admin.delete.dialog.label')}"
            required
            name="confirmation"
            ?readonly="${isDeleting}"
            .customValidator="${this._addonNameConfirmationValidator}"
            .customErrorMessages="${customErrorMessages}"
          >
            <p slot="help">${addonName}</p>
          </cc-input-text>
          <div class="dialog-form__actions">
            <cc-button type="button" outlined primary @cc-click="${this._onDialogClose}" ?disabled="${isDeleting}">
              ${i18n('cc-addon-admin.delete.dialog.cancel')}
            </cc-button>
            <cc-button type="submit" danger .waiting="${isDeleting}">
              ${i18n('cc-addon-admin.delete.dialog.confirm')}
            </cc-button>
          </div>
        </form>
      </dialog>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
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

        .danger-desc p {
          margin: 0;
        }

        dialog {
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-shadow: 2px 4px 8px 0 rgb(0 0 0 / 12%);
          box-sizing: border-box;
          padding: 4em;
          width: min(38em, 80%);
        }

        /* stylelint-disable-next-line media-feature-range-notation */
        @media screen and (max-width: 38em) {
          dialog {
            padding: 1em;
          }
        }

        ::backdrop {
          background: rgb(30 30 30 / 55%);
        }

        @supports (backdrop-filter: blur(5px)) {
          ::backdrop {
            backdrop-filter: blur(5px);
            background: rgb(30 30 30 / 35%);
          }
        }

        .dialog-close {
          background: none;
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: var(--cc-color-text-weak);
          cursor: pointer;
          padding: 0.5em;
          position: absolute;
          right: 1.5em;
          top: 1.5em;

          --cc-icon-size: 1.4em;
        }

        .dialog-close:disabled {
          opacity: var(--cc-opacity-when-disabled, 0.65);
        }

        /* stylelint-disable-next-line media-feature-range-notation */
        @media screen and (max-width: 38em) {
          .dialog-close {
            right: 0.5em;
            top: 0.5em;
          }
        }

        .dialog-close:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .dialog-heading {
          border-bottom: solid 1px var(--cc-color-border-neutral-weak);
          color: var(--cc-color-text-primary-strongest);
          font-weight: bold;
          margin-bottom: 1.25em;
          padding-bottom: 1.25em;
        }

        .dialog-desc {
          margin-bottom: 1.25em;
        }

        .dialog-form {
          display: grid;
        }

        .dialog-form__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: end;
          margin-top: 3.75em;
        }

        /* stylelint-disable-next-line media-feature-range-notation */
        @media screen and (max-width: 38em) {
          .dialog-form__actions {
            display: grid;
            justify-content: stretch;
            margin-top: 2em;
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-admin', CcAddonAdmin);
