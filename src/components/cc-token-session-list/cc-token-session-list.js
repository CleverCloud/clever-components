import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixCalendar_2Fill as iconCreation,
  iconRemixRadioButtonLine as iconCurrentSession,
  iconRemixDeleteBinLine as iconDelete,
  iconRemixInformationLine as iconExpiration,
  iconRemixHistoryLine as iconLastUsed,
} from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { isExpirationClose } from '../../lib/tokens.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';

/**
 * @typedef {import('./cc-token-session-list.types.js').SessionTokenState} SessionTokenState
 * @typedef {import('./cc-token-session-list.types.js').TokenSessionListState} TokenSessionListState
 * @typedef {import('./cc-token-session-list.types.js').SessionToken} SessionToken
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit').PropertyValues<CcTokenSessionList>} CcSessionTokensPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLLIElement>} RefHTMLLIElement
 */

/**
 * A component that displays and manages user sessions.
 *
 * This component allows users to view their active session and revoke individual tokens or all tokens at once.
 * It displays information about each session including creation date, last used date, and expiration date.
 * Sessions are displayed in a list sorted by creation date (newest first).
 *
 * @fires {CustomEvent<void>} cc-token-session-list:revoke-all-session-tokens - Dispatched when a user requests to revoke all tokens
 * @fires {CustomEvent<string>} cc-token-session-list:revoke-session-token - Dispatched when a user requests to revoke a specific token, with the token ID as payload
 */
