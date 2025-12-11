import dedent from 'dedent';
import { css, html, LitElement } from 'lit';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-icon/cc-icon.js';

/**
 * @import { EventWithTarget } from '../../lib/events.types.js'
 */

/**
 * A display component to show code or command examples and a built-in copy button.
 *
 * @cssdisplay block
 *
 * @slot - Sets code or command.
 */
export class CcCode extends LitElement {
  static get properties() {
    return {
      _formattedCode: { type: String, state: true },
    };
  }

  constructor() {
    super();

    this._formattedCode = '';
    this._mutationObserver = new MutationObserver(() => {
      this._formatCode();
    });
  }

  /**
   * @param {EventWithTarget<HTMLSlotElement>} e
   * @private
   */
  _onSlotchange(e) {
    this._mutationObserver.disconnect();
    e.target.assignedNodes().forEach((node) => {
      this._mutationObserver.observe(node, {
        characterData: true,
        subtree: true,
      });
    });

    this._formatCode();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mutationObserver.disconnect();
  }

  render() {
    return html`
      <slot @slotchange="${this._onSlotchange}"></slot>
      <code tabindex="0">${this._formattedCode}</code>
      <cc-clipboard value="${this._formattedCode}"></cc-clipboard>
    `;
  }

  _formatCode() {
    const textContent = this.shadowRoot
      .querySelector('slot')
      .assignedNodes()
      .map((node) => node.textContent)
      .join('');
    this._formattedCode = dedent(textContent);
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          align-items: start;
          background-color: var(--cc-color-bg-neutral);
          border: 1px solid var(--cc-color-border-neutral, #bfbfbf);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          font-family: var(--cc-ff-monospace), serif;
          gap: 0.5em;
          padding: 0.5em;
          word-break: break-all;
        }

        slot {
          display: none;
        }

        code {
          flex: 1 1 0;
          font-size: calc(1em); /* Force font size to 14px */
          line-height: 1.5;
          overflow-x: auto;
          padding-left: 0.25em;
          white-space: pre;
        }
      `,
    ];
  }
}

window.customElements.define('cc-code', CcCode);
