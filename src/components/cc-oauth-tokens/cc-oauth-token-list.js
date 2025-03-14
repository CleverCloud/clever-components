import { LitElement, html, css } from 'lit';
import '../cc-notice/cc-notice.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-loader/cc-loader.js';
import { isExpirationClose } from '../../lib/utils.js';
import {
  iconRemixDeleteBinLine as iconDelete,
  iconRemixHistoryLine as iconLastUsed,
  iconRemixCalendar_2Fill as iconCreation,
  iconRemixAlertLine as iconExpiration,
} from '../../assets/cc-remix.icons.js';
import '../cc-badge/cc-badge.js';
import { classMap } from 'lit/directives/class-map.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { createRef, ref } from 'lit/directives/ref.js';

/**
 * @typedef {import('./cc-oauth-token-list.types.js').OauthTokenListState} OauthTokenListState
 * @typedef {import('./cc-oauth-token-list.types.js').OauthTokenState} OauthTokenState
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDivElement>} RefHTMLDivElement
 */

/**
 * A component that displays and manages OAuth tokens.
 *
 * This component allows users to view their active OAuth tokens and revoke individual tokens or all tokens at once.
 * It displays information about each token including consumer name, creation date, last used date, and expiration date.
 * Tokens are displayed in a list sorted by creation date (newest first).
 *
 * @fires {CustomEvent<void>} cc-oauth-token-list:revoke-all-tokens - Dispatched when a user requests to revoke all tokens
 * @fires {CustomEvent<string>} cc-oauth-token-list:revoke-token - Dispatched when a user requests to revoke a specific token, with the token ID as payload
 */
