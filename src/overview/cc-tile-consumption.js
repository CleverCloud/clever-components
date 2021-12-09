import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { tileStyles } from '../styles/info-tiles.js';
import { skeletonStyles } from '../styles/skeleton.js';

/** @type {Consumption} */
const SKELETON_CONSUMPTION = {
  yesterday: 0.7,
  last30Days: 14.6,
};

/**
 * A "tile" component to display consumption info (yesterday and over last 30 days).
 *
 * ## Details
 *
 * * When `consumption` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * @typedef {import('./types.js').Consumption} Consumption
 *
 * @cssdisplay grid
 */
export class CcTileConsumption extends LitElement {

  static get properties () {
    return {
      consumption: { type: Object },
      error: { type: Boolean, reflect: true },
    };
  }

  constructor () {
    super();

    /** @type {Consumption|null} Sets the consumption details */
    this.consumption = null;

    /** @type {boolean} Displays an error message */
    this.error = false;
  }

  render () {

    const skeleton = (this.consumption == null);
    const { yesterday, last30Days } = skeleton ? SKELETON_CONSUMPTION : this.consumption;

    return html`
      <div class="tile_title">${i18n('cc-tile-consumption.title')}</div>

      ${!this.error ? html`
        <div class="tile_body">
          <div class="line">
            <span>${i18n('cc-tile-consumption.yesterday')}</span>
            <span class="separator"></span>
            <span class="value ${classMap({ skeleton })}">${i18n('cc-tile-consumption.amount', { amount: yesterday })}</span>
          </div>
          <div class="line">
            <span>${i18n('cc-tile-consumption.last-30-days')}</span>
            <span class="separator"></span>
            <span class="value ${classMap({ skeleton })}">${i18n('cc-tile-consumption.amount', { amount: last30Days })}</span>
          </div>
        </div>
      ` : ''}

      ${this.error ? html`
        <cc-error class="tile_message">${i18n('cc-tile-consumption.error')}</cc-error>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      tileStyles,
      skeletonStyles,
      // language=CSS
      css`
        .line {
          align-items: center;
          display: flex;
          padding: 0.5rem 0;
          width: 100%;
        }

        .separator {
          border-top: 1px dotted #8C8C8C;
          flex: 1 1 0;
          margin: 0 10px;
        }

        .value {
          font-weight: bold;
        }

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tile-consumption', CcTileConsumption);
