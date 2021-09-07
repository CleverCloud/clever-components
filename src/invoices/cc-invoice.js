import { css, html, LitElement } from 'lit-element';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import '../atoms/cc-html-frame.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';

const fileSvg = new URL('../assets/file.svg', import.meta.url).href;

const SKELETON_INVOICE = {
  emissionDate: '2020-01-01',
  number: '????????????',
  type: 'INVOICE',
  status: 'PENDING',
  total: { currency: 'EUR', amount: 10.00 },
};

/**
 * A block component to display an HTML invoice.
 *
 * ## Type definitions
 *
 * ```js
 * interface Amount {
 *   amount: Number,
 *   currency: String,
 * }
 * ```
 *
 * ```js
 * type InvoiceStatus = "PENDING" | "PROCESSING" | "PAID" | "PAYMENTHELD" | "CANCELED" | "REFUNDED" | "WONTPAY"
 * ```
 *
 * ```js
 * type InvoiceType = "INVOICE" | "CREDITNOTE"
 * ```
 *
 * ```js
 * interface Invoice {
 *   downloadUrl: String,
 *   emissionDate: String,
 *   invoiceHtml: String,
 *   number: String,
 *   paymentUrl: String,
 *   status: InvoiceStatus,
 *   total: Amount,
 *   type: InvoiceType,
 * }
 * ```
 *
 * @cssdisplay block
 *
 * @prop {Boolean} error - Sets a loading error state.
 * @prop {Invoice} invoice - Sets the invoice.
 * @prop {String} number - Sets the invoice number.
 */
export class CcInvoice extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean },
      invoice: { type: Object },
      number: { type: String },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  render () {

    const skeleton = (this.invoice == null);
    const invoice = skeleton ? SKELETON_INVOICE : this.invoice;

    const number = this.number ?? SKELETON_INVOICE.number;
    const date = invoice.emissionDate;
    const amount = invoice.total.amount;

    return html`
      <cc-block icon=${fileSvg} class=${classMap({ 'has-errors': this.error })}>
        <div slot="title">${i18n('cc-invoice.title')} ${number}</div>
        ${!this.error ? html`
          <div slot="button">${ccLink(invoice.downloadUrl, i18n('cc-invoice.download-pdf'), skeleton)}</div>
          <div class="info"><em class=${classMap({ skeleton })}>${i18n('cc-invoice.info', { date, amount })}</em></div>
          <cc-html-frame class="frame" ?loading="${skeleton}">
            ${!skeleton ? html`
              <template>${unsafeHTML(this.invoice.invoiceHtml)}</template>
            ` : ''}
          </cc-html-frame>
        ` : ''}
        ${this.error ? html`
          <cc-error>${i18n('cc-invoice.error')}</cc-error>
        ` : ''}
      </cc-block>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        [slot="button"] {
          align-self: start;
          margin-left: 1rem;
        }

        .has-errors {
          --cc-skeleton-state: paused;
        }

        .skeleton {
          background-color: #bbb;
        }
        
        .info,
        .frame {
          justify-self: center;
        }

        .frame {
          /* height and max-width are roughly set to have a standard letter / A4 paper ratio */
          box-shadow: 0 0 0.5rem #ccc;
          height: 31cm;
          max-width: 22cm;
          width: 100%;
        }
      `,
    ];
  }
}

window.customElements.define('cc-invoice', CcInvoice);