export class CcOauthTokenList extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {OauthTokenListState} The state of the component */
    this.state = { type: 'loading' };

    /** @type {RefHTMLDivElement} */
    this._emptyMessageRef = createRef();

    new ResizeController(this, {
      widthBreakpoints: [995, 730],
    });

    new LostFocusController(
      this,
      '.oauth-token-card__action-revoke, .revoke-all-tokens-button',
      ({ suggestedElement }) => {
        if (suggestedElement instanceof HTMLElement) {
          suggestedElement.focus();
        } else {
          this._emptyMessageRef.value.focus();
        }
      },
    );
  }

  _onRevokeAllTokens() {
    dispatchCustomEvent(this, 'revoke-all-tokens');
  }

  /** @param {string} tokenId */
  _onRevokeToken(tokenId) {
    dispatchCustomEvent(this, 'revoke-token', tokenId);
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-oauth-token-list.error')}"></cc-notice>`;
    }

    const hasTokens =
      (this.state.type === 'loaded' || this.state.type === 'revoking-all') && this.state.tokens.length > 0;
    const isEmpty = this.state.type === 'loaded' && this.state.tokens.length === 0;
    const sortedOauthTokens =
      this.state.type === 'loaded' || this.state.type === 'revoking-all'
        ? [...this.state.tokens].sort((tokenA, tokenB) => tokenB.creationDate.getTime() - tokenA.creationDate.getTime())
        : [];

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-oauth-token-list.main-heading')}</div>
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
                  ${i18n('cc-oauth-token-list.revoke-all-tokens')}
                </cc-button>
              `
            : ''}
        </div>
        <div slot="content">
          <p>${i18n('cc-oauth-token-list.intro')}</p>
          <div class="oauth-token-list-wrapper">
            ${isEmpty
              ? html`<p class="empty" tabindex="-1" ${ref(this._emptyMessageRef)}>
                  ${i18n('cc-oauth-token-list.empty')}
                </p>`
              : ''}
            ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
            ${this.state.type === 'loaded' || this.state.type === 'revoking-all'
              ? sortedOauthTokens.map((token) => this._renderTokenCard(token))
              : ''}
          </div>
        </div>
      </cc-block>
    `;
  }

  /**
   * @param {OauthTokenState} token
   */
  _renderTokenCard({ type, id, consumerName, imageUrl, lastUsedDate, creationDate, expirationDate }) {
    const hasExpirationWarning = isExpirationClose({ creationDate, expirationDate });
    const isRevoking = type === 'revoking';

    return html`
      <div class="oauth-token-card">
        <div class="oauth-token-card__header ${classMap({ 'is-revoking': isRevoking })}">
          <div class="oauth-token-card__header__logo-name">
            <cc-img src="${imageUrl}"></cc-img>
            <span>${consumerName}</span>
          </div>
          ${hasExpirationWarning
            ? html` <cc-badge intent="warning">${i18n('cc-oauth-token-list.card.deadline-approaches')}</cc-badge> `
            : ''}
        </div>
        <dl class="oauth-token-card__info ${classMap({ 'is-revoking': type === 'revoking' })}">
          <div class="oauth-token-card__info__last-used">
            <dt>
              <cc-icon .icon=${iconLastUsed}></cc-icon>
              <span>${i18n('cc-oauth-token-list.card.label.last-used')}</span>
            </dt>
            <dd>${i18n('cc-oauth-token-list.card.human-friendly-date', { date: lastUsedDate })}</dd>
          </div>
          <div>
            <dt>
              <cc-icon .icon=${iconCreation}></cc-icon>
              <span>${i18n('cc-oauth-token-list.card.label.creation')}</span>
            </dt>
            <dd>${i18n('cc-oauth-token-list.card.human-friendly-date', { date: creationDate })}</dd>
          </div>
          <div class="oauth-token-card__info__expiration">
            <dt>
              <cc-icon .icon=${iconExpiration}></cc-icon>
              <span>${i18n('cc-oauth-token-list.card.label.expiration')}</span>
            </dt>
            <dd>
              <span>${i18n('cc-oauth-token-list.card.human-friendly-date', { date: expirationDate })}</span>
            </dd>
          </div>
        </dl>
        <cc-button
          class="oauth-token-card__action-revoke"
          danger
          outlined
          hide-text
          .icon=${iconDelete}
          circle
          ?waiting=${type === 'revoking'}
          @cc-button:click=${() => this._onRevokeToken(id)}
        >
          ${i18n('cc-oauth-token-list.revoke-token', { consumerName })}
        </cc-button>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      /* Reset default margins and paddings */
      dl,
      dd,
      dt {
        margin: 0;
        padding: 0;
      }

      p {
        margin: 0;
      }

      .is-revoking {
        opacity: var(--cc-opacity-when-disabled, 0.65);
      }

      .oauth-token-list-wrapper {
        margin-top: 2.5em;
      }

      .empty {
        border: 1px solid var(--cc-color-border-neutral-weak);
        font-weight: bold;
        padding: 1em;
        text-align: center;
      }

      /* When all sessions are revoked, focus goes to the empty message container */
      .empty:focus-visible {
        outline: var(--cc-focus-outline);
        outline-offset: var(--cc-focus-outline-offset, 2px);
      }

      .oauth-token-card {
        align-items: center;
        border: solid 1px var(--cc-color-border-neutral-weak, #e6e6e6);
        border-radius: var(--cc-border-radius-default, 0.25em);
        display: grid;
        grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
        margin-top: 1.5em;
        padding: 1em;
      }

      .oauth-token-card__header {
        --cc-icon-size: 1.2em;

        align-items: center;
        column-gap: 1em;
        display: flex;
        flex-wrap: wrap;
        font-weight: bold;
        grid-column: info-start / info-end;
        margin-bottom: 1em;
        row-gap: 0.5em;
      }

      .oauth-token-card__header__logo-name {
        align-items: center;
        display: flex;
        gap: 0.5em;
      }

      .oauth-token-card__header__logo-name cc-img {
        border-radius: var(--cc-border-radius-default, 0.25em);
        height: 2em;
        width: 2em;
      }

      .oauth-token-card__info {
        display: flex;
        gap: 1em;
        grid-column: info-start / info-end;
      }

      .oauth-token-card__info div {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
      }

      .oauth-token-card__info__last-used {
        font-style: italic;
      }

      .oauth-token-card__info__expiration {
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

      .oauth-token-card cc-button {
        align-self: start;
        grid-column: actions-start / actions-end;
        grid-row: 1 / -1;
        justify-self: end;
      }

      :host([w-lt-730]) .oauth-token-card {
        grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
      }

      :host([w-lt-730]) .oauth-token-card__info {
        display: grid;
        row-gap: 0.5em;
      }

      @supports (grid-template-columns: subgrid) {
        .oauth-token-card {
          display: grid;
          grid-template-columns: [card-start info-start] max-content max-content max-content [info-end actions-start] auto [actions-end card-end];
        }

        .oauth-token-card__info {
          display: grid;
          grid-column: info-start / info-end;
          grid-template-columns: subgrid;
        }

        :host([w-lt-995]) .oauth-token-card {
          grid-template-columns: [card-start info-start] 1fr 1fr 1fr [info-end actions-start] auto [actions-end card-end];
        }

        :host([w-lt-995]) .oauth-token-card__info div {
          display: grid;
        }

        :host([w-lt-730]) .oauth-token-card {
          grid-template-columns: [card-start info-start] 1fr [info-end actions-start] auto [actions-end card-end];
        }

        :host([w-lt-730]) .oauth-token-card__info {
          row-gap: 0.5em;
        }

        :host([w-lt-730]) .oauth-token-card__info div {
          display: flex;
        }
      }
    `;
  }
}

window.customElements.define('cc-oauth-token-list', CcOauthTokenList);
