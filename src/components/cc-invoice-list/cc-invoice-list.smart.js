import { fetchAllInvoices } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-invoice-list.js';

/**
 * @import { CcInvoiceList } from './cc-invoice-list.js'
 * @import { Invoice } from '../common.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-invoice-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcInvoiceList>} args
   */
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