export class CcTokenSessionList extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {TokenSessionListState} The current state of the component */
    this.state = { type: 'loading' };

    /** @type {RefHTMLLIElement} */
    this._currentSessionCardRef = createRef();

    new ResizeController(this, {
      widthBreakpoints: [995, 730],
    });

    new LostFocusController(this, '.session-token-card__action-revoke', ({ suggestedElement }) => {
      if (suggestedElement instanceof HTMLElement) {
        suggestedElement.focus();
      } else {
        this._currentSessionCardRef.value?.focus();
      }
    });

    new LostFocusController(this, '.revoke-all-sessions-button', () => {
      this._currentSessionCardRef.value?.focus();
    });
  }

  /**
   * @param {string} tokenId
   * @return {boolean}
   * @private
   */
  _isCurrentSessionToken(tokenId) {
    if (this.state.type === 'loading' || this.state.type === 'error') {
      return false;
    }
    return this.state.currentSessionToken.id === tokenId;
  }

  /**
   * Handles the revocation of all tokens
   *
   * @private
   */
  _onRevokeAllTokens() {
    dispatchCustomEvent(this, 'revoke-all-session-tokens');
  }

  /**
   * Handles the revocation of a specific token
   *
   * @param {string} tokenId - The ID of the token to be revoked
   * @private
   */
  _onRevokeToken(tokenId) {
    dispatchCustomEvent(this, 'revoke-session-token', tokenId);
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-token-session-list.error')}"></cc-notice>`;
    }

    const hasTokens =
      (this.state.type === 'loaded' || this.state.type === 'revoking-all') && this.state.otherSessionTokens.length > 0;

    const sortedSessionTokens =
      this.state.type === 'loaded' || this.state.type === 'revoking-all'
        ? [this.state.currentSessionToken, ...this.state.otherSessionTokens].sort(
            (tokenA, tokenB) => tokenB.creationDate.getTime() - tokenA.creationDate.getTime(),
          )
        : [];

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-token-session-list.main-heading')}</div>
        <div slot="header-right">
          ${hasTokens
            ? html`
                <cc-button
                  class="revoke-all-sessions-button"
                  danger
                  outlined
                  ?waiting=${this.state.type === 'revoking-all'}
                  @cc-button:click=${this._onRevokeAllTokens}
                >
                  ${i18n('cc-token-session-list.revoke-all-sessions')}
                </cc-button>
              `
            : ''}
        </div>
        <div slot="content">
          <p>${i18n('cc-token-session-list.intro')}</p>
          <div class="session-tokens-wrapper">
            ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
            ${this.state.type === 'loaded' || this.state.type === 'revoking-all'
              ? html`
                  <!-- TODO: A11Y when we add headings inside cards (User Agent / IP Address or whatever), we should remove the ul / li structure -->
                  <ul class="session-tokens-wrapper__list">
                    ${sortedSessionTokens.map((token, index) => this._renderTokenCard(token, index))}
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
   * @param {SessionTokenState|SessionToken} token - The token data to render
   * @param {number} index - The index of the token in the list
   * @returns {TemplateResult} The rendered token card
   * @private
   */
  _renderTokenCard(token, index) {
    const { id, creationDate, expirationDate, lastUsedDate, isCleverTeam } = token;
    const isCurrentSession = this._isCurrentSessionToken(id);
    const isRevoking = 'type' in token && token.type === 'revoking';
    const tabIndex = isCurrentSession ? -1 : null;
    const hasExpirationWarning = isExpirationClose({
      creationDate: token.creationDate,
      expirationDate: token.expirationDate,
    });

    return html`
      <li
        class="session-token-card ${classMap({ 'is-revoking': isRevoking })}"
        tabindex=${ifDefined(tabIndex)}
        ${isCurrentSession ? ref(this._currentSessionCardRef) : ''}
      >
        ${isCurrentSession || isCleverTeam || hasExpirationWarning
          ? this._renderCardHeader({
              isCurrentSession,
              isCleverTeam,
              hasExpirationWarning,
            })
          : ''}
        <dl class="session-token-card__info-list">
          <div class="session-token-card__info-list__item session-token-card__info-list__item--italic">
            <dt>
              <cc-icon .icon=${iconLastUsed}></cc-icon>
              <span>${i18n('cc-token-session-list.card.label.last-used')}</span>
            </dt>
            <dd>${i18n('cc-token-session-list.card.human-friendly-date', { date: lastUsedDate })}</dd>
          </div>
          <div class="session-token-card__info-list__item">
            <dt>
              <cc-icon .icon=${iconCreation}></cc-icon>
              <span>${i18n('cc-token-session-list.card.label.creation')}</span>
            </dt>
            <dd>${i18n('cc-token-session-list.card.human-friendly-date', { date: creationDate })}</dd>
          </div>
          <div class="session-token-card__info-list__item session-token-card__info-list__item--bold">
            <dt>
              <cc-icon .icon=${iconExpiration}></cc-icon>
              <span>${i18n('cc-token-session-list.card.label.expiration')}</span>
            </dt>
            <dd>
              <span>${i18n('cc-token-session-list.card.human-friendly-date', { date: expirationDate })}</span>
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
                ?waiting=${isRevoking}
                @cc-button:click=${() => this._onRevokeToken(id)}
              >
                ${i18n('cc-token-session-list.revoke-session', { tokenNumber: index + 1 })}
              </cc-button>
            `
          : ''}
      </li>
    `;
  }

  /** @param {{ isCleverTeam: boolean, hasExpirationWarning: boolean, isCurrentSession: boolean }} params */
  _renderCardHeader({ isCurrentSession, isCleverTeam, hasExpirationWarning }) {
    return html`
      <div class="session-token-card__header">
        ${isCurrentSession
          ? html`
              <div class="session-token-card__header__current-session">
                <cc-icon .icon=${iconCurrentSession}></cc-icon>
                <span>${i18n('cc-token-session-list.card.current-session')}</span>
              </div>
            `
          : ''}
        ${isCleverTeam
          ? html` <cc-badge intent="info">${i18n('cc-token-session-list.card.clever-team')}</cc-badge> `
          : ''}
        ${!isCleverTeam && hasExpirationWarning
          ? html` <cc-badge intent="warning">${i18n('cc-token-session-list.card.expires-soon')}</cc-badge> `
          : ''}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      /* Reset default margins and paddings */
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

      p {
        margin: 0;
      }

      .is-revoking > :not(cc-button) {
        opacity: var(--cc-opacity-when-disabled, 0.65);
      }

      /* When all other sessions are revoked, focus may return to the current session card */
      .session-token-card:focus-visible {
        outline: var(--cc-focus-outline);
        outline-offset: var(--cc-focus-outline-offset, 2px);
      }

      .session-tokens-wrapper {
        margin-top: 2.5em;
      }

      .session-tokens-wrapper__list {
        display: grid;
        gap: 1.5em;
      }

      @supports (grid-template-columns: subgrid) {
        .session-tokens-wrapper__list {
          grid-template-columns: [card-start info-start] max-content max-content 1fr [info-end actions-start] auto [actions-end card-end];
        }

        :host([w-lt-995]) .session-tokens-wrapper__list {
          grid-template-columns: [card-start info-start] 1fr 1fr 1fr [info-end actions-start] auto [actions-end card-end];
        }

        :host([w-lt-730]) .session-tokens-wrapper__list {
          grid-template-columns: [card-start info-start] 1fr [info-end actions-start] auto [actions-end card-end];
        }
      }

      .session-token-card {
        align-items: center;
        border: solid 1px var(--cc-color-border-neutral-weak, #e6e6e6);
        border-radius: var(--cc-border-radius-default, 0.25em);
        column-gap: 1em;
        display: grid;
        grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
        padding: 1em;
      }

      @supports (grid-template-columns: subgrid) {
        .session-token-card {
          display: grid;
          grid-column: card-start / card-end;
          grid-template-columns: subgrid;
        }
      }

      .session-token-card__header {
        --cc-icon-size: 1.2em;

        align-items: center;
        column-gap: 1em;
        display: flex;
        flex-wrap: wrap;
        grid-column: info-start / info-end;
        margin-bottom: 1em;
        row-gap: 0.5em;
      }

      .session-token-card__header__current-session {
        align-items: center;
        color: var(--cc-color-text-success, #318051);
        display: flex;
        font-weight: bold;
        gap: 0.5em;
      }

      .session-token-card__info-list {
        display: flex;
        gap: 1em;
        grid-column: info-start / info-end;
      }

      :host([w-lt-730]) .session-token-card__info-list {
        display: grid;
        row-gap: 0.5em;
      }

      @supports (grid-template-columns: subgrid) {
        .session-token-card__info-list {
          display: grid;
          grid-column: info-start / info-end;
          grid-template-columns: subgrid;
        }

        :host([w-lt-730]) .session-token-card__info-list {
          row-gap: 0.5em;
        }
      }

      .session-token-card__info-list__item {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
      }

      @supports (grid-template-columns: subgrid) {
        :host([w-lt-995]) .session-token-card__info-list__item {
          display: grid;
        }

        :host([w-lt-730]) .session-token-card__info-list__item {
          display: flex;
        }
      }

      .session-token-card__info-list__item--italic {
        font-style: italic;
      }

      .session-token-card__info-list__item--bold {
        font-weight: bold;
      }

      dt {
        --line-height: 1.2em;
        --cc-icon-size: var(--line-height);

        align-items: center;
        display: flex;
        gap: 0.5em;
        line-height: var(--line-height);
      }

      dd {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
      }

      .session-token-card cc-button {
        align-self: start;
        grid-column: actions-start / actions-end;
        grid-row: 1 / -1;
        justify-self: end;
      }
    `;
  }
}

customElements.define('cc-token-session-list', CcTokenSessionList);
