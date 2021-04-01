import { css, html, LitElement } from 'lit-element';
import '../atoms/cc-flex-gap.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { sortBy } from '../lib/utils.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';

// TODO: Move to clever-client
export const PENDING_STATUSES = ['PENDING', 'PAYMENTHELD', 'WONTPAY'];
export const PROCESSING_STATUS = 'PROCESSING';
export const PROCESSED_STATUSES = ['PAID', 'CANCELED', 'REFUNDED'];

const SKELETON_INVOICES = [
  // @formatter:off
  { emissionDate: '2020-01-01', number: '????????????', type: 'INVOICE', status: 'PENDING', total: { currency: 'EUR', amount: 10.00 } },
  { emissionDate: '2020-02-01', number: '????????????', type: 'INVOICE', status: 'PENDING', total: { currency: 'EUR', amount: 200.00 } },
  { emissionDate: '2020-03-01', number: '????????????', type: 'INVOICE', status: 'PENDING', total: { currency: 'EUR', amount: 3000.00 } },
  // @formatter:on
];

/**
 * A table component to display a list of invoices.
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/invoices/cc-invoice-table.js)
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
 *   number: String,
 *   paymentUrl: String,
 *   status: InvoiceStatus,
 *   total: Amount,
 *   type: InvoiceType,
 * }
 * ```
 *
 * @prop {Invoice[]} invoices - Sets the list of invoices.
 */
export class CcInvoiceTable extends LitElement {

  static get properties () {
    return {
      invoices: { type: Array },
    };
  }

  render () {

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

    return html`
      <table>
        <tr>
          <th>${i18n('cc-invoice-table.date.emission')}</th>
          <th>${i18n('cc-invoice-table.number')}</th>
          <th class="number">${i18n('cc-invoice-table.total.label')}</th>
          <th></th>
        </tr>
        ${formattedInvoices.map((invoice) => html`
          <tr>
            <td>
              <span class="${classMap({ skeleton })}">${i18n('cc-invoice-table.date.value', { date: invoice.emissionDate })}</span>
            </td>
            <td>
              <span class="${classMap({ skeleton })}">${invoice.number}</span>
            </td>
            <td class="number">
              <span class="${classMap({ skeleton, 'credit-note': (invoice.type === 'CREDITNOTE') })}">
                ${i18n('cc-invoice-table.total.value', { amount: invoice.total.amount })}
              </span>
            </td>
            <td>
              <cc-flex-gap class="actions">
                ${ccLink(invoice.downloadUrl, i18n('cc-invoice-table.open-pdf'), skeleton)}
                ${PENDING_STATUSES.includes(invoice.status) ? html`
                  ${ccLink(invoice.paymentUrl, i18n('cc-invoice-table.pay'), skeleton)}
                ` : ''}
              </cc-flex-gap>
            </td>
          </tr>
        `)}
      </table>
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

        table {
          border-collapse: collapse;
          border-radius: 5px;
          overflow: hidden;
        }

        th,
        td {
          padding: 0.5rem 1rem;
          text-align: left;
        }

        th.number,
        td.number {
          text-align: right;
        }

        th {
          background-color: #eee;
        }

        td {
          background-color: #fafafa;
        }

        tr:not(:last-child) td {
          border-bottom: 1px solid #ddd;
        }

        td.number {
          font-family: monospace;
          font-size: 1rem;
          /* "-ø###,###.##" OR "-### ###,## ø" => 13ch */
          min-width: 13ch;
        }

        tr:hover td {
          background-color: #f5f5f5;
        }

        .credit-note {
          font-style: italic;
        }

        .skeleton {
          background-color: #bbb;
        }

        .actions {
          --cc-gap: 1rem;
          --cc-align-items: center;
        }

        .cc-link {
          white-space: nowrap;
        }
      `,
    ];
  }
}

window.customElements.define('cc-invoice-table', CcInvoiceTable);
