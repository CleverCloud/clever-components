import { LitElement, html, css } from 'lit';
import '../cc-notice/cc-notice.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';

/**
 * @typedef {import('./cc-oauth-tokens.types.js').OauthTokensState} OauthTokensState
 */

export class CcOauthTokens extends LitElement {
  static get properties() {
    return {
      tokens: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {OauthTokensState} */
    this.state = { type: 'loading' };
  }

  _onRevokeAllTokens() {
    // TODO
  }

  render() {
    const hasTokens =
      (this.state.type === 'loaded' || this.state.type === 'revoking-all') && this.state.tokens.length > 0;

    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-oauth-tokens.error')}"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-oauth-tokens.main-heading')}</div>
        <div slot="header-right">
          ${hasTokens
            ? html`
                <cc-button
                  class="revoke-all-tokens-button"
                  danger
                  outlined
                  ?waiting=${this.state.type === 'revoking-all'}
                  @cc-button:click=${this._onRevokeAllTokens}
                >
                  ${i18n('cc-oauth-tokens.revoke-all-tokens')}
                </cc-button>
              `
            : ''}
        </div>
        <div slot="content">
          <p>${i18n('cc-oauth-tokens.intro')}</p>
          ${!hasTokens ? html`<p class="empty">${i18n('cc-oauth-tokens.empty')}</p>` : ''}
        </div>
      </cc-block>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .empty {
        border: 1px solid var(--cc-color-border-neutral-weak);
        padding: 1em;
      }
    `;
  }
}

window.customElements.define('cc-oauth-tokens', CcOauthTokens);
