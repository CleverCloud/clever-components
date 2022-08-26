import { css, html, LitElement } from 'lit';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import '../cc-html-frame/cc-html-frame.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const fileSvg = new URL('../../assets/file.svg', import.meta.url).href;

/** @type {Invoice} */
const SKELETON_INVOICE = {
  emissionDate: '2020-01-01',
  number: '????????????',
  type: 'INVOICE',
  status: 'PENDING',
  total: { currency: 'EUR', amount: 10.00 },
};

/**
 * @typedef {import('./cc-invoice.types.js').Amount} Amount
 * @typedef {import('./cc-invoice.types.js').Invoice} Invoice
 */

/**
 * A block component to display an HTML invoice.
 *
 * @cssdisplay block
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

    /** @type {boolean} Sets a loading error state. */
    this.error = false;

    /** @type {Invoice|null} Sets the invoice. */
    this.invoice = null;

    /** @type {string|null} Sets the invoice number. */
    this.number = null;
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
          margin-left: 1em;
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
          box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.4);
          height: 31cm;
          max-width: 22cm;
          width: 100%;
        }
      `,
    ];
  }
}

window.customElements.define('cc-invoice', CcInvoice);
