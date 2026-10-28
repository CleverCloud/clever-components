import { unlessAborted } from '../../lib/abortable.js';
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
    invoicePdfUrlPattern: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcInvoiceList>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    updateComponent('state', { type: 'loading' });

    const { apiConfig, ownerId, invoicePdfUrlPattern } = context;

    fetchAllInvoices({ apiConfig, ownerId, signal })
      .then(
        /** @param {Invoice[]} invoices */
        (invoices) => {
          // Without a pattern, invoices have no PDF link
          const invoicesWithPdfUrl =
            invoicePdfUrlPattern != null
              ? invoices.map((invoice) => ({
                  ...invoice,
                  downloadUrl: invoicePdfUrlPattern.replace(':id', invoice.number),
                }))
              : invoices;
          updateComponent('state', { type: 'loaded', invoices: invoicesWithPdfUrl });
        },
      )
      .catch((error) =>
        unlessAborted(signal, error, () => {
          console.error(error);
          updateComponent('state', { type: 'error' });
        }),
      );
  },
});
