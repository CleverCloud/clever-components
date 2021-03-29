import './cc-invoice.js';
import '../smart/cc-smart-container.js';
import { fetchInvoice, fetchInvoiceHtml } from '../lib/api-helpers.js';
import { combineLatest, LastPromise, map, merge, unsubscribeWithSignal } from '../lib/observables.js';
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
    const invoiceHtml_lp = new LastPromise();

    const error$ = merge(invoice_lp.error$, invoiceHtml_lp.error$);
    const invoice$ = combineLatest(invoice_lp.value$, invoiceHtml_lp.value$)
      .pipe(map(([invoice, invoiceHtml]) => ({ ...invoice, invoiceHtml })));

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe(console.error),
      error$.subscribe(() => (component.error = true)),
      invoice$.subscribe((invoice) => (component.invoice = invoice)),

      context$.subscribe(({ apiConfig, ownerId, invoiceNumber }) => {
        if (apiConfig != null && ownerId != null && invoiceNumber != null) {

          component.number = invoiceNumber;
          component.invoice = null;

          invoice_lp.push((signal) => fetchInvoice({ apiConfig, signal, ownerId, invoiceNumber }));
          invoiceHtml_lp.push((signal) => fetchInvoiceHtml({ apiConfig, signal, ownerId, invoiceNumber }));
        }
      }),

    ]);
  },
});
