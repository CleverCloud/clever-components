import warningSvg from 'twemoji/2/svg/26a0.svg';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { iconStyles } from '../styles/icon.js';
import { skeleton } from '../styles/skeleton.js';
import { tileStyles } from '../styles/info-tiles.js';

/**
 * A "tile" component to display consumption info (yesterday and over last 30 days).
 *
 * ## Details
 *
 * * When `consumption` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * ## Type definitions
 *
 * ```js
 * interface Consumption {
 *   yesterday: number,
 *   last30Days: number,
 * }
 * ```
 *
 * @prop {Consumption} consumption - Sets the consumption details.
 * @prop {Boolean} error - Displays an error message.
 */
export class CcTileConsumption extends LitElement {

  static get properties () {
    return {
      consumption: { type: Object, attribute: false },
      error: { type: Boolean, reflect: true },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  static get _skeletonConsumption () {
    return {
      yesterday: 0.7,
      last30Days: 14.6,
    };
  }

  render () {

    const skeleton = (this.consumption == null);
    const { yesterday, last30Days } = skeleton ? CcTileConsumption._skeletonConsumption : this.consumption;

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
        <div class="tile_message"><img class="icon-img" src=${warningSvg} alt="">${i18n('cc-tile-consumption.error')}</div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      tileStyles,
      iconStyles,
      skeleton,
      // language=CSS
      css`
        .line {
          align-items: center;
          display: flex;
          padding: 0.5rem 0;
          width: 100%;
        }

        .separator {
          flex: 1 1 0;
          border-top: 1px dotted #8C8C8C;
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
