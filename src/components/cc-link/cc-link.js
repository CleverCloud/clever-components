import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { skeletonStyles } from '../../styles/skeleton.js';

export const linkStyles = css`
  .cc-link {
    align-items: center;
    display: flex;
    gap: 0.5em;
  }

  .cc-link,
  .cc-link:visited,
  .cc-link:active {
    color: var(--cc-color-text-primary-highlight, blue);
  }

  .cc-link:enabled:hover {
    color: var(--cc-color-text-primary);
  }

  .cc-link:focus {
    background-color: var(--cc-color-bg-default, #fff);
    border-radius: 0.1em;
    outline: var(--cc-focus-outline, #000 solid 2px);
    outline-offset: var(--cc-focus-outline-offset, 2px);
  }

  .cc-link::-moz-focus-inner {
    border: 0;
  }

  .cc-link.skeleton {
    background-color: var(--cc-color-text-primary-weak, hsl(209deg 98% 73%));
    color: transparent;
  }
`;

/**
 * A component that displays a link with optional skeleton for loading and automatic handling of external links
 *
 * ## Details
 *
 * * The link has a display of `flex` to ease vertical alignment and spacing.
 * * External URLs are automatically handled by adding `target="_blank"` and `rel="noopener noreferrer"` on the link for security purposes.
 *
 * @cssdisplay inline
 *
 * @slot - The content of the link (text or HTML).
 */
export class CcLink extends LitElement {
  static get properties() {
    return {
      a11yDesc: { type: String, attribute: 'a11y-desc' },
      href: { type: String },
      skeleton: { type: Boolean },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Optional accessibility description (`aria-label` attribute). */
    this.a11yDesc = null;

    /** @type {string} The URL for the link. */
    this.href = '';

    /** @type {boolean} Enables skeleton styles for loading state. */
    this.skeleton = false;
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

  render() {
    const href = this.href != null && !this.skeleton ? this.href : null;
    const isDifferentOrigin = this._isDifferentOrigin(href);
    const target = isDifferentOrigin ? '_blank' : null;
    const rel = isDifferentOrigin ? 'noopener noreferrer' : null;

    // Make sure there are no spaces before the <a> and after the </a>
    return html`<a
      class="cc-link ${classMap({ skeleton: this.skeleton })}"
      href=${ifDefined(href)}
      target=${ifDefined(target)}
      rel=${ifDefined(rel)}
      title="${ifDefined(this.a11yDesc)}"
      ><slot></slot
    ></a>`;
  }

  static get styles() {
    return [
      skeletonStyles,
      linkStyles,
      css`
        :host {
          display: inline;
        }
      `,
    ];
  }
}

window.customElements.define('cc-link', CcLink);
