import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixCloseLine as iconClose } from '../../assets/cc-remix.icons.js';
import { findActiveElement, querySelectorDeep } from '../../lib/shadow-dom-utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import { CcCloseEvent, CcFocusRestorationFailEvent, CcOpenEvent } from '../common.events.js';

/**
 * @import { PropertyValues } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 * A side panel that slides in from the right side of the screen.
 *
 * @cssdisplay block
 * @slot - The content of the drawer
 */
export class CcDrawer extends LitElement {
  static get properties() {
    return {
      heading: { type: String },
      open: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {string|null} The header of the drawer */
    this.heading = null;

    /** @type {Boolean} Whether the drawer is opened */
    this.open = false;

    /** @type {Ref<HTMLDialogElement>} */
    this._dialogRef = createRef();

    /** @type {Element|null} */
    this._openerElement = null;
  }

  //#region Public methods

  /** Opens the drawer */
  show() {
    this.open = true;
  }

  /** Closes the drawer */
  hide() {
    this.open = false;
  }

  //#endregion

  //#region Private methods

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
      this.dispatchEvent(new CcFocusRestorationFailEvent(this._openerElement));
    }
  }

  //#endregion

  //#region Event handlers

  /** @param {Event} e */
  _onDialogClose(e) {
    e.preventDefault();
    this.open = false;
  }

  //#endregion

  //#region CustomElement lifecycle methods

  disconnectedCallback() {
    super.disconnectedCallback();
    // Restore focus to the element that opened the dialog in case the dialog is removed while open
    // This can happen when the dialog is inside a conditional template in which case the native dialog does not support focus restoration
    if (this.open) {
      this._tryToFocusOpenerElement();
    }
  }

  //#endregion

  //#region Lit lifecycle methods

  /** @param {PropertyValues<CcDrawer>} changedProperties */
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

  //#endregion

  //#region Rendering methods

  render() {
    return html`<dialog ${ref(this._dialogRef)} aria-labelledby="title" closedby="any" @cancel="${this._onDialogClose}">
      <div class="header">
        <div class="title" id="title">${this.heading}</div>
        <button class="close-button" @click=${this._onDialogClose}>
          <span class="visually-hidden">${i18n('cc-drawer.close')}</span>
          <cc-icon .icon=${iconClose}></cc-icon>
        </button>
      </div>
      <div class="body"><slot></slot></div>
    </dialog>`;
  }

  //#endregion

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          --margin: 2em;
          --padding: 2em;

          display: none;
        }

        :host([open]) {
          display: block;
        }

        dialog {
          background-color: var(--cc-color-bg-default, #fff);
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-shadow: 2px 4px 8px 0 rgb(0 0 0 / 12%);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          height: calc(100% - var(--margin) * 2);
          margin-bottom: var(--margin);
          margin-right: var(--margin);
          margin-top: var(--margin);
          max-height: none;
          padding: 0;
        }

        /* stylelint-disable-next-line media-feature-range-notation */
        @media screen and (max-width: 38em) {
          dialog {
            margin-left: 0;
            max-width: none;
            width: 100%;
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

        dialog[open] {
          animation: show 0.2s ease;
        }

        .header {
          align-items: center;
          border-bottom: 1px solid var(--cc-color-border-primary-weak, #aaa);
          display: flex;
          flex-wrap: nowrap;
          margin: var(--padding);
          padding-bottom: 0.5em;
        }

        .title {
          color: var(--cc-color-text-primary-strongest, #000);
          flex: 1;
          font-size: 1.2em;
          font-weight: bold;
        }

        .close-button {
          background: none;
          border: none;
          color: var(--cc-color-text-weak, #666);
          cursor: pointer;
          padding: 0;

          --cc-icon-size: 1.5em;
        }

        .close-button:focus-visible {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .body {
          flex: 1;
          overflow: auto;
          padding: 0 var(--padding) var(--padding) var(--padding);
        }

        @keyframes show {
          from {
            translate: 100%;
          }

          to {
            translate: 0 0;
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-drawer', CcDrawer);
