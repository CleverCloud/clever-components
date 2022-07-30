import { css, html, LitElement } from 'lit-element';

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
          animation: progress-circular-rotate 1.75s linear infinite;
          height: 100%;
          margin: auto;
          max-height: 2.5em;
          max-width: 2.5em;
          width: 100%;
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
