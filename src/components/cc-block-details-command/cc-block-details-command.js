import { css, html, LitElement } from 'lit';
import { iconRemixFileCopyLine as iconCopy, iconRemixCheckLine as iconSuccess } from '../../assets/cc-remix.icons.js';
import '../cc-icon/cc-icon.js';

/**
 * A display component with mostly HTML+CSS and to display CLI commands and be able to copy them.
 * The main purpose is to be used with a cc-block-details.
 *
 * @cssdisplay block
 *
 */

export class CcBlockDetailsCommand extends LitElement {
  static get properties() {
    return {
      command: { type: String },
      description: { type: String },
      _copied: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {String} Sets the command. */
    this.command = '';

    /** @type {String} Sets the command description. */
    this.description = '';

    /** @type {Boolean} Feedback state for copy action. */
    this._copied = false;
  }

  /** @private */
  async _copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.command);
      this._copied = true;
      setTimeout(() => (this._copied = false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }

  render() {
    return html`
      <div class="description">${this.description}</div>
      <div class="command-container">
        <code class="command">${this.command}</code>
        <button class="copy-button" @click=${this._copyToClipboard} title="Copy command">
          <cc-icon .icon="${this._copied ? iconSuccess : iconCopy}" size="lg"></cc-icon>
        </button>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .description {
          font-weight: bold;
          margin: 1em 0 0.5em;
        }

        .command-container {
          align-items: center;
          background-color: var(--cc-color-bg-neutral);
          border: 1px solid #dcdcdc;
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          font-family: var(--cc-ff-monospace);
          padding: 0 0.7em;
          word-break: break-all;
        }

        .command {
          flex: 1;
          padding: 0.5em 0;
        }

        .copy-button {
          background: none;
          border: none;
          border-radius: 0.25em;
          cursor: pointer;
          padding: 0.3em;
          transition: background-color 0.2s ease;
        }

        .copy-button:hover {
          background-color: rgb(0 0 0 / 5%);
        }
      `,
    ];
  }
}

window.customElements.define('cc-block-details-command', CcBlockDetailsCommand);
