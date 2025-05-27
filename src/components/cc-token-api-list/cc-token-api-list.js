import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixCalendar_2Fill as iconCreation,
  iconRemixCloseLine as iconDelete,
  iconRemixLogoutBoxRLine as iconExternalLink,
  iconRemixArrowRightLine as iconGoTo,
  iconRemixCodeSSlashLine as iconId,
  iconRemixInformationLine as iconInfo,
  iconRemixDeleteBinLine as iconRevoke,
} from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { isExpirationClose } from '../../lib/tokens.js';
import { isStringEmpty } from '../../lib/utils.js';
import { cliCommandsStyles } from '../../styles/cli-commands.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { CcTokenRevokeEvent } from '../common.events.js';

/**
 * @typedef {import('./cc-token-api-list.types.js').ApiTokenState} ApiTokenState
 * @typedef {import('./cc-token-api-list.types.js').TokenApiListState} TokenApiListState
 * @typedef {import('lit/directives/ref.js').Ref<HTMLAnchorElement>} RefHTMLAnchorElement
 */

/**
 * A component to display and manage API tokens.
 *
 * This component provides a user interface to view, create, and revoke API tokens.
 * It displays token information including name, description, ID, creation date,
 * and expiration date. It supports different states (loading, error, loaded)
 * and provides responsive design that adapts to different screen sizes.
 */
