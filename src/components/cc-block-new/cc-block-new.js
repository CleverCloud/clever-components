import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixArrowDownSFill as iconDown, iconRemixArrowUpSFill as iconUp } from '../../assets/cc-remix.icons.js';
import { hasSlottedChildren } from '../../directives/hasSlottedChildren.js';
import { i18n } from '../../lib/i18n.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-button/cc-button.js';
import '../cc-expand/cc-expand.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';

/**
 * @typedef {import('../common.types.js').IconModel} IconModel
 * @typedef {import('../common.types.js').ToggleStateType} ToggleStateType
 */

/**
 * A display component with mostly HTML+CSS and an open/close toggle feature organized with slots.
 *
 * ## Details
 *
 * * The main section is wrapped in a `<cc-expand>` so variation of this section height will be animated.
 *
 * @cssdisplay block
 *
 * @slot ribbon - The ribbon in the top left corner.
 * @slot header - A zone dedicated for header content.
 * @slot header-icon - The icon in the header.
 * @slot header-title - The title of the header. Try to only use text. Use the `icon` property/attribute.
 * @slot header-right - A zone dedicated for header content on the top right side.
 * @slot content - A zone dedicated for main content.
 * @slot content-header - A zone dedicated for content header content.
 * @slot content-body - A zone dedicated for content body content.
 * @slot content-footer - A zone dedicated for content footer content.
 * @slot footer - A zone dedicated for footer content.
 * @slot footer-left - A zone dedicated for footer left side content.
 * @slot footer-right - A zone dedicated for footer right side content.
 */
export class CcBlockNew extends LitElement {
  static get properties() {
    return {
      icon: { type: Object },
      image: { type: String, reflect: true },
      ribbon: { type: String, reflect: true },
      state: { type: String, reflect: true },
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

    /** @type {ToggleStateType} Sets the state of the toggle behaviour. */
    this.state = 'off';
  }

  _clickToggle() {
    if (this.state === 'close') {
      this.state = 'open';
    } else if (this.state === 'open') {
      this.state = 'close';
    }
  }

  render() {
    const hasImageOrIcon = this.image != null || this.icon != null;
    const isToggleEnabled = this.state === 'open' || this.state === 'close';
    const isOpen = this.state !== 'close';
    const stateHidden = isToggleEnabled && !isOpen;

    /* TODO when reworking the component, check this a11y issue https://github.com/CleverCloud/clever-components/issues/225#issuecomment-1239462826 */
    /* eslint-disable lit-a11y/click-events-have-key-events */
    return html`
      <div class="container">
        <div class="ribbon">
          <slot name="ribbon" ${hasSlottedChildren()}>
            ${this.ribbon != null && this.ribbon !== '' ? html` <div class="info-ribbon">${this.ribbon}</div> ` : ''}
          </slot>
        </div>

        <slot name="header" ${hasSlottedChildren()}>
          <div class="header">
            <div class="header-icon ${classMap({ 'has-image-or-icon': hasImageOrIcon })}">
              ${this.image == null && this.icon == null
                ? html` <slot name="header-icon" ${hasSlottedChildren()}></slot> `
                : ''}
              ${this.image != null && this.icon == null
                ? html` <cc-img class="header-img" src="${this.image}"></cc-img> `
                : ''}
              ${this.icon != null && this.image == null
                ? html` <cc-icon size="lg" .icon="${this.icon}"></cc-icon> `
                : ''}
            </div>
            <div class="header-title">
              <slot name="header-title" ${hasSlottedChildren()}></slot>
            </div>
            <div class="header-right">
              <slot name="header-right" ${hasSlottedChildren()}></slot>
            </div>
            ${isToggleEnabled
              ? html`
                  <cc-button
                    class="toggle_button"
                    .icon=${isOpen ? iconUp : iconDown}
                    hide-text
                    outlined
                    primary
                    @cc-button:click=${this._clickToggle}
                    >${isOpen ? i18n('cc-block.toggle.close') : i18n('cc-block.toggle.open')}
                  </cc-button>
                `
              : ''}
          </div>
        </slot>

        <slot name="content" class="${classMap({ stateHidden })}" ${hasSlottedChildren()}>
          <div class="content">
            <div class="content-header">
              <slot name="content-header" ${hasSlottedChildren()}></slot>
            </div>
            <cc-expand class="content-body">
              <slot name="content-body" ${hasSlottedChildren()}></slot>
            </cc-expand>
            <div class="content-footer">
              <slot name="content-footer" ${hasSlottedChildren()}></slot>
            </div>
          </div>
        </slot>

        <slot name="footer" class="${classMap({ stateHidden })}" ${hasSlottedChildren()}>
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
          margin-bottom: 1em;
          overflow: hidden;
          position: relative;
        }

        .container {
          display: grid;
          gap: 1em;
          padding: 1em;
          padding-left: var(--left-space);
          --left-space: 1em;
        }

        .container:has(slot[name='ribbon'][is-slotted]) {
          --left-space: 3.5em;
        }

        .ribbon {
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

        .ribbon:not(:has([is-slotted])) {
          display: none;
        }

        .stateHidden {
          display: none;
        }

        /* region header */

        .header {
          align-items: center;
          color: var(--cc-color-text-primary-strongest);
          display: none;
        }

        slot[name='header'][is-slotted] .header,
        .header:has(slot[is-slotted]) {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        /* Fixer CSS taille img */

        .header-img {
          align-self: flex-start;
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 1.5em;
          width: 1.5em;
        }

        .header-icon:not(:has([is-slotted]), .has-image-or-icon) {
          display: none;
        }

        .header-title {
          flex: 1 1 0;
        }

        ::slotted([slot='header-title']) {
          color: var(--cc-color-text-primary-strongest);
          font-size: 1.2em;
          font-weight: bold;
        }

        .header-right:not(:has([is-slotted])) {
          display: none;
        }

        /* endregion */

        /* region content */

        .content {
          display: none;
          gap: 1em;
          margin: 0 -1em;
        }

        .content:has(slot[is-slotted]) {
          display: grid;
        }

        .content-header,
        .content-body,
        .content-footer {
          padding: 0 1em;
        }

        .content-header,
        .content-body,
        .content-footer {
          display: none;
        }

        .content-header:has(slot[is-slotted]),
        .content-body:has(slot[is-slotted]),
        .content-footer:has(slot[is-slotted]) {
          display: block;
        }

        /* endregion */

        /* region footer */

        .footer {
          background-color: var(--cc-color-bg-neutral);
          box-shadow: inset 0 6px 6px -6px rgb(0 0 0 / 40%);
          display: none;
          flex-wrap: wrap;
          gap: 1em;
          /* TODO doc */
          justify-content: flex-end;
          /* TODO doc */
          margin: 0 -1em -1em;
          /* TODO doc */
          margin-left: calc(var(--left-space) * -1);
          padding: 0.5em 1em;
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
      `,
    ];
  }
}

window.customElements.define('cc-block-new', CcBlockNew);
