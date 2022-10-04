import '../cc-button/cc-button.js';
import '../cc-expand/cc-expand.js';
import '../cc-img/cc-img.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { i18n } from '../../lib/i18n.js';

const downSvg = new URL('../../assets/down.svg', import.meta.url).href;
const upSvg = new URL('../../assets/up.svg', import.meta.url).href;

/**
 * @typedef {import('../common.types.js').ToggleStateType} ToggleStateType
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
      _overlay: { type: Boolean, state: true },
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

    /* TODO when reworking the component, check this a11y issue https://github.com/CleverCloud/clever-components/issues/225#issuecomment-1239462826 */
    /* eslint-disable lit-a11y/click-events-have-key-events */
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
          border-radius: 0.25em;
          box-sizing: border-box;
          display: grid;
          overflow: hidden;
          position: relative;
        }

        .head {
          align-items: center;
          display: flex;
          padding: 1em;
        }

        :host([ribbon]) .head {
          padding-left: 3.5em;
        }

        :host([state="open"]) .head:hover,
        :host([state="close"]) .head:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
          cursor: pointer;
        }

        cc-img {
          align-self: flex-start;
          border-radius: 0.25em;
          height: 1.5em;
          margin-right: 1em;
          width: 1.5em;
        }

        ::slotted([slot="title"]) {
          color: var(--cc-color-text-strong);
          flex: 1 1 0;
          font-size: 1.2em;
          font-weight: bold;
        }

        .info-ribbon {
          --height: 1.5em;
          --width: 8em;
          --r: -45deg;
          --translate: 1.6em;
          background: var(--cc-color-bg-strong);
          color: white;
          font-size: 0.9em;
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
          grid-gap: 1em;
          padding: 0.5em 1em 1em;
        }

        :host([no-head]) .main {
          padding: 1em;
        }

        .main-wrapper--overlay {
          filter: blur(0.3em);
          opacity: 0.35;
        }

        /* superpose main and overlay */
        .main-wrapper,
        ::slotted([slot="overlay"]) {
          grid-area: 2 / 1 / auto / auto;
        }

        :host([ribbon]) .main-wrapper {
          padding-left: 2.5em;
        }

        ::slotted([slot="overlay"]) {
          align-content: center;
          display: grid;
          justify-items: center;
          /* we have a few z-index:2 on atoms */
          z-index: 10;
        }

        ::slotted(.cc-block_empty-msg) {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }
      `,
    ];
  }
}

window.customElements.define('cc-block', CcBlock);
