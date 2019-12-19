import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';

/**
 * A layout component to position a simple beta ribbon around any content.
 *
 * @prop {"top-left"|"bottom-left"|"top-right"|"bottom-right"} position - Where to position the beta label.
 *
 * @slot - The content around which the beta label will be positionned.
 */
export class CcBeta extends LitElement {

  static get properties () {
    return {
      position: { type: String, reflect: true },
    };
  }

  constructor () {
    super();
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
          display: block;
          overflow: hidden;
          position: relative;
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
          z-index: 1;
        }

        :host([position^="top-"]) .beta {
          top: calc(var(--height) / -2);
          --translate: 1.6rem;
        }

        :host([position^="bottom-"]) .beta {
          bottom: calc(var(--height) / -2);
          --translate: -1.6rem;
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
