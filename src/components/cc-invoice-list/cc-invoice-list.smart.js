import './cc-invoice-list.js';
import '../cc-smart-container/cc-smart-container.js';
import { fetchAllInvoices } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';

defineSmartComponent({
  selector: 'cc-invoice-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  onContextUpdate ({ context, updateComponent, signal }) {

    updateComponent('state', { type: 'loading' });

    const { apiConfig, ownerId } = context;

    fetchAllInvoices({ apiConfig, ownerId, signal })
      .then((invoices) => {
        updateComponent('state', { type: 'loaded', invoices });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
