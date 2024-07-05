import { css, html, LitElement } from 'lit';
import { ResizeController } from '../../controllers/resize-controller.js';

// ceiled width with 275px tiles and 1em (16px) gap
const BREAKPOINTS = [570, 860, 1150];
/**
 * @typedef {import('./cc-overview.types.js').OverviewModeType} OverviewModeType
 */

/**
 * A display only component (just HTML+CSS) to layout heads, a main and several tiles.
 *
 * ## Details
 *
 * * The head components must have the `head` CSS class, they will be displayed at the top.
 * * If you use more than one `head`, you must specify how many with `--cc-overview-head-count`.
 * * The main component must have the `main` CSS class, it will be displayed at the bottom left (depending on the number of columns).
 * * The tile components will be displayed in a 1 to 4 columns grid layout, below the header and around the main.
 * * The number of columns is variable and depends directly on the width of the component (with some help from the `ResizeController`).
 * * `mode="app"` for 6 tiles
 * * `mode="orga"` for 2 tiles
 *
 * @cssdisplay grid
 *
 * @slot - Put your `.head`, tiles and `.main` components here.
 *
 * @cssprop {Number} --cc-overview-head-count - How many `.head` elements marked are in the slot  (defaults: `1`).
 */
export class CcOverview extends LitElement {
  static get properties() {
    return {
      /** @required */
      mode: { type: String, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {OverviewModeType|null} Sets the mode of the layout for the overview */
    this.mode = null;

    new ResizeController(this, {
      widthBreakpoints: BREAKPOINTS,
    });
  }

  render() {
    return html` <slot></slot> `;
  }

  static get styles() {
    // language=CSS
    return css`
      :host {
        /*
          We ask the user to specify this number (if > 1)
          because the information is known and detecting it automatically and properly requires a MutationObserver
          to count them in the \` < slot >\` and it seems overkill.
        */
        --cc-overview-head-count: 1;

        display: grid;
        grid-gap: 1em;
      }

      /* region GRID LAYOUT */

      :host([w-lt-570]) {
        grid-template-columns: [main-start] 1fr [main-end];
      }

      :host([w-gte-570][w-lt-860]) {
        grid-template-columns: [main-start] 1fr 1fr [main-end];
      }

      :host([w-gte-860][w-lt-1150]) {
        grid-template-columns: [main-start] 1fr 1fr [main-end] 1fr;
      }

      :host([w-gte-1150]) {
        grid-template-columns: [main-start] 1fr 1fr 1fr [main-end] 1fr;
      }

      /* endregion */

      /* region GRID LAYOUT (app) */

      :host([mode='app'][w-lt-570]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 6), min-content) [main-start] 1fr [main-end];
      }

      :host([mode='app'][w-gte-570][w-lt-860]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 3), min-content) [main-start] 1fr [main-end];
      }

      :host([mode='app'][w-gte-860][w-lt-1150]) {
        grid-template-rows:
          repeat(calc(var(--cc-overview-head-count) + 1), min-content)
          [main-start] min-content 1fr 1fr [main-end];
      }

      :host([mode='app'][w-gte-1150]) {
        grid-template-rows:
          repeat(calc(var(--cc-overview-head-count) + 1), min-content)
          [main-start] 1fr 1fr [main-end];
      }

      /* endregion */

      /* region GRID LAYOUT (orga) */

      :host([mode='orga'][w-lt-570]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 2), min-content) [main-start] 1fr [main-end];
      }

      :host([mode='orga'][w-gte-570][w-lt-860]) {
        grid-template-rows: repeat(calc(var(--cc-overview-head-count) + 1), min-content) [main-start] 1fr [main-end];
      }

      :host([mode='orga'][w-gte-860]) {
        grid-template-rows:
          repeat(calc(var(--cc-overview-head-count) + 0), min-content)
          [main-start] 1fr 1fr [main-end];
      }

      /* endregion */

      /* .head TILE POSITION/SIZE */

      ::slotted(*.head) {
        grid-column: 1 / -1;
      }

      /* .main TILE POSITION/SIZE */

      ::slotted(*.main) {
        width: auto;
        height: auto;
        min-height: 25em;
        grid-column: main-start / main-end;
        grid-row: main-start / main-end;
      }
    `;
  }
}

window.customElements.define('cc-overview', CcOverview);
