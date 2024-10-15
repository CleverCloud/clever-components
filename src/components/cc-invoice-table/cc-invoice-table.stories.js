import {
  createInvoice,
  pendingInvoices,
  processedInvoices,
  processingInvoices,
} from '../../stories/fixtures/invoices.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-invoice-table.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Invoices/<cc-invoice-table>',
  component: 'cc-invoice-table',
  excludeStories: ['pendingInvoices', 'processingInvoices', 'processedInvoices'],
};

const conf = {
  component: 'cc-invoice-table',
};

/**
 * @typedef {import('./cc-invoice-table.types.js').InvoiceTableStateLoaded} InvoiceTableStateLoaded
 * @typedef {import('./cc-invoice-table.types.js').InvoiceTableStateLoading} InvoiceTableStateLoading
 */

export const defaultStory = makeStory(conf, {
  /** @type {{ state: InvoiceTableStateLoaded }[] } */
  items: [
    { state: { type: 'loaded', invoices: pendingInvoices('2020').slice(0, 4) } },
    { state: { type: 'loaded', invoices: processingInvoices('2020').slice(0, 4) } },
    { state: { type: 'loaded', invoices: processedInvoices('2019').slice(0, 4) } },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {InvoiceTableStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

export const dataLoadedWithPending = makeStory(conf, {
  /** @type {{ state: InvoiceTableStateLoaded }[] } */
  items: [{ state: { type: 'loaded', invoices: pendingInvoices('2020') } }],
});

export const dataLoadedWithProcessing = makeStory(conf, {
  /** @type {{ state: InvoiceTableStateLoaded }[] } */
  items: [{ state: { type: 'loaded', invoices: processingInvoices('2020') } }],
});

export const dataLoadedWithProcessed = makeStory(conf, {
  /** @type {{ state: InvoiceTableStateLoaded }[] } */
  items: [{ state: { type: 'loaded', invoices: processedInvoices('2019') } }],
});

export const dataLoadedWithCreditNotes = makeStory(conf, {
  /** @type {{ state: InvoiceTableStateLoaded }[] } */
  items: [
    {
      state: {
        type: 'loaded',
        invoices: [
          ...processedInvoices('2019'),
          createInvoice('2019', '09', 88.27, 'PAID', 'CREDITNOTE'),
          createInvoice('2019', '04', 121.22, 'PAID', 'CREDITNOTE'),
        ],
      },
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  /** @type {{ state: InvoiceTableStateLoaded }[] } */
  items: [
    {
      state: {
        type: 'loaded',
        invoices: [
          ...processedInvoices('2019').map((invoice) => ({
            ...invoice,
            total: { ...invoice.total, currency: 'USD' },
          })),
        ],
      },
    },
  ],
});
