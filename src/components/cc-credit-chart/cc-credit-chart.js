import { css, html, LitElement } from 'lit';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';

// This figure is obtained by using `.getTotalLength()` on the <path> element of the half circle Path
const HALF_CIRCLE_PATH_SIZE = 283;
// Variables below help to modify the `svg` without having to calculate everything but this could be improved a lot by computing these
const X_START_POINT = 50;
const X_END_POINT = 230;
const Y_BOTTOM_POINT = 105;

/**
 * @typedef {import('../cc-credit-consumption/cc-credit-consumption.types.js').Currency} Currency
 */

/**
 * A component that draws a chart to highlight the remaining credits amount.
 *
 * @cssdisplay block
 *
 * @cssprop {Color} --cc-credit-chart-stroke - Sets the color of the stroke representing remaining credits within the chart.
 */
export class CcCreditChart extends LitElement {
  static get properties () {
    return {
      currency: { type: String },
      digits: { type: Number },
      remaining: { type: Number },
      skeleton: { type: Boolean },
      total: { type: Number },
    };
  }

  constructor () {
    super();

    /** @type {Currency} Sets the displayed currency */
    this.currency = 'EUR';

    /** @type {number} Sets the number of digits displayed. */
    this.digits = 2;

    /** @type {number|null} Sets the remaining part of the chart. */
    this.remaining = null;

    /** @type {boolean} Sets the component in skeleton mode. */
    this.skeleton = false;

    /** @type {number|null} Sets the total of the chart. */
    this.total = null;
  }

  /**
   * TODO move this to separate helper?
   * @param {number} partialValue - the partial value
   * @param {number} totalValue - the total value
   * @return {number} the percent
   */
  _getPercentValue (partialValue, totalValue) {
    return (totalValue === 0) ? 0 : Math.ceil((partialValue * 100) / totalValue);
  }

  render () {
    return this.skeleton ? this._renderSkeleton() : this._renderLoaded();
  }

  _renderLoaded () {
    const consumed = this.total - this.remaining;
    const consumedPercent = this._getPercentValue(consumed, this.total);
    const dashOffset = this.total > 0 ? (consumedPercent * HALF_CIRCLE_PATH_SIZE) / 100 : HALF_CIRCLE_PATH_SIZE;

    return html`
      <svg viewbox="0 0 280 150">
        <path d="M ${X_START_POINT},${Y_BOTTOM_POINT} A 75,75 0 0 1 ${X_END_POINT},${Y_BOTTOM_POINT}" stroke="#ccc" stroke-width="15" fill="transparent">
        </path>
        <path id="credit-stroke" d="M ${X_START_POINT},${Y_BOTTOM_POINT} A 75,75 0 0 1 ${X_END_POINT},${Y_BOTTOM_POINT}" stroke="#ccc" stroke-width="15" fill="transparent" stroke-dasharray="${HALF_CIRCLE_PATH_SIZE}" stroke-dashoffset="-${dashOffset}"></path>

        <text x="140" y="67" text-anchor="middle" dominant-baseline="middle" font-size="22">${i18n('cc-credit-chart.price', { price: this.remaining, currency: this.currency, digits: this.digits })}</text>
        <text x="140" y="85" text-anchor="middle" dominant-baseline="middle" font-size="14">${i18n('cc-credit-chart.remaining')}</text>

        <text x="${X_START_POINT}" y="${Y_BOTTOM_POINT + 20}" text-anchor="middle" dominant-baseline="middle"  font-size="16">${i18n('cc-credit-chart.price', { currency: this.currency, price: this.total, digits: this.digits })}</text>
        <text x="${X_END_POINT}" y="${Y_BOTTOM_POINT + 20}" text-anchor="middle" dominant-baseline="middle"  font-size="16">${i18n('cc-credit-chart.price', { currency: this.currency, price: 0, digits: this.digits })}</text>
      </svg>
    `;
  }

  _renderSkeleton () {
    return html`
      <svg class="skeleton" viewbox="0 0 280 150">
        <path class="skeleton" d="M ${X_START_POINT},${Y_BOTTOM_POINT} A 75,75 0 0 1 ${X_END_POINT},${Y_BOTTOM_POINT}" stroke="#ccc" stroke-width="15" fill="transparent">
        </path>
        <path class="skeleton--dash" d="M ${X_START_POINT},${Y_BOTTOM_POINT} A 75,75 0 0 1 ${X_END_POINT},${Y_BOTTOM_POINT}" stroke="#bbb" stroke-width="15" fill="transparent" stroke-dasharray="${HALF_CIRCLE_PATH_SIZE}" stroke-dashoffset="-90"></path>

        <rect width="100" height="18" fill="#bbb" y="65" x="90"></rect>

        <rect width="70" height="18" fill="#bbb" x="15" y="115"></rect>
        <rect width="70" height="18" fill="#bbb" x="195" y="115"></rect>
      </svg>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        #credit-stroke {
          stroke: var(--cc-credit-chart-stroke, #353535);
        }

        svg text {
          fill: var(--cc-color-text-weak, #333);
        }

        .skeleton--dash {
          animation: ease-out 2s infinite dash-skeleton;
        }

        @keyframes dash-skeleton {

          from {
            opacity: 0.3;
            stroke-dashoffset: 0%;
          }

          to {
            opacity: 0.2;
            stroke-dashoffset: -100%;
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-credit-chart', CcCreditChart);
