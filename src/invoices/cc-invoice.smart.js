import './cc-invoice.js';
import '../smart/cc-smart-container.js';
import { fetchInvoice, fetchInvoiceHtml } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-invoice',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    invoiceNumber: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const invoice_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      invoice_lp.error$.subscribe(console.error),
      invoice_lp.error$.subscribe(() => (component.error = true)),
      invoice_lp.value$.subscribe((invoice) => (component.invoice = invoice)),

      context$.subscribe(({ apiConfig, ownerId, invoiceNumber }) => {

        component.error = false;
        component.number = invoiceNumber;
        component.invoice = null;

        if (apiConfig != null && ownerId != null && invoiceNumber != null) {
          invoice_lp.push((signal) => fetchFullInvoice({ apiConfig, signal, ownerId, invoiceNumber }));
        }
      }),

    ]);
  },
});

function fetchFullInvoice ({ apiConfig, signal, ownerId, invoiceNumber }) {
  return Promise
    .all([
      fetchInvoice({ apiConfig, signal, ownerId, invoiceNumber }),
      fetchInvoiceHtml({ apiConfig, signal, ownerId, invoiceNumber }),
    ])
    .then(([invoice, invoiceHtml]) => {
      return { ...invoice, invoiceHtml };
    });
}
