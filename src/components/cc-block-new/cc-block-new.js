import '../cc-button/cc-button.js';
import '../cc-expand/cc-expand.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixArrowDownSFill as iconDown,
  iconRemixArrowUpSFill as iconUp,
} from '../../assets/cc-remix.icons.js';
import { hasSlottedChildren } from '../../directives/hasSlottedChildren.js';
import { i18n } from '../../lib/i18n.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

/**
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('../common.types.js').ToggleStateType} ToggleStateType
 * @typedef {import('../common.types.js').Footer} Footer
 */

/**
 * TODO
 */
export class CcBlockNew extends LitElement {

  static get properties () {
    return {
      icon: { type: Object },
      image: { type: String, reflect: true },
      ribbon: { type: String, reflect: true },
      state: { type: String, reflect: true },
      _overlay: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    /** @type {IconModel|null} Sets the icon before the title using a `<cc-icon>`. Icon is hidden if nullish. */
    this.icon = null;

    /** @type {string|null} Sets the icon before the title using a `<cc-img>`. Icon is hidden if nullish. Property will be ignored if `icon` property is already set. */
    this.image = null;

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
    const hasImageOrIcon = this.image != null || this.icon != null;
    /* TODO when reworking the component, check this a11y issue https://github.com/CleverCloud/clever-components/issues/225#issuecomment-1239462826 */
    /* eslint-disable lit-a11y/click-events-have-key-events */
    return html`
      <div class="container">
        <slot name="header" ${hasSlottedChildren()}>
          <div class="header">
            <div class="icon ${classMap({ 'has-image-or-icon': hasImageOrIcon })}">
              ${this.image == null && this.icon == null ? html`
                <slot name="icon" ${hasSlottedChildren()}></slot>
              ` : ''}
              ${this.image != null && this.icon == null ? html`
                <cc-img src="${this.image}"></cc-img>
              ` : ''}
              ${this.icon != null && this.image == null ? html`
                <cc-icon size="lg" .icon="${this.icon}"></cc-icon>
              ` : ''}
            </div>
            <div class="title">
              <slot name="title" ${hasSlottedChildren()}></slot>
            </div>
            <div class="ribbon">
              <slot name="ribbon" ${hasSlottedChildren()}>
                ${this.ribbon != null && this.ribbon !== '' ? html`
                  <div class="info-ribbon">${this.ribbon}</div>
                ` : ''}
              </slot>
            </div>
            <div class="button">
              <slot name="button">
                ${isToggleEnabled ? html`
                  <cc-button
                    class="toggle_button"
                    .icon=${isOpen ? iconUp : iconDown}
                    hide-text
                    outlined
                    primary
                    @cc-button:click=${this._clickToggle}
                  >${isOpen ? i18n('cc-block.toggle.close') : i18n('cc-block.toggle.open')}
                  </cc-button>
                ` : ''}
              </slot>
            </div>
            <div class="other-element">
              <slot name="other-element"></slot>
            </div>

          </div>
        </slot>

        <slot name="content">
          <div class="content">
            ${!isToggleEnabled || isOpen ? html`
              <slot name="main" class="main">
                <slot name="content-header"></slot>
                <cc-expand class="main-wrapper ${classMap({ 'main-wrapper--overlay': this._overlay })}">
                  <slot name="content-body"></slot>
                </cc-expand>
                <slot name="content-footer"></slot>
              </slot>
            ` : ''}
          </div>
        </slot>

        <slot name="footer" ${hasSlottedChildren()}>
          <div class="footer">
            <div class="footer-left">
              <slot name="footer-left" ${hasSlottedChildren()}></slot>
            </div>
            <div class="footer-right">
              <slot name="footer-right" ${hasSlottedChildren()}></slot>
            </div>
          </div>
        </slot>
      </div>
    `;
  }

  /* firstUpdated () {
    const $overlay = this.shadowRoot.querySelector('slot[name="overlay"]');
    $overlay.addEventListener('slotchange', (e) => {
      const oldVal = this._overlay;
      this._overlay = ($overlay.assignedNodes().length > 0);
      this.requestUpdate('_overlay', oldVal);
    });
  }*/

  static get styles () {
    return [
      // language=CSS
      linkStyles,
      css`
        :host {
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: block;
          margin-bottom: 1em;
        }

        .container {
          display: grid;
          gap: 1em;
          --left-space: 1em;
          padding: 1em;
          padding-left: var(--left-space);
        }

        .container:has(slot[name=ribbon][is-slotted]) {
          --left-space: 3.5em;
        }

        /* region header */

        .header {
          display: none;
          align-items: center;
          color: var(--cc-color-text-primary-strongest);
        }

        slot[name=header][is-slotted] .header,
        .header:has(slot[is-slotted]) {
          display: flex;
          gap: 1em;
        }

        /* Fixer CSS taille img */
        .header cc-img {
          width: 1.5em;
          height: 1.5em;
          align-self: flex-start;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .header .title {
          flex: 1 1 0;
        }

        .header .icon:not(:has([is-slotted])):not(.has-image-or-icon) {
          display: none;
        }

        .header .ribbon:not(:has([is-slotted])) {
          display: none;
        }


        .header .ribbon {
          --height: 1.5em;
          --width: 8em;
          --r: -45deg;
          --translate: 1.6em;

          position: absolute;
          z-index: 2;
          top: calc(var(--height) / -2);
          left: calc(var(--width) / -2);
          width: var(--width);
          height: var(--height);
          background: var(--cc-color-bg-strong);
          color: white;
          font-size: 0.9em;
          font-weight: bold;
          line-height: var(--height);
          text-align: center;
          transform: rotate(var(--r)) translateY(var(--translate));
        }

        ::slotted([slot='title']) {
          color: var(--cc-color-text-primary-strongest);
          font-size: 1.2em;
          font-weight: bold;
        }

        .main {
        }

        :host([no-head]) .main {
          padding: 1em;
        }

        .main-wrapper--overlay {
          filter: blur(0.3em);
          opacity: 0.35;
        }

        /* endregion */

        /* region footer */

        .footer {
          display: none;
          padding: 0.5em 1em;
          background-color: var(--cc-color-bg-neutral);
          box-shadow: inset 0 6px 6px -6px rgb(0 0 0 / 40%);
          gap: 1em;
          flex-wrap: wrap;
          /* TODO doc */
          justify-content: flex-end;
          /* TODO doc */
          margin: 0 -1em -1em -1em;
          /* TODO doc */
          margin-left: calc(var(--left-space) * -1);
        }

        /* TMP at least one of these slots is used: footer, footer-left, footer-right */
        .footer:has(slot[is-slotted]) {
          display: flex;
        }
        
        .footer-left,
        .footer-right {
          display: none;
        }

        .footer-left:has(slot[is-slotted]),
        .footer-right:has(slot[is-slotted]) {
          display: block;
        }

        .footer-left {
          flex: 1 1 0;
        }

        /* endregion */

        /*     
                :host([ribbon]) .head {
                  padding-left: 3.5em;
                }
        
                :host([state='open']) .head:hover,
                :host([state='close']) .head:hover {
                  background-color: var(--cc-color-bg-neutral-hovered);
                  cursor: pointer;
                }
        
                .toggle_button {
                  --cc-icon-size: 1.5em;
                }
        
                ::slotted([slot='title']) {
                  flex: 1 1 0;
                  font-size: 1.2em;
                  font-weight: bold;
                }
       
                .main {
                  display: grid;
                  padding: 0.5em 1em 1em;
                  grid-gap: 1em;
                }
        
                :host([no-head]) .main {
                  padding: 1em;
                }
        
                .main-wrapper--overlay {
                  filter: blur(0.3em);
                  opacity: 0.35;
                }
        
                !* superpose main and overlay *!
        
                .main-wrapper,
                ::slotted([slot='overlay']) {
                  grid-area: 2 / 1 / auto / auto;
                }
                
                :host([ribbon]) .main-wrapper {
                  padding-left: 2.5em;
                }
        
                ::slotted([slot='overlay']) {
                  !* we have a few z-index:2 on atoms *!
                  z-index: 10;
                  display: grid;
                  align-content: center;
                  justify-items: center;
                }
        
                ::slotted(.cc-block_empty-msg) {
                  color: var(--cc-color-text-weak);
                  font-style: italic;
                }
                
                }*/
      `,
    ];
  }
}

window.customElements.define('cc-block-new', CcBlockNew);
