import '../atoms/cc-button.js';
import '../atoms/cc-loader.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';

const warningSvg = new URL('../assets/warning.svg', import.meta.url).href;

/**
 * A display component for error messages with 4 modes: inline (default), info, loading or confirm.
 *
 * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/molecules/cc-error.js)
 *
 * ## Details
 *
 * * Use `"inline"` mode when you want to display the message as simple text.
 * * Use `"info"` when you want to display the message in a bordered "box".
 * * Use `"loading"` when you want to display the message in a bordered "box" with a loader.
 * * Use `"confirm"` when you want to display the message in a bordered "box" with a confirm "OK" button.
 *
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="assets/warning.svg" style="height: 1.5rem; vertical-align: middle"> | <code>warning.svg</code>
 *
 * @prop {"inline"|"info"|"loading"|"confirm"} mode - Sets the displays mode (see details).
 *
 * @event {CustomEvent} cc-error:ok - Fires when the OK button is clicked.
 *
 * @slot - The content of the error message.
 */
export class CcError extends LitElement {

  static get properties () {
    return {
      mode: { type: String, reflect: true },
    };
  }

  constructor () {
    super();
    this.mode = 'inline';
  }

  _onOkClick () {
    dispatchCustomEvent(this, 'ok');
  }

  render () {
    return html`
      ${this.mode === 'loading' ? html`
        <cc-loader></cc-loader>
      ` : ''}
      <div><img src=${warningSvg} alt=""><slot></slot></div>
      ${this.mode === 'confirm' ? html`
        <cc-button @cc-button:click=${this._onOkClick}>${i18n('cc-error.ok')}</cc-button>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        :host([mode="info"]),
        :host([mode="loading"]),
        :host([mode="confirm"]) {
          align-items: center;
          background-color: white;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          box-shadow: 0 0 1rem #aaa;
          display: grid;
          grid-gap: 1rem;
          justify-content: center;
          justify-items: center;
          padding: 1rem;
        }

        :host([mode="loading"]) {
          grid-template-columns: min-content auto;
        }

        cc-loader {
          height: 1.5rem;
          width: 1.5rem;
        }

        img {
          display: inline-block;
          height: 1rem;
          margin-right: 0.4rem;
          margin-top: 0.1rem;
          vertical-align: text-top;
          width: 1rem;
        }

        cc-button {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-error', CcError);
