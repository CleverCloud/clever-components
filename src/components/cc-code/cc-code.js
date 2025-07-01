import { css, html, LitElement } from 'lit';
import { dedent } from '../../lib/utils.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLSlotElement>} SlotChangeEvent
 */

/**
 * A display component to show code or command examples and a built-in copy button.
 * @cssdisplay block
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
  }

  /**
   * @param {SlotChangeEvent} e
   * @private
   */
  _onSlotchange(e) {
    const rawText = e.target
      .assignedNodes()
      .map((node) => {
        return node.textContent;
      })
      .join('');
    this._formattedCode = dedent(rawText);
  }

  render() {
    return html`
      <slot @slotchange="${this._onSlotchange}"></slot>
      <code>${this._formattedCode}</code>
      <cc-clipboard value="${this._formattedCode}"></cc-clipboard>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          align-items: start;
          background-color: var(--cc-color-bg-neutral);
          border: 1px solid #dcdcdc;
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
          font-size: calc(1em);
          line-height: 1.5;
          padding-left: 0.25em;
          white-space: preserve;
        }
      `,
    ];
  }
}

window.customElements.define('cc-code', CcCode);
