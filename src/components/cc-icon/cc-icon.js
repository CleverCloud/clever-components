import { css, html, LitElement } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { skeletonStyles } from '../../styles/skeleton.js';

/**
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('./cc-icon.types.js').IconSize} IconSize
 * @typedef {import('lit').PropertyValues<CcIcon>} CcIconPropertyValues
 */

/**
 * A component rendering an SVG icon.
 *
 * **Accessibility guidelines:**
 *
 * Use the `a11y-name` prop only if your icon provides information that is not already given in its surrounding text.
 *
 * If this prop has a value:
 *
 *  * sets a `role="img"` and `aria-label="the value of this prop"` attributes on the `<svg>` element.
 *  * creates a `<title>` element inside the `<svg>`.
 *
 * This allows assistive technologies to recognize the element as an image and convey its information.
 *
 * If this prop has no value, sets an `aria-hidden="true"` attribute on the `<svg>` element so that it can be ignored by assistive technologies.
 *
 * @cssdisplay inline-flex
 *
 * @cssprop {Color} --cc-icon-color - Sets the value of the color CSS property (defaults: `currentColor`).
 * @cssprop {Size} --cc-icon-size - Sets the value of the width and height CSS properties (defaults: `1em`).
 */
export class CcIcon extends LitElement {
  static get properties() {
    return {
      a11yName: { type: String, attribute: 'a11y-name' },
      icon: { type: Object },
      size: { type: String, reflect: true },
      skeleton: { type: Boolean },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Only use this prop if your icon provides information that is not already given in its surrounding text.
     *
     * If this prop has a value:
     *
     *  * sets a `role="img"` and `aria-label="the value of this prop"` attributes on the `<svg>` element.
     *  * creates a `<title>` element inside the `<svg>`.
     *
     * This allows assistive technologies to recognize the element as an image and convey its information.
     *
     * If this prop has no value, sets an `aria-hidden="true"` attribute on the `<svg>` element so that it can be ignored by assistive technologies.
     */
    this.a11yName = null;

    /** @type {IconModel|null} Icon to be rendered */
    this.icon = null;

    /** @type {IconSize} Size of the icon, setting the width and height */
    this.size = 'md';

    /** @type {boolean} Whether the icon should be displayed as skeleton. */
    this.skeleton = false;
  }

  /** @param {CcIconPropertyValues} changedProperties */
  updated(changedProperties) {
    const shouldPatchSvg = changedProperties.has('a11yName') || changedProperties.has('icon');
    const svg = this.shadowRoot.querySelector('svg');
    if (shouldPatchSvg && svg != null) {
      if (this.a11yName == null || this.a11yName === '') {
        svg.setAttribute('aria-hidden', 'true');
        svg.removeAttribute('aria-label');
        svg.removeAttribute('role');
        svg.querySelector('title')?.remove();
      } else {
        svg.removeAttribute('aria-hidden');
        svg.setAttribute('aria-label', this.a11yName);
        svg.setAttribute('role', 'img');
        let title = svg.querySelector('title');
        if (title == null) {
          title = document.createElement('title');
          svg.prepend(title);
        }
        title.textContent = this.a11yName;
      }
    }
  }

  render() {
    if (this.skeleton) {
      return html`<div class="skeleton"></div>`;
    }

    const theSvg = this.icon != null ? unsafeSVG(this.icon.content) : '';

    return html`${theSvg}`;
  }

  static get styles() {
    return [
      skeletonStyles,
      css`
        :host {
          --skeleton-color: #bbb;

          display: inline-flex;
          height: var(--size, 1em);
          vertical-align: top;
          width: var(--size, 1em);
        }

        :host([size='xs']) {
          --size: var(--cc-icon-size, 0.5em);
        }

        :host([size='sm']) {
          --size: var(--cc-icon-size, 0.75em);
        }

        :host([size='md']) {
          --size: var(--cc-icon-size, 1em);
        }

        :host([size='lg']) {
          --size: var(--cc-icon-size, 1.5em);
        }

        :host([size='xl']) {
          --size: var(--cc-icon-size, 2.25em);
        }

        svg {
          fill: var(--cc-icon-color, currentColor);
          height: 100%;
          width: 100%;
        }

        .skeleton {
          background-color: var(--skeleton-color);
          height: var(--size, 1em);
          width: var(--size, 1em);
        }
      `,
    ];
  }
}

customElements.define('cc-icon', CcIcon);
