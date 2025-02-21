import { css, html, LitElement } from 'lit';
import { iconRemixArrowDownSLine as iconArrowDown } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import '../cc-icon/cc-icon.js';

/**
 * A display component with mostly HTML+CSS and an open/close toggle feature organized with slots to display information such as CLI commands.
 * The main purpose is to be used with a cc-block.
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<boolean>} cc-block-details:is-open-change - Fires is-open state whenever it changes.
 *
 * @slot tab-title - The title of the tab. Try to only use text.
 * @slot link - A zone dedicated to link, for example to documentation.
 * @slot content - A zone dedicated to main content.
 */

export class CcBlockDetails extends LitElement {
  static get properties() {
    return {
      isOpen: { type: Boolean, reflect: true, attribute: 'is-open' },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Sets the state of the toggle. */
    this.isOpen = false;
  }

  _onClickToggle() {
    this.isOpen = !this.isOpen;
    dispatchCustomEvent(this, 'is-open-change', !this.isOpen);
  }

  render() {
    return html`
      <div class="wrapper">
        <button class="button" aria-expanded="${this.isOpen}" aria-controls="content" @click=${this._onClickToggle}>
          <slot name="button-text"></slot>
          <cc-icon .icon="${iconArrowDown}"></cc-icon>
        </button>
        <div id="content" class="content"><slot name="content"></slot></div>
        <div class="links">
          <slot name="link"></slot>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          column-gap: 1em;
          display: grid;
          grid-template-areas: 'button links' 'content content';
          justify-items: start;
        }

        .button {
          align-items: center;
          background-color: transparent;
          border: solid 1px transparent;
          display: flex;
          font-family: inherit;
          font-size: 1em;
          grid-area: button;
          padding: 0.25em 0.6em 0.35em;
          transition: all 0.3s;
        }

        :host([is-open]) .button {
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em) var(--cc-border-radius-default, 0.25em) 0 0;
          margin-bottom: 0;
        }

        .button:hover {
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        :host(:not([is-open])) .button:hover {
          border: solid 1px var(--cc-color-border-neutral-strong, #8c8c8c);
        }

        .button cc-icon {
          margin-left: 0.1em;
          transition: all 0.3s;
        }

        :host([is-open]) .button cc-icon {
          transform: rotate(180deg);
        }

        :host(:not([is-open])) .button:hover cc-icon {
          transform: rotate(90deg);
        }

        .content {
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: none;
          grid-area: content;
          padding: 1em;
        }

        :host([is-open]) .content {
          display: block;
        }

        .links {
          align-items: center;
          display: flex;
          gap: 0.5em;
          grid-area: links;
          justify-self: end;
        }
      `,
    ];
  }
}

window.customElements.define('cc-block-details', CcBlockDetails);
