import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonHeaderClient } from './cc-addon-header.client.js';
import './cc-addon-header.js';

const PROVIDER_ID = 'postgresql-addon';

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode="postgresql"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    productStatus: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonHeader>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, productStatus } = context;
    const api = new CcAddonHeaderClient({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });

    updateComponent('state', { type: 'loading', productStatus });

    api
      .getAddonWithZone()
      .then(({ rawAddon, zone }) => {
        updateComponent('state', {
          type: 'loaded',
          providerId: rawAddon.provider.name,
          providerLogoUrl: rawAddon.provider.logoUrl,
          name: rawAddon.name,
          id: rawAddon.realId,
          zone,
          productStatus,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
