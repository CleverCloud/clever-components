import '../atoms/cc-button.js';
import '../atoms/cc-expand.js';
import '../atoms/cc-img.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';

const downSvg = new URL('../assets/down.svg', import.meta.url).href;
const upSvg = new URL('../assets/up.svg', import.meta.url).href;

/**
 * @typedef {import('../types.js').ToggleStateType} ToggleStateType
 */

/**
 * A display component with mostly HTML+CSS and a open/close toggle feature.
 *
 * ## Details
 *
 * * The main section is wrapped in a `<cc-expand>` so variation of this section height will be animated.
 *
 * @cssdisplay grid
 *
 * @slot - The main content of the block. The direct children of this will be spaced in a 1 column CSS grid.
 * @slot button - A zone dedicated for a button/toggle in the to right corner.
 * @slot overlay - The content to display on top of the main content.
 * @slot title - The title of the block. Try to only use text. Use the `icon` property/attribute.
 */
export class CcBlock extends LitElement {

  static get properties () {
    return {
      icon: { type: String },
      noHead: { type: Boolean, attribute: 'no-head', reflect: true },
      ribbon: { type: String, reflect: true },
      state: { type: String, reflect: true },
      _overlay: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {string|null} Sets the URL of the image before the title. Icon is hidden if nullish. */
    this.icon = null;

    /** @type {boolean} Hides the head section. */
    this.noHead = false;

    /** @type {string|null} Adds a ribbon on the top left corner if it is not empty. */
    this.ribbon = null;

    /** @type {ToggleStateType} Sets the state of the toggle behaviour. */
    this.state = 'off';

    /** @type {boolean} */
    this._overlay = false;
  }

  _clickToggle () {
    if (this.state === 'close') {
      this.state = 'open';
    }
    else if (this.state === 'open') {
      this.state = 'close';
    }
  }

  render () {

    const isToggleEnabled = (this.state === 'open' || this.state === 'close');
    const isOpen = (this.state !== 'close');

    return html`

      ${this.ribbon != null && this.ribbon !== '' ? html`
        <div class="info-ribbon">${this.ribbon}</div>
      ` : ''}

      ${!this.noHead ? html`
        <div class="head" @click=${this._clickToggle}>
          ${this.icon != null ? html`
            <cc-img src="${this.icon}"></cc-img>
          ` : ''}
          <slot name="title"></slot>
          ${isToggleEnabled ? html`
            <cc-button
              image=${isOpen ? upSvg : downSvg}
              hide-text
              outlined
              primary
              @cc-button:click=${this._clickToggle}
            >${(this.state === 'close') ? i18n('cc-block.toggle.close') : i18n('cc-block.toggle.open')}
            </cc-button>
          ` : ''}
          <slot name="button"></slot>
        </div>
      ` : ''}

      <cc-expand class="main-wrapper ${classMap({ 'main-wrapper--overlay': this._overlay })}">
        ${!isToggleEnabled || isOpen ? html`
          <div class="main">
            <slot></slot>
          </div>
        ` : ''}
      </cc-expand>

      <slot name="overlay"></slot>
    `;
  }

  firstUpdated () {
    const $overlay = this.shadowRoot.querySelector('slot[name="overlay"]');
    $overlay.addEventListener('slotchange', (e) => {
      const oldVal = this._overlay;
      this._overlay = ($overlay.assignedNodes().length > 0);
      this.requestUpdate('_overlay', oldVal);
    });
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          box-sizing: border-box;
          display: grid;
          overflow: hidden;
          position: relative;
        }

        .head {
          align-items: center;
          display: flex;
          padding: 1rem;
        }

        :host([ribbon]) .head {
          padding-left: 3.5rem;
        }

        :host([state="open"]) .head:hover,
        :host([state="close"]) .head:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
          cursor: pointer;
        }

        cc-img {
          align-self: flex-start;
          border-radius: 0.25rem;
          height: 1.5rem;
          margin-right: 1rem;
          width: 1.5rem;
        }

        ::slotted([slot="title"]) {
          color: var(--cc-color-text-strong);
          flex: 1 1 0;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .info-ribbon {
          --height: 1.5rem;
          --width: 8rem;
          --r: -45deg;
          --translate: 1.6rem;
          background: var(--cc-color-bg-strong);
          color: white;
          font-size: 0.9rem;
          font-weight: bold;
          height: var(--height);
          left: calc(var(--width) / -2);
          line-height: var(--height);
          position: absolute;
          text-align: center;
          top: calc(var(--height) / -2);
          transform: rotate(var(--r)) translateY(var(--translate));
          width: var(--width);
          z-index: 2;
        }

        .main {
          display: grid;
          grid-gap: 1rem;
          padding: 0.5rem 1rem 1rem;
        }

        :host([no-head]) .main {
          padding: 1rem;
        }

        .main-wrapper--overlay {
          filter: blur(0.3rem);
          opacity: 0.35;
        }

        /* superpose main and overlay */
        .main-wrapper,
        ::slotted([slot="overlay"]) {
          grid-area: 2 / 1 / auto / auto;
        }

        :host([ribbon]) .main-wrapper {
          padding-left: 2.5rem;
        }

        ::slotted([slot="overlay"]) {
          align-content: center;
          display: grid;
          justify-items: center;
          /* we have a few z-index:2 on atoms */
          z-index: 10;
        }

        ::slotted(.cc-block_empty-msg) {
          color: var(--cc-color-text-light);
          font-style: italic;
        }
      `,
    ];
  }
}

window.customElements.define('cc-block', CcBlock);
