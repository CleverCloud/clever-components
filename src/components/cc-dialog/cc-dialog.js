import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixCloseLine as iconClose } from '../../assets/cc-remix.icons.js';
import { findActiveElement } from '../../lib/shadow-dom-utils.js';
import { isStringEmpty } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import { CcDialogCloseEvent } from './cc-dialog.events.js';

/**
 * @typedef {import('../common.types.d.ts').IconModel} IconModel
 * @typedef {import('lit').PropertyValues<CcDialog>} CcDialogPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDialogElement>} HTMLDialogElementRef
 * @typedef {import('../../lib/form/validation.js').Validator} Validator
 */

/**
 * A modal dialog component with optional heading, icon, and close button.
 * Can be opened or closed programmatically or by user action.
 *
 * If both the `heading` prop and the `heading` slot are set, the prop takes precedence.
 *
 * @cssdisplay contents
 *
 * @slot Default slot for dialog content.
 * @slot heading - Slot for custom heading content.
 */
export class CcDialog extends LitElement {
  static get properties() {
    return {
      closedBy: { type: String, attribute: 'closed-by' },
      heading: { type: String },
      headingIcon: { type: Object, attribute: 'heading-icon' },
      headingIconA11yName: { type: String, attribute: 'heading-icon-a11y-name' },
      hiddenCloseButton: { type: Boolean, attribute: 'hidden-close-button' },
      open: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {'any'|'closerequest'|'none'} Indicates which action closes the dialog (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy for more information) */
    this.closedBy = 'any';

    /** @type {string|null} Heading text displayed at the top of the dialog. If you need more complex heading content, use the `heading` slot instead. */
    this.heading = null;

    /** @type {boolean} Hides the close button when true */
    this.hiddenCloseButton = false;

    /** @type {IconModel|null} Sets the icon before the heading using a `<cc-icon>`. Icon is hidden if nullish. */
    this.headingIcon = null;

    /** @type {string|null} Only use this prop if your icon provides information that is not already given in its surrounding text. */
    this.headingIconA11yName = null;

    /** @type {boolean} Displays or hides the dialog */
    this.open = false;

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
    }
  }

  _setLastFocusElements() {
    this._lastFocusedElement = findActiveElement();
  }

  /** Opens the dialog by setting the `open` property to true. */
  show() {
    this.open = true;
  }

  /** Closes the dialog by setting the `open` property to false. */
  hide() {
    this.open = false;
  }

  /** @param {Event} e */
  _onDialogClose(e) {
    // Prevent the native dialog close (`cancel` event) to manage it through the `open` property
    e?.preventDefault();
    this.open = false;
  }

  _tryToFocusOpeningElement() {
    if (this._lastFocusedElement instanceof HTMLElement && this._lastFocusedElement.isConnected) {
      this._lastFocusedElement.focus();
    }
    // TODO: dispatch some event to warn that focus lost?
    console.log(this._lastFocusedElement);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Restore focus to the element that opened the dialog in case the dialog is removed while open
    // This can happen when the dialog is inside a conditional template in which case the native dialog does not support focus restoration
    if (this.open) {
      this._tryToFocusOpeningElement();
    }
  }

  render() {
    return html`
      <dialog
        aria-labelledby="dialog-heading"
        closedby="${this.closedBy}"
        part="dialog"
        ${ref(this._dialogRef)}
        @cancel="${this._onDialogClose}"
      >
        ${!this.hiddenCloseButton
          ? html`
              <button class="dialog-close" @click="${this._onDialogClose}">
                <span class="visually-hidden">${i18n('cc-dialog.close')}</span>
                <cc-icon .icon="${iconClose}"></cc-icon>
              </button>
            `
          : ''}
        ${!isStringEmpty(this.heading)
          ? html`
              <div class="dialog-heading-wrapper">
                ${this.headingIcon != null
                  ? html`
                      <cc-icon
                        class="dialog-heading-icon"
                        .icon="${this.headingIcon}"
                        a11y-name="${ifDefined(this.headingIconA11yName)}"
                      ></cc-icon>
                    `
                  : ''}
                <span id="dialog-heading">${this.heading}</span>
              </div>
            `
          : ''}
        ${isStringEmpty(this.heading)
          ? html`
              <div class="dialog-heading-wrapper">
                ${this.headingIcon != null
                  ? html`
                      <cc-icon
                        class="dialog-heading-icon"
                        .icon="${this.headingIcon}"
                        a11y-name="${ifDefined(this.headingIconA11yName)}"
                      ></cc-icon>
                    `
                  : ''}
                <slot name="heading" id="dialog-heading"></slot>
              </div>
            `
          : ''}
        <div class="dialog-content-body-wrapper">
          <slot></slot>
        </div>
      </dialog>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      css`
        :host {
          display: contents;

          --cc-dialog-padding-xl: 4em;
          --cc-dialog-padding-sm: 2em;
        }

        dialog {
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-shadow: 2px 4px 8px 0 rgb(0 0 0 / 12%);
          box-sizing: border-box;
          padding: var(--cc-dialog-padding);
          width: min(38em, 80%);

          --cc-dialog-padding: var(--cc-dialog-padding-xl);
        }

        @media screen and (width <= 25em) {
          dialog {
            --cc-dialog-padding: var(--cc-dialog-padding-sm);
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
          align-items: center;
          background: none;
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: var(--cc-color-text-weak);
          cursor: pointer;
          display: flex;
          height: 2em;
          justify-content: center;
          position: absolute;
          right: calc(var(--cc-dialog-padding) / 2.5);
          top: calc(var(--cc-dialog-padding) / 2.5);
          width: 2em;

          --cc-icon-size: 1.5em;
        }

        .dialog-heading-wrapper cc-icon,
        .dialog-close cc-icon {
          flex: 0 0 auto;
        }

        .dialog-close:disabled {
          opacity: var(--cc-opacity-when-disabled, 0.65);
        }

        .dialog-close:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .dialog-heading-wrapper {
          align-items: center;
          border-bottom: solid 1px var(--cc-color-border-neutral-weak);
          color: var(--cc-color-text-primary-strongest);
          display: flex;
          font-weight: bold;
          gap: 0.5em;
          margin-bottom: 1.25em;
          padding-bottom: 1.25em;
        }

        .dialog-content-body-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
      `,
    ];
  }
}

customElements.define('cc-dialog', CcDialog);
