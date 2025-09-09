import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconRemixExternalLinkLine as externalLinkIcon, iconRemixDownloadLine } from '../../assets/cc-remix.icons.js';
import { isStringEmpty } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';

/**
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLSlotElement>} SlotChangeEvent
 */

/**
 * A component that displays a link with optional skeleton for loading and automatic handling of external links
 *
 * ## Details
 *
 * * The link has a display of `inline-flex` to ease vertical alignment and spacing.
 * * External URLs are automatically handled by adding `target="_blank"` and `rel="noreferrer"` on the link for security purposes.
 * * The title is automatically inferred though it can be overridden by the `a11yDesc` attribute.
 *
 * @cssdisplay inline-flex
 *
 * @csspart img - Styles the `cc-img` on the left of the link when the `image` property is used.
 *
 * @slot - The content of the link (text or HTML).
 */
export class CcLink extends LitElement {
  static get properties() {
    return {
      a11yDesc: { type: String, attribute: 'a11y-desc' },
      disableExternalLinkIcon: { type: Boolean, attribute: 'disable-external-link-icon' },
      download: { type: String },
      href: { type: String },
      icon: { type: Object },
      iconA11yName: { type: String, attribute: 'icon-a11y-name' },
      image: { type: String },
      imgA11yName: { type: String, attribute: 'img-a11y-name' },
      mode: { type: String, reflect: true },
      skeleton: { type: Boolean },
      _title: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Optional accessibility description (`title` attribute). */
    this.a11yDesc = null;

    /** @type {boolean} Disables the external link icon. */
    this.disableExternalLinkIcon = false;

    /** @type {string|null} If set, enables `download` attribute value on the inner native `<a>` element. */
    this.download = null;

    /** @type {string} The URL for the link. */
    this.href = '';

    /** @type {IconModel|null} If set, enables icon mode and displays the required icon in the <cc-icon> component. */
    this.icon = null;

    /** @type {string|null} Sets the `a11y-name` attribute value on the `<cc-icon>` tag. Only use if the icon conveys additional info compared to surrounding text. Check the `<cc-icon>` documentation for more details. */
    this.iconA11yName = null;

    /** @type {string|null} Sets the `a11y-name` attribute value on the `<cc-img>` tag. Only use if the image conveys additional info compared to surrounding text. Check the `<cc-img>` documentation for more details. */
    this.imgA11yName = null;

    /** @type {string|null} If set, enables icon mode and sets the `src` of the inner native `<img>` element. */
    this.image = null;

    /** @type {'default'|'button'|'subtle'} Sets the display mode of the link. (defaults to `default`) */
    this.mode = 'default';

    /** @type {boolean} Enables skeleton styles for loading state. */
    this.skeleton = false;

    this._title = '';
  }

  /**
   * Checks if a given URL points to a different origin than the current page.
   * If the URL is invalid, it is considered as a different origin for security.
   *
   * @param {string} rawUrl - The URL to check.
   * @returns {boolean} True if the URL points to a different origin, false otherwise.
   * @private
   */
  _isDifferentOrigin(rawUrl) {
    try {
      const url = new URL(rawUrl, location.href);
      return url.origin !== location.origin;
    } catch {
      // Consider bad URLs as different origin
      return true;
    }
  }

  /**
   * Determines the appropriate title for the link
   *
   * @param {string|null} a11yDesc - The accessibility description
   * @param {boolean} isDifferentOrigin - Whether the link points to a different origin
   * @param {string} title - The text content of the cc-link slot
   * @returns {string|null}  The title to use for the link, or null if no title should be set
   * @private
   */
  _getTitle(a11yDesc, isDifferentOrigin, title) {
    if (isDifferentOrigin) {
      const linkText = !isStringEmpty(a11yDesc) ? a11yDesc : title;
      return i18n('cc-link.new-window.title', { linkText });
    }

    if (!isStringEmpty(a11yDesc)) {
      return a11yDesc;
    }

    return null;
  }

  /**
   * @param {SlotChangeEvent} e
   * @private
   */
  _onSlotChange(e) {
    const slotElement = e.target;
    this._title = slotElement
      .assignedNodes()
      .map((node) => {
        return node.textContent;
      })
      .join('')
      .trim();
  }

  render() {
    const href = this.href != null && !this.skeleton ? this.href : null;
    const isDifferentOrigin = this._isDifferentOrigin(href);
    const target = isDifferentOrigin ? '_blank' : null;
    const rel = isDifferentOrigin ? 'noreferrer' : null;
    const disableExternalIcon = this.disableExternalLinkIcon || this.mode !== 'default';

    const title = this._getTitle(this.a11yDesc, isDifferentOrigin, this._title);

    // Make sure there are no spaces before the <a> and after the </a>
    return html`
      <div class="cc-link ${classMap({ skeleton: this.skeleton })}">
        ${this.image != null && this.icon == null
          ? html` <cc-img src=${this.image} a11y-name="${this.imgA11yName}" part="img"></cc-img> `
          : ''}
        ${this.icon != null
          ? html` <cc-icon class="cc-link__icon" .icon="${this.icon}" a11y-name="${this.iconA11yName}"></cc-icon> `
          : ''}
        <a
          href=${ifDefined(href)}
          target=${ifDefined(target)}
          rel=${ifDefined(rel)}
          title="${ifDefined(title)}"
          download=${ifDefined(this.download)}
        >
          <span class="link-slot">
            <slot @slotchange="${this._onSlotChange}"></slot>
          </span>
          ${isDifferentOrigin && !disableExternalIcon
            ? html`<cc-icon
                class="cc-link__external-icon"
                .icon=${externalLinkIcon}
                a11y-name=${i18n('cc-link.new-window.name')}
              ></cc-icon>`
            : ''}
          ${this.download != null && this.mode === 'default'
            ? html`<cc-icon
                .icon=${iconRemixDownloadLine}
                a11y-name=${i18n('cc-link.download.icon-a11y-name')}
              ></cc-icon>`
            : ''}
        </a>
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      css`
        :host {
          color: var(--cc-color-text-primary-highlight, blue);
          display: inline;
        }

        .cc-link,
        a {
          align-items: center;
          display: inline-flex;
          gap: 0.5em;
        }

        .link-slot {
          text-decoration: underline;
        }

        /* region link base styles */
        a,
        a:visited,
        a:active {
          color: var(--cc-color-text-primary-highlight, blue);
          gap: 0.1em;
          text-decoration: none;
        }

        /* endregion */

        /* region focus states */
        a:focus {
          outline: none;
        }

        .cc-link:focus-within {
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-small, 0.15em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        a::-moz-focus-inner {
          border: 0;
        }
        /* endregion */

        /* region icon & image styles */
        cc-img {
          height: 1em;
          min-height: 0;
          padding: 0;
          width: 1em;
        }
        /* endregion */

        /* region skeleton state */
        .cc-link.skeleton {
          background-color: var(--cc-color-text-primary-weak, hsl(209deg 98% 73%));

          --cc-icon-color: transparent;
        }

        .cc-link.skeleton cc-img {
          display: none;
        }

        .cc-link.skeleton a {
          color: transparent;
        }
        /* endregion */

        /* region Subtle */
        :host([mode='subtle']),
        :host([mode='subtle']) a,
        :host([mode='subtle']) a:active,
        :host([mode='subtle']) a:visited {
          color: var(--cc-color-text-weak);
        }

        :host([mode='subtle']) .link-slot {
          text-decoration: none;
        }

        :host([mode='subtle']) .skeleton .link-slot {
          color: transparent;
        }

        :host([mode='subtle']) .skeleton {
          background-color: #bbb;
        }
        /* endregion */

        /* region BUTTON */
        :host([mode='button']) .link-slot {
          color: var(--cc-color-text-inverted, #fff);
          font-size: 0.85em;
          text-decoration: none;
        }

        :host([mode='button']) {
          display: inline-block;
        }

        :host([mode='button']) .cc-link {
          background-color: var(--cc-color-bg-primary, #3569aaff);
          border: 1px solid var(--cc-color-bg-primary, #3569aaff);
          border-radius: var(--cc-button-border-radius, 0.15em);
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          font-weight: var(--cc-button-font-weight, bold);
          justify-content: center;
          min-height: 2em;
          padding: 0 0.5em;
          text-transform: var(--cc-button-text-transform, uppercase);
        }

        :host([mode='button']) .cc-link:hover {
          box-shadow: 0 1px 3px rgb(0 0 0 / 40%);
        }

        :host([mode='button']) .skeleton {
          background-color: #bbb;
          border-color: #777;
          cursor: default;
        }

        :host([mode='button']) .skeleton .link-slot {
          color: transparent;
        }

        :host([mode='button']) .cc-link:hover.skeleton {
          box-shadow: none;
        }

        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-link', CcLink);
