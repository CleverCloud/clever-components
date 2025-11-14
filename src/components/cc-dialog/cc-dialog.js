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
import { CcDialogCloseEvent, CcDialogConfirmEvent, CcDialogOpenEvent } from './cc-dialog.events.js';

/**
 * @typedef {import('../common.types.d.ts').IconModel} IconModel
 * @typedef {import('lit').PropertyValues<CcDialog>} CcDialogPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDialogElement>} HTMLDialogElementRef
 * @typedef {import('../../lib/form/validation.js').Validator} Validator
 */

/**
 * TODO: dialog-confirm / dialog-close or hide or cancel
 */
export class CcDialog extends LitElement {
  static get properties() {
    return {
      closedBy: { type: String, attribute: 'closed-by' },
      heading: { type: String },
      hiddenCloseButton: { type: Boolean, attribute: 'hidden-close-button' },
      icon: { type: Object },
      iconA11yName: { type: String, attribute: 'icon-a11y-name' },
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
    this.icon = null;

    /** @type {string|null} Only use this prop if your icon provides information that is not already given in its surrounding text. */
    this.iconA11yName = null;

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
      console.log('WAS OPEN so focusing');
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

  _setLastFocusElements() {
    this._lastFocusedElement = findActiveElement();
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  /** @param {Event} e */
  _onDialogClose(e) {
    e?.preventDefault();
    this.open = false;
  }

  _onDialogConfirm() {
    this.dispatchEvent(new CcDialogConfirmEvent());
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
    this._tryToFocusOpeningElement();
  }

  render() {
    // TODO: heading wrapper only if heading or slotted heading + icon in slotted heading?
    return html`
      <dialog
        aria-labelledby="dialog-heading"
        closedby="${this.closedBy}"
        ${ref(this._dialogRef)}
        @cancel="${this._onDialogClose}"
      >
        <div class="dialog-padding">
          ${!this.hiddenCloseButton
            ? html`
                <button class="dialog-close" @click="${this._onDialogClose}">
                  <span class="visually-hidden">${i18n('cc-dialog.close')}</span>
                  <cc-icon .icon="${iconClose}"></cc-icon>
                </button>
              `
            : ''}
          <div class="dialog-heading-wrapper">
            ${this.icon
              ? html`
                  <cc-icon
                    class="dialog-heading-icon"
                    .icon="${this.icon}"
                    a11y-name="${ifDefined(this.iconA11yName)}"
                  ></cc-icon>
                `
              : ''}
            ${!isStringEmpty(this.heading) ? this.heading : html`<slot name="heading" id="dialog-heading"></slot>`}
          </div>
          <div class="dialog-content-body-wrapper">
            <slot></slot>
          </div>
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
          container: dialog / inline-size;
          padding: 0;
          width: min(38em, 80%);
        }

        .dialog-padding {
          padding: 4em;
        }

        @container dialog (max-width: 37em) {
          .dialog-padding {
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
