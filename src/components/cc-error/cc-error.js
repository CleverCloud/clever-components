import '../cc-button/cc-button.js';
import '../cc-loader/cc-loader.js';
import '../cc-icon/cc-icon.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixInformationFill as iconInfo,
  iconRemixAlertFill as iconWarning,
} from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';

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
      <div>
        <cc-icon
          class="${classMap({ notice: this.notice, warning: !this.notice })}"
          .icon=${this.notice ? iconInfo : iconWarning}
        ></cc-icon>
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

          :host([mode='info']),
          :host([mode='loading']),
          :host([mode='confirm']) {
            display: grid;
            align-items: center;
            justify-content: center;
            padding: 1em;
            border: 1px solid var(--cc-color-border-neutral, #aaa);
            background-color: var(--cc-color-bg-default, #fff);
            border-radius: var(--cc-border-radius-default, 0.25em);
            box-shadow: 0 0 1em rgb(0 0 0 / 40%);
            grid-gap: 1em;
            justify-items: center;
          }

          :host([mode='loading']) {
            grid-template-columns: min-content auto;
          }

          cc-loader {
            width: 1.5em;
            height: 1.5em;
          }

          cc-icon {
            --cc-icon-size: 1.1em;
            
            margin-right: 0.4em;
          }
          
          .notice {
            --cc-icon-color: var(--cc-color-text-primary);
          }

          .warning {
            --cc-icon-color: var(--cc-color-text-warning);
          }

          cc-button {
            display: block;
          }
      `,
    ];
  }
}

window.customElements.define('cc-error', CcError);
