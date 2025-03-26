import { html, LitElement, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { i18n } from '../../translations/translation.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { isExpirationClose } from '../../lib/utils.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-badge/cc-badge.js';
import '../cc-empty/cc-empty.js';
import {
  iconRemixDeleteBinLine as iconDelete,
  iconRemixHistoryLine as iconLastUsed,
  iconRemixCalendar_2Fill as iconCreation,
  iconRemixAlertLine as iconExpiration,
  iconRemixInformationLine as iconDescription,
  iconRemixComputerLine as iconIp,
} from '../../assets/cc-remix.icons.js';

/**
 * @typedef {import('./cc-api-token-list.types.js').ApiTokenState} ApiTokenState
 * @typedef {import('./cc-api-token-list.types.js').ApiTokensState} ApiTokensState
 * @typedef {import('./cc-api-token-list.types.js').ApiTokenStateWithExpirationWarning} ApiTokenStateWithExpirationWarning
 */

/**
 * A component to display and manage API tokens
 *
 * @fires {CustomEvent<string>} cc-api-token-list:revoke-token - Dispatched when a user requests to revoke a specific token
 * @fires {CustomEvent<void>} cc-api-token-list:create-token - Dispatched when a user clicks on the create token button
 */
export class CcApiTokenList extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _tokensWithExpirationInfo: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {ApiTokensState} */
    this.state = { type: 'loading' };

    /** @type {Array<ApiTokenStateWithExpirationWarning>|null} */
    this._tokensWithExpirationInfo = null;
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
   * Handles the creation of a new token
   *
   * @private
   */
  _onCreateToken() {
    dispatchCustomEvent(this, 'create-token');
  }

  /** @param {import('lit').PropertyValues<this>} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && this.state.type === 'loaded') {
      this._tokensWithExpirationInfo = this.state.tokens.map((token) => ({
        ...token,
        isExpirationClose: isExpirationClose({
          creationDate: token.creationDate,
          expirationDate: token.expirationDate,
        }),
      }));
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-api-token-list.error')}"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-api-token-list.title')}</div>
        <div slot="header-right">
          <cc-button primary outlined @cc-button:click=${this._onCreateToken}>
            ${i18n('cc-api-token-list.create-token')}
          </cc-button>
        </div>
        <div slot="content">
          <p>${i18n('cc-api-token-list.intro')}</p>
          <div class="api-tokens-wrapper">
            ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
            ${this.state.type === 'loaded' && this._tokensWithExpirationInfo?.length === 0
              ? html`<cc-empty>${i18n('cc-api-token-list.empty')}</cc-empty>`
              : ''}
            ${this.state.type === 'loaded' && this._tokensWithExpirationInfo?.length > 0
              ? html`
                  <ul class="api-tokens-wrapper__list">
                    ${this._tokensWithExpirationInfo.map((token) => this._renderTokenCard(token))}
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
   * @param {ApiTokenStateWithExpirationWarning} token - The token data to render
   * @returns {import('lit').TemplateResult} The rendered token card
   * @private
   */
  _renderTokenCard({ type, apiTokenId, name, description, creationDate, expirationDate, ip, isExpirationClose }) {
    const isRevoking = type === 'revoking';

    return html`
      <li class="api-token-card">
        ${isExpirationClose
          ? html`
              <div class="api-token-card__header ${classMap({ 'is-revoking': isRevoking })}">
                <cc-badge intent="warning">${i18n('cc-api-token-list.card.deadline-approaches')}</cc-badge>
              </div>
            `
          : ''}
        <dl class="api-token-card__info ${classMap({ 'is-revoking': isRevoking })}">
          <div class="api-token-card__info__name">
            <dt>${i18n('cc-api-token-list.card.label.name')}</dt>
            <dd>${name}</dd>
          </div>
          ${description
            ? html`
                <div class="api-token-card__info__description">
                  <dt>
                    <cc-icon .icon=${iconDescription}></cc-icon>
                    <span>${i18n('cc-api-token-list.card.label.description')}</span>
                  </dt>
                  <dd>${description}</dd>
                </div>
              `
            : ''}
          <div>
            <dt>
              <cc-icon .icon=${iconCreation}></cc-icon>
              <span>${i18n('cc-api-token-list.card.label.creation')}</span>
            </dt>
            <dd>${i18n('cc-api-token-list.card.human-friendly-date', { date: creationDate })}</dd>
          </div>
          <div class="api-token-card__info__expiration">
            <dt>
              <cc-icon .icon=${iconExpiration}></cc-icon>
              <span>${i18n('cc-api-token-list.card.label.expiration')}</span>
            </dt>
            <dd>
              <span>${i18n('cc-api-token-list.card.human-friendly-date', { date: expirationDate })}</span>
            </dd>
          </div>
          ${ip
            ? html`
                <div>
                  <dt>
                    <cc-icon .icon=${iconIp}></cc-icon>
                    <span>${i18n('cc-api-token-list.card.label.ip')}</span>
                  </dt>
                  <dd>${ip}</dd>
                </div>
              `
            : ''}
        </dl>
        <cc-button
          class="api-token-card__action-revoke"
          danger
          outlined
          hide-text
          .icon=${iconDelete}
          circle
          ?waiting=${isRevoking}
          @cc-button:click=${() => this._onRevokeToken(apiTokenId)}
        >
          ${i18n('cc-api-token-list.revoke-token')}
        </cc-button>
      </li>
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

      .is-revoking {
        opacity: var(--cc-opacity-when-disabled, 0.65);
      }

      .api-tokens-wrapper {
        margin-top: 2.5em;
      }

      .api-token-card {
        align-items: center;
        border: solid 1px var(--cc-color-border-neutral-weak, #e6e6e6);
        border-radius: var(--cc-border-radius-default, 0.25em);
        display: grid;
        grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
        padding: 1em;
      }

      .api-token-card__header {
        --cc-icon-size: 1.2em;

        align-items: center;
        column-gap: 1em;
        display: flex;
        flex-wrap: wrap;
        grid-column: info-start / info-end;
        margin-bottom: 1em;
        row-gap: 0.5em;
      }

      .api-token-card__info {
        display: flex;
        flex-direction: column;
        gap: 1em;
        grid-column: info-start / info-end;
      }

      .api-token-card__info div {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
      }

      .api-token-card__info__name {
        font-weight: bold;
        font-size: 1.1em;
      }

      .api-token-card__info__description {
        font-style: italic;
      }

      .api-token-card__info__expiration {
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

      .api-token-card cc-button {
        align-self: start;
        grid-column: actions-start / actions-end;
        grid-row: 1 / -1;
        justify-self: end;
      }

      .api-tokens-wrapper__list {
        display: grid;
        gap: 1.5em;
      }

      @media (max-width: 730px) {
        .api-token-card {
          grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
        }

        .api-token-card__info div {
          display: grid;
          row-gap: 0.5em;
        }
      }

      @supports (grid-template-columns: subgrid) {
        .api-tokens-wrapper__list {
          grid-template-columns: [card-start info-start] 1fr [info-end actions-start] auto [actions-end card-end];
        }

        .api-token-card {
          display: grid;
          grid-column: card-start / card-end;
          grid-template-columns: subgrid;
        }

        .api-token-card__info {
          display: grid;
          grid-column: info-start / info-end;
          grid-template-columns: subgrid;
        }

        @media (max-width: 730px) {
          .api-tokens-wrapper__list {
            grid-template-columns: [card-start info-start] 1fr [info-end actions-start] auto [actions-end card-end];
          }

          .api-token-card__info div {
            display: flex;
          }
        }
      }
    `;
  }
}

customElements.define('cc-api-token-list', CcApiTokenList);
