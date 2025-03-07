import { LitElement, html, css } from 'lit';
import { i18n } from '../../translations/translation.js';
import {
  iconRemixDeleteBinLine as iconDelete,
  iconRemixHistoryLine as iconLastUsed,
  iconRemixCalendar_2Fill as iconCreation,
  iconRemixAlertLine as iconExpiration,
  iconRemixRadioButtonLine as iconCurrentSession,
} from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-badge/cc-badge.js';

/**
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenState} SessionTokenState
 * @typedef {import('./cc-session-tokens.types.js').SessionTokensState} SessionTokensState
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit').PropertyValues<CcSessionTokens>} CcSessionTokensPropertyValues
 */

/**
 * A web component that displays and manages user session tokens
 *
 * This component allows users to view their active session tokens and revoke individual tokens or all tokens at once.
 *
 * @fires {CustomEvent<string>} delete-token - Dispatched when a user requests to delete a specific token
 * @fires {CustomEvent} revoke-all-tokens - Dispatched when a user requests to revoke all tokens
 */
export class CcSessionTokens extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {SessionTokensState} The current state of the session tokens component */
    this.state = { type: 'loading' };
  }

  /**
   * Handles the revocation of all tokens
   *
   * @private
   */
  _onRevokeAllTokens() {
    dispatchCustomEvent(this, 'revoke-all-tokens');
  }

  /**
   * Handles the revocation of a specific token
   *
   * @param {string} tokenId - The ID of the token to be revoked
   * @private
   */
  _onRevokeToken(tokenId) {
    dispatchCustomEvent(this, 'delete-token', tokenId);
  }

  /** @param {CcSessionTokensPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && this.state.type === 'loaded') {
      this._sortedAndFormattedTokens = this.state.tokens.sort(
        (tokenA, tokenB) => new Date(tokenA.creationDate).getTime() - new Date(tokenB.creationDate).getTime(),
      );
      console.log(this._sortedAndFormattedTokens);
    }
  }

  render() {
    const hasTokens = this.state.type === 'loaded' && this.state.tokens.length > 0;
    // TODO: maybe we want individual waiting state for each token when revoking all :thinking:
    const areAllTokensRevoking =
      this.state.type === 'loaded' && hasTokens && this.state.tokens.every((token) => token.type === 'revoking');

    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-session-tokens.error')}"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-session-tokens.main-heading')}</div>
        ${this.state.type === 'loaded' && hasTokens
          ? html`
              <div slot="header-right">
                <cc-button danger outlined .waiting=${areAllTokensRevoking} @cc-button:click=${this._onRevokeAllTokens}>
                  ${i18n('cc-session-tokens.revoke-all-tokens')}
                </cc-button>
              </div>
            `
          : ''}
        <div class="session-tokens-wrapper" slot="content">
          <p>${i18n('cc-session-tokens.intro')}</p>
          ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
          ${this.state.type === 'loaded'
            ? html`
                <!-- TODO: A11Y when we add headings inside cards (User Agent / IP Address or whatever), we should remove the ul / li structure -->
                <ul class="session-tokens-wrapper__list">
                  ${this.state.tokens.map((token, index) => this._renderToken(token, index))}
                </ul>
              `
            : ''}
        </div>
      </cc-block>
    `;
  }

  /**
   * Renders an individual token card
   *
   * @param {SessionTokenState} token - The token data to render
   * @param {number} index - The index of the token in the list
   * @returns {TemplateResult} The rendered token card
   * @private
   */
  _renderToken({ type, id, creationDate, expirationDate, lastUsedDate, isCurrentSession, expiresSoon }, index) {
    return html`
      <div class="session-token-card">
        ${isCurrentSession
          ? html`
              <div class="session-token-card__current-session">
                <cc-icon .icon=${iconCurrentSession}></cc-icon>
                <span>${i18n('cc-session-tokens.card.current-session')}</span>
              </div>
            `
          : ''}
        <dl class="session-token-card__info">
          <div class="session-token-card__info__last-used">
            <dt>
              <cc-icon .icon=${iconLastUsed}></cc-icon>
              ${i18n('cc-session-tokens.card.label.last-used')}
            </dt>
            <dd>${i18n('cc-session-tokens.card.human-friendly-date', { date: lastUsedDate })}</dd>
          </div>
          <div>
            <dt>
              <cc-icon .icon=${iconCreation}></cc-icon>
              ${i18n('cc-session-tokens.card.label.creation')}
            </dt>
            <dd>${i18n('cc-session-tokens.card.human-friendly-date', { date: creationDate })}</dd>
          </div>
          <div class="session-token-card__info__expiration">
            <dt>
              <cc-icon .icon=${iconExpiration}></cc-icon>
              ${i18n('cc-session-tokens.card.label.expiration')}
            </dt>
            <dd>
              <span>${i18n('cc-session-tokens.card.human-friendly-date', { date: expirationDate })}</span>
              ${expiresSoon
                ? html` <cc-badge intent="warning">${i18n('cc-session-tokens.card.deadline-approaches')}</cc-badge> `
                : ''}
            </dd>
          </div>
        </dl>
        <cc-button
          danger
          outlined
          hide-text
          .icon=${iconDelete}
          circle
          .waiting=${type === 'revoking'}
          @cc-button:click=${() => this._onRevokeToken(id)}
        >
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

      ul,
      dl,
      dd,
      dt {
        margin: 0;
        padding: 0;
      }

      .session-tokens-wrapper__list {
        display: grid;
        gap: 1em;
      }

      .session-token-card {
        align-items: center;
        border: solid 1px var(--cc-color-border-neutral-weak);
        border-radius: var(--cc-border-radius-default);
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em 1em;
        justify-content: space-between;
        padding: 1em;
      }

      .session-token-card__info {
        display: flex;
        gap: 1.5em;
      }

      .session-token-card__info__last-used {
        font-style: italic;
      }

      .session-token-card__info__expiration {
        font-weight: bold;
      }

      dl div {
        display: flex;
        gap: 0.5em;
      }

      dt {
        align-items: center;
        display: flex;
        gap: 0.5em;

        --cc-icon-size: 1.2em;
      }

      /* Remove spacing below the font so that it matches dt spacing */
      dd {
        align-items: center;
        display: flex;
        gap: 0.5em;
      }

      dd cc-badge {
        font-weight: normal;
      }
    `;
  }
}

customElements.define('cc-session-tokens', CcSessionTokens);
