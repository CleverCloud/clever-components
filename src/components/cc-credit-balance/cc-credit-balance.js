import { css, html, LitElement } from 'lit';

import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';

/**
 * A component ...
 *
 * @cssdisplay block
 *
 */
export class CcCreditBalance extends LitElement {
  static get properties () {
    return {
      case: { type: String },
      extra: { type: String },
      free: { Type: Object },
      prepaid: { Type: Object },
      _free: { type: Object },
      _prepaid: { type: Object },
      _total: { type: String },
    };
  }

  constructor () {
    super();

    this.case = '';

    this.extra = '0';

    this.free = {
      consumed: 0,
      total: 0,
    };

    this.prepaid = {
      consumed: 0,
      total: 0,
    };

    this._free = {
      consumed: 0,
      remaining: 0,
    };

    this._prepaid = {
      consumed: 0,
      remaining: 0,
    };

    this._total = 0;
  }

  update (changedProperties) {
    this._free.consumed = (this.free.consumed > 0 || this.free.total > 0)
      ? (this.free.consumed / this.free.total) * 100
      : 0;
    this._free.remaining = 100 - this._free.consumed;

    this._prepaid.consumed = (this.prepaid.consumed > 0 || this.prepaid.total > 0)
      ? (this.prepaid.consumed / this.prepaid.total) * 100
      : 0;
    this._prepaid.remaining = 100 - this._prepaid.consumed;

    this._total = this.free.consumed + this.prepaid.consumed + this.extra;

    super.update(changedProperties);
  }

