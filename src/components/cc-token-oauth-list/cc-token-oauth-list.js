import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixCalendar_2Fill as iconCreation,
  iconRemixDeleteBinLine as iconDelete,
  iconRemixInformationLine as iconExpiration,
  iconRemixInformationFill as iconInfo,
  iconRemixHistoryLine as iconLastUsed,
} from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { isExpirationClose } from '../../lib/tokens.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block/cc-block.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { CcTokenRevokeEvent, CcTokensRevokeAllEvent } from '../common.events.js';

/**
 * @typedef {import('./cc-token-oauth-list.types.js').TokenOauthListState} TokenOauthListState
 * @typedef {import('./cc-token-oauth-list.types.js').OauthTokenState} OauthTokenState
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDivElement>} RefHTMLDivElement
 */

/**
 * A component that displays and manages OAuth tokens.
 *
 * This component allows users to view their active OAuth tokens and revoke individual tokens or all tokens at once.
 * It displays information about each token including consumer name, creation date, last used date, and expiration date.
 * Tokens are displayed in a list sorted by creation date (newest first).
 */
export class CcTokenOauthList extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {TokenOauthListState} The state of the component */
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

  _onRevokeAllOauthTokens() {
    this.dispatchEvent(new CcTokensRevokeAllEvent());
  }

  /** @param {string} tokenId */
  _onRevokeToken(tokenId) {
    this.dispatchEvent(new CcTokenRevokeEvent(tokenId));
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-token-oauth-list.error')}"></cc-notice>`;
    }

    const isEmpty = this.state.type === 'loaded' && this.state.oauthTokens.length === 0;
    const shouldDisplayRevokeAllButton =
      this.state.type === 'revoking-all' || (!isEmpty && this.state.type !== 'loading');
    const sortedOauthTokens =
      this.state.type === 'loaded' || this.state.type === 'revoking-all'
        ? [...this.state.oauthTokens].sort(
            (tokenA, tokenB) => tokenB.creationDate.getTime() - tokenA.creationDate.getTime(),
          )
        : [];

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-token-oauth-list.main-heading')}</div>
        <div slot="header-right">
          ${shouldDisplayRevokeAllButton
            ? html`
                <cc-button
                  class="revoke-all-tokens-button"
                  danger
                  outlined
                  ?waiting=${this.state.type === 'revoking-all'}
                  @cc-click=${this._onRevokeAllOauthTokens}
                >
                  ${i18n('cc-token-oauth-list.revoke-all-tokens')}
                </cc-button>
              `
            : ''}
        </div>
        <div slot="content">
          <p>${i18n('cc-token-oauth-list.intro')}</p>
          <div class="oauth-token-list-wrapper">
            ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
            ${isEmpty
              ? html`<p class="empty" tabindex="-1" ${ref(this._emptyMessageRef)}>
                  ${i18n('cc-token-oauth-list.empty')}
                </p>`
              : ''}
            ${!isEmpty
              ? html`
                  <div class="oauth-token-list-wrapper__list">
                    ${sortedOauthTokens.map((token) => this._renderTokenCard(token))}
                  </div>
                `
              : ''}
          </div>
        </div>
        <div slot="footer-right">
          <cc-link slot="link" href="https://www.clever-cloud.com/developers/api/howto/#oauth1" .icon="${iconInfo}">
            <span>${i18n('cc-token-oauth-list.link.doc')}</span>
          </cc-link>
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
      <div class="oauth-token-card ${classMap({ 'is-revoking': isRevoking })}">
        <div class="oauth-token-card__header">
          <div class="oauth-token-card__header__logo-name">
            <cc-img src="${imageUrl}"></cc-img>
            <span>${consumerName}</span>
          </div>
          ${hasExpirationWarning
            ? html` <cc-badge intent="warning">${i18n('cc-token-oauth-list.card.expires-soon')}</cc-badge> `
            : ''}
        </div>
        <dl class="oauth-token-card__info-list">
          <div class="oauth-token-card__info-list__item oauth-token-card__info-list__item--italic">
            <dt>
              <cc-icon .icon=${iconLastUsed}></cc-icon>
              <span>${i18n('cc-token-oauth-list.card.label.last-used')}</span>
            </dt>
            <dd>${i18n('cc-token-oauth-list.card.human-friendly-date', { date: lastUsedDate })}</dd>
          </div>
          <div class="oauth-token-card__info-list__item">
            <dt>
              <cc-icon .icon=${iconCreation}></cc-icon>
              <span>${i18n('cc-token-oauth-list.card.label.creation')}</span>
            </dt>
            <dd>${i18n('cc-token-oauth-list.card.human-friendly-date', { date: creationDate })}</dd>
          </div>
          <div class="oauth-token-card__info-list__item oauth-token-card__info-list__item--bold">
            <dt>
              <cc-icon .icon=${iconExpiration}></cc-icon>
              <span>${i18n('cc-token-oauth-list.card.label.expiration')}</span>
            </dt>
            <dd>
              <span>${i18n('cc-token-oauth-list.card.human-friendly-date', { date: expirationDate })}</span>
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
          @cc-click=${() => this._onRevokeToken(id)}
        >
          ${i18n('cc-token-oauth-list.revoke-token', { consumerName })}
        </cc-button>
      </div>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        [slot='link'] {
          align-items: center;
          color: var(--cc-color-text-primary-highlight, blue);
          display: flex;
          flex-direction: row;
          gap: 0.5em;
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

        .is-revoking > :not(cc-button) {
          opacity: var(--cc-opacity-when-disabled, 0.65);
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

        .oauth-token-list-wrapper {
          margin-top: 2.5em;
        }

        .oauth-token-list-wrapper__list {
          display: grid;
          gap: 1.5em;
        }

        @supports (grid-template-columns: subgrid) {
          .oauth-token-list-wrapper__list {
            grid-template-columns: [card-start info-start] max-content max-content 1fr [info-end actions-start] auto [actions-end card-end];
          }

          :host([w-lt-995]) .oauth-token-list-wrapper__list {
            grid-template-columns: [card-start info-start] 1fr 1fr 1fr [info-end actions-start] auto [actions-end card-end];
          }
        }

        .oauth-token-card {
          align-items: center;
          border: solid 1px var(--cc-color-border-neutral-weak, #e6e6e6);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: grid;
          grid-template-columns: [card-start info-start] 1fr [info-end actions-start] auto [actions-end card-end];
          padding: 1em;
        }

        :host([w-lt-730]) .oauth-token-card {
          grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
        }

        @supports (grid-template-columns: subgrid) {
          .oauth-token-card {
            display: grid;
            grid-column: card-start / card-end;
            grid-template-columns: subgrid;
          }

          :host([w-lt-730]) .oauth-token-card {
            grid-template-columns: [card-start info-start] 1fr [info-end actions-start] auto [actions-end card-end];
          }
        }

        .oauth-token-card__header {
          --cc-icon-size: 1.2em;

          align-items: center;
          column-gap: 1em;
          display: flex;
          flex-wrap: wrap;
          grid-column: info-start / info-end;
          margin-bottom: 1em;
          row-gap: 0.5em;
        }

        .oauth-token-card__header__logo-name {
          align-items: center;
          display: flex;
          font-weight: bold;
          gap: 0.5em;
        }

        .oauth-token-card__header__logo-name cc-img {
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 2em;
          width: 2em;

          --cc-img-fit: contain;
        }

        .oauth-token-card__info-list {
          display: flex;
          gap: 1em;
          grid-column: info-start / info-end;
        }

        :host([w-lt-730]) .oauth-token-card__info-list {
          display: grid;
          row-gap: 0.5em;
        }

        @supports (grid-template-columns: subgrid) {
          .oauth-token-card__info-list {
            display: grid;
            grid-column: info-start / info-end;
            grid-template-columns: subgrid;
          }

          :host([w-lt-730]) .oauth-token-card__info-list {
            row-gap: 0.5em;
          }
        }

        .oauth-token-card__info-list__item {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        :host([w-lt-995]) .oauth-token-card__info-list__item {
          display: grid;
        }

        @supports (grid-template-columns: subgrid) {
          :host([w-lt-730]) .oauth-token-card__info-list__item {
            display: flex;
          }
        }

        .oauth-token-card__info-list__item--italic {
          font-style: italic;
        }

        .oauth-token-card__info-list__item--bold {
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
      `,
    ];
  }
}

window.customElements.define('cc-token-oauth-list', CcTokenOauthList);
