import { css, html, LitElement } from 'lit-element';
import '../atoms/cc-button.js';
import '../atoms/cc-toggle.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import '../molecules/cc-block-section.js';
import { i18n } from '../lib/i18n.js';
import { sortBy, unique } from '../lib/utils.js';
import { PENDING_STATUSES, PROCESSED_STATUSES, PROCESSING_STATUS } from './cc-invoice-table.js';

function getYearAsString (dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  return String(year);
}

function maxFromStrings (strings) {
  const numbers = strings.map((s) => Number(s));
  const max = Math.max(...numbers);
  return String(max);
}

/**
 * A component to display a list of invoices in paginated categories.
 *
 * @typedef {import('./types.js').Invoice} Invoice
 *
 * @cssdisplay block
 */
export class CcInvoiceList extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean },
      invoices: { type: Array },
      _yearFilter: { type: Number },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Sets a loading error state. */
    this.error = false;

    /** @type {Invoice[]|null} Sets the list of invoices. */
    this.invoices = null;

    /** @type {number|null} */
    this._yearFilter = null;
  }

  _onYearFilterValue ({ detail: year }) {
    this._yearFilter = year;
  }

  render () {

    const skeleton = (this.invoices == null);

    const pendingInvoices = skeleton ? [] : this.invoices.filter((i) => PENDING_STATUSES.includes(i.status));
    const processingInvoices = skeleton ? [] : this.invoices.filter((i) => i.status === PROCESSING_STATUS);
    const processedInvoices = skeleton ? [] : this.invoices.filter((i) => PROCESSED_STATUSES.includes(i.status));

    const processedInvoicesYears = processedInvoices
      .map((invoice) => getYearAsString(invoice.emissionDate))
      .reduce(...unique)
      .map((year) => String(year));

    const yearChoices = processedInvoicesYears
      .map((year) => ({ label: year, value: year }))
      .sort(sortBy('label'));

    const yearFilter = (this._yearFilter == null)
      ? maxFromStrings(processedInvoicesYears)
      : this._yearFilter;

    const filteredProcessedInvoices = processedInvoices.filter((i) => getYearAsString(i.emissionDate) === yearFilter);

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-invoice-list.title')}</div>

        ${!this.error ? html`

          <cc-block-section>
            <div slot="title">${i18n('cc-invoice-list.pending')}</div>
            ${skeleton || pendingInvoices.length > 0 ? html`
              <cc-invoice-table .invoices=${skeleton ? null : pendingInvoices}></cc-invoice-table>
            ` : ''}
            ${!skeleton && pendingInvoices.length === 0 ? html`
              <em>${i18n('cc-invoice-list.pending.no-invoices')}</em>
            ` : ''}
          </cc-block-section>

          ${!skeleton && processingInvoices.length > 0 ? html`
            <cc-block-section>
              <div slot="title">${i18n('cc-invoice-list.processing')}</div>
              <cc-invoice-table .invoices=${skeleton ? null : processingInvoices}></cc-invoice-table>
            </cc-block-section>
          ` : ''}

          <cc-block-section>
            <div slot="title">${i18n('cc-invoice-list.processed')}</div>
            ${!skeleton && filteredProcessedInvoices.length > 0 && yearChoices.length > 1 ? html`
              <cc-toggle
                legend=${i18n('cc-invoice-list.year')}
                .choices=${yearChoices}
                value=${yearFilter}
                @cc-toggle:input=${this._onYearFilterValue}
              ></cc-toggle>
            ` : ''}
            ${skeleton || filteredProcessedInvoices.length > 0 ? html`
              <cc-invoice-table .invoices=${skeleton ? null : filteredProcessedInvoices}></cc-invoice-table>
            ` : ''}
            ${!skeleton && filteredProcessedInvoices.length === 0 ? html`
              <em>${i18n('cc-invoice-list.processed.no-invoices')}</em>
            ` : ''}
          </cc-block-section>

        ` : ''}

        ${this.error ? html`
          <cc-error>${i18n('cc-invoice-list.error')}</cc-error>
        ` : ''}
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

        cc-toggle {
          justify-self: start;
        }
      `,
    ];
  }
}

window.customElements.define('cc-invoice-list', CcInvoiceList);
