import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { CcPostgresqlClient } from '../cc-postgresql-admin/cc-postgresql-admin.client.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-postgresql-notices.js';

/**
 * @import { CcPostgresqlNotices } from './cc-postgresql-notices.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-postgresql-notices',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcPostgresqlNotices>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId } = context;
    const api = new CcPostgresqlClient({ apiConfig, addonId, signal });

    updateComponent('state', { type: 'loading' });

    api
      .getDashboard()
      .then((dashboard) => {
        updateComponent('state', { type: 'loaded', notices: dashboard.notices });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
