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

    const creditsGridTemplateColumns = `grid-template-columns: ${totalFreeCreditsPercent} ${totalPrepaidCreditsPercent} ${totalExtraPercent}`;
    const consumptionGridTemplateColumns = `grid-template-columns: ${totalConsumptionPercent} ${totalRemainingPercent}`;

    return html`
      <h1>${this.case}</h1>
      <cc-block>
          <div slot="title">Credit balance & Consumption</div>
          <div class="graph">
            <div class="credits-graph" style=${creditsGridTemplateColumns}>    
              <div class="free ${classMap({ hidden: this.totalFreeCredits === 0 })}">
                <p class="label">Crédits gratuis <br><span class="color-box"></span>${totalFreeCreditsPercent}</p>
                <div></div>
              </div>
              <div class="prepaid ${classMap({ hidden: this.totalPrepaidCredits === 0 })}">
                <p class="label">Crédits prépayés <br><span class="color-box"></span>${totalPrepaidCreditsPercent}</p>
                <div></div>
              </div>
              <div class="extra ${classMap({ hidden: extraConsumption === 0 })}">
                <p class="label">Dépassement de consommation <br><span class="color-box"></span>${totalExtraPercent}</p>
                <div></div>
              </div>
            </div>
            <div class="consumption-graph" style=${consumptionGridTemplateColumns}>
              <div class="consumption ${classMap({ hidden: this.totalConsumption === 0 })}">
                <div></div>
                <p class="label">Consommation totale <br><span class="color-box"></span>${totalConsumptionPercent}</p>
              </div>
              <div class="remaining ${classMap({ hidden: creditsRemaining === 0 })}">
                <div></div>
                <p class="label">Crédits restants <br><span class="color-box"></span>${totalRemainingPercent}</p>
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
          box-sizing: border-box;
        }

        .hidden {
          position: absolute;
          display: none !important;
        }

        .graph {
          display: grid;
          width: 30em;
          height: 30em;
          align-content: center;
          border-radius: 0.5em;
          gap: 0.2em;
          grid-template-rows: max-content max-content;
        }

        
        .credits-graph {
          display: grid;
          width: 100%;
          gap: 0.2em;
        }

        .consumption-graph {
          display: grid;
          width: 100%;
          gap: 0.2em;
        }

        .extra,
        .free,
        .prepaid {
          position: relative;
          display: grid;
          align-items: center;
          gap: 1.5em;
          grid-auto-columns: 100%;
          grid-template-rows: 3em;
        }

        .label {
          position: absolute;
          width: max-content;
          line-height: 1.5;
          text-align: end;
        }

        .free .label {
          top: -5em;
        }

        .prepaid .label {
          top: -8em;
        }

        .extra .label {
          top: -14em;
        }

        .consumption .label {
          bottom: -5em;
        }

        .remaining .label {
          bottom: -8em;
        }

        .extra div,
        .prepaid div,
        .free div,
        .remaining div,
        .consumption div {
          position: relative;
          height: 100%;
        }

        .remaining,
        .consumption {
          position: relative;
          display: grid;
          align-items: center;
          gap: 1.5em;
          grid-auto-columns: 100%;
          grid-template-rows: 1em;
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
