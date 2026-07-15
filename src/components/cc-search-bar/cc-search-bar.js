import { css, html, LitElement, nothing } from 'lit';
import {
  iconRemixArrowRightSLine as iconArrowRight,
  iconRemixExternalLinkLine as iconExternalLink,
  iconRemixSearchLine as iconSearch,
} from '../../assets/cc-remix.icons.js';
import { isExternalUrl } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';

const KEYWORD_TOKEN_REGEX = /^is:./;

/** @type {Record<SearchBarItemType, BadgeIntent>} */
const ITEM_TYPE_BADGE_INTENT = {
  app: 'success',
  addon: 'warning',
  'network-group': 'neutral',
  cke: 'neutral',
  'oauth-consumer': 'neutral',
  'addon-provider': 'neutral',
};

/**
 * Returns the translated badge label for a given item type.
 *
 * Keys are spelled out one by one so `tasks/check-i18n.js` can statically detect them.
 *
 * @param {SearchBarItemType} itemType
 * @returns {string}
 */
function getItemTypeBadgeLabel(itemType) {
  switch (itemType) {
    case 'app':
      return i18n('cc-search-bar.badge.app');
    case 'addon':
      return i18n('cc-search-bar.badge.addon');
    case 'network-group':
      return i18n('cc-search-bar.badge.network-group');
    case 'cke':
      return i18n('cc-search-bar.badge.cke');
    case 'oauth-consumer':
      return i18n('cc-search-bar.badge.oauth-consumer');
    case 'addon-provider':
      return i18n('cc-search-bar.badge.addon-provider');
  }
}

/**
 * @import { SearchBarItem, SearchBarItemType, SearchBarSection } from './cc-search-bar.types.js'
 * @import { BadgeIntent } from '../cc-badge/cc-badge.types.js'
 * @import { CcInputEvent } from '../common.events.js'
 */

/**
 * A search bar dialog that displays categorized results.
 *
 * ## Details
 *
 * The component wraps a search input and a list of sections inside a `cc-dialog`.
 * Items can have optional badges and external link indicators.
 *
 * @cssdisplay contents
 *
 */
