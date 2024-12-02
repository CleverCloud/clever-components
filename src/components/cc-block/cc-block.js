import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixArrowRightSLine as iconArrowRight } from '../../assets/cc-remix.icons.js';
import { hasSlottedChildren } from '../../directives/has-slotted-children.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { isStringEmpty } from '../../lib/utils.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-button/cc-button.js';
import '../cc-expand/cc-expand.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';

/**
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('./cc-block.types.js').BlockToggleState} BlockToggleState
 */

/**
 * A display component with mostly HTML+CSS and an open/close toggle feature organized with slots.
 *
 * ## Details
 *
 * * The content-body section is wrapped in a `<cc-expand>` so variation of this section height will be animated.
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<'open'|'close'>} cc-block:toggle-change - Fires toggle state whenever it changes.
 *
 * @slot ribbon - The ribbon in the top left corner.
 * @slot header - A zone dedicated to header content.
 * @slot header-icon - The icon in the header.
 * @slot header-title - The title of the header. Try to only use text. Use the `icon` property/attribute.
 * @slot header-right - A zone dedicated to header content on the top right side.
 * @slot content - A zone dedicated to main content.
 * @slot content-header - A zone dedicated to content header content.
 * @slot content-body - A zone dedicated to content body content.
 * @slot content-footer - A zone dedicated to content footer content.
 * @slot footer - A zone dedicated to footer content.
 * @slot footer-left - A zone dedicated to footer left side content.
 * @slot footer-right - A zone dedicated to footer right side content.
 */
