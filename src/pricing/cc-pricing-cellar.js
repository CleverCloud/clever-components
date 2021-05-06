import '../atoms/cc-toggle.js';
import '../atoms/cc-input-text.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';

const UNITS = [
  {
    label: 'MB',
    value: 1,
  },
  {
    label: 'GB',
    value: 1000,
  },
  {
    label: 'TB',
    value: 1000000,
  },
];

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/dir/cc-example-component.js)
 *
 * ## Details
 *
 * * Details about bla.
 * * Details about bla bla.
 * * Details about bla bla bla.
 *
 * ## Technical details
 *
 * * Technical details about foo.
 * * Technical details about bar.
 * * Technical details about baz.
 *
 * ## Type definitions
 *
 * ```js
 * interface ExampleInterface {
 *   one: string,
 *   two: number,
 *   three: boolean,
 * }
 * ```
 *
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="/src/assets/warning.svg" style="height: 1.5rem; vertical-align: middle"> | <code>warning.svg</code>
 * | <img src="/src/assets/redirection-off.svg" style="height: 1.5rem; vertical-align: middle"> | <code>redirection-off.svg</code>
 *
 * @prop {String} one - Description for one.
 * @prop {Boolean} two - Description for two.
 * @prop {ExampleInterface[]} three - Description for three.
 *
 * @event {CustomEvent<ExampleInterface>} example-component:event-name - Fires XXX whenever YYY.
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcPricingCellar extends LitElement {

  // DOCS: 1. LitElement's properties descriptor

  static get properties () {
    return {
      _cellarInfos: { type: Object },
      _totalPrice: { type: Number },
      // _storageUnitValue: { type: Number },
      // _trafficUnitValue: { type: Number },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    this._totalPrice = 0;
    this._storageUnitValue = 1;
    this._trafficUnitValue = 1;
    this._storageQuantity = 0;
    this._trafficQuantity = 0;
    // One possibility is to have an object like below to render and check our "quota" in a generic way
    // min max are TiB
    // price is the price per GB per month
    this._cellarInfos = {
      storage: [
        {
          minRange: 0,
          maxRange: 1000000,
          minRangeDisplay: 0,
          maxRangeDisplay: 1e12,
          price: 0.02,
          highlighted: true,
          totalPrice: {
            price: 0,
            visible: true,
          },
        },
        {
          minRange: 1000000,
          maxRange: 25000000,
          minRangeDisplay: 10 * 1e12,
          maxRangeDisplay: 25 * 1e12,
          price: 0.015,
          highlighted: false,
          totalPrice: {
            price: 0,
            visible: false,
          },
        },
        {
          minRange: 25000000,
          // -1 to represent infinity
          maxRange: -1,
          minRangeDisplay: 25 * 1e12,
          maxRangeDisplay: '∞',
          price: 0.01,
          highlighted: false,
          totalPrice: {
            price: 0,
            hidden: false,
          },
        },
      ],
      traffic: [
        {
          minRange: 0,
          maxRange: 1000000,
          minRangeDisplay: 0,
          maxRangeDisplay: 10 * 1e12,
          price: 0.09,
          highlighted: true,
          totalPrice: {
            price: 0,
            visible: true,
          },
        },
        {
          minRange: 1000000,
          // -1 to represent infinity
          maxRange: -1,
          minRangeDisplay: 10 * 1e12,
          maxRangeDisplay: '∞',
          price: 0.07,
          highlighted: false,
          totalPrice: {
            price: 0,
            visible: false,
          },
        },
      ],
    };
  }

  // DOCS: 3. Property getters

  // DOCS: 5. Public methods

  // DOCS: 6. Private methods

  // Might need to refactor later Can't we use reduce ???
  _getTotal () {
    const totalStorage = Object.values(this._cellarInfos.storage).find((elem) => elem.totalPrice.price !== 0);
    const trafficStorage = Object.values(this._cellarInfos.traffic).find((elem) => elem.totalPrice.price !== 0);
    return (totalStorage?.totalPrice.price != null ? totalStorage?.totalPrice.price : 0)
        + (trafficStorage?.totalPrice.price != null ? trafficStorage?.totalPrice.price : 0);
  }

  _renderInfos (placeholder, infos) {
    return infos.map((info) => {
      return html`
                <div class="${placeholder}-infos infos"> 
                    <div class="info">
                        <span class="${classMap({ highlighted: info.highlighted })}">
                          ${(info.maxRange !== -1)
                                  ? html`<span>${i18n('cc-pricing-cellar.bytes', { bytes: info.minRangeDisplay })}</span>
                                  <span> &le; ${placeholder} &lt; </span>
                                  <span>${i18n('cc-pricing-cellar.bytes', { bytes: info.maxRangeDisplay })}</span>`
                                  : html`<span>${i18n('cc-pricing-cellar.bytes', { bytes: info.minRangeDisplay })}</span>
                                  <span> &le; ${placeholder} &lt; </span>
                                  <span>${info.maxRangeDisplay}</span>`
                          }
                        </span>
                    </div>
                    <div class="price">
                        ${i18n('cc-pricing-cellar.format-price', { price: info.price })} / 
                        ${i18n('cc-pricing-cellar.per-month-text')}
                    </div>
                    <div class="price_estimation ${classMap({ visible: info.totalPrice.visible })}">
                        Price
                        ${i18n('cc-pricing-cellar.format-price', { price: info.totalPrice.price })}
                    </div>
                </div>
            `;
    });
  }

  _calculatePrice (infos) {
    if (infos === 'storage') {
      const newStorage = this._cellarInfos.storage.map((info) => {
        return this._changeInfo(infos, info, this._storageQuantity);
      });
      this._cellarInfos = { storage: newStorage, ...this._cellarInfos };
    }
    else if (infos === 'traffic') {
      const newTraffic = this._cellarInfos.traffic.map((info) => {
        return this._changeInfo(infos, info, this._trafficQuantity);
      });
      this._cellarInfos = { ...this._cellarInfos, traffic: newTraffic };
    }
    this._totalPrice = this._getTotal();
  }

  _changeInfo (from, info, quantity) {
    const unit = ((from === 'storage') ? this._storageUnitValue : this._trafficUnitValue);
    console.log('from', from, 'unit', unit, 'qt', quantity);
    if (info.maxRange !== -1) {
      info.highlighted = quantity * unit >= info.minRange && quantity * unit < info.maxRange;
      info.totalPrice.visible = info.highlighted;
      info.totalPrice.price = (info.totalPrice.visible)
        ? ((quantity * unit) / 1000) * info.price
        : 0;
    }
    else {
      info.highlighted = quantity * unit >= info.minRange;
      info.totalPrice.visible = info.highlighted;
      info.totalPrice.price = (info.totalPrice.visible)
        ? ((quantity * unit) / 1000) * info.price
        : 0;
    }
    return info;
  }

  // DOCS: 7. Event handlers

  _onToggleStorage ({ detail: unit }) {
    this._storageUnitValue = parseInt(unit);
    this._calculatePrice('storage');
    // console.log('storage', this._storageUnitValue);
    console.log('storage quantity when toggle storage', this._storageQuantity);
  }

  _onToggleTraffic ({ detail: unit }) {
    this._trafficUnitValue = parseInt(unit);
    this._calculatePrice('traffic');
    console.log('traffic', this._trafficUnitValue);
  }

  // Shouldn't we use one function that the event handlers will use as they're doing basically the same ?

  _onStorageChanged ({ detail: quantity }) {
    let qt = null;
    if (!isNaN(parseFloat(quantity))) {
      qt = parseFloat(quantity);
    }
    this._storageQuantity = qt != null && qt >= 0 ? qt : 0;
    this._calculatePrice('storage');

    // const quantity = parseInt(quantity);
    // const newStorage = this._cellarInfos.storage.map((info) => {
    //   if (info.maxRange !== -1) {
    //     info.highlighted = quantity >= info.minRange && quantity < info.maxRange;
    //     info.totalPrice.visible = info.highlighted;
    //     info.totalPrice.price = (info.totalPrice.visible)
    //       ? ((quantity / 1000) * info.price)
    //       : 0;
    //   }
    //   else {
    //     info.highlighted = quantity >= info.minRange;
    //     info.totalPrice.visible = info.highlighted;
    //     info.totalPrice.price = (info.totalPrice.visible)
    //       ? ((quantity / 1000) * info.price)
    //       : 0;
    //   }
    //   return info;
    // });
    // this._cellarInfos = { storage: newStorage, ...this._cellarInfos };
    // this._totalPrice = this._getTotal();
  }

  _onTrafficChanged ({ detail: quantity }) {
    let qt = null;
    if (!isNaN(parseFloat(quantity))) {
      qt = parseFloat(quantity);
    }
    this._trafficQuantity = qt != null && qt >= 0 ? qt : 0;
    this._calculatePrice('traffic');
    // const storage = parseInt(traffic);
    //
    // const newTraffic = this._cellarInfos.traffic.map((info) => {
    //   if (info.maxRange !== -1) {
    //     info.highlighted = storage >= info.minRange && storage < info.maxRange;
    //     info.totalPrice.visible = info.highlighted;
    //     info.totalPrice.price = (info.totalPrice.visible)
    //       ? ((storage * this._trafficUnitValue) * info.price)
    //       : 0;
    //   }
    //   else {
    //     info.highlighted = storage >= info.minRange;
    //     info.totalPrice.visible = info.highlighted;
    //     info.totalPrice.price = (info.totalPrice.visible)
    //       ? ((storage * this._trafficUnitValue) * info.price)
    //       : 0;
    //   }
    //   return info;
    // });
    // this._cellarInfos = { ...this._cellarInfos, traffic: newTraffic };
    // this._totalPrice = this._getTotal();
  }

  // DOCS: 10. LitElement's render method

  render () {
    return html`
            <div class="cellar-recap">
                bla bla bla to explain how the pricing works (storage + outbound traffic)
            </div>

            <div class="title">Estimate your cellar cost</div>
            </div>
           
            <div class="storage">
              <div class="title title-storage">Storage</div>

              <div class="input-wrapper">
                <cc-input-text 
                    placeholder="Your storage"
                    @cc-input-text:input=${this._onStorageChanged}
                    number
                ></cc-input-text>
                <cc-toggle 
                    class="unit-toggle" 
                    value=${this._storageUnitValue}
                    choices='[{"label":"MB","value":"1"},{"label":"GB","value":"1000"}, {"label":"TB","value":"1000000"}]'
                    @cc-toggle:input=${this._onToggleStorage}
                >
                </cc-toggle>
              </div>
              
              ${this._renderInfos('storage', this._cellarInfos.storage)}
            </div>
            
            <div class="traffic">
              <div class="title title-traffic">Outbound Traffic</div>

              <div class="input-wrapper">
                <cc-input-text
                    placeholder="Your traffic"
                    @cc-input-text:input=${this._onTrafficChanged}
                    number
                ></cc-input-text>
<!--                <input type="number" @input=...>-->
                <cc-toggle 
                    class="unit-toggle" 
                    value=${this._trafficUnitValue}
                    choices='[{"label":"MB","value":"1"},{"label":"GB","value":"1000"}, {"label":"TB","value":"1000000"}]'
                    @cc-toggle:input=${this._onToggleTraffic}
                >
                </cc-toggle>
              </div>

              ${this._renderInfos('outbound traffic', this._cellarInfos.traffic)}

            </div>
           
            <div class="total-recap">
                Total
                <div class="estimated-monthly">
                    ${i18n('cc-pricing-cellar.format-price', { price: this._totalPrice })}
                </div>
            </div>
        `;
  }

  connectedCallback () {
    super.connectedCallback();
  }

  static get styles () {
    return [
      // language=CSS
      css`
                :host {
                    display: grid;
                    grid-gap: 0.5rem;
                }

                input {
                  padding: 0.25rem 0.5rem;
                  text-align: right;
                }

                .input-wrapper {
                  align-items: flex-end;
                  display: flex;
                  flex-direction: row;
                  gap: 0.5rem;
                  margin-bottom: 1rem;
                }
                
                .input-toggle {
                  align-self: center;
                }
                .price_estimation {
                    visibility: hidden;
                }

                .visible {
                    display: block;
                    visibility: visible;
                }

                .highlighted {
                  --color: rgba(50, 50, 255, 0.15);
                  background-color: var(--color);
                  border-radius: 3px;
                  box-shadow: 0 0 0 2px var(--color);
                  padding: 1px 0;
                }
                
                .cellar-recap {
                    font-style: italic;
                }
                
                .title {
                  font-weight: bold;
                }

                .title-storage,
                .title-traffic {
                  margin: 1rem 0 0.5rem 0;
                }

                .storage,
                .traffic {
                  box-shadow: 0 0 0.5rem #aaa;
                  padding: 0.5rem 0 0.5rem 1rem;
                }
                
                .infos {
                  /*display: flex;
                  justify-content: space-between;
                  align-content: center;*/
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                }
                
                .info {
                    margin-top: 0.5rem;
                }
                
                .storage-infos .price_estimation,
                .traffic-infos .price_estimation {
                  justify-self: end;
                  padding-right: 0.5rem;
                }


                .storage-infos .price,
                .traffic-infos .price {
                  justify-self: center;
                }
                
                .total-recap {
                  font-weight: bold;
                  padding-right: 0.5rem;
                  text-align: right;
                }
                
                .price_estimation {
                  font-weight: bold;
                }

            `,
    ];
  }
}

window.customElements.define('cc-pricing-cellar', CcPricingCellar);
