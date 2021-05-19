import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { dispatchCustomEvent } from '../lib/events.js';
import '../atoms/cc-img.js';
import '../atoms/cc-loader.js';
import '../molecules/cc-error.js';
import './cc-pricing-table.js';
import { fakeString } from '../lib/fake-strings.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';

const SKELETON_NAME = '????????????';
const SKELETON_DESCRIPTION = fakeString(180);

/**
 * A component to display product informations: icon, name, description with items (plans) and features.
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-product.js)
 *
 * ## Type definitions
 *
 * ```js
 * interface Item {
 *   name: string,
 *   price: number, // price in euros for 1 hour
 *   features: Feature[],
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   code: "connection-limit" | "cpu" | "databases" | "disk-size" | "gpu" | "has-logs" | "has-metrics" | "max-db-size" | "memory" | "version",
 *   type: "boolean" | "shared" | "bytes" | "number" | "runtime" | "string",
 *   value?: number|string, // Only required for an item feature
 * }
 * ```
 *
 * ```js
 * interface Currency {
 *   code: string,
 *   changeRate: number, // based on euros
 * }
 * ```
 *
 * ```js
 * interface Product {
 *   name: string,
 *   item: Item,
 * }
 * ```
 *
 * @prop {"add"|"none"} action - Sets the type of action: "add" to display add buttons for each item and "none" for no actions (defaults to "add").
 * @prop {Currency} currency - Sets the currency used to display the prices (defaults to euros).
 * @prop {String} description - Sets the description of the product (can be overriden with the default slot).
 * @prop {Boolean} error - Displays an error message.
 * @prop {Array<Feature>} features - Sets the list of features (used for the feature sort order).
 * @prop {String} icon - Sets the url of the product icon/logo image (can be overriden with the `icon` slot).
 * @prop {Array<Item>} items - Sets the list of items.
 * @prop {String} name - Sets the name of the product (can be overriden with the `name` slot).
 *
 * @event {CustomEvent<Product>} cc-pricing-product:add-product - Fires the product whenever the "plus" button of an item is clicked.
 *
 * @slot - Override the `description` param with custom HTML.
 * @slot head - Override the whole head section (with the icon, name and description).
 * @slot icon - Override the `icon` url param with HTML where you can put multiple `<img>` tags.
 * @slot name - Override the `name` param with custom HTML.
 */
export class CcPricingProduct extends LitElement {

  static get properties () {
    return {
      action: { type: String },
      currency: { type: Object },
      description: { type: String },
      error: { type: Boolean, reflect: true },
      features: { type: Array },
      icon: { type: String },
      items: { type: Array },
      name: { type: String },
    };
  }

  constructor () {
    super();
    this.action = 'add';
    this.icons = [];
    this.features = [];
  }

  _onAddItem ({ detail: item }) {
    const name = this.name;
    dispatchCustomEvent(this, 'add-product', { name, item });
  }

  render () {

    const skeleton = (this.items == null || this.features == null);
    const name = skeleton ? SKELETON_NAME : this.name;
    const description = skeleton ? SKELETON_DESCRIPTION : this.description;

    return html`

      <slot name="head">
        <div class="head">

          <div class="head-info">
            <slot name="icon">
              <cc-img class="product-logo" src="${ifDefined(this.icon)}" ?skeleton="${skeleton}"></cc-img>
            </slot>
            <div class="name">
              <slot name="name">
                <span class="${classMap({ skeleton })}">${name}</span>
              </slot>
            </div>
          </div>

          ${skeleton && !this.error ? html`
            <slot>
              <div>
                <span class="description skeleton">${description}</span>
              </div>
            </slot>
          ` : ''}
          ${!skeleton && !this.error ? html`
            <slot>${description}</slot>
          ` : ''}

        </div>
      </slot>

      ${this.error ? html`
        <cc-error>${i18n('cc-pricing-product.error')}</cc-error>
      ` : ''}
      ${skeleton && !this.error ? html`
        <cc-loader></cc-loader>
      ` : ''}
      ${!skeleton && !this.error ? html`
        <cc-pricing-table
          class="pricing-table"
          .items=${this.items}
          .features=${this.features}
          .currency=${this.currency}
          action=${this.action}
          @cc-pricing-table:add-item=${this._onAddItem}
        ></cc-pricing-table>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      // language=CSS
      skeletonStyles,
      css`
        :host {
          background-color: #ffffff;
          display: block;
        }

        .head {
          display: grid;
          gap: 1em;
          grid-auto-rows: min-content;
          padding: 1em;
        }

        /* We cannot use cc-flex-gap because of a double slot */
        .head-info {
          display: flex;
          flex-wrap: wrap;
          /* reset gap for browsers that support gap for flexbox */
          gap: 0;
          margin: -0.5em;
        }

        .product-logo,
        slot[name="icon"]::slotted(*),
        .name {
          margin: 0.5em;
        }

        .product-logo,
        slot[name=icon]::slotted(*) {
          --cc-img-fit: contain;
          border-radius: 0.25em;
          display: block;
          height: 3em;
          width: 3em;
        }

        .name {
          align-self: center;
          font-size: 1.5em;
          font-weight: bold;
        }

        /* Slotted description */
        .description {
          line-height: 1.5;
        }

        .pricing-table {
          overflow: auto;
        }

        .skeleton {
          background-color: #bbb;
        }

        :host([error]) .skeleton,
        :host([error]) [skeleton] {
          --cc-skeleton-state: paused;
        }

        cc-loader {
          min-height: 20em;
        }

        cc-error {
          padding: 0 1em 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-product', CcPricingProduct);
