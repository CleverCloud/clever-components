import { css, html, LitElement } from 'lit';
import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-img/cc-img.js';
import { classMap } from 'lit/directives/class-map.js';
import { i18n } from '../../lib/i18n.js';
import { sortBy } from '../../lib/utils.js';
import { withResizeObserver } from '../../mixins/with-resize-observer/with-resize-observer.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const fileSvg = new URL('../../assets/file.svg', import.meta.url).href;

// TODO: Move to clever-client
export const PENDING_STATUSES = ['PENDING', 'PAYMENTHELD', 'WONTPAY'];
export const PROCESSING_STATUS = 'PROCESSING';
export const PROCESSED_STATUSES = ['PAID', 'CANCELED', 'REFUNDED'];

/** @type {Invoice[]} */
const SKELETON_INVOICES = [
  // @formatter:off
  { emissionDate: '2020-01-01', number: '????????????', type: 'INVOICE', status: 'PENDING', total: { currency: 'EUR', amount: 10.00 } },
  { emissionDate: '2020-02-01', number: '????????????', type: 'INVOICE', status: 'PENDING', total: { currency: 'EUR', amount: 200.00 } },
  { emissionDate: '2020-03-01', number: '????????????', type: 'INVOICE', status: 'PENDING', total: { currency: 'EUR', amount: 3000.00 } },
  // @formatter:on
];

/**
 * @typedef {import('../common.types.js').Invoice} Invoice
 */

/**
 * A table component to display a list of invoices.
 *
 * @cssdisplay block
 */
export class CcInvoiceTable extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      invoices: { type: Array },
      _width: { type: Number, state: true },
    };
  }

  constructor () {
    super();

    /** @type {Invoice[]|null} Sets the list of invoices. */
    this.invoices = null;

    /** @type {number|null} */
    this._width = null;
  }

  onResize ({ width }) {
    this._width = width;
  }

  render () {

    // NOTE: This value is arbitrary, we don't have a better solution for now
    // It's a bit more than the width of the table in french (which is the largest) and with both links (download and pay)
    // The table width is mostly stable since the with of the amount is fixed and the rest is almost always the same number of characters
    const bigMode = (this._width > 700);

    const skeleton = (this.invoices == null);
    const invoices = skeleton ? SKELETON_INVOICES : this.invoices;
    const formattedInvoices = invoices
      .map((invoice) => {
        const sign = (invoice.type === 'CREDITNOTE') ? -1 : 1;
        return {
          ...invoice,
          total: {
            ...invoice.total,
            amount: invoice.total.amount * sign,
          },
        };
      })
      .sort(sortBy('emissionDate', true));

    return bigMode
      ? this._renderBig(skeleton, formattedInvoices)
      : this._renderSmall(skeleton, formattedInvoices);
  }

  _renderBig (skeleton, invoiceList) {
    return html`
      <table>
        <tr>
          <th>${i18n('cc-invoice-table.date.emission')}</th>
          <th>${i18n('cc-invoice-table.number')}</th>
          <th class="number">${i18n('cc-invoice-table.total.label')}</th>
          <th></th>
        </tr>
        ${invoiceList.map((invoice) => html`
          <tr>
            <td>
              <span class="${classMap({ skeleton })}">${i18n('cc-invoice-table.date.value', { date: invoice.emissionDate })}</span>
            </td>
            <td>
              <span class="${classMap({ skeleton })}">${invoice.number}</span>
            </td>
            <td class="number">
              <code class="${classMap({ skeleton, 'credit-note': (invoice.type === 'CREDITNOTE') })}">
                ${i18n('cc-invoice-table.total.value', { amount: invoice.total.amount })}
              </code>
            </td>
            <td>
              ${this._renderLinks(skeleton, invoice)}
            </td>
          </tr>
        `)}
      </table>
    `;
  }

  _renderSmall (skeleton, invoiceList) {
    return html`
      <div class="invoice-list">
        ${invoiceList.map((invoice) => html`
          <div class="invoice">
            <cc-img class="invoice-icon" src=${fileSvg}></cc-img>
            <div class="invoice-text ${classMap({ skeleton })}">
              ${i18n('cc-invoice-table.text', {
                number: invoice.number,
                date: invoice.emissionDate,
                amount: invoice.total.amount,
              })}
              <br>
              ${this._renderLinks(skeleton, invoice)}
            </div>
          </div>
        `)}
      </div>
    `;
  }

  _renderLinks (skeleton, invoice) {
    return html`
      <cc-flex-gap class="links">
        ${ccLink(invoice.downloadUrl, i18n('cc-invoice-table.open-pdf'), skeleton)}
        ${PENDING_STATUSES.includes(invoice.status) ? html`
          ${ccLink(invoice.paymentUrl, i18n('cc-invoice-table.pay'), skeleton)}
        ` : ''}
      </cc-flex-gap>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        /* region COMMON */
        /* we should use a class (something like "number-value") but it's not possible right now in i18n */

        code {
          font-family: var(--cc-ff-monospace, monospace);
        }

        .credit-note {
          font-style: italic;
        }

        .cc-link {
          white-space: nowrap;
        }

        .links {
          --cc-gap: 1em;
          --cc-align-items: center;
        }

        /* endregion */

        /* region SMALL */

        .invoice-list {
          display: grid;
          gap: 1.5em;
        }

        .invoice {
          display: flex;
          line-height: 1.5em;
        }

        .invoice-icon,
        .invoice-text {
          margin-right: 0.5em;
        }

        .invoice-icon {
          width: 1.5em;
          height: 1.5em;
          flex: 0 0 auto;
        }

        .invoice-text {
          color: var(--cc-color-text-weak);
        }

        .invoice-text code,
        .invoice-text strong {
          color: var(--cc-color-text-strongest);
          font-weight: bold;
          white-space: nowrap;
        }

        .invoice-list .skeleton code,
        .invoice-list .skeleton strong {
          background-color: #bbb;
          color: transparent;
        }
        /* endregion */

        /* region BIG */

        table {
          overflow: hidden;
          border-collapse: collapse;
          border-radius: 5px;
        }

        th,
        td {
          padding: 0.5em 1em;
          text-align: left;
        }

        th {
          background-color: var(--cc-color-bg-neutral-alt, #eee);
          color: var(--cc-color-text-strongest);
        }

        td {
          background-color: var(--cc-color-bg-neutral);
          color: var(--cc-color-text-normal);
        }

        tr:not(:last-child) td {
          border-bottom: 1px solid #ddd;
        }

        /* applied on th and td */

        .number {
          text-align: right;
        }

        td.number {
          /* "-ø###,###.##" OR "-### ###,## ø" => 13ch */
          min-width: 13ch;
        }

        tr:hover td {
          background-color: var(--cc-color-bg-neutral-hovered, #f9f9f9);
        }

        table .skeleton {
          background-color: #bbb;
        }

        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-invoice-table', CcInvoiceTable);
