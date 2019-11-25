import { css, html, LitElement } from 'lit-element';
import { withResizeObserver } from '../mixins/with-resize-observer.js';

/**
 * A display only component (just HTML+CSS) to layout:
 *
 * * A header component `.head`
 * * A main component `.main`
 * * Multiple tiles in a 1 to 4 columns grid layout (below the header and around the main component when possible)
 *   * `mode="app"` for 6 tiles
 *   * `mode="orga"` for 2 tiles
 *
 * ## Properties
 *
 * | Property         | Attribute         | Type             | Description
 * | --------         | ---------         | ----             | -----------
 * | `mode`           | `mode`            | `string`         | "app" or "orga"
 *
 * *WARNING*: The "Properties" table below is broken
 *
 * @prop {string} mode - BROKEN
 *
 * @slot - Put your `.head`, tiles and `.main` components here
 */
export class CcOverview extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      mode: { type: String, reflect: true },
    };
  }

  constructor () {
    super();
    this.breakpoints = {
      // ceiled width with 275px tiles and 1rem (16px) gap
      width: [570, 860, 1150],
    };
  }

  render () {
    return html`
      <slot></slot>
    `;
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: grid;
        grid-gap: 1rem;
      }

      /* GRID LAYOUT */
      :host([w-lt-570]) {
        grid-template-columns: repeat(1, 1fr);
      }

      :host([w-gte-570][w-lt-860]) {
        grid-template-columns: repeat(2, 1fr);
      }

      :host([w-gte-860][w-lt-1150]) {
        grid-template-columns: repeat(3, 1fr);
      }

      :host([w-gte-1150]) {
        grid-template-columns: repeat(4, 1fr);
      }

      /* GRID LAYOUT (app) */
      :host([mode="app"][w-lt-570]) {
        grid-template-rows: repeat(7, min-content) 1fr;
      }

      :host([mode="app"][w-gte-570][w-lt-860]) {
        grid-template-rows: repeat(4, min-content) 1fr;
      }

      :host([mode="app"][w-gte-860][w-lt-1150]) {
        grid-template-rows: repeat(3, min-content) 1fr 1fr;
      }

      :host([mode="app"][w-gte-1150]) {
        grid-template-rows: repeat(2, min-content) 1fr 1fr;
      }

      /* GRID LAYOUT (orga) */
      :host([mode="orga"][w-lt-570]) {
        grid-template-rows: repeat(3, min-content) 1fr;
      }

      :host([mode="orga"][w-gte-570][w-lt-860]) {
        grid-template-rows: repeat(2, min-content) 1fr;
      }

      :host([mode="orga"][w-gte-860]) {
        grid-template-rows: repeat(1, min-content) 1fr 1fr;
      }

      /* .head TILE POSITION/SIZE */
      ::slotted(*.head) {
        grid-column: 1 / -1;
      }

      /* .main TILE POSITION/SIZE */
      ::slotted(*.main) {
        grid-column: 1 / -1;
        min-height: 25rem;
      }

      :host([w-gte-860]) ::slotted(*.main) {
        grid-column: 1 / -2;
      }

      :host([mode="app"][w-gte-860]) ::slotted(*.main) {
        grid-row: 3 / -1;
      }

      :host([mode="orga"][w-gte-860]) ::slotted(*.main) {
        grid-row: 2 / -1;
      }
    `;
  }
}

window.customElements.define('cc-overview', CcOverview);
