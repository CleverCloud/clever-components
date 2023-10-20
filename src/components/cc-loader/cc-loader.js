import { css, html, LitElement } from 'lit';

/**
 * A loading indicator, auto centered and with flexible size.
 *
 * ## Details
 *
 * * Size this component like you want, the loading circle will be centered automatically.
 *
 * @cssdisplay flex
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcLoader extends LitElement {

  static get properties () {
    return {
      accessibleName: { type: String, attribute: 'accessible-name' },
    };
  }

  constructor () {
    super();

    /** @type {string|null} Only use this prop if your loader provides information that is not already given in its surrounding text.
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
    this.accessibleName = null;
  }

  updated (changedProperties) {
    if (changedProperties.has('accessibleName')) {
      const svg = this.shadowRoot.querySelector('svg');

      if (this.accessibleName == null || this.accessibleName === '') {
        svg.setAttribute('aria-hidden', 'true');
        svg.removeAttribute('aria-label');
        svg.removeAttribute('role');
        svg.querySelector('title')?.remove();
      }
      else {
        svg.removeAttribute('aria-hidden');
        svg.setAttribute('aria-label', this.accessibleName);
        svg.setAttribute('role', 'img');
        let title = svg.querySelector('title');
        if (title == null) {
          title = document.createElement('title');
          svg.prepend(title);
        }
        title.textContent = this.accessibleName;
      }
    }
  }

  render () {
    // language=HTML
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 40 40">
        <circle cx="40px" cy="40px" r="16px"></circle>
      </svg>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
        }

        svg {
          width: 100%;
          max-width: 2.5em;
          height: 100%;
          max-height: 2.5em;
          margin: auto;
          animation: progress-circular-rotate 1.75s linear infinite;
        }

        circle {
          animation: progress-circular-dash 1.75s ease-in-out infinite;
          fill: transparent;
          stroke: var(--cc-loader-color, var(--cc-color-bg-primary-highlight, blue));
          stroke-linecap: round;
          stroke-width: 5px;
        }

        @keyframes progress-circular-rotate {

          0% {
            transform: rotate(0turn);
          }

          100% {
            transform: rotate(1turn);
          }
        }

        /* radius is set at 16px => perimeter: 100.53096491487 ~= 100 */
        @keyframes progress-circular-dash {

          0% {
            stroke-dasharray: 0, 100px;
            stroke-dashoffset: 0;
          }

          50% {
            stroke-dasharray: 80px, 100px;
            stroke-dashoffset: 0;
          }

          100% {
            stroke-dasharray: 80px, 100px;
            stroke-dashoffset: -100px;
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-loader', CcLoader);
