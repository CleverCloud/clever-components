import '../../src/invoices/cc-invoice-table.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

function createInvoice (year, month, amount, status, type = 'INVOICE') {
  const emissionDate = `${year}-${month}-01`;
  const number = `${year + month}01-${String((Math.ceil(amount * 100)) % 1000).padStart(4, '0')}`;
  const downloadUrl = '/download/' + number;
  const paymentUrl = '/pay/' + number;
  return { emissionDate, number, type, status, total: { currency: 'EUR', amount }, downloadUrl, paymentUrl };
}

export const pendingInvoices = (year) => [
  createInvoice(year, '01', 17.79, 'WONTPAY'),
  createInvoice(year, '02', 29.24, 'PENDING'),
  createInvoice(year, '03', 73.34, 'PENDING'),
  createInvoice(year, '04', 71.96, 'PENDING'),
  createInvoice(year, '05', 662.95, 'PENDING'),
  createInvoice(year, '06', 100.42, 'PENDING'),
  createInvoice(year, '07', 1894.88, 'PENDING'),
  createInvoice(year, '08', 111971.46, 'PENDING'),
  createInvoice(year, '09', 99.14, 'PENDING'),
  createInvoice(year, '10', 2261.81, 'PAYMENTHELD'),
  createInvoice(year, '11', 6218.31, 'PENDING'),
  createInvoice(year, '12', 11487.02, 'PENDING'),
];

export const processingInvoices = (year) => [
  createInvoice(year, '11', 172.79, 'PROCESSING'),
  createInvoice(year, '12', 2287.02, 'PROCESSING'),
];

export const processedInvoices = (year) => [
  createInvoice(year, '01', 1782.79, 'PAID'),
  createInvoice(year, '02', 1129.24, 'PAID'),
  createInvoice(year, '03', 4273.34, 'PAID'),
  createInvoice(year, '04', 2171.96, 'CANCELED'),
  createInvoice(year, '05', 3662.95, 'PAID'),
  createInvoice(year, '06', 100.42, 'PAID'),
  createInvoice(year, '07', 1894.88, 'PAID'),
  createInvoice(year, '08', 1971.46, 'REFUNDED'),
  createInvoice(year, '09', 1699.14, 'PAID'),
  createInvoice(year, '10', 2261.81, 'CANCELED'),
  createInvoice(year, '11', 618.31, 'PAID'),
  createInvoice(year, '12', 1487.02, 'PAID'),
];

export default {
  title: '🛠 Invoices/<cc-invoice-table>',
  component: 'cc-invoice-table',
  excludeStories: ['pendingInvoices', 'processingInvoices', 'processedInvoices'],
};

const conf = {
  component: 'cc-invoice-table',
  // language=CSS
  css: `cc-invoice-table {
    margin-bottom: 1rem;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [
    { invoices: pendingInvoices(2020).slice(0, 4) },
    { invoices: processingInvoices(2020).slice(0, 4) },
    { invoices: processedInvoices(2019).slice(0, 4) },
  ],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const dataLoadedWithPending = makeStory(conf, {
  items: [{ invoices: pendingInvoices(2020) }],
});

export const dataLoadedWithProcessing = makeStory(conf, {
  items: [{ invoices: processingInvoices(2020) }],
});

export const dataLoadedWithProcessed = makeStory(conf, {
  items: [{ invoices: processedInvoices(2019) }],
});

export const dataLoadedWithCreditNotes = makeStory(conf, {
  items: [{
    invoices: [
      ...processedInvoices(2019),
      createInvoice('2019', '09', 88.27, 'PAID', 'CREDITNOTE'),
      createInvoice('2019', '04', 121.22, 'PAID', 'CREDITNOTE'),
    ],
  }],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  dataLoadedWithPending,
  dataLoadedWithProcessing,
  dataLoadedWithProcessed,
  dataLoadedWithCreditNotes,
});
