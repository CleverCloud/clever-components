import '../atoms/cc-button.js';
import '../atoms/cc-expand.js';
import '../atoms/cc-img.js';
import downSvg from './down.svg';
import upSvg from './up.svg';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';

/**
 * A display component with mostly HTML+CSS and a open/close toggle feature.
 *
 * ## Details
 *
 * * The main section is wrapped in a `<cc-expand>` so variation of this section height will be animated.
 *
 * @prop {String} icon - Sets the URL of the image before the title. Icon is hidden if nullish.
 * @prop {"off"|"open"|"close"} state - Sets the state of the toggle behaviour.
 *
 * @slot title - The title of the block. Try to only use text. Use the `icon` property/attribute.
 * @slot main - The main content of the block. The direct children of this will be spaced in a 1 column CSS grid.
 */
export class CcBlock extends LitElement {

  static get properties () {
    return {
      icon: { type: String },
      state: { type: String, reflect: true },
    };
  }

  constructor () {
    super();
    this.state = 'off';
  }

  _clickToggle () {
    if (this.state === 'close') {
      this.state = 'open';
    }
    else if (this.state === 'open') {
      this.state = 'close';
    }
  }

  _getToggleTitle () {
    return (this.state === 'close')
      ? i18n('cc-block.toggle.close')
      : i18n('cc-block.toggle.open');
  }

  render () {

    const isToggleEnabled = (this.state === 'open' || this.state === 'close');
    const isOpen = (this.state !== 'close');

    return html`
      
      <div class="head" @click=${this._clickToggle}>
        ${this.icon != null ? html`
          <cc-img src="${this.icon}"></cc-img>
        ` : ''}
        <slot name="title"></slot>
        ${isToggleEnabled ? html`
          <cc-button @cc-button:click=${this._clickToggle}
            image=${isOpen ? upSvg : downSvg}
            title="${this._getToggleTitle()}"
          ></cc-button>
        ` : ''}
      </div>
      
      <cc-expand>
        ${!isToggleEnabled || isOpen ? html`
          <slot name="main"></slot>
        ` : ''}
      </cc-expand>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          background-color: #fff;
          border-radius: 0.25rem;
          border: 1px solid #bcc2d1;
          box-sizing: border-box;
          display: block;
          overflow: hidden;
        }

        .head {
          align-items: center;
          display: flex;
          padding: 1rem;
        }

        :host([state="open"]) .head:hover,
        :host([state="close"]) .head:hover {
          background-color: #fafafa;
          cursor: pointer;
        }

        cc-img {
          border-radius: 0.25rem;
          margin-right: 1rem;
          height: 1.5rem;
          width: 1.5rem;
        }

        ::slotted([slot="title"]) {
          color: #3A3871;
          flex: 1 1 0;
          font-size: 1.2rem;
          font-weight: bold;
        }

        ::slotted([slot="main"]) {
          display: grid;
          grid-gap: 1rem;
          padding: 0.5rem 1rem 1rem;
        }
      `,
    ];
  }
}

window.customElements.define('cc-block', CcBlock);

export const blockStyles = css`

  .cc-block_subtitle {
    font-weight: bold;
  }

  .cc-block_subtitle:not(:first-child) {
    margin-top: 1rem;
  }

  .cc-block_empty-msg {
    color: #555;
    font-style: italic;
  }
`;
