import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-button/cc-button.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import '../cc-toggle/cc-toggle.js';
import { css, html, LitElement } from 'lit';
import { ResizeController } from '../../controllers/resize-controller.js';
import { i18n } from '../../lib/i18n.js';
import { sortBy, unique } from '../../lib/utils.js';
import { PENDING_STATUSES, PROCESSED_STATUSES, PROCESSING_STATUS } from '../cc-invoice-table/cc-invoice-table.js';

const BREAKPOINTS = [520];

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
 * @typedef {import('./cc-invoice-list.types.js').InvoiceListState} InvoiceListState
 */

/**
 * A component to display a list of invoices in paginated categories.
 *
 * @cssdisplay block
 */
export class CcInvoiceList extends LitElement {

  static get properties () {
    return {
      state: { type: Object },
      _yearFilter: { type: Number, state: true },
    };
  }

  constructor () {
    super();

    /** @type {InvoiceListState} Sets the invoices state. */
    this.state = { type: 'loading' };

    /** @type {number|null} */
    this._yearFilter = null;

    new ResizeController(this, {
      widthBreakpoints: BREAKPOINTS,
    });
  }

  _onYearFilterValue ({ detail: year }) {
    this._yearFilter = year;
  }

  render () {
    if (this.state.type === 'error') {
      return this._renderView(html`
        <cc-notice intent="warning" message="${i18n('cc-invoice-list.error')}"></cc-notice>
      `);
    }

    if (this.state.type === 'loading') {
      return this._renderView(html`
        <cc-block-section>
          <div slot="title">${i18n('cc-invoice-list.pending')}</div>
          <cc-invoice-table></cc-invoice-table>
        </cc-block-section>

        <cc-block-section>
          <div slot="title">${i18n('cc-invoice-list.processed')}</div>
          <cc-invoice-table></cc-invoice-table>
        </cc-block-section>
      `);
    }

    const pendingInvoices = this.state.invoices.filter((i) => PENDING_STATUSES.includes(i.status));
    const processingInvoices = this.state.invoices.filter((i) => i.status === PROCESSING_STATUS);
    const processedInvoices = this.state.invoices.filter((i) => PROCESSED_STATUSES.includes(i.status));

    const processedInvoicesYears = processedInvoices
      .map((invoice) => getYearAsString(invoice.emissionDate))
      .flatMap(unique);

    const yearChoices = processedInvoicesYears
      .map((year) => ({ label: year, value: year }))
      .sort(sortBy('label'));

    const yearFilter = (this._yearFilter == null)
      ? maxFromStrings(processedInvoicesYears)
      : this._yearFilter;

    const filteredProcessedInvoices = processedInvoices.filter((i) => getYearAsString(i.emissionDate) === yearFilter);

    const hasYearSelector = filteredProcessedInvoices.length > 0 && yearChoices.length > 1;

    return this._renderView(html`
      <cc-block-section>
        <div slot="title">${i18n('cc-invoice-list.pending')}</div>
        ${pendingInvoices.length > 0 ? html`
          <cc-invoice-table .invoices=${pendingInvoices}></cc-invoice-table>
        ` : ''}
        ${pendingInvoices.length === 0 ? html`
          <div class="empty-msg">${i18n('cc-invoice-list.pending.no-invoices')}</div>
        ` : ''}
      </cc-block-section>

      ${processingInvoices.length > 0 ? html`
        <cc-block-section>
          <div slot="title">${i18n('cc-invoice-list.processing')}</div>
          <cc-invoice-table .invoices=${processingInvoices}></cc-invoice-table>
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
        ${filteredProcessedInvoices.length > 0 ? html`
          <cc-invoice-table .invoices=${filteredProcessedInvoices}></cc-invoice-table>
        ` : ''}
        ${filteredProcessedInvoices.length === 0 ? html`
          <div class="empty-msg ">${i18n('cc-invoice-list.processed.no-invoices')}</div>
        ` : ''}
      </cc-block-section>
    `);
  }

  _renderView (content) {
    return html`
      <cc-block>
        <div slot="title">${i18n('cc-invoice-list.title')}</div>
        ${content}
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

        .empty-msg {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }
      `,
    ];
  }
}

window.customElements.define('cc-invoice-list', CcInvoiceList);
