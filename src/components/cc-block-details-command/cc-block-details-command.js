import dedent from 'dedent';
import { css, html, LitElement } from 'lit';
import '../cc-clipboard/cc-clipboard.js';

/**
 * A display component with mostly HTML+CSS and to display CLI commands and be able to copy them.
 * The main purpose is to be used with a cc-block-details.
 *
 * @cssdisplay block
 */
export class CcBlockDetailsCommand extends LitElement {
  static get properties() {
    return {
      _formattedCode: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this._formattedCode = '';
  }

  _onSlotchange(e) {
    const rawText = e.target
      .assignedNodes()
      .map((node) => {
        return node.textContent;
      })
      .join('');
    console.log(e.target.assignedNodes());
    console.log(rawText);
    this._formattedCode = dedent(rawText);
    console.log(this._formattedCode);
  }

  render() {
    return html`
      <slot @slotchange="${this._onSlotchange}"></slot>
      <code>${this._formattedCode}</code>
      <cc-clipboard></cc-clipboard>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
          background-color: var(--cc-color-bg-neutral);
          border: 1px solid #dcdcdc;
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
          word-break: break-all;
          align-items: start;
          padding: 0.5em;
          gap: 0.5em;
        }

        slot {
          display: none;
        }

        code {
          white-space: preserve;
          /* hack chelou à vérifier dans safari */
          font-size: calc(1em);
          /* version qui se base sur c'est 12px dans tous les navigateurs */
          /*font-size: 1.33333em;*/
          flex: 1 1 0;
          line-height: 1.5;
          padding-left: 0.25em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-block-details-command', CcBlockDetailsCommand);

// .description {
//   font-weight: bold;
//   margin: 1em 0 0.5em;
// }
//
// .command-container {
//   align-items: center;
//   background-color: var(--cc-color-bg-neutral);
//   border: 1px solid #dcdcdc;
//   border-radius: var(--cc-border-radius-default, 0.25em);
//   display: flex;
//   font-family: var(--cc-ff-monospace);
//   margin: 0;
//   padding: 0 0.7em;
//   word-break: break-all;
// }
//
// .command {
//   flex: 1;
//   padding: 0.5em 0;
// }
//
// .copy-button {
//   background: none;
//   border: none;
//   border-radius: 0.25em;
//   cursor: pointer;
//   padding: 0.3em;
//   transition: background-color 0.2s ease;
// }
//
// .copy-button:hover {
//   background-color: rgb(0 0 0 / 5%);
// }