export class CcTokenApiList extends LitElement {
  static get properties() {
    return {
      apiTokenCreationHref: { type: String, attribute: 'api-token-creation-href' },
      apiTokenUpdateHref: { type: String, attribute: 'api-token-update-href' },
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Sets the URL leading to the API token creation screen */
    this.apiTokenCreationHref = null;

    /** @type {string|null} Sets the URL leading to the API token update screen */
    this.apiTokenUpdateHref = null;

    /** @type {TokenApiListState} Sets the state of the component */
    this.state = { type: 'loading' };

    /** @type {RefHTMLAnchorElement} */
    this._createApiTokenLinkWhenEmptyRef = createRef();

    new ResizeController(this, {
      widthBreakpoints: [730],
    });

    new LostFocusController(this, '.api-token-card__actions__rev', ({ suggestedElement }) => {
      if (suggestedElement instanceof HTMLElement) {
        suggestedElement.focus();
      } else {
        this._createApiTokenLinkWhenEmptyRef.value?.focus();
      }
    });
  }

  /**
   * Handles the revocation of a specific token
   *
   * @param {string} tokenId - The ID of the token to be revoked
   * @private
   */
  _onRevokeToken(tokenId) {
    this.dispatchEvent(new CcTokenRevokeEvent(tokenId));
  }

  /**
   * Sorts API tokens for display.
   * Non-expired tokens are shown first, then expired tokens.
   * Within each group, tokens are sorted by creationDate descending.
   *
   * @param {ApiTokenState} tokenA
   * @param {ApiTokenState} tokenB
   */
  _sortTokens(tokenA, tokenB) {
    if (tokenA.isExpired && !tokenB.isExpired) {
      return 1;
    }
    if (!tokenA.isExpired && tokenB.isExpired) {
      return -1;
    }
    return tokenB.creationDate.getTime() - tokenA.creationDate.getTime();
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-token-api-list.error')}"></cc-notice>`;
    }

    const isEmpty = this.state.type === 'loaded' && this.state.apiTokens.length === 0;

    const sortedTokens = this.state.type === 'loaded' ? [...this.state.apiTokens].sort(this._sortTokens) : [];
    const isOneTokenRevoking = sortedTokens.some((token) => token.type === 'revoking');

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-token-api-list.main-heading')}</div>
        ${!isEmpty
          ? html`
              <div slot="header-right">
                <a class="create-token-cta" href="${this.apiTokenCreationHref}">
                  <span>${i18n('cc-token-api-list.create-token')}</span>
                </a>
              </div>
            `
          : ''}
        <div slot="content">
          <p>${i18n('cc-token-api-list.intro')}</p>
          <div class="api-tokens-wrapper">
            ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
            ${isEmpty
              ? html`
                  <div class="empty">
                    ${i18n('cc-token-api-list.empty')}
                    <a
                      class="create-token-cta"
                      href="${this.apiTokenCreationHref}"
                      ${ref(this._createApiTokenLinkWhenEmptyRef)}
                    >
                      <span>${i18n('cc-token-api-list.create-token')}</span>
                    </a>
                  </div>
                `
              : ''}
            ${sortedTokens.length > 0
              ? html`
                  <div class="api-tokens-wrapper__list">
                    ${sortedTokens.map((token) => this._renderTokenCard(token, isOneTokenRevoking))}
                  </div>
                `
              : ''}
          </div>
        </div>
        <cc-block-details slot="footer-left">
          <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
          <a slot="link" href="https://www.clever-cloud.com/developers/api/howto/#api-tokens" target="_blank">
            <span class="cc-link">${i18n('cc-token-api-list.link.doc')}</span>
            <cc-icon .icon=${iconExternalLink}></cc-icon>
          </a>
          <div slot="content">${i18n('cc-token-api-list.cli.content')}</div>
        </cc-block-details>
      </cc-block>
    `;
  }

  /**
   * Renders an individual token card
   *
   * @param {ApiTokenState} token - The token data to render
   * @param {boolean} isOneTokenRevoking - True if there is at least one token within the list that is being revoked
   * @private
   */
  _renderTokenCard({ type, id, name, description, creationDate, expirationDate, isExpired }, isOneTokenRevoking) {
    const hasExpirationWarning = !isExpired && isExpirationClose({ creationDate, expirationDate });
    const isRevoking = type === 'revoking';
    const textRevokeOrDelete = isExpired
      ? i18n('cc-token-api-list.delete-token', { name })
      : i18n('cc-token-api-list.revoke-token', { name });
    const iconRevokeOrDelete = isExpired ? iconDelete : iconRevoke;

    return html`
      <div
        class="api-token-card ${classMap({
          'api-token-card--is-revoking': isRevoking,
          'api-token-card--is-expired': isExpired,
        })}"
      >
        <div class="api-token-card__header">
          <div class="api-token-card__header__name">${name}</div>
          ${hasExpirationWarning
            ? html`<cc-badge intent="warning">${i18n('cc-token-api-list.card.expires-soon')}</cc-badge>`
            : ''}
          ${isExpired ? html`<cc-badge>${i18n('cc-token-api-list.card.expired')}</cc-badge>` : ''}
        </div>
        ${!isStringEmpty(description) ? html` <p class="api-token-card__description">${description}</p> ` : ''}
        <div class="api-token-card__id">
          <cc-icon .icon="${iconId}" a11y-name=${i18n('cc-token-api-list.card.token-id-icon.a11y-name')}></cc-icon>
          <span class="api-token-card__id__text">${id}</span>
        </div>
        <dl class="api-token-card__info-list">
          <div class="api-token-card__info-list__item">
            <dt>
              <cc-icon .icon=${iconCreation}></cc-icon>
              <span>${i18n('cc-token-api-list.card.label.creation')}</span>
            </dt>
            <dd>${i18n('cc-token-api-list.card.human-friendly-date', { date: creationDate })}</dd>
          </div>
          <div class="api-token-card__info-list__item api-token-card__info-list__item--bold">
            <dt>
              <cc-icon .icon=${iconInfo}></cc-icon>
              <span>${i18n('cc-token-api-list.card.label.expiration')}</span>
            </dt>
            <dd>
              <span>${i18n('cc-token-api-list.card.human-friendly-date', { date: expirationDate })}</span>
            </dd>
          </div>
        </dl>
        <cc-button
          class="api-token-card__action-revoke"
          ?danger="${!isExpired}"
          outlined
          hide-text
          .icon=${iconRevokeOrDelete}
          circle
          ?waiting=${isRevoking}
          @cc-click=${() => this._onRevokeToken(id)}
        >
          ${textRevokeOrDelete}
        </cc-button>
        ${!isOneTokenRevoking && !isExpired
          ? html`
              <a
                class="api-token-card__actions__update"
                href="${this.apiTokenUpdateHref}/${id}"
                title="${i18n('cc-token-api-list.update-token-with-name', { name })}"
              >
                ${i18n('cc-token-api-list.update-token')}
                <cc-icon .icon="${iconGoTo}"></cc-icon>
              </a>
            `
          : ''}
        ${isOneTokenRevoking && !isExpired
          ? html`
              <span class="api-token-card__actions__update api-token-card__actions__update--disabled">
                ${i18n('cc-token-api-list.update-token')}
                <cc-icon .icon="${iconGoTo}"></cc-icon>
              </span>
            `
          : ''}
      </div>
    `;
  }

  static get styles() {
    return [
      cliCommandsStyles,
      linkStyles,
      css`
        :host {
          --list-item-icon-size: 1.2em;

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

        .empty {
          border: 1px solid var(--cc-color-border-neutral-weak);
          display: grid;
          font-weight: bold;
          gap: 1.5em;
          justify-items: center;
          padding: 1em;
        }

        .create-token-cta {
          align-items: center;
          background-color: var(--cc-color-bg-primary);
          border: 1px solid var(--cc-color-bg-primary);
          border-radius: var(--cc-button-border-radius, 0.15em);
          box-sizing: border-box;
          color: var(--cc-color-text-inverted, #000);
          cursor: pointer;
          display: flex;
          font-weight: var(--cc-button-font-weight, bold);
          min-height: 2em;
          padding: 0 0.5em;
          text-decoration: none;
          text-transform: var(--cc-button-text-transform, uppercase);
          user-select: none;
        }

        .create-token-cta span {
          font-size: 0.85em;
        }

        .create-token-cta:hover {
          box-shadow: 0 1px 3px rgb(0 0 0 / 40%);
        }

        .create-token-cta:focus {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .api-tokens-wrapper {
          margin-top: 2.5em;
        }

        .api-tokens-wrapper__list {
          display: grid;
          gap: 1.5em;
        }

        @supports (grid-template-columns: subgrid) {
          .api-tokens-wrapper__list {
            grid-template-columns: [card-start info-start] max-content 1fr [info-end actions-start] auto [actions-end card-end];
          }

          :host([w-lt-730]) .api-tokens-wrapper__list {
            grid-template-columns: [card-start info-start] 1fr [info-end actions-start] auto [actions-end card-end];
          }
        }

        .api-token-card {
          align-items: center;
          border: solid 1px var(--cc-color-border-neutral-weak, #e6e6e6);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: grid;
          gap: 0.5em;
          grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
          padding: 1em;
        }

        .api-token-card--is-revoking > :not(cc-button),
        .api-token-card--is-expired > :not(cc-button) {
          opacity: var(--cc-opacity-when-disabled, 0.65);
        }

        .api-token-card--is-expired {
          background-color: var(--cc-color-bg-neutral, #eee);
        }

        @supports (grid-template-columns: subgrid) {
          .api-token-card {
            grid-column: card-start / card-end;
            grid-template-columns: subgrid;
          }

          :host([w-lt-730]) .api-token-card {
            grid-template-columns: subgrid;
          }
        }

        .api-token-card__header {
          align-items: center;
          column-gap: 1em;
          display: flex;
          flex-wrap: wrap;
          grid-column: info-start / info-end;
          row-gap: 0.5em;
        }

        .api-token-card__header__name {
          font-weight: bold;
        }

        .api-token-card__id {
          align-items: flex-start;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          grid-column: info-start / info-end;
        }

        .api-token-card__id__text {
          flex: 1 1 0;
          word-break: break-word;
        }

        .api-token-card__description {
          grid-column: info-start / info-end;
          margin: 0;
        }

        .api-token-card__id cc-icon {
          --cc-icon-size: var(--list-item-icon-size);

          flex: 0 0 auto;
        }

        .api-token-card__info-list {
          column-gap: 1em;
          display: flex;
          flex-wrap: wrap;
          grid-column: info-start / info-end;
          row-gap: 0.5em;
        }

        @supports (grid-template-columns: subgrid) {
          .api-token-card__info-list {
            display: grid;
            grid-column: info-start / info-end;
            grid-template-columns: subgrid;
          }
        }

        .api-token-card__info-list__item {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        :host([w-lt-730]) .api-token-card__info-list__item {
          display: grid;
          row-gap: 0.5em;
        }

        @supports (grid-template-columns: subgrid) {
          :host([w-lt-730]) .api-token-card__info-list__item {
            display: flex;
          }
        }

        .api-token-card__info-list__item--bold {
          font-weight: bold;
        }

        .api-token-card__info-list__item dt {
          --cc-icon-size: var(--list-item-icon-size);

          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .api-token-card__info-list__item dd {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .api-token-card cc-button {
          align-self: start;
          grid-column: actions-start / actions-end;
          grid-row: 1 / 2;
          justify-self: end;
        }

        .api-token-card__actions__update {
          align-items: center;
          align-self: flex-end;
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: var(--cc-color-text-weak, #404040);
          display: flex;
          gap: 0.5em;
          grid-column: actions-start / actions-end;
          padding: 0.2em;
          text-decoration: none;
        }

        .api-token-card__actions__update:visited,
        .api-token-card__actions__update:active {
          color: var(--cc-color-text-weak, #404040);
        }

        .api-token-card__actions__update:focus-visible {
          outline: var(--cc-focus-outline, #3569aa solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .api-token-card__actions__update--disabled {
          opacity: var(--cc-opacity-when-disabled, 0.65);
        }
      `,
    ];
  }
}

customElements.define('cc-token-api-list', CcTokenApiList);
