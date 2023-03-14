import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

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
      totalFreeCredits: { type: Number, attribute: 'total-free-credits' },
      totalPrepaidCredits: { type: Number, attribute: 'total-prepaid-credits' },
      totalConsumption: { type: Number, attribute: 'total-consumption' },
      layout: { type: String, reflect: true },
    };
  }

  constructor () {
    super();

    this.case = '';

    /** @type {number} . */
    this.totalFreeCredits = 0;

    /** @type {number} . */
    this.totalPrepaidCredits = 0;

    /** @type {number} . */
    this.totalConsumption = 0;
  }

  _getPercent (rawFigure, max) {
    return ((rawFigure / max) * 100).toFixed(2) ?? 0;
  }

  render () {
    const totalCredits = this.totalFreeCredits + this.totalPrepaidCredits;
    const extraConsumption = this.totalConsumption > totalCredits ? this.totalConsumption - totalCredits : 0;
    const creditsRemaining = this.totalConsumption < totalCredits ? totalCredits - this.totalConsumption : 0;
    const max = this.totalConsumption + creditsRemaining;

    const totalFreeCreditsPercent = this.totalFreeCredits > 0 ? `${this._getPercent(this.totalFreeCredits, max)}%` : '';
    const totalPrepaidCreditsPercent = this.totalPrepaidCredits > 0 ? `${this._getPercent(this.totalPrepaidCredits, max)}%` : '';
    const totalExtraPercent = extraConsumption > 0 ? `${this._getPercent(extraConsumption, max)}%` : '';
    const totalRemainingPercent = creditsRemaining > 0 ? `${this._getPercent(creditsRemaining, max)}%` : '';
    const totalConsumptionPercent = this.totalConsumption > 0 ? `${this._getPercent(this.totalConsumption, max)}%` : '';

    const creditsGridTemplateRows = `grid-template-rows: ${totalExtraPercent} ${totalPrepaidCreditsPercent} ${totalFreeCreditsPercent}`;
    const consumptionGridTemplateRows = `grid-template-rows: ${totalRemainingPercent} ${totalConsumptionPercent}`;

    return html`
      <h1>${this.case}</h1>
      <cc-block>
          <div slot="title">Credit balance & Consumption</div>
          <div class="container">
            <div class="graph">
              <div class="credits-graph" style=${creditsGridTemplateRows}>  
                <div class="extra ${classMap({ hidden: extraConsumption === 0 })}">
                  <p class="label ${classMap({ shifted: this._getPercent(extraConsumption, max) <= 5 })}">Dépassement de consommation <br><span class="color-box"></span>${totalExtraPercent}</p>
                  <div></div>
                </div>
                <div class="prepaid ${classMap({ hidden: this.totalPrepaidCredits === 0 })}">
                  <p class="label ${classMap({ shifted: this._getPercent(this.totalPrepaidCredits, max) <= 5 })}">Crédits prépayés <br><span class="color-box"></span>${totalPrepaidCreditsPercent}</p>
                  <div></div>
                </div>
                <div class="free ${classMap({ hidden: this.totalFreeCredits === 0 })}">
                  <p class="label ${classMap({ shifted: this._getPercent(this.totalFreeCredits, max) <= 5 })}">Crédits gratuis <br><span class="color-box"></span>${totalFreeCreditsPercent}</p>
                  <div></div>
                </div>
              </div>
              <div class="consumption-graph" style=${consumptionGridTemplateRows}>
                <div class="remaining ${classMap({ hidden: creditsRemaining === 0 })}">
                  <div></div>
                  <p class="label ${classMap({ shifted: this._getPercent(creditsRemaining, max) <= 5 })}">Crédits restants <br><span class="color-box"></span>${totalRemainingPercent}</p>
                </div>
                <div class="consumption ${classMap({ hidden: this.totalConsumption === 0 })}">
                  <div></div>
                  <p class="label ${classMap({ shifted: this._getPercent(this.totalConsumption, max) <= 5 })}">Consommation totale <br><span class="color-box"></span>${totalConsumptionPercent}</p>
                </div>
              </div>
            </div>
          </div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .hidden {
          display: none !important;
        }

        .container {
          display: flex;
          min-height: 40em;
          align-items: center;
          justify-content: center;
        }

        .graph {
          display: grid;
          height: 20em;
          border-radius: 0.5em;
          grid-template-columns: max-content max-content;
        }

        .credits-graph {
          display: grid;
          width: 100%;
        }

        .consumption-graph {
          display: grid;
          width: 100%;
        }

        .extra,
        .free,
        .prepaid {
          position: relative;
          display: grid;
          align-items: center;
          gap: 1.5em;
          grid-auto-rows: 100%;
          grid-template-columns: 3em;
        }

        .label {
          position: absolute;
          top: 50%;
          min-width: 10em;
          margin: 0;
          line-height: 1.5;
        }

        .label.shifted {
          transform: translate(-215%, -50%) !important;
        }

        .extra .label,
        .free .label,
        .prepaid .label {
          left: 0;
          text-align: end;
          transform: translate(-115%, -50%);
        }

        .extra div,
        .prepaid div,
        .free div,
        .remaining div,
        .consumption div {
          height: 100%;
        }

        .remaining,
        .consumption {
          position: relative;
          display: grid;
          align-items: center;
          gap: 1.5em;
          grid-auto-rows: 100%;
          grid-template-columns: 1em;
        }

        .free div,
        .free .color-box {
          background-color: #56ac69;
        }

        .color-box {
          display: inline-block;
          width: 1.5em;
          height: 1em;
          margin-right: 0.5em;
          vertical-align: text-top;
        }

        .prepaid div,
        .prepaid .color-box {
          background-color: #4f5678;
        }

        .remaining div,
        .extra div,
        .extra .color-box,
        .remaining .color-box {
          background-color: #c5c5c5;
        }

        .consumption div,
        .consumption .color-box {
          background-color: #b461c9;
        }
      `,
    ];
  }
}

window.customElements.define('cc-credit-balance', CcCreditBalance);
