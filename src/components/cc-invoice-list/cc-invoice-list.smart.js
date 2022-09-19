import './cc-invoice-list.js';
import '../cc-smart-container/cc-smart-container.js';
import { fetchAllInvoices } from '../../lib/api-helpers.js';
import { defineSmartComponentWithObservables } from '../../lib/define-smart-component-with-observables.js';
import { LastPromise, unsubscribeWithSignal } from '../../lib/observables.js';

defineSmartComponentWithObservables({
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