  render () {
    return html`
      <h1>${this.case}</h1>
      <cc-block>
          <div slot="title">Credit balance & Consumption</div>
          <cc-block-section>
              <div slot="title">Current Consumption</div>
              <div slot="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab amet architecto aut consequatur, cupiditate debitis dicta doloribus dolorum eius et impedit iusto laudantium minus modi nobis quam quidem sit voluptas.</div>
            <div class="container">
              <div class="svg-item free">
                <svg width="100%" height="100%" viewBox="0 0 40 40" class="donut" style="--consumed: ${this._free.consumed}; --remaining: ${this._free.remaining};">
                  <circle class="donut-hole" cx="20" cy="20" r="15.91549430918954" fill="#fff"></circle>
                  <circle class="donut-ring" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5"></circle>
                  <circle class="donut-segment donut-segment-2" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5" stroke-dasharray="${this._free.remaining} ${this._free.consumed}" stroke-dashoffset="25"></circle>
                  <g class="donut-text donut-text-1">

                    <text y="50%">
                      <tspan x="50%" text-anchor="middle" class="donut-percent">${this.free.consumed} €</tspan>
                    </text>
                  </g>
                </svg>
              </div>
              <p class="legend-free">Gratuits (${this.free.total} €)</p>
              
              <span class="plus plus-free">+</span>
              <div class="svg-item prepaid">
                <svg width="100%" height="100%" viewBox="0 0 40 40" class="donut" style="--consumed: ${this._prepaid.remaining}; --remaining: ${this._prepaid.consumed};">
                  <circle class="donut-hole" cx="20" cy="20" r="15.91549430918954" fill="#fff"></circle>
                  <circle class="donut-ring" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5"></circle>
                  <circle class="donut-segment donut-segment-3" cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke-width="3.5" stroke-dasharray="${this._prepaid.remaining} ${this._prepaid.consumed}" stroke-dashoffset="25"></circle>
                  <g class="donut-text donut-text-2">

                    <text y="50%">
                      <tspan x="50%" text-anchor="middle" class="donut-percent">${this.prepaid.consumed} €</tspan>
                    </text>
                  </g>
                </svg>
              </div>
              <p class="legend-prepaid">Prépayés (${this.prepaid.total} €)</p>
              <span class="plus plus-prepaid">+</span>
              <div class="svg-item extra">
                <svg width="100%" height="100%" viewBox="0 0 40 40" class="donut">
                  <circle cx="20" cy="20" r="15.91549430918954" fill="#eee"></circle>
                  <g class="donut-text donut-text-3">

                    <text y="50%" transform="translate(0, 2)">
                      <tspan x="50%" text-anchor="middle" class="donut-percent">${this.extra} €</tspan>
                    </text>
                  </g>
                </svg>
              </div>
              <p class="legend-extra">Dépassement</p>
              <span class="equal">=</span>
              <span class="total">${this._total} €</span>
            </div>
          </cc-block-section>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
          font-family: 'Arial', 'Helvetica Neue', 'Helvetica', sans-serif;
        }
        
        .plus,
        .equal {
          color: var(--cc-color-text-weak);
          font-size: 3em;
        }
        
        .equal {
          margin-right: 0.4em;
          grid-area: equal;
        }
        
        .total {
          color: var(--cc-color-text-strong);
          font-size: 3.5em;
          grid-area: total;
        }
        
        
        .legend-free {
          grid-area: legend-free;
        }
        
        .svg-item {
          width: 100%;
          margin: 0 auto;
          animation: donutfade 1s;
        }

        .container {
          display: grid;
          align-items: center;
          font-weight: bold;
          gap: 0.5em 0;
          grid-template-areas: 
            'free plus-free prepaid plus-prepaid extra equal total'
            'legend-free . legend-prepaid . legend-extra . .';
          grid-template-columns: 1fr auto 1fr auto 1fr auto auto;
          justify-items: center;
        }
        
        p {
          margin: 0;
        }
        
        .free {
          grid-area: free;
        }
        
        .plus-free {
          grid-area: plus-free;
        }
        
        .prepaid {
          grid-area: prepaid;
        }

        .plus-prepaid {
          grid-area: plus-prepaid;
        }
        
        .extra {
          grid-area: extra;
        }
        
        .legend-extra {
          grid-area: legend-extra;
        }
        
        .legend-free {
          grid-area: legend-free;
        }

        .legend-prepaid {
          grid-area: legend-prepaid;
        }
        
        .donut-ring {
          stroke: #ebebeb;
        }

        .donut-segment {
          stroke: #ff6200;
          transform-origin: center;
        }

        .donut-segment-2 {
          animation: donut1 3s;
          stroke: var(--cc-color-text-success);
        }

        .donut-segment-3 {
          animation: donut2 3s;
          stroke: var(--cc-color-text-primary);
        }

        .donut-segment-4 {
          animation: donut3 3s;
          stroke: #ed1e79;
        }

        .segment-1 {
          fill: #ccc;
        }

        .segment-2 {
          fill: aqua;
        }

        .segment-3 {
          fill: #164c8a;
        }

        .segment-4 {
          fill: #ed1e79;
        }

        .donut-percent {
          animation: donutfadelong 1s;
        }

        .donut-text {
          fill: #ff6200;
          font-family: 'Arial', 'Helvetica', sans-serif;
          transform: translateY(8%);
        }

        .donut-text-1 {
          fill: var(--cc-color-text-success);
        }

        .donut-text-2 {
          fill: var(--cc-color-text-primary);
        }

        .donut-text-3 {
          fill: var(--cc-color-text-danger);
          transform: translateY(3%);
        }

        .donut-label {
          fill: #000;
          font-size: 0.28em;
          font-weight: bold;
          line-height: 1;
        }

        .donut-percent {
          font-size: 0.5em;
          font-weight: bold;
          line-height: 1;
        }

        .donut-data {
          animation: donutfadelong 1s;
          color: #666;
          fill: #666;
          font-size: 0.2em;
          line-height: 1;
          text-align: center;
          text-anchor: middle;
        }
        
        .svg-item p {
          color: var(--cc-color-text-weak);
          text-align: center;
        }
      `,
    ];
  }
}

window.customElements.define('cc-credit-balance', CcCreditBalance);
