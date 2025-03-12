import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { i18n } from '../../translations/translation.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import {
  iconRemixDeleteBinLine as iconDelete,
  iconRemixHistoryLine as iconLastUsed,
  iconRemixCalendar_2Fill as iconCreation,
  iconRemixAlertLine as iconExpiration,
  iconRemixRadioButtonLine as iconCurrentSession,
} from '../../assets/cc-remix.icons.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-badge/cc-badge.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';

/**
 */

/**
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenState} SessionTokenState
 * @typedef {import('./cc-session-tokens.types.js').SessionTokensState} SessionTokensState
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenStateWithExpirationWarning} SessionTokenStateWithExpirationWarning
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit').PropertyValues<CcSessionTokens>} CcSessionTokensPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLLIElement>} RefHTMLLIElement
 */

/**
 * A web component that displays and manages user session tokens.
 *
 * This component allows users to view their active session tokens and revoke individual tokens or all tokens at once.
 * It displays information about each token including creation date, last used date, and expiration date.
 * Tokens are displayed in a list with the current session token always appearing first, followed by other tokens
 * sorted by creation date (newest first).
 *
 * @fires {CustomEvent<void>} cc-session-tokens:revoke-all-tokens - Dispatched when a user requests to revoke all tokens
 * @fires {CustomEvent<string>} cc-session-tokens:revoke-token - Dispatched when a user requests to revoke a specific token, with the token ID as payload
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

    /** @type {SessionTokensState} The current state of the component */
    this.state = { type: 'loading' };

    /** @type {Array<SessionTokenStateWithExpirationWarning>|null} Array of session tokens sorted by creation date with added expiration information */
    this._sortedAndFormattedTokens = null;

    /** @type {RefHTMLLIElement} */
    this._currentSessionCardRef = createRef();

    new ResizeController(this, {
      widthBreakpoints: [900, 730],
    });

    new LostFocusController(this, '.session-token-card__action-revoke', ({ suggestedElement }) => {
      if (suggestedElement instanceof HTMLElement) {
        suggestedElement.focus();
      } else {
        this._currentSessionCardRef.value?.focus();
      }
    });

    new LostFocusController(this, '.revoke-all-tokens-button', () => {
      this._currentSessionCardRef.value?.focus();
    });
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
   * @returns {SessionTokenStateWithExpirationWarning} The token with added expiration information
   * @private
   */
  _addIsExpirationClose(token) {
    const expirationDate = new Date(token.expirationDate);
    const now = new Date();
    const daysUntilExpiration = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    let thresholdDays;
    if (daysUntilExpiration <= 7) {
      thresholdDays = 2;
    } else if (daysUntilExpiration <= 30) {
      thresholdDays = 7;
    } else if (daysUntilExpiration <= 60) {
      thresholdDays = 10;
    } else if (daysUntilExpiration <= 90) {
      thresholdDays = 20;
    } else {
      thresholdDays = 30;
    }

    const isExpirationClose = daysUntilExpiration <= thresholdDays;
    return { ...token, isExpirationClose };
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
        .map(this._addIsExpirationClose);
    }
  }

  render() {
    const hasTokens =
      (this.state.type === 'loaded' || this.state.type === 'revoking-all') && this.state.tokens.length > 1;

    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-session-tokens.error')}"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-session-tokens.main-heading')}</div>
        <div slot="header-right">
          ${hasTokens
            ? html`
                <cc-button
                  class="revoke-all-tokens-button"
                  danger
                  outlined
                  .waiting=${this.state.type === 'revoking-all'}
                  @cc-button:click=${this._onRevokeAllTokens}
                >
                  ${i18n('cc-session-tokens.revoke-all-tokens')}
                </cc-button>
              `
            : ''}
        </div>
        <div slot="content">
          <p>${i18n('cc-session-tokens.intro')}</p>
          <div class="session-tokens-wrapper">
            ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
            ${this.state.type === 'loaded' || this.state.type === 'revoking-all'
              ? html`
                  <!-- TODO: A11Y when we add headings inside cards (User Agent / IP Address or whatever), we should remove the ul / li structure -->
                  <ul class="session-tokens-wrapper__list">
                    ${this._sortedAndFormattedTokens.map((token, index) => this._renderTokenCard(token, index))}
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
   * @param {SessionTokenStateWithExpirationWarning} token - The token data to render
   * @param {number} index - The index of the token in the list
   * @returns {TemplateResult} The rendered token card
   * @private
   */
  _renderTokenCard(
    { type, id, creationDate, expirationDate, lastUsedDate, isCurrentSession, isExpirationClose, isCleverTeam },
    index,
  ) {
    const tabIndex = isCurrentSession ? -1 : null;
    return html`
      <li
        class="session-token-card"
        tabindex=${ifDefined(tabIndex)}
        ${isCurrentSession ? ref(this._currentSessionCardRef) : ''}
      >
        ${isCurrentSession || isCleverTeam || isExpirationClose
          ? this._renderCardHeader({ isCurrentSession, isCleverTeam, isExpirationClose })
          : ''}
        <dl class="session-token-card__info ${classMap({ 'is-revoking': type === 'revoking' })}">
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
          </div>
        </dl>
        ${!isCurrentSession
          ? html`
              <cc-button
                class="session-token-card__action-revoke"
                danger
                outlined
                hide-text
                .icon=${iconDelete}
                circle
                .waiting=${type === 'revoking'}
                @cc-button:click=${() => this._onRevokeToken(id)}
              >
                ${i18n('cc-session-tokens.revoke-token', { tokenNumber: index + 1 })}
              </cc-button>
            `
          : ''}
      </li>
    `;
  }

  /** @param {Pick<SessionTokenStateWithExpirationWarning, 'isCurrentSession' | 'isCleverTeam' | 'isExpirationClose'>} params */
  _renderCardHeader({ isCurrentSession, isCleverTeam, isExpirationClose }) {
    return html`
      <div class="session-token-card__header">
        ${isCurrentSession
          ? html`
              <div class="session-token-card__header__current-session">
                <cc-icon .icon=${iconCurrentSession}></cc-icon>
                <span>${i18n('cc-session-tokens.card.current-session')}</span>
              </div>
            `
          : ''}
        ${isCleverTeam ? html` <cc-badge intent="info">${i18n('cc-session-tokens.card.clever-team')}</cc-badge> ` : ''}
        ${!isCleverTeam && isExpirationClose
          ? html` <cc-badge intent="warning">${i18n('cc-session-tokens.card.deadline-approaches')}</cc-badge> `
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
      li,
      dl,
      dd,
      dt {
        margin: 0;
        padding: 0;
      }

      li {
        list-style: none;
      }

      /* the current session card may be focused after deleting the last session */
      .session-token-card:focus {
        outline: var(--cc-focus-outline);
        outline-offset: var(--cc-focus-outline-offset, 2px);
      }

      p {
        margin: 0;
      }

      .is-revoking {
        opacity: var(--cc-opacity-when-disabled, 0.65);
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
        border: solid 1px var(--cc-color-border-neutral-weak, #e6e6e6);
        border-radius: var(--cc-border-radius-default, 0.25em);
        display: grid;
        grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
        padding: 1em;
      }

      .session-token-card__header {
        --cc-icon-size: 1.2em;

        align-items: center;
        display: flex;
        flex-wrap: wrap;
        font-weight: bold;
        gap: 1em;
        grid-column: info-start / info-end;
        margin-bottom: 1em;
        width: 100%;
      }

      .session-token-card__header__current-session {
        align-items: center;
        color: var(--cc-color-text-success, #318051);
        display: flex;
        gap: 0.5em;
      }

      .session-token-card__info {
        display: flex;
        gap: 1em;
        grid-column: info-start / info-end;
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
      }

      dd cc-badge {
        font-weight: normal;
      }

      :host([w-lt-730]) .session-token-card {
        grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
      }

      :host([w-lt-730]) .session-token-card__info {
        display: grid;
        row-gap: 0.5em;
      }

      .session-token-card cc-button {
        align-self: start;
        grid-column: actions-start / actions-end;
        grid-row: 1 / -1;
        justify-self: end;
      }

      @supports (grid-template-columns: subgrid) {
        .session-tokens-wrapper__list {
          column-gap: 1.5em;
          display: grid;
          grid-template-columns: [card-start info-start] max-content max-content max-content [info-end actions-start] 1fr [actions-end card-end];
          row-gap: 1.5em;
        }

        .session-token-card {
          display: grid;
          grid-column: card-start / card-end;
          grid-template-columns: subgrid;
        }

        .session-token-card__header {
          grid-column: info-start / info-end;
        }

        .session-token-card__info {
          display: grid;
          gap: unset;
          grid-column: info-start / info-end;
          grid-template-columns: subgrid;
        }

        :host([w-lt-900]) .session-tokens-wrapper__list {
          grid-template-columns: [card-start info-start] 1fr 1fr 1fr [info-end actions-start] 1fr [actions-end card-end];
        }

        :host([w-lt-900]) .session-token-card__info div {
          display: grid;
        }

        :host([w-lt-730]) .session-tokens-wrapper__list {
          grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
        }

        :host([w-lt-730]) .session-token-card__info {
          row-gap: 0.5em;
        }

        :host([w-lt-730]) .session-token-card__info div {
          display: flex;
        }
      }
    `;
  }
}

customElements.define('cc-session-tokens', CcSessionTokens);
