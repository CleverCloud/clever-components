import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixSafe_2Line as iconPrepaid,
} from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-credit-chart/cc-credit-chart.js';
import '../cc-icon/cc-icon.js';
import '../cc-block/cc-block.js';

/**
 * @typedef {import('../common.types.js').ConsumptionCurrency} Currency
 */

/**
 * A component showing the remaining prepaid credits amount and some explanation about prepaid credits.
 *
 * @cssdisplay block
 */
export class CcPrepaidCredits extends LitElement {
  static get properties () {
    return {
      currency: { type: String },
      digits: { type: Number },
      remainingCredits: { type: Number, attribute: 'remaining-credits' },
      skeleton: { type: Boolean },
      totalCredits: { type: Number, attribute: 'total-credits' },
    };
  }

  constructor () {
    super();

    /** @type {Currency} Sets the displayed currency. */
    this.currency = 'EUR';

    /** @type {number} Sets the number of digits displayed for every figure. */
    this.digits = 2;

    /** @type {number|null} Sets the remaining prepaid credits. */
    this.remainingCredits = null;

    /** @type {boolean} Sets the component in skeleton mode. */
    this.skeleton = false;

    /** @type {number|null} Sets the total of prepaid credits. */
    this.totalCredits = null;
  }

  render () {
    const skeleton = this.skeleton;

    return html`
      <cc-block>
        <div slot="title">
          <cc-icon class="${classMap({ skeleton })}" .icon=${iconPrepaid}></cc-icon>
          <span class="${classMap({ skeleton })}">${i18n('cc-prepaid-credits.title')}</span>
        </div>

        <div class="block-content">
          <cc-credit-chart
            total=${this.totalCredits}
            remaining=${this.remainingCredits}
            currency=${this.currency}
            digits=${this.digits}
            ?skeleton=${skeleton}
          ></cc-credit-chart>

          <div class="block-content__desc ${classMap({ skeleton })}">
            ${i18n('cc-prepaid-credits.desc')}
          </div>
        </div>
      </cc-block>
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

        p {
          margin: 0.5em;
        }

        div[slot='title'] {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .block-content {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 3em;
        }

        cc-credit-chart {
          width: 17em;
        }

        .block-content__desc {
          flex: 1 1 34em;
        }

        .skeleton,
        .skeleton * {
          background-color: #bbb !important;
          color: transparent !important;
        }
      `,
    ];
  }
}

window.customElements.define('cc-prepaid-credits', CcPrepaidCredits);
