import { fetchInvoice, fetchInvoiceHtml } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-invoice.js';

defineSmartComponent({
  selector: 'cc-invoice',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    invoiceNumber: { type: String },
  },
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
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
          invoiceHtml: invoice.invoiceHtml,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error', number: invoiceNumber });
      });
  },
});

function fetchFullInvoice({ apiConfig, signal, ownerId, invoiceNumber }) {
  return Promise.all([
    fetchInvoice({ apiConfig, signal, ownerId, invoiceNumber }),
    fetchInvoiceHtml({ apiConfig, signal, ownerId, invoiceNumber }),
  ]).then(([invoice, invoiceHtml]) => {
    return { ...invoice, invoiceHtml };
  });
}
