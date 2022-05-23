import './cc-invoice-list.js';
import '../smart/cc-smart-container.js';
import { fetchAllInvoices } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-invoice-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const invoices_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      invoices_lp.error$.subscribe(console.error),
      invoices_lp.error$.subscribe(() => (component.error = true)),
      invoices_lp.value$.subscribe((invoices) => (component.invoices = invoices)),

      context$.subscribe(({ apiConfig, ownerId }) => {

        component.eror = null;
        component.invoices = null;

        if (apiConfig != null && ownerId != null) {
          invoices_lp.push((signal) => fetchAllInvoices({ apiConfig, signal, ownerId }));
        }
      }),

    ]);
  },
});