export class CcSearchBar extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      sections: { type: Array },
      value: { type: String },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Displays or hides the search bar dialog. */
    this.open = false;

    /** @type {SearchBarSection[]} Sets the sections to display, each containing a label, icon, and items. */
    this.sections = [];

    /** @type {string} Sets the current search input value. */
    this.value = '';
  }

  /** Opens the search bar dialog by setting the `open` property to true. */
  show() {
    this.open = true;
  }

  /** Closes the search bar dialog by setting the `open` property to false. */
  hide() {
    this.open = false;
  }

  /**
   * Filters `this.sections` based on `this.value`, using a token-based syntax.
   *
   * Tokens are split on whitespace and partitioned into:
   * - keyword tokens (`is:<value>`): an item passes only if every keyword token
   *   is present in its derived matchers (`is:<itemType>` and explicit `matchers`).
   * - text tokens: an item passes only if every text token is `includes`'d in its
   *   lowercased label or its lowercased id.
   *
   * @returns {SearchBarSection[]}
   */
  _getFilteredSections() {
    const query = this.value.trim().toLowerCase();
    if (query === '') {
      return [];
    }
    const tokens = query.split(/\s+/);
    const keywordTokens = tokens.filter((token) => KEYWORD_TOKEN_REGEX.test(token));
    const textTokens = tokens.filter((token) => !KEYWORD_TOKEN_REGEX.test(token));

    return this.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const itemMatchers = [...(item.itemType != null ? [`is:${item.itemType}`] : []), ...(item.matchers ?? [])];
          const keywordsMatch = keywordTokens.every((keyword) => itemMatchers.includes(keyword));
          if (!keywordsMatch) {
            return false;
          }
          const label = item.label.toLowerCase();
          const id = item.id?.toLowerCase() ?? '';
          return textTokens.every((token) => label.includes(token) || id.includes(token));
        }),
      }))
      .filter((section) => section.items.length > 0);
  }

  _onDialogClose() {
    this.open = false;
  }

  /** @param {CcInputEvent} e */
  _onInput(e) {
    this.value = e.detail;
  }

  render() {
    const filteredSections = this._getFilteredSections();
    const hasItems = filteredSections.length > 0;
    return html`
      <cc-dialog ?open="${this.open}" @cc-close="${this._onDialogClose}">
        <h1 slot="heading" class="heading">${i18n('cc-search-bar.heading')}</h1>
        <div class="search-bar">
          ${this._renderSearchInput()}
          ${hasItems
            ? html`<div class="sections" tabindex="-1">
                ${filteredSections.map((section) => this._renderSection(section))}
              </div>`
            : this._renderEmpty()}
        </div>
      </cc-dialog>
    `;
  }

  _renderEmpty() {
    const isInitial = this.value.trim() === '';
    return html`
      <div class="empty">
        <cc-icon class="empty-icon" .icon="${iconSearch}" size="xl"></cc-icon>
        <p class="empty-title">
          ${isInitial ? i18n('cc-search-bar.initial.title') : i18n('cc-search-bar.no-result.title')}
        </p>
        <p class="empty-description">
          ${isInitial ? i18n('cc-search-bar.initial.description') : i18n('cc-search-bar.no-result.description')}
        </p>
      </div>
    `;
  }

  _renderSearchInput() {
    return html`
      <div class="input-wrapper">
        <div class="input-field">
          <cc-input-text
            label="${i18n('cc-search-bar.label')}"
            placeholder="${i18n('cc-search-bar.placeholder')}"
            value="${this.value}"
            ?autofocus="${true}"
            @cc-input="${this._onInput}"
          ></cc-input-text>
          <cc-icon class="search-icon" .icon="${iconSearch}" size="sm"></cc-icon>
        </div>
      </div>
    `;
  }

  /** @param {SearchBarSection} section */
  _renderSection(section) {
    return html`
      <div class="section">
        <h2 class="section-header">
          <cc-icon .icon="${section.icon}" size="md"></cc-icon>
          <span class="section-header-label">${section.label}</span>
        </h2>
        <ul class="section-items">
          ${section.items.map((item) => this._renderItem(item))}
        </ul>
      </div>
    `;
  }

  /** @param {SearchBarItem} item */
  _renderItem(item) {
    const isExternal = isExternalUrl(item.href);
    const badgeIntent = item.itemType != null ? ITEM_TYPE_BADGE_INTENT[item.itemType] : null;
    const title = isExternal ? i18n('cc-search-bar.external-link.title', { linkText: item.label }) : nothing;
    return html`
      <li>
        <a
          class="item"
          href="${item.href}"
          target="${isExternal ? '_blank' : nothing}"
          rel="${isExternal ? 'noreferrer' : nothing}"
          title="${title}"
        >
          <span class="item-label">${item.label}</span>
          ${item.itemType != null
            ? html`
                <cc-badge intent="${badgeIntent}" weight="dimmed">${getItemTypeBadgeLabel(item.itemType)}</cc-badge>
              `
            : ''}
          ${isExternal
            ? html`
                <cc-icon
                  class="external-link-icon"
                  .icon="${iconExternalLink}"
                  size="md"
                  a11y-name="${i18n('cc-search-bar.external-link.name')}"
                ></cc-icon>
              `
            : html`<cc-icon class="hover-chevron" .icon="${iconArrowRight}" size="md"></cc-icon>`}
        </a>
      </li>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: contents;
        }

        cc-dialog {
          --cc-dialog-width: 45em;
        }

        cc-dialog::part(dialog) {
          margin-block: var(--cc-spacing-5, 1em) auto;
          overflow: hidden;
        }

        .search-bar {
          display: flex;
          flex-direction: column;
        }

        .heading {
          font-size: 1.125em;
          margin: 0;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--cc-spacing-2, 0.35em);
          padding: var(--cc-spacing-3, 0.5em) var(--cc-spacing-3, 0.5em) var(--cc-spacing-5, 1em);
        }

        .input-field {
          position: relative;
        }

        .input-field cc-input-text {
          display: block;
          font-size: 0.8em;
          width: 100%;
        }

        .search-icon {
          bottom: 0.8em;
          color: var(--cc-color-text-default, #000);
          pointer-events: none;
          position: absolute;
          right: 0.67em;
          transform: translateY(50%);
        }

        .sections {
          flex: 1;
          max-height: calc(100dvh - 16em);
          overflow-y: auto;
          padding: 0 var(--cc-spacing-3, 0.5em);
        }

        .empty {
          align-items: center;
          color: var(--cc-color-text-default, #000);
          display: flex;
          flex-direction: column;
          gap: var(--cc-spacing-3, 0.5em);
          padding: var(--cc-spacing-7, 1.5em) var(--cc-spacing-5, 1em);
          text-align: center;
        }

        .empty-icon {
          color: var(--cc-color-text-primary-strongest, #000);
          margin-bottom: var(--cc-spacing-1, 0.25em);
        }

        .empty-title {
          font-size: 0.78em;
          font-weight: bold;
          margin: 0;
        }

        .empty-description {
          color: var(--cc-color-text-weak, #666);
          font-size: 0.78em;
          line-height: 1.5;
          margin: 0;
        }

        .empty-description code {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
          border-radius: var(--cc-border-radius-small, 0.25em);
          font-family: var(--cc-ff-monospace, monospace);
          padding: var(--cc-spacing-0, 0.125em) var(--cc-spacing-1, 0.25em);
        }

        .section:not(:last-child) {
          border-bottom: solid 1px var(--cc-color-border-neutral-weak, #e7e7e7);
          padding-bottom: var(--cc-spacing-5, 1em);
        }

        .section:not(:first-child) {
          padding-top: var(--cc-spacing-3, 0.5em);
        }

        .section-header {
          align-items: center;
          color: var(--cc-color-text-weak, #666);
          display: flex;
          font-size: 1em;
          font-weight: normal;
          gap: var(--cc-spacing-2, 0.35em);
          line-height: 1.3;
          margin: 0;
          padding: var(--cc-spacing-5, 1em) 0;
        }

        .section-header-label {
          font-size: 0.75em;
        }

        .section-items {
          display: flex;
          flex-direction: column;
          gap: var(--cc-spacing-3, 0.5em);
          list-style: none;
          margin: 0;
          padding: var(--cc-spacing-2, 0.35em) 0;
        }

        .item {
          align-items: center;
          border-radius: var(--cc-border-radius-large, 0.5em);
          color: var(--cc-color-text-default, #000);
          display: flex;
          font-weight: normal;
          gap: var(--cc-spacing-3, 0.5em);
          letter-spacing: -0.15px;
          padding: var(--cc-spacing-3, 0.5em);
          text-decoration: none;
        }

        .item:hover {
          background: var(--cc-color-bg-neutral, #f5f5f5);
        }

        .item:focus-visible {
          border-radius: var(--cc-border-radius-large, 0.5em);
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .item-label {
          flex: 1;
          font-size: 0.875em;
          max-width: 80%;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .item-label + * {
          margin-left: auto;
        }

        .external-link-icon {
          color: var(--cc-color-text-primary-strongest, #012a51);
          flex-shrink: 0;
        }

        .hover-chevron {
          color: var(--cc-color-text-primary, #1a51b3);
          display: none;
          flex-shrink: 0;
        }

        .item:hover .hover-chevron {
          display: inline-block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-search-bar', CcSearchBar);
