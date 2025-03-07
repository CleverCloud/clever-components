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
 */

/**
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenState} SessionTokenState
 * @typedef {import('./cc-session-tokens.types.js').SessionTokensState} SessionTokensState
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenStateWitExpiresSoon} SessionTokenStateWithExpiresSoon
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit').PropertyValues<CcSessionTokens>} CcSessionTokensPropertyValues
 */

/**
 * A web component that displays and manages user session tokens
 *
 * This component allows users to view their active session tokens and revoke individual tokens or all tokens at once.
 *
 * TODO: fix doc cause details not string
 * @fires {CustomEvent<string>} cc-session-tokens:revoke-token - Dispatched when a user requests to delete a specific token
 * @fires {CustomEvent} cc-session-tokens:revoke-all-tokens - Dispatched when a user requests to revoke all tokens
 */
export class CcSessionTokens extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _sortedAndFormattedTokens: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {SessionTokensState} The current state of the session tokens component */
    this.state = { type: 'loading' };

    /** @type {Array<SessionTokenStateWithExpiresSoon>|null} Array of session tokens sorted by creation date with added expiration information */
    this._sortedAndFormattedTokens = null;
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
    dispatchCustomEvent(this, 'revoke-token', tokenId);
  }

  /**
   * Adds expiration information to a token based on time remaining
   *
   * @param {SessionTokenState} token - The token to process
   * @returns {SessionTokenStateWithExpiresSoon} The token with added expiration information
   * @private
   */
  _addExpireSoon(token) {
    const expirationDate = new Date(token.expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Determine threshold based on total expiration length
    let thresholdDays;
    if (daysUntilExpiration <= 7) {
      thresholdDays = 2; // For short expirations (up to a week), warn at 2 days
    } else if (daysUntilExpiration <= 30) {
      thresholdDays = 7; // For medium expirations (up to a month), warn at 7 days
    } else if (daysUntilExpiration <= 60) {
      thresholdDays = 10; // For longer expirations (up to 2 months), warn at 10 days
    } else if (daysUntilExpiration <= 90) {
      thresholdDays = 20; // For even longer expirations (up to 3 months), warn at 20 days
    } else {
      thresholdDays = 30; // For very long expirations, warn at 30 days
    }

    const expiresSoon = daysUntilExpiration <= thresholdDays;
    return { ...token, expiresSoon };
  }

  /** @param {CcSessionTokensPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && this.state.type === 'loaded') {
      this._sortedAndFormattedTokens = [...this.state.tokens]
        .sort((tokenA, tokenB) => {
          // Current session always comes first
          if (tokenA.isCurrentSession) {
            return -1;
          }
          if (tokenB.isCurrentSession) {
            return 1;
          }
          // Then sort by creation date (newest first)
          return new Date(tokenB.creationDate).getTime() - new Date(tokenA.creationDate).getTime();
        })
        .map(this._addExpireSoon);
    }
  }

  render() {
    const hasTokens = this.state.type === 'loaded' && this.state.tokens.length > 0;
    // TODO: maybe we want individual waiting state for each token when revoking all :thinking:
    const areAllTokensRevoking =
      this.state.type === 'loaded' &&
      hasTokens &&
      // TODO: do we want revoke all tokens to also remove current session and logout user? This is what the API does
      // => no, let's use the initial approach and call revokeOneToken from the smart on every token except the current session
      // => should we have a state for revoking all tokens?
      // a state for revoking all tokens would be better because it would only be triggered when the user explicitly wants to revoke all tokens
      // while the logic below is triggered when the user removes all tokens by hand fast enough (only likely to happen with 2 tokens current + another)
      this._sortedAndFormattedTokens.length > 2 &&
      this._sortedAndFormattedTokens.every((token) => token.type === 'revoking');

    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-session-tokens.error')}"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-session-tokens.main-heading')}</div>
        <div slot="header-right">
          <cc-button
            danger
            outlined
            .waiting=${areAllTokensRevoking}
            ?disabled=${!hasTokens}
            @cc-button:click=${this._onRevokeAllTokens}
          >
            ${i18n('cc-session-tokens.revoke-all-tokens')}
          </cc-button>
        </div>
        <div slot="content">
          <p>${i18n('cc-session-tokens.intro')}</p>
          <div class="session-tokens-wrapper">
            ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
            ${this.state.type === 'loaded'
              ? html`
                  <!-- TODO: A11Y when we add headings inside cards (User Agent / IP Address or whatever), we should remove the ul / li structure -->
                  <ul class="session-tokens-wrapper__list">
                    ${this._sortedAndFormattedTokens.map((token, index) => this._renderToken(token, index))}
                  </ul>
                `
              : ''}
          </div>
        </div>
      </cc-block>
    `;
  }

  /**
   * Renders an individual token card
   *
   * @param {SessionTokenStateWithExpiresSoon} token - The token data to render
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
              <span>${i18n('cc-session-tokens.card.label.last-used')}</span>
            </dt>
            <dd>${i18n('cc-session-tokens.card.human-friendly-date', { date: lastUsedDate })}</dd>
          </div>
          <div>
            <dt>
              <cc-icon .icon=${iconCreation}></cc-icon>
              <span>${i18n('cc-session-tokens.card.label.creation')}</span>
            </dt>
            <dd>${i18n('cc-session-tokens.card.human-friendly-date', { date: creationDate })}</dd>
          </div>
          <div class="session-token-card__info__expiration">
            <dt>
              <cc-icon .icon=${iconExpiration}></cc-icon>
              <span>${i18n('cc-session-tokens.card.label.expiration')}</span>
            </dt>
            <dd>
              <span>${i18n('cc-session-tokens.card.human-friendly-date', { date: expirationDate })}</span>
            </dd>
            ${expiresSoon
              ? html` <cc-badge intent="warning">${i18n('cc-session-tokens.card.deadline-approaches')}</cc-badge> `
              : ''}
          </div>
        </dl>
        ${!isCurrentSession
          ? html`
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
            `
          : ''}
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

      p {
        margin: 0;
      }

      .session-tokens-wrapper {
        margin-top: 2.5em;
      }

      .session-tokens-wrapper__list {
        display: grid;
        gap: 1.5em;
      }

      .session-token-card {
        align-items: center;
        border: solid 1px var(--cc-color-border-neutral-weak);
        border-radius: var(--cc-border-radius-default);
        display: grid;
        gap: 0.5em 1em;
        grid-template-columns: 1fr auto;
        justify-content: space-between;
        padding: 1em;
      }

      .session-token-card__current-session {
        --cc-icon-size: 1.2em;

        align-items: center;
        color: var(--cc-color-text-success);
        display: flex;
        font-weight: bold;
        gap: 0.5em;
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        margin-bottom: 1em;
        width: 100%;
      }

      .session-token-card__info {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
        grid-column: 1 / 2;
      }

      .session-token-card__info__last-used {
        font-style: italic;
      }

      .session-token-card__info__expiration {
        font-weight: bold;
      }

      dl div {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
      }

      dt {
        --line-height: 1.2em;
        --cc-icon-size: var(--line-height);

        align-items: center;
        display: flex;
        gap: 0.5em;
        line-height: var(--line-height);
      }

      /* Remove spacing below the font so that it matches dt spacing */
      dd {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
        min-width: 10.1em;
      }

      dd cc-badge {
        font-weight: normal;
      }

      .session-token-card cc-button {
        align-self: start;
        /* TODO: go for named columns */
        grid-column: 2 / 3;
        grid-row: 1 / 2;
      }
    `;
  }
}

customElements.define('cc-session-tokens', CcSessionTokens);
