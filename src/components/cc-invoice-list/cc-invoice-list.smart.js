import { fetchAllInvoices } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-invoice-list.js';

/**
 * @typedef {import('./cc-invoice-list.js').CcInvoiceList} CcInvoiceList
 * @typedef {import('../common.types.js').Invoice} Invoice
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-invoice-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  /**
   * @param {Object} settings
   * @param {CcInvoiceList} settings.component
   * @param {{apiConfig: ApiConfig, ownerId: string }} settings.context
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   * @param {function} settings.updateComponent
   * @param {AbortSignal} settings.signal
   */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is type with generics
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
