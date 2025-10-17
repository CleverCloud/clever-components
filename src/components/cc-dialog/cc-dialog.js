import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixCloseLine as iconClose } from '../../assets/cc-remix.icons.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { Validation } from '../../lib/form/validation.js';
import { findActiveElement } from '../../lib/shadow-dom-utils.js';
import { isStringEmpty } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import { CcDialogCloseEvent, CcDialogOpenEvent } from './cc-dialog.events.js';

/**
 * @typedef {import('lit').PropertyValues<CcDialog>} CcDialogPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDialogElement>} HTMLDialogElementRef
 * @typedef {import('../../lib/form/validation.js').Validator} Validator
 */

/**
 *
 */
export class CcDialog extends LitElement {
  static get properties() {
    return {
      autofocusInput: { type: Boolean, attribute: 'autofocus-input' },
      cancelLabel: { type: String, attribute: 'cancel-label' },
      confirmInputLabel: { type: String, attribute: 'confirm-input-label' },
      confirmTextToInput: { type: String, attribute: 'confirm-text-to-input' },
      content: { type: String },
      heading: { type: String },
      open: { type: Boolean, reflect: true },
      submitIntent: { type: String, attribute: 'submit-intent' },
      submitLabel: { type: String, attribute: 'submit-label' },
      waiting: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Automatically focuses the input when the dialog is opened */
    this.autofocusInput = false;

    /** @type {string|null} Sets Text that needs to be matched by the user, also visible in the help text below the input */
    this.confirmTextToInput = null;

    /** @type {string|null} Sets the label for the confirm text input */
    this.confirmInputLabel = null;

    /** @type {string|null} Sets the label for the cancel button */
    this.cancelLabel = null;

    /** @type {string|null} Sets the heading of the dialog as long as the heading slot is unused */
    this.heading = null;

    /** @type {string|null} Sets the content of the dialog below the heading as long as the content slot is unused */
    this.content = null;

    /** @type {boolean} Displays or hides the dialog */
    this.open = false;

    /** @type {string|null} Sets the label for the submit button and displays a generic cancel button next to it */
    this.submitLabel = null;

    /** @type {'primary'|'danger'} Sets the color of the submit button */
    this.submitIntent = 'primary';

    /** @type {boolean} Disables the form inputs and buttons, and shows a loading indicator for the submit button */
    this.waiting = false;

    /** @type {Validator} */
    this._confirmValidator = {
      validate: (value) => {
        if (this.confirmTextToInput === value) {
          return Validation.VALID;
        }
        return Validation.invalid('no-match');
      },
    };

    this._customErrorMessages = {
      'no-match': () => i18n('cc-addon-admin.delete.dialog.error', { name: this.confirmTextToInput }),
    };

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

  _onDialogClose(e) {
    e?.preventDefault();
    if (this.waiting) {
      return;
    }
    this.open = false;
  }

  _tryToFocusOpeningElement() {
    if (this._lastFocusedElement instanceof HTMLElement && this._lastFocusedElement.isConnected) {
      this._lastFocusedElement.focus();
    }
    // TODO: dispatch some event to warn that focus lost?
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._tryToFocusOpeningElement();
  }

  render() {
    return html`
      <dialog aria-labelledby="dialog-heading" closedby="any" ${ref(this._dialogRef)} @cancel="${this._onDialogClose}">
        <div class="dialog-padding-wrapper">
          <button class="dialog-close" ?disabled="${this.waiting}" @click="${this._onDialogClose}">
            <span class="visually-hidden">${i18n('cc-dialog.close')}</span>
            <cc-icon .icon="${iconClose}"></cc-icon>
          </button>
          <slot name="heading" class="dialog-heading" id="dialog-heading">
            ${!isStringEmpty(this.heading) ? this.heading : ''}
          </slot>
          <slot name="content" class="dialog-content"> ${!isStringEmpty(this.content) ? this.content : ''} </slot>
          ${isStringEmpty(this.confirmInputLabel) && isStringEmpty(this.confirmTextToInput)
            ? html`
                <slot name="actions" class="dialog-actions">
                  ${!isStringEmpty(this.submitLabel)
                    ? html`
                        <cc-button outlined @cc-click="${this._onDialogClose}" ?disabled="${this.waiting}">
                          ${this.cancelLabel}
                        </cc-button>
                        <cc-button
                          ?primary="${this.submitIntent === 'primary'}"
                          ?danger="${this.submitIntent === 'danger'}"
                          type="submit"
                          ?waiting="${this.waiting}"
                        >
                          ${this.submitLabel}
                        </cc-button>
                      `
                    : ''}
                </slot>
              `
            : ''}
          ${!isStringEmpty(this.confirmInputLabel) && !isStringEmpty(this.confirmTextToInput)
            ? this._renderConfirmForm()
            : ''}
        </div>
      </dialog>
    `;
  }

  _renderConfirmForm() {
    return html`
      <form ${formSubmit()}>
        <div class="dialog-content">
          <cc-input-text
            label="${this.confirmInputLabel}"
            name="confirmation-input"
            required
            .customValidator="${this._confirmValidator}"
            .customErrorMessages="${this._customErrorMessages}"
            ?autofocus="${this.autofocusInput}"
          >
            <p slot="help">${this.confirmTextToInput}</p>
          </cc-input-text>
        </div>
        <div class="dialog-actions">
          <cc-button outlined @click="${this._onDialogClose}" ?disabled="${this.waiting}">
            ${this.cancelLabel}
          </cc-button>
          <cc-button
            ?primary="${this.submitIntent === 'primary'}"
            ?danger="${this.submitIntent === 'danger'}"
            type="submit"
            ?waiting="${this.waiting}"
          >
            ${this.submitLabel}
          </cc-button>
        </div>
      </form>
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

        .dialog-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: end;
          margin-top: 3.75em;
        }

        @container dialog (max-width: 37em) {
          .dialog-actions {
            display: grid;
            justify-content: stretch;
            margin-top: 2em;
          }
        }
      `,
    ];
  }
}

customElements.define('cc-dialog', CcDialog);
