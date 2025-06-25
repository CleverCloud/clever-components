import { css, html, LitElement } from 'lit';
import { iconRemixFileCopyLine as iconCopy, iconRemixCheckLine as iconSuccess } from '../../assets/cc-remix.icons.js';
import { copyToClipboard } from '../../lib/clipboard.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('lit').PropertyValues<CcClipboard>} CcClipboardPropertyValues
 */

/**
 * A component to copy text to clipboard with visual feedback.
 *
 * ## Details
 *
 * * Provides a button to copy text to the clipboard
 * * Shows visual feedback when copy operation succeeds or fails
 * * Supports skeleton loading state
 *
 * @cssdisplay block
 */
export class CcClipboard extends LitElement {
  static get properties() {
    return {
      value: { type: String },
      _copied: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {string|null} The text value to copy to clipboard. */
    this.value = null;

    /** @type {boolean} */
    this._copied = false;
  }

  async _copyToClipboard() {
    await copyToClipboard(this.value);
    this._copied = true;
    setTimeout(() => {
      this._copied = false;
    }, 2000);
  }

  render() {
    return html`
      <button
        type="button"
        class="copy-button"
        @click=${this._copyToClipboard}
        title="${i18n('cc-clipboard.copy', { text: this.value })}"
      >
        <cc-icon class="copy-icon" .icon="${this._copied ? iconSuccess : iconCopy}" size="lg"></cc-icon>
        <span class="visually-hidden"> ${i18n('cc-clipboard.copy', { text: this.value })} </span>
      </button>
      <span class="visually-hidden" aria-live="polite"> ${this._copied ? i18n('cc-clipboard.copied') : ''} </span>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .copy-button {
          background: transparent;
          border: none;
          border-radius: var(--cc-border-radius-small, 0.15em);
          cursor: pointer;
          display: block;
          font-family: inherit;
          font-size: unset;
          margin: 0;
          padding: 0;
        }

        .copy-button:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .copy-button:active,
        .copy-button:hover {
          box-shadow: none;
          outline: 0;
        }

        .copy-button:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .copy-icon {
          --cc-icon-color: var(--cc-input-btn-icons-color, #595959);

          box-sizing: border-box;
          padding: 15%;
        }

        .copy-icon:hover {
          --cc-icon-color: var(--cc-color-text-primary);
        }
      `,
    ];
  }
}

window.customElements.define('cc-clipboard', CcClipboard);
