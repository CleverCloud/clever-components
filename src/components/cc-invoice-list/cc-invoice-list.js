import { css, html, LitElement } from 'lit-element';
import '../cc-button/cc-button.js';
import '../cc-select/cc-select.js';
import '../cc-toggle/cc-toggle.js';
import '../cc-block/cc-block.js';
import { i18n } from '../../lib/i18n.js';
import '../cc-error/cc-error.js';
import '../cc-block-section/cc-block-section.js';
import { sortBy, unique } from '../../lib/utils.js';
import { withResizeObserver } from '../../mixins/with-resize-observer/with-resize-observer.js';
import { PENDING_STATUSES, PROCESSED_STATUSES, PROCESSING_STATUS } from '../cc-invoice-table/cc-invoice-table.js';

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
 * @typedef {import('./cc-invoice-list.types.d.ts').Invoice} Invoice
 */

/**
 * A component to display a list of invoices in paginated categories.
 *
 * @cssdisplay block
 */
export class CcInvoiceList extends withResizeObserver(LitElement) {

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

    /** @protected */
    this.breakpoints = {
      // used to switch between cc-toggle (> 520) and cc-select (<= 520)
      width: [520],
    };
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

    const hasYearSelector = !skeleton && filteredProcessedInvoices.length > 0 && yearChoices.length > 1;

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
            ${hasYearSelector ? html`
                <cc-toggle
                  legend=${i18n('cc-invoice-list.year')}
                  .choices=${yearChoices}
                  value=${yearFilter}
                  inline
                  @cc-toggle:input=${this._onYearFilterValue}
                ></cc-toggle>
                <cc-select
                  label=${i18n('cc-invoice-list.year')}
                  .options=${yearChoices}
                  value=${yearFilter}
                  inline
                  @cc-select:input=${this._onYearFilterValue}
                ></cc-select>
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

        :host([w-lt-520]) cc-toggle {
          display: none;
        }
        
        :host([w-gte-520]) cc-select {
          display: none;
        }

        cc-select {
          width: max-content;
        }
      `,
    ];
  }
}

window.customElements.define('cc-invoice-list', CcInvoiceList);
