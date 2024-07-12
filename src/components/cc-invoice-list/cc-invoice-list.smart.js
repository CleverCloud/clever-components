import { fetchAllInvoices } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-invoice-list.js';

/**
 * @typedef {import('../common.types.js').Invoice} Invoice
 */

defineSmartComponent({
  selector: 'cc-invoice-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  onContextUpdate({ context, updateComponent, signal }) {
    updateComponent('state', { type: 'loading' });

    const { apiConfig, ownerId } = context;

    fetchAllInvoices({ apiConfig, ownerId, signal })
      .then(
        /** @param {Invoice[]} invoices */
        (invoices) => {
          updateComponent('state', { type: 'loaded', invoices });
        },
      )
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
