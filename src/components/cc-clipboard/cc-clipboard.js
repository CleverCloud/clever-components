import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconRemixFileCopyLine as iconCopy, iconRemixCheckLine as iconSuccess } from '../../assets/cc-remix.icons.js';
import { copyToClipboard } from '../../lib/clipboard.js';
import { isStringEmpty } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';

/**
 * A component to copy text to clipboard with visual feedback.
 *
 * ## Details
 *
 * * Provides a button to copy text to the clipboard
 * * Shows visual feedback when copy operation succeeds
 *
 * @cssdisplay block
 *
 * @cssprop {Color} --cc-clipboard-color - The text and icon color of the clipboard button (defaults: `#000`).
 */
export class CcClipboard extends LitElement {
  static get properties() {
    return {
      skeleton: { type: Boolean },
      value: { type: String },
      _copied: { type: Boolean, state: true },
    };
  }

  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  constructor() {
    super();

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {string|null} The text value to copy to clipboard. */
    this.value = null;

    /** @type {boolean} */
    this._copied = false;
  }

  async _copyToClipboard() {
    if (this.skeleton) {
      return;
    }
    await copyToClipboard(this.value);
    this._copied = true;
    setTimeout(() => {
      this._copied = false;
    }, 2000);
  }

  render() {
    const tabIndex = this.skeleton ? -1 : null;

    return html`
      <button
        type="button"
        tabindex=${ifDefined(tabIndex)}
        class=${classMap({ skeleton: this.skeleton })}
        aria-disabled=${this.skeleton}
        @click=${this._copyToClipboard}
        title=" ${!isStringEmpty(this.value)
          ? i18n('cc-clipboard.copy', { text: this.value })
          : i18n('cc-clipboard.copy.empty')}"
      >
        <cc-icon class="copy-icon" .icon="${this._copied ? iconSuccess : iconCopy}" size="lg"></cc-icon>
        <span class="visually-hidden">
          ${!isStringEmpty(this.value)
            ? i18n('cc-clipboard.copy', { text: this.value })
            : i18n('cc-clipboard.copy.empty')}
        </span>
      </button>
      <span class="visually-hidden" aria-live="polite"> ${this._copied ? i18n('cc-clipboard.copied') : ''} </span>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        button {
          background: transparent;
          border: none;
          border-radius: var(--cc-border-radius-small, 0.15em);
          color: var(--cc-clipboard-color, var(--cc-color-text-default, #000));
          cursor: pointer;
          display: block;
          font-family: inherit;
          font-size: unset;
          margin: 0;
          padding: 0;
        }

        button:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        button:not(.skeleton):hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .copy-icon {
          box-sizing: border-box;
          padding: 15%;
        }

        .skeleton {
          background-color: #bbb;
          border-color: #777;
          color: transparent;
        }
      `,
    ];
  }
}

window.customElements.define('cc-clipboard', CcClipboard);