export class CcBlock extends LitElement {
  static get properties() {
    return {
      icon: { type: Object },
      image: { type: String },
      ribbon: { type: String, reflect: true },
      toggle: { type: String, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {IconModel|null} Sets the icon before the title using a `<cc-icon>`. Icon is hidden if nullish. */
    this.icon = null;

    /** @type {string|null} Sets the icon before the title using a `<cc-img>`. Icon is hidden if nullish. Property will be ignored if `icon` property is already set. */
    this.image = null;

    /** @type {string|null} Adds a ribbon in the top left corner if it is not empty. */
    this.ribbon = null;

    /** @type {BlockToggleState} Sets the state of the toggle behaviour. */
    this.toggle = 'off';
  }

  _onClickToggle() {
    if (this.toggle === 'close') {
      this.toggle = 'open';
    } else if (this.toggle === 'open') {
      this.toggle = 'close';
    }
    dispatchCustomEvent(this, 'toggle-change', this.toggle);
  }

  render() {
    const isToggleEnabled = this.toggle === 'open' || this.toggle === 'close';
    const isToggleOpen = this.toggle === 'open';
    const areContentAndFooterHidden = isToggleEnabled && !isToggleOpen;

    return html`
      <div class="container" ${hasSlottedChildren()}>
        <div class="ribbon">
          <slot name="ribbon">
            ${!isStringEmpty(this.ribbon) ? html` <div class="info-ribbon">${this.ribbon}</div> ` : ''}
          </slot>
        </div>

        ${isToggleEnabled
          ? html`
              <button
                class="toggle-button"
                aria-expanded=${isToggleOpen}
                aria-controls="content-and-footer"
                @click=${this._onClickToggle}
              >
                ${this._renderHeader()}
                <cc-icon class="toggle-icon" .icon=${iconArrowRight} size="xl"></cc-icon>
              </button>
            `
          : this._renderHeader()}
        <div id="content-and-footer" class="${classMap({ hidden: areContentAndFooterHidden })}">
          <slot name="content">
            <div class="content">
              <div class="content-header">
                <slot name="content-header"></slot>
              </div>
              <cc-expand class="content-body">
                <slot name="content-body"></slot>
              </cc-expand>
              <div class="content-footer">
                <slot name="content-footer"></slot>
              </div>
            </div>
          </slot>

          <slot name="footer">
            <div class="footer">
              <div class="footer-left">
                <slot name="footer-left"></slot>
              </div>
              <div class="footer-right">
                <slot name="footer-right"></slot>
              </div>
            </div>
          </slot>
        </div>
      </div>
    `;
  }

  _renderHeader() {
    const hasImageOrIcon = this.image != null || this.icon != null;
    return html`
      <slot name="header">
        <div class="header">
          <div class="header-icon ${classMap({ 'has-image-or-icon': hasImageOrIcon })}">
            ${this.image == null && this.icon == null ? html` <slot name="header-icon"></slot> ` : ''}
            ${this.image != null && this.icon == null
              ? html` <cc-img class="header-img" src="${this.image}"></cc-img> `
              : ''}
            ${this.icon != null ? html` <cc-icon size="lg" .icon="${this.icon}"></cc-icon> ` : ''}
          </div>
          <div class="header-title">
            <slot name="header-title"></slot>
          </div>
          <div class="header-right">
            <slot name="header-right"></slot>
          </div>
        </div>
      </slot>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      linkStyles,
      css`
        :host {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-sizing: border-box;
          display: block;
          overflow: hidden;
          position: relative;
        }

        .container {
          display: grid;
          gap: 0.5em;
          padding-block: 1em;

          --left-space: 1em;
        }

        .container[ribbon-is-slotted],
        :host([ribbon]:not([ribbon=''])) .container {
          --left-space: 3.5em;
        }

        .ribbon {
          display: none;
        }

        .container[ribbon-is-slotted] .ribbon,
        :host([ribbon]:not([ribbon=''])) .ribbon {
          background: var(--cc-color-bg-strong);
          color: white;
          display: inherit;
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

          --height: 1.5em;
          --width: 8em;
          --r: -45deg;
          --translate: 1.6em;
        }

        /* region header */

        .header {
          align-items: center;
          color: var(--cc-color-text-primary-strongest);
          display: none;
          padding: 1em 1em 1em var(--left-space);
        }

        .container[header-is-slotted] .header,
        .container[header-title-is-slotted] .header,
        .container[header-right-is-slotted] .header,
        .container[header-icon-is-slotted] .header {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .container[header-is-slotted],
        .container[header-title-is-slotted],
        .container[header-right-is-slotted] {
          padding-top: 0;
        }

        ::slotted([slot='header']) {
          padding: 1em 1em 1em var(--left-space);
        }

        .header-icon {
          display: none;
        }

        .container[header-icon-is-slotted] .header-icon,
        .has-image-or-icon.header-icon {
          display: flex;
        }

        .header-img,
        ::slotted([slot='header-icon']) {
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 1.5em;
          width: 1.5em;
        }

        .header-title {
          flex: 1 1 0;
        }

        ::slotted([slot='header-title']) {
          color: var(--cc-color-text-primary-strongest);
          font-size: 1.2em;
          font-weight: bold;
        }

        .container[header-right-is-slotted] .header-right {
          display: inline-block;
        }

        .toggle-button {
          --cc-icon-color: var(--cc-color-text-primary-strongest);

          align-items: center;
          background-color: transparent;
          border: 0;
          display: flex;
          font-family: inherit;
          font-size: 1em;
          justify-content: space-between;
          padding: 0 1em 0 0;
          text-align: start;
        }

        .toggle-icon {
          transition: transform 0.3s ease-out;
        }

        .toggle-button[aria-expanded='true'] .toggle-icon {
          transform: rotate(0.25turn);
        }

        .toggle-button:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        /* endregion */

        /* region content */

        .content {
          display: none;
          gap: 1em;
        }

        ::slotted([slot='content']) {
          padding-left: var(--left-space);
          padding-right: 1em;
        }

        .container[content-is-slotted] .content,
        .container[content-header-is-slotted] .content,
        .container[content-body-is-slotted] .content,
        .container[content-footer-is-slotted] .content {
          display: grid;
          gap: 1em;
        }

        .content-header,
        .content-body,
        .content-footer {
          display: none;
          padding: 0 1em 0 var(--left-space);
        }

        .container[content-header-is-slotted] .content-header,
        .container[content-body-is-slotted] .content-body,
        .container[content-footer-is-slotted] .content-footer {
          display: block;
        }

        .content-body {
          margin-block: -0.5em;
          padding-block: 0.5em;
        }

        slot[name='content-body'] {
          display: grid;
          gap: 1em;
        }

        #content-and-footer {
          display: grid;
          gap: 1em;
        }

        #content-and-footer.hidden {
          display: none;
        }

        /* endregion */

        /* region footer */

        .footer {
          align-items: center;
          background-color: var(--cc-color-bg-neutral);
          box-shadow: inset 0 6px 6px -6px rgb(0 0 0 / 40%);
          display: none;
          flex-wrap: wrap;
          gap: 1em;
          /* TODO doc */
          justify-content: flex-end;
          padding: 0.5em 1em;
        }

        .footer-left {
          flex: 1 1 0;
        }

        .footer-left,
        .footer-right {
          display: none;
        }

        .container[footer-is-slotted],
        .container[footer-left-is-slotted],
        .container[footer-right-is-slotted],
        :host([toggle='close']) .container {
          padding-bottom: 0;
        }

        .container[footer-is-slotted] .footer,
        .container[footer-left-is-slotted] .footer,
        .container[footer-right-is-slotted] .footer {
          display: flex;
        }

        .container[footer-left-is-slotted] .footer-left,
        .container[footer-right-is-slotted] .footer-right {
          display: block;
        }

        ::slotted([slot='footer']) {
          padding: 0.5em 1em;
        }

        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-block', CcBlock);
