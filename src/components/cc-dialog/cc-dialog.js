import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixCloseLine as iconClose } from '../../assets/cc-remix.icons.js';
import { findActiveElement } from '../../lib/shadow-dom-utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import { CcDialogCloseEvent, CcDialogOpenEvent } from './cc-dialog.events.js';

/**
 * @typedef {import('lit').PropertyValues<CcDialog>} CcDialogPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDialogElement>} HTMLDialogElementRef
 */

/**
 *
 * @cc-dialog-cancel
 * @cc-dialog-confirm
 *
 */
export class CcDialog extends LitElement {
  static get properties() {
    return {
      cancelLabel: { type: String, attribute: 'cancel-label' },
      confirmInputLabel: { type: String, attribute: 'confirm-input-label' },
      confirmText: { type: String, attribute: 'confirm-text' },
      desc: { type: String },
      heading: { type: String },
      open: { type: Boolean, reflect: true },
      submitIntent: { type: String, attribute: 'submit-intent' },
      submitLabel: { type: String, attribute: 'submit-label' },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Displays or hides the dialog */
    this.open = false;

    /** @type {string|null} Sets the va  */
    this.confirmationInput = null;
    this.confirmInputLabel = null;
    this.submitLabel = null;
    this.submitIntent = null;
    this.cancelLabel = null;
    this.heading = null;
    this.desc = null;

    /** @type {HTMLDialogElementRef} */
    this._dialogRef = createRef();

    /** @type {Element|null} */
    this._lastFocusedElement = null;
  }

  /** @param {CcDialogPropertyValues} changedProperties */
  updated(changedProperties) {
    if (changedProperties.get('open') === true && !this.open) {
      this._dialogRef.value?.close();
      this._tryToFocusOpeningElement();
      this.dispatchEvent(new CcDialogCloseEvent());
    }

    if (changedProperties.has('open') && this.open) {
      this._lastFocusedElement = findActiveElement();
      this._dialogRef.value?.showModal();
      // FIXME: might be weird to dispatch since the component cannot open by itself
      this.dispatchEvent(new CcDialogOpenEvent());
    }
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  _onDialogClose() {
    this.open = false;
  }

  _tryToFocusOpeningElement() {
    if (this._lastFocusedElement instanceof HTMLElement && this._lastFocusedElement.isConnected) {
      this._lastFocusedElement.focus();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.dispatchEvent(new CcDialogCloseEvent());
    if (this._lastFocusedElement instanceof HTMLElement && this._lastFocusedElement.isConnected) {
      this._lastFocusedElement.focus();
    }
    // TODO: dispatch some event to warn that focus lost?
  }

  render() {
    // TODO: disabled close btn?
    // TODO: confirm form
    return html`
      <dialog aria-labelledby="dialog-heading" closedby="any" ${ref(this._dialogRef)} @cancel="${this._onDialogClose}">
        <div class="dialog-padding-wrapper">
          <button class="dialog-close" @click="${this._onDialogClose}">
            <span class="visually-hidden">${i18n('cc-dialog.close')}</span>
            <cc-icon .icon="${iconClose}"></cc-icon>
          </button>
          <slot name="heading" class="dialog-heading" id="dialog-heading"></slot>
          <slot name="content" class="dialog-content"></slot>
          <slot name="actions" class="dialog-actions"></slot>
          <slot name="form">
            <slot name="form-content" class="dialog-content"></slot>
            <slot name="form-actions" class="dialog-actions"></slot>
          </slot>
        </div>
      </dialog>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      css`
        :host {
          display: block;
        }

        dialog {
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-shadow: 2px 4px 8px 0 rgb(0 0 0 / 12%);
          box-sizing: border-box;
          /* IMPORTANT: used by the component itself and shared dialog-form-actions styles */
          container: dialog / inline-size;
          padding: 0;
          width: min(38em, 80%);
        }

        .dialog-padding-wrapper {
          padding: 4em;
        }

        @container dialog (max-width: 37em) {
          .dialog-padding-wrapper {
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

        @container dialog (max-width: 37em) {
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
          display: block;
          font-weight: bold;
          margin-bottom: 1.25em;
          padding-bottom: 1.25em;
        }

        .dialog-desc {
          display: block;
          margin-bottom: 1.25em;
        }
      `,
    ];
  }
}

customElements.define('cc-dialog', CcDialog);
