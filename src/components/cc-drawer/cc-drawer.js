import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixCloseLine as iconClose } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-icon/cc-icon.js';
import { CcCloseEvent } from '../common.events.js';

/**
 * @typedef {import('lit').PropertyValues<CcDrawer>} PropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDialogElement>} HTMLDialogElementRef
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

    /** @type {HTMLDialogElementRef} */
    this._dialogRef = createRef();
  }

  /** Opens the drawer */
  show() {
    this.open = true;
  }

  /** Closes the drawer */
  hide() {
    this.open = false;
  }

  /** @param {Event} e */
  _onDialogClose(e) {
    e.preventDefault();
    this.open = false;
  }

  /** @param {PropertyValues} changedProperties */
  updated(changedProperties) {
    if (changedProperties.get('open') === true && !this.open) {
      this._dialogRef.value?.close();
      this.dispatchEvent(new CcCloseEvent());
    }

    if (changedProperties.has('open') && this.open) {
      this._dialogRef.value?.showModal();
    }
  }

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

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          --margin: 2em;

          display: none;
        }

        :host([open]) {
          display: block;
        }

        dialog {
          --border-radius: var(--cc-border-radius-default, 0.25em);

          display: flex;
          flex-direction: column;
          background-color: var(--cc-color-bg-default, #fff);
          max-height: none;
          height: 100%;
          border: none;
          box-sizing: border-box;
          margin-right: 0;
          margin-top: 0;
          margin-bottom: 0;
          padding: 0;
        }

        @media screen and (max-width: 38em) {
          dialog {
            margin-left: 0;
            max-width: none;
            width: 100%;
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

        dialog[open] {
          animation: show 0.2s ease;
        }

        .header {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          padding-bottom: 0.5em;
          border-bottom: 1px solid var(--cc-color-border-primary-weak, #aaa);
          margin: var(--margin);
        }

        .title {
          flex: 1;
          font-weight: bold;
          font-size: 1.2em;
          color: var(--cc-color-text-primary-strongest, #000);
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          color: var(--cc-color-text-weak, #666);

          --cc-icon-size: 1.5em;
        }

        .close-button:focus {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .body {
          flex: 1;
          overflow: auto;
          padding: 0 var(--margin) var(--margin) var(--margin);
        }

        @keyframes show {
          from {
            opacity: 0;
            translate: 100%;
          }
          to {
            opacity: 1;
            translate: 0 0;
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-drawer', CcDrawer);
