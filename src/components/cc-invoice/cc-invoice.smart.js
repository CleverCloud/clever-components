import { fetchInvoice, fetchInvoiceHtml } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-invoice.js';

/**
 * @typedef {import('./cc-invoice.js').CcInvoice} CcInvoice
 * @typedef {import('../common.types.js').Invoice} Invoice
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart-component.types.js').OnContextUpdateArgs<CcInvoice>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-invoice',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    invoiceNumber: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, invoiceNumber } = context;

    updateComponent('state', { type: 'loading', number: invoiceNumber });

    fetchFullInvoice({ apiConfig, signal, ownerId, invoiceNumber })
      .then((invoice) => {
        updateComponent('state', {
          type: 'loaded',
          number: invoiceNumber,
          downloadUrl: invoice.downloadUrl,
          emissionDate: invoice.emissionDate,
          amount: invoice.total.amount,
          currency: invoice.total.currency,
          invoiceHtml: invoice.invoiceHtml,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error', number: invoiceNumber });
      });
  },
});

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.invoiceNumber
 * @returns {Promise<Invoice>}
 */
function fetchFullInvoice({ apiConfig, signal, ownerId, invoiceNumber }) {
  return Promise.all([
    fetchInvoice({ apiConfig, signal, ownerId, invoiceNumber }),
    fetchInvoiceHtml({ apiConfig, signal, ownerId, invoiceNumber }),
  ]).then(([invoice, invoiceHtml]) => {
    return { ...invoice, invoiceHtml };
  });
}
