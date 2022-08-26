import '../cc-button/cc-button.js';
import '../cc-loader/cc-loader.js';
import { css, html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';

const noticeSvg = new URL('../../assets/notice.svg', import.meta.url).href;
const warningSvg = new URL('../../assets/warning.svg', import.meta.url).href;

/**
 * @typedef {import('./cc-error.types.js').ErrorModeType} ErrorModeType
 */

/**
 * A display component for error messages with 4 modes: inline (default), info, loading or confirm.
 *
 * ## Details
 *
 * * Use `"inline"` mode when you want to display the message as simple text.
 * * Use `"info"` when you want to display the message in a bordered "box".
 * * Use `"loading"` when you want to display the message in a bordered "box" with a loader.
 * * Use `"confirm"` when you want to display the message in a bordered "box" with a confirm "OK" button.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-error:ok - Fires when the OK button is clicked.
 *
 * @slot - The content of the error message.
 */
export class CcError extends LitElement {

  static get properties () {
    return {
      mode: { type: String, reflect: true },
      notice: { type: Boolean },
    };
  }

  constructor () {
    super();

    /** @type {ErrorModeType}  Sets the displays mode (see details). */
    this.mode = 'inline';
    this.notice = false;
  }

  _onOkClick () {
    dispatchCustomEvent(this, 'ok');
  }

  render () {
    return html`
      ${this.mode === 'loading' ? html`
        <cc-loader></cc-loader>
      ` : ''}
      <div><img src=${this.notice ? noticeSvg : warningSvg} alt="">
        <slot></slot>
      </div>
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
              background-color: var(--cc-color-bg-default, #fff);
              border: 1px solid #bcc2d1;
              border-radius: 0.25em;
              box-shadow: 0 0 1em rgba(0, 0, 0, 0.4);
              display: grid;
              grid-gap: 1em;
              justify-content: center;
              justify-items: center;
              padding: 1em;
          }

          :host([mode="loading"]) {
              grid-template-columns: min-content auto;
          }

          cc-loader {
              height: 1.5em;
              width: 1.5em;
          }

          img {
              display: inline-block;
              height: 1em;
              margin-right: 0.4em;
              margin-top: 0.1em;
              vertical-align: text-top;
              width: 1em;
          }

          cc-button {
              display: block;
          }
      `,
    ];
  }
}

window.customElements.define('cc-error', CcError);
