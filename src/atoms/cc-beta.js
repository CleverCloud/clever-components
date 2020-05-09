import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';

/**
 * A layout component to position a simple beta ribbon around any content.
 *
 * 🎨 default CSS display: `grid`
 *
 * @prop {Boolean} fill - Forces the slotted element to fill the beta container size (same heigh and width). By default, the beta container adapts to the slotted element size.
 * @prop {"top-left"|"bottom-left"|"top-right"|"bottom-right"} position - Where to position the beta label.
 *
 * @slot - The content around which the beta label will be positionned. You ONLY one element.
 */
export class CcBeta extends LitElement {

  static get properties () {
    return {
      fill: { type: Boolean, reflect: true },
      position: { type: String, reflect: true },
    };
  }

  constructor () {
    super();
    this.fill = false;
    this.position = 'top-left';
  }

  render () {
    return html`
      <slot></slot>
      <div class="beta">${i18n('cc-beta.label')}</div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: grid;
          overflow: hidden;
          position: relative;
        }

        :host([fill]) ::slotted(*) {
          box-sizing: border-box;
          height: 100%;
          width: 100%;
        }

        .beta {
          --height: 1.5rem;
          --width: 8rem;
          background: #3A3871;
          color: white;
          font-size: 0.9rem;
          font-weight: bold;
          height: var(--height);
          line-height: var(--height);
          position: absolute;
          text-align: center;
          transform: rotate(var(--r)) translateY(var(--translate));
          width: var(--width);
          z-index: 2;
        }

        :host([position^="top-"]) .beta {
          --translate: 1.6rem;
          top: calc(var(--height) / -2);
        }

        :host([position^="bottom-"]) .beta {
          --translate: -1.6rem;
          bottom: calc(var(--height) / -2);
        }

        :host([position$="-left"]) .beta {
          left: calc(var(--width) / -2);
        }

        :host([position$="-right"]) .beta {
          right: calc(var(--width) / -2);
        }

        :host([position="top-left"]) .beta,
        :host([position="bottom-right"]) .beta {
          --r: -45deg;
        }

        :host([position="bottom-left"]) .beta,
        :host([position="top-right"]) .beta {
          --r: 45deg;
        }
      `,
    ];
  }
}

window.customElements.define('cc-beta', CcBeta);
