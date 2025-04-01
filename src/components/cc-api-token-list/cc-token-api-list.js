import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixCalendar_2Fill as iconCreation,
  iconRemixDeleteBinLine as iconDelete,
  iconRemixAlertLine as iconExpiration,
  iconRemixInformationLine as iconTokenId,
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
 * @typedef {import('./cc-token-api-list.types.js').TokenApiState} TokenApiState
 * @typedef {import('./cc-token-api-list.types.js').TokenApiListState} TokenApiListState
 * @typedef {import('lit/directives/ref.js').Ref<HTMLAnchorElement>} RefHTMLAnchorElement
 */

/**
 * A component to display and manage API tokens
 *
 * @fires {CustomEvent<string>} cc-token-api-list:revoke-token - Dispatched when a user requests to revoke a specific token
 * @fires {CustomEvent<void>} cc-token-api-list:create-token - Dispatched when a user clicks on the create token button
 */
export class CcTokenApiList extends LitElement {
  static get properties() {
    return {
      createApiTokenHref: { type: String, attribute: 'create-api-token-href' },
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {string|null} the URL leading to the API token creation screen */
    this.createApiTokenHref = null;

    /** @type {TokenApiListState} */
    this.state = { type: 'loading' };

    /** @type {RefHTMLAnchorElement} */
    this._createApiTokenLinkWhenEmptyRef = createRef();

    new ResizeController(this, {
      widthBreakpoints: [995, 730],
    });

    new LostFocusController(this, '.api-token-card__action-revoke', ({ suggestedElement }) => {
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
    dispatchCustomEvent(this, 'revoke-token', tokenId);
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-token-api-list.error')}"></cc-notice>`;
    }

    const isEmpty = this.state.type === 'loaded' && this.state.tokens.length === 0;

    const sortedTokens =
      this.state.type === 'loaded'
        ? [...this.state.tokens].sort((tokenA, tokenB) => tokenB.creationDate.getTime() - tokenA.creationDate.getTime())
        : [];

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-token-api-list.main-heading')}</div>
        ${!isEmpty
          ? html`
              <div slot="header-right">
                <a class="create-token-cta" href="${this.createApiTokenHref}">
                  ${i18n('cc-token-api-list.create-token')}
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
                      href="${this.createApiTokenHref}"
                      ${ref(this._createApiTokenLinkWhenEmptyRef)}
                    >
                      ${i18n('cc-token-api-list.create-token')}
                    </a>
                  </div>
                `
              : ''}
            ${this.state.type === 'loaded' && sortedTokens?.length > 0
              ? html`
                  <div class="api-tokens-wrapper__list">
                    ${sortedTokens.map((token) => this._renderTokenCard(token))}
                  </div>
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
   * @param {TokenApiState} token - The token data to render
   * @private
   */
  _renderTokenCard({ type, id, name, description, creationDate, expirationDate }) {
    const hasExpirationWarning = isExpirationClose({ creationDate, expirationDate });
    const isRevoking = type === 'revoking';

    return html`
      <div class="api-token-card ${classMap({ 'is-revoking': isRevoking })}">
        <div class="api-token-card__header">
          <div class="api-token-card__header__name">${name}</div>
          ${hasExpirationWarning
            ? html` <cc-badge intent="warning">${i18n('cc-token-api-list.card.deadline-approaches')}</cc-badge> `
            : ''}
        </div>
        ${description != null ? html` <p class="api-token-card__description">${description}</p> ` : ''}
        <div class="api-token-card__id">
          <cc-icon .icon="${iconTokenId}"></cc-icon>
          <span>${id}</span>
        </div>
        <dl class="api-token-card__info">
          <div>
            <dt>
              <cc-icon .icon=${iconCreation}></cc-icon>
              <span>${i18n('cc-token-api-list.card.label.creation')}</span>
            </dt>
            <dd>${i18n('cc-token-api-list.card.human-friendly-date', { date: creationDate })}</dd>
          </div>
          <div class="api-token-card__info__expiration">
            <dt>
              <cc-icon .icon=${iconExpiration}></cc-icon>
              <span>${i18n('cc-token-api-list.card.label.expiration')}</span>
            </dt>
            <dd>
              <span>${i18n('cc-token-api-list.card.human-friendly-date', { date: expirationDate })}</span>
            </dd>
          </div>
        </dl>
        <cc-button
          class="api-token-card__action-revoke"
          danger
          outlined
          hide-text
          .icon=${iconDelete}
          circle
          ?waiting=${isRevoking}
          @cc-button:click=${() => this._onRevokeToken(id)}
        >
          ${i18n('cc-token-api-list.revoke-token', { name })}
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
        padding: 1em;
        display: grid;
        justify-items: center;
        font-weight: bold;
        gap: 1.5em;
      }

      .is-revoking > *:not(cc-button) {
        opacity: var(--cc-opacity-when-disabled, 0.65);
      }

      .create-token-cta {
        display: flex;
        align-items: center;
        color: var(--cc-color-text-primary, #000);
        text-decoration: none;
        background-color: var(--cc-color-bg-default, #fff);
        /* FIXME: we should have token for primary border? */
        border: 1px solid var(--cc-color-bg-primary);
        border-radius: var(--cc-button-border-radius, 0.15em);
        cursor: pointer;
        font-weight: var(--cc-button-font-weight, bold);
        min-height: 2em;
        padding: 0 0.5em;
        /* used to absolutely position the <progress> */
        text-transform: var(--cc-button-text-transform, uppercase);
        user-select: none;
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

      .api-token-card {
        align-items: center;
        border: solid 1px var(--cc-color-border-neutral-weak, #e6e6e6);
        border-radius: var(--cc-border-radius-default, 0.25em);
        display: grid;
        grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
        padding: 1em;
        gap: 1em;
      }

      .api-token-card__header {
        --cc-icon-size: 1.2em;

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
        display: flex;
        gap: 0.5em;
        grid-column: info-start / info-end;
      }

      .api-token-card__description {
        grid-column: info-start / info-end;
        margin: 0;
      }

      .api-token-card__id cc-icon {
        flex: 0 0 auto;
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

      :host([w-lt-730]) .api-token-card {
        grid-template-columns: [card-start info-start] 1fr [info-end actions-start] max-content [actions-end card-end];
      }

      :host([w-lt-730]) .api-token-card__info div {
        display: grid;
        row-gap: 0.5em;
      }

      @supports (grid-template-columns: subgrid) {
        .api-tokens-wrapper__list {
          grid-template-columns: [card-start info-start] max-content 1fr [info-end actions-start] auto [actions-end card-end];
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

        :host([w-lt-730]) .api-tokens-wrapper__list {
          grid-template-columns: [card-start info-start] 1fr [info-end actions-start] auto [actions-end card-end];
        }

        :host([w-lt-730]) .api-token-card__info div {
          display: flex;
        }
      }
    `;
  }
}

customElements.define('cc-token-api-list', CcTokenApiList);
