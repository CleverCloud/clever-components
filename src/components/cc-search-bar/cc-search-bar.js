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
 * @import { IconModel } from '../common.types.js'
 * @import { CcInputEvent } from '../common.events.js'
 * @import { PropertyValues } from 'lit'
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
      _activeItemIndex: { type: Number, state: true },
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

    /**
     * @type {number} Index of the virtually focused item within the flattened list of filtered items.
     * `-1` means no item is virtually focused: the real focus stays on the input.
     */
    this._activeItemIndex = -1;

    // We listen to `keydown` in the capture phase because `cc-input-text` stops the propagation of keydown events
    // during the bubbling phase (to avoid conflicts with shortcuts).
    /** @type {{ handleEvent: (e: KeyboardEvent) => void, capture: boolean }} */
    this._inputKeydownListener = {
      handleEvent: (e) => this._onInputKeydown(e),
      capture: true,
    };
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

  /**
   * Returns the filtered items flattened into a single ordered list, matching the order they are rendered in.
   *
   * @returns {SearchBarItem[]}
   */
  _getFlatItems() {
    return this._getFilteredSections().flatMap((section) => section.items);
  }

  _onDialogClose() {
    this.open = false;
    this._activeItemIndex = -1;
  }

  /** @param {CcInputEvent} e */
  _onInput(e) {
    this.value = e.detail;
    // As soon as the query changes, the filtered items change: the virtually focused item may disappear,
    // so we reset the virtual focus back to the input.
    this._activeItemIndex = -1;
  }

  /**
   * Handles the keyboard navigation across the filtered items using a "virtual focus":
   * the real focus stays on the input while the arrow keys move a purely visual selection.
   *
   * No ARIA is added on purpose: screen reader users keep the default experience (tabbing through the links).
   *
   * @param {KeyboardEvent} e
   */
  _onInputKeydown(e) {
    const itemCount = this._getFlatItems().length;
    if (itemCount === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      // We prevent the native behavior (moving the caret / scrolling).
      e.preventDefault();
      // Loop back to the first item when reaching the end.
      this._activeItemIndex = this._activeItemIndex >= itemCount - 1 ? 0 : this._activeItemIndex + 1;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Loop back to the last item when reaching the start (including from the input, index `-1`).
      this._activeItemIndex = this._activeItemIndex <= 0 ? itemCount - 1 : this._activeItemIndex - 1;
    } else if (e.key === 'Enter' && this._activeItemIndex >= 0) {
      e.preventDefault();
      // Activating the virtually focused item mirrors a click on the corresponding link.
      /** @type {HTMLAnchorElement} */
      const activeItem = this.shadowRoot.querySelector(`.item[data-index="${this._activeItemIndex}"]`);
      activeItem?.click();
    }
  }

  /** @param {PropertyValues} changedProperties */
  updated(changedProperties) {
    // If the virtually focused item no longer exists (e.g. the sections changed), reset the focus to the input.
    if (this._activeItemIndex >= this._getFlatItems().length) {
      this._activeItemIndex = -1;
      return;
    }
    if (changedProperties.has('_activeItemIndex') && this._activeItemIndex >= 0) {
      // `block: 'nearest'` keeps the selection visible when scrolling through a long list (or when zoomed in)
      // without jumping around.
      this.shadowRoot.querySelector('.item.active')?.scrollIntoView({ block: 'nearest' });
    }
  }

  render() {
    const filteredSections = this._getFilteredSections();
    const hasItems = filteredSections.length > 0;

    // We flatten the items into a single ordered list so each rendered item gets a global index,
    // used by the keyboard navigation to know which item is virtually focused.
    let itemIndex = 0;
    const indexedSections = filteredSections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({ item, index: itemIndex++ })),
    }));

    return html`
      <cc-dialog ?open="${this.open}" @cc-close="${this._onDialogClose}">
        <h1 slot="heading" class="heading">${i18n('cc-search-bar.heading')}</h1>
        <div class="search-bar">
          ${this._renderSearchInput()}
          ${hasItems
            ? html`<div class="sections" tabindex="-1">
                ${indexedSections.map((section) => this._renderSection(section))}
              </div>`
            : this._renderEmpty()}
          ${this._renderFooter()}
        </div>
      </cc-dialog>
    `;
  }

  _renderFooter() {
    return html`
      <div class="footer">
        <span class="footer-hint">
          <kbd class="footer-key">↑↓</kbd>
          <span>${i18n('cc-search-bar.footer.navigate')}</span>
        </span>
        <span class="footer-hint">
          <kbd class="footer-key">↵</kbd>
          <span>${i18n('cc-search-bar.footer.select')}</span>
        </span>
        <span class="footer-hint">
          <kbd class="footer-key footer-key--text">ESC</kbd>
          <span>${i18n('cc-search-bar.footer.close')}</span>
        </span>
      </div>
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
            @keydown="${this._inputKeydownListener}"
          ></cc-input-text>
          <cc-icon class="search-icon" .icon="${iconSearch}" size="sm"></cc-icon>
        </div>
      </div>
    `;
  }

  /** @param {{ label: string, icon: IconModel, items: Array<{ item: SearchBarItem, index: number }> }} section */
  _renderSection(section) {
    return html`
      <div class="section">
        <h2 class="section-header">
          <cc-icon .icon="${section.icon}" size="md"></cc-icon>
          <span class="section-header-label">${section.label}</span>
        </h2>
        <ul class="section-items">
          ${section.items.map(({ item, index }) => this._renderItem(item, index))}
        </ul>
      </div>
    `;
  }

  /**
   * @param {SearchBarItem} item
   * @param {number} index
   */
  _renderItem(item, index) {
    const isExternal = isExternalUrl(item.href);
    const badgeIntent = item.itemType != null ? ITEM_TYPE_BADGE_INTENT[item.itemType] : null;
    const title = isExternal ? i18n('cc-search-bar.external-link.title', { linkText: item.label }) : nothing;
    const isActive = index === this._activeItemIndex;
    return html`
      <li>
        <a
          class="item ${isActive ? 'active' : ''}"
          data-index="${index}"
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
          /* We reserve some room (compared to a footer-less layout) so the footer is never clipped by the dialog's \`overflow: hidden\`. */
          max-height: calc(100dvh - 19em);
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

        /* Virtual focus: we don't use \`outline\` here because it's already used for the real \`:focus-visible\` state. */
        .item.active {
          background: var(--cc-color-bg-neutral-active, #eaeaea);
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

        .item:hover .hover-chevron,
        .item.active .hover-chevron {
          display: inline-block;
        }

        .footer {
          /* The dialog wraps its content in padding. We cancel it with negative margins so the footer spans the full
             width and reaches the bottom edge of the dialog (full-bleed grey bar). We rebuild the same padding value
             the dialog uses (\`--cc-dialog-padding-xl\` / \`--cc-dialog-padding-sm\`, both inherited from \`cc-dialog\`). */
          --footer-dialog-padding: var(--cc-dialog-padding, var(--cc-dialog-padding-xl, 4em));

          align-items: center;
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
          border-top: solid 1px var(--cc-color-border-neutral-weak, #e7e7e7);
          color: var(--cc-color-text-weak, #666);
          display: flex;
          flex-wrap: wrap;
          gap: var(--cc-spacing-5, 1em);
          justify-content: center;
          margin-bottom: calc(-1 * var(--footer-dialog-padding));
          margin-inline: calc(-1 * var(--footer-dialog-padding));
          margin-top: var(--cc-spacing-3, 0.5em);
          padding: var(--cc-spacing-3, 0.5em) var(--footer-dialog-padding);
        }

        /* stylelint-disable-next-line media-feature-range-notation */
        @media screen and (max-width: 25em) {
          .footer {
            --footer-dialog-padding: var(--cc-dialog-padding, var(--cc-dialog-padding-sm, 2em));
          }
        }

        .footer-hint {
          align-items: center;
          display: flex;
          font-size: 0.75em;
          gap: var(--cc-spacing-1, 0.25em);
        }

        .footer-key {
          align-items: center;
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
          border: solid 1px var(--cc-color-border-neutral-weak, #e7e7e7);
          border-radius: var(--cc-border-radius-small, 0.25em);
          display: inline-flex;
          font-family: var(--cc-ff-monospace, monospace);
          justify-content: center;
          line-height: 1;
          min-width: 1.5em;
          padding: var(--cc-spacing-1, 0.25em);
        }

        /* Textual keys (e.g. \`ESC\`) get a smaller font so they don't look bigger than the single-glyph keys. */
        .footer-key--text {
          font-size: 0.85em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-search-bar', CcSearchBar);
