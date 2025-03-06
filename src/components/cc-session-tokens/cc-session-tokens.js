import { LitElement, html, css } from 'lit';
import { i18n } from '../../translations/translation.js';
import { iconRemixDeleteBinLine as iconDelete } from '../../assets/cc-remix.icons.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';

/**
 * @typedef {import('./cc-session-tokens.types.js').SessionToken} SessionToken
 * @typedef {import('./cc-session-tokens.types.js').SessionTokensState} SessionTokensState
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

export class CcSessionTokens extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {SessionTokensState} */
    this.state = { type: 'loading' };
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-session-tokens.error')}"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-session-tokens.main-heading')}</div>
        <div slot="header-right">
          <cc-button danger outlined>${i18n('cc-session-tokens.revoke-all-tokens')}</cc-button>
        </div>
        <div class="session-tokens-wrapper" slot="content">
          ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
          ${this.state.type === 'loaded'
            ? html`
                <ul>
                  ${this.state.tokens.map((token, index) => this._renderToken(token, index))}
                </ul>
              `
            : ''}
        </div>
      </cc-block>
    `;
  }

  /**
   * @param {SessionToken} token
   * @param {number} index
   * @returns {TemplateResult}
   */
  _renderToken({ creationDate, expirationDate, lastUsedDate }, index) {
    return html`
      <div class="session-token-card">
        <div>${creationDate}</div>
        <div>${expirationDate}</div>
        <div>${lastUsedDate}</div>
        <cc-button danger outlined hide-text .icon=${iconDelete} circle>
          ${i18n('cc-session-tokens.revoke-token', { tokenNumber: index })}
        </cc-button>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .session-token-card {
        border: 1px solid #ccc;
        /* TODO grid with spacing so that diff dates don't have diff spacing */
        display: flex;
        gap: 1em;
        padding: 10px;
      }
    `;
  }
}

customElements.define('cc-session-tokens', CcSessionTokens);
