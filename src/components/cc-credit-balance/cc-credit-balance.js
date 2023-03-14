import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

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
      _max: { type: Number },
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

    this._offSet = 0;

    this._max = 0;
  }

  _getPercent (rawFigure, max) {
    return ((rawFigure / max) * 100) ?? 0;
  }

  _getProportionalComputedHeight (rawPercent, numberOfItems) {
    if (rawPercent === 0) {
      return 0;
    }

    const containerHeightMinusGaps = 20 - ((numberOfItems - 1) * 0.2) - this._offSet;
    const computedHeight = (containerHeightMinusGaps * (rawPercent / 100));

    if (computedHeight < 1) {
      this._offSet += 0.5;
    }

    console.log(computedHeight);

    return Math.max(computedHeight, 1);
  }

  _getHeightValue (computedHeight) {
    const computedValue = computedHeight > 0
      ? `${computedHeight}em`
      : '';
    const styles = {
      height: computedValue,
    };

    return styles;
  }

  render () {
    const totalCredits = this.totalFreeCredits + this.totalPrepaidCredits;
    const extraConsumption = this.totalConsumption > totalCredits ? this.totalConsumption - totalCredits : 0;
    const remainingCredits = this.totalConsumption < totalCredits ? totalCredits - this.totalConsumption : 0;
    const max = this.totalConsumption + remainingCredits;

    const freeCreditsPercent = this._getPercent(this.totalFreeCredits, max);
    const prepaidCreditsPercent = this._getPercent(this.totalPrepaidCredits, max);
    const remainingCreditsPercent = this._getPercent(remainingCredits, max);
    const extraConsumptionPercent = this._getPercent(extraConsumption, max);
    const consumptionPercent = this._getPercent(this.totalConsumption, max);

    const numberOfCreditItems = [extraConsumption, this.totalFreeCredits, this.totalPrepaidCredits].filter((number) => number > 0).length;
    const numberOfConsumptionItems = [remainingCredits, this.totalConsumption].filter((number) => number > 0).length;

    const freeCreditsComputedHeight = this._getProportionalComputedHeight(freeCreditsPercent, numberOfCreditItems);
    const prepaidCreditsComputedHeight = this._getProportionalComputedHeight(prepaidCreditsPercent, numberOfCreditItems);
    const extraConsumptionComputedHeight = this._getProportionalComputedHeight(extraConsumptionPercent, numberOfCreditItems);
    const remainingCreditsComputedHeight = this._getProportionalComputedHeight(remainingCreditsPercent, numberOfConsumptionItems);
    const consumptionComputedHeight = this._getProportionalComputedHeight(consumptionPercent, numberOfConsumptionItems);

    return html`
      <h1>${this.case}</h1>
      <cc-block>
        <div slot="title">Credit balance & Consumption</div>
        <cc-block-section>
          <div slot="info">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque augue urna, dictum vel dolor sit amet, rutrum placerat quam. Fusce rhoncus nulla et lacus porttitor laoreet. Sed maximus elit at sapien elementum tempor.</p>
            <p>Fusce rhoncus nulla et lacus porttitor laoreet. Sed maximus elit at sapien elementum tempor.</p>
            <p>Quisque augue urna, dictum vel dolor sit amet, rutrum placerat quam.</p>
          </div>
          <div class="container">
            <div class="credits-legends">
              <p class="label ${classMap({ hidden: extraConsumption === 0 })}">Dépassement consommation <br><span class="color-box bg-extra"></span>${extraConsumption} €</p>
              <p class="label ${classMap({ hidden: this.totalPrepaidCredits === 0 })}">Crédits prépayés <br><span class="color-box bg-prepaid"></span>${this.totalPrepaidCredits} €</p>
              <p class="label ${classMap({ hidden: this.totalFreeCredits === 0 })}">Crédits gratuits <br><span class="color-box bg-free"></span>${this.totalFreeCredits} €</p>
            </div>
            <div class="consumption-legends">
              <p class="label ${classMap({ hidden: remainingCredits === 0 })}">Crédits restants <br><span class="color-box bg-remaining"></span>${remainingCredits} €</p>
              <p class="label">Consommation totale <br><span class="color-box bg-consumption"></span>${this.totalConsumption} €</p>
          </div>
            <div class="graph">
              <div class="credits-graph">  
                <div
                  class="extra ${classMap({ hidden: extraConsumption === 0 })}"
                  style=${styleMap(this._getHeightValue(extraConsumptionComputedHeight))}
                >
                  <div class="bg-extra"></div>
                </div>
                <div
                  class="prepaid ${classMap({ hidden: this.totalPrepaidCredits === 0 })}"
                  style=${styleMap(this._getHeightValue(prepaidCreditsComputedHeight))}
                >
                  <div class="bg-prepaid"></div>
                </div>
                <div
                  class="free ${classMap({ hidden: this.totalFreeCredits === 0 })}"
                  style=${styleMap(this._getHeightValue(freeCreditsComputedHeight))}
                >
                  <div class="bg-free"></div>
                </div>
              </div>
              <div class="consumption-graph">
                <div
                  class="remaining ${classMap({ hidden: remainingCredits === 0 })}"
                  style=${styleMap(this._getHeightValue(remainingCreditsComputedHeight))}
                >
                  <div class="bg-remaining"></div>
                </div>
                <div
                  class="consumption ${classMap({ hidden: this.totalConsumption === 0 })}"
                  style=${styleMap(this._getHeightValue(consumptionComputedHeight))}
                  >
                  <div class="bg-consumption"></div>
                </div>
              </div>
            </div>
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
        }

        * {
          box-sizing: border-box;
        }

        .hidden {
          display: none !important;
        }

        .container {
          display: grid;
          gap: 1em;
          grid-template-areas: 'credits-legends graphs consumption-legends';
          grid-template-columns: auto max-content auto;
        }

        .credits-legends {
          display: grid;
          height: max-content;
          grid-area: credits-legends;
          justify-items: flex-end;
        }

        .credits-legends .label {
          text-align: end;
        }

        .consumption-legends {
          display: grid;
          height: max-content;
          align-self: flex-end;
        }

        .label {
          max-width: max-content;
          margin: 0;
          font-size: 0.9em;
          line-height: 1.5;
          padding-block: 0.5em;
        }

        .label:not(.hidden, :last-of-type) {
          border-bottom: solid 1px #d5d5d5;
        }

        .color-box {
          display: inline-block;
          width: 1.5em;
          height: 1em;
          margin-right: 0.5em;
          vertical-align: text-top;
        }

        .graph {
          display: grid;
          overflow: hidden;
          height: 20em;
          border-radius: 0.5em;
          gap: 0.2em;
          grid-area: graphs;
          grid-template-columns: max-content max-content;
        }

        .credits-graph {
          display: grid;
          width: 100%;
          gap: 0.2em;
        }

        .consumption-graph {
          display: grid;
          width: 100%;
          gap: 0.3em;
        }

        .extra,
        .free,
        .prepaid {
          position: relative;
          display: grid;
          align-items: center;
          gap: 1.5em;
          grid-auto-rows: 100%;
          grid-template-columns: 2.3em;
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
          grid-template-columns: 0.9em;
        }

        .bg-free {
          background: linear-gradient(0deg, #56ac69 0%, #56ac69d9 100%);
        }

        .bg-prepaid {
          background: linear-gradient(0deg, #4f5678 0%, #4f5678d9 100%);
        }

        .bg-remaining,
        .bg-extra {
          background: linear-gradient(0deg, #c5c5c5 0%, #c5c5c5d9 100%);
        }

        .bg-consumption {
          background: linear-gradient(0deg, #b461c9 0%, #b461c9d9 100%);
        }
      `,
    ];
  }
}

window.customElements.define('cc-credit-balance', CcCreditBalance);
