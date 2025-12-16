import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixCloseLine as iconClose } from '../../assets/cc-remix.icons.js';
import { findActiveElement, querySelectorDeep } from '../../lib/shadow-dom-utils.js';
import { isStringEmpty } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import { CcCloseEvent, CcFocusRestorationFail, CcOpenEvent } from '../common.events.js';

/**
 * @import { IconModel } from '../common.types.js';
 * @import { PropertyValues } from 'lit';
 * @import { Ref } from 'lit/directives/ref.js';
 */

/**
 * A modal dialog component with optional heading, icon, and close button.
 * Can be opened or closed programmatically or by user action.
 *
 * If both the `heading` prop and the `heading` slot are set, the prop takes precedence.
 *
 * @cssdisplay contents
 *
 * @slot default Dialog content
 * @slot heading - Heading content
 *
 * @csspart dialog - Styles the dialog element, can be used to modify it's positioning, size, layout.
 *
 * @cssprop {Length} --cc-dialog-padding-xl - Sets the value of the padding CSS property when viewport is large (defaults: `4em`).
 * @cssprop {Length} --cc-dialog-padding-sm - Sets the value of the padding CSS property when viewport is narrow (defaults: `2em`).
 * @cssprop {Length} --cc-dialog-padding - Sets the value of the padding CSS property whatever the viewport size may be (defaults: `var(--cc-dialog-padding-xl` or `var(--cc-dialog-padding-sm)` depending on the viewport)`).
 * @cssprop {Width} --cc-dialog-width - Sets the value of the width CSS property (defaults: `38em`). Note that the dialog width will never exceed 80% of the viewport width. If you need to override this, use the `dialog` CSS part.
 */
export class CcDialog extends LitElement {
  static get properties() {
    return {
      closedBy: { type: String, attribute: 'closed-by' },
      heading: { type: String },
      headingIcon: { type: Object, attribute: 'heading-icon' },
      headingIconA11yName: { type: String, attribute: 'heading-icon-a11y-name' },
      hiddenCloseButton: { type: Boolean, attribute: 'hidden-close-button' },
      hiddenHeading: { type: Boolean, attribute: 'hidden-heading' },
      open: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {'any'|'closerequest'|'none'} Indicates which action closes the dialog (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy for more information) */
    this.closedBy = 'any';

    /** @type {string|null}
     * Heading text displayed at the top of the dialog.
     * You must always set this property with a relevant value since it's used to identify the dialog for accessibility.
     * Use the `hiddenHeading` prop to hide it visually if needed.
     * If you need more complex heading content, use the `heading` slot instead.
     */
    this.heading = null;

    /** @type {boolean} Hides the close button when true */
    this.hiddenCloseButton = false;

    /** @type {boolean} Hides the heading when true. Even when hidden, the heading is used as the dialog accessible name. */
    this.hiddenHeading = false;

    /** @type {IconModel|null} Sets the icon before the heading using a `<cc-icon>`. Icon is hidden if nullish. */
    this.headingIcon = null;

    /** @type {string|null}
     * Sets the a11y name for the icon displayed next to the heading.
     * Only use this prop if your icon provides information that is not already given in its surrounding text.
     */
    this.headingIconA11yName = null;

    /** @type {boolean} Displays or hides the dialog */
    this.open = false;

    /** @type {Ref<HTMLDialogElement>} */
    this._dialogRef = createRef();

    /** @type {Element|null} */
    this._openerElement = null;
  }

  /** @param {PropertyValues<CcDialog>} changedProperties */
  updated(changedProperties) {
    const isClosing = changedProperties.get('open') === true && !this.open;
    const isOpening = changedProperties.has('open') && this.open;

    if (isClosing) {
      this._dialogRef.value?.close();
      this._tryToFocusOpenerElement();
      this.dispatchEvent(new CcCloseEvent());
    }

    if (isOpening) {
      this._openerElement = findActiveElement();
      this._dialogRef.value?.showModal();
      this._autofocusOnOpen();
      this.dispatchEvent(new CcOpenEvent());
    }
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

  _autofocusOnOpen() {
    const elementWithAutofocus = querySelectorDeep('[autofocus]', this);
    if (elementWithAutofocus instanceof HTMLElement) {
      elementWithAutofocus.focus();
    }
  }

  _tryToFocusOpenerElement() {
    if (this._openerElement instanceof HTMLElement && this._openerElement.isConnected) {
      this._openerElement.focus();
    } else {
      this.dispatchEvent(new CcFocusRestorationFail(this._openerElement));
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Restore focus to the element that opened the dialog in case the dialog is removed while open
    // This can happen when the dialog is inside a conditional template in which case the native dialog does not support focus restoration
    if (this.open) {
      this._tryToFocusOpenerElement();
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
        @cc-close-request="${this._onDialogClose}"
      >
        ${!this.hiddenCloseButton
          ? html`
              <button class="dialog-close" @click="${this._onDialogClose}">
                <span class="visually-hidden">${i18n('cc-dialog.close')}</span>
                <cc-icon .icon="${iconClose}" size="lg"></cc-icon>
              </button>
            `
          : ''}
        <div class="dialog-heading-wrapper ${classMap({ 'visually-hidden': this.hiddenHeading })}">
          ${this.headingIcon != null
            ? html`
                <cc-icon
                  class="dialog-heading-icon"
                  .icon="${this.headingIcon}"
                  a11y-name="${ifDefined(this.headingIconA11yName)}"
                ></cc-icon>
              `
            : ''}
          ${isStringEmpty(this.heading) ? html`<slot name="heading" id="dialog-heading"></slot>` : ''}
          ${!isStringEmpty(this.heading) ? html` <span id="dialog-heading">${this.heading}</span>` : ''}
        </div>
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
          width: min(var(--cc-dialog-width, 38em), 80%);

          --cc-dialog-padding: var(--cc-dialog-padding-xl);
        }

        /* stylelint-disable-next-line media-feature-range-notation */
        @media screen and (max-width: 25em) {
          dialog {
            --cc-dialog-padding: var(--cc-dialog-padding-sm);
          }
        }

        ::backdrop {
          background: var(--cc-color-bg-backdrop, rgb(30 30 30 / 55%));
        }

        @supports (backdrop-filter: blur(5px)) {
          ::backdrop {
            backdrop-filter: var(--cc-blur-default, blur(5px));
            background: var(--cc-color-bg-backdrop, rgb(30 30 30 / 55%));
          }
        }

        .dialog-close {
          --close-btn-size: 2em;

          align-items: center;
          background: none;
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: var(--cc-color-text-weak);
          cursor: pointer;
          display: flex;
          height: var(--close-btn-size);
          justify-content: center;
          left: 100%;
          margin-top: calc(var(--close-btn-size) * -1);
          position: sticky;
          top: 0;
          transform: translate(2.75em, -2.75em);
          width: var(--close-btn-size);
        }

        .dialog-heading-wrapper cc-icon,
        .dialog-close cc-icon {
          flex: 0 0 auto;
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
