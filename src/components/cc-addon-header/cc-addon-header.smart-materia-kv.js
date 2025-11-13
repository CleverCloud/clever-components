import { fakeString } from '../../lib/fake-strings.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonHeaderClient } from './cc-addon-header.client.js';
import './cc-addon-header.js';

const PROVIDER_ID = 'kv';

/**
 * @typedef {import('./cc-addon-header.js').CcAddonHeader} CcAddonHeader
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonHeader>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode="materia-kv"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    explorerUrlPattern: { type: String },
    productStatus: { type: String, optional: true },
  },

  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, productStatus } = context;
    const api = new CcAddonHeaderClient({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
    let explorerUrl = '';

    updateComponent('state', {
      type: 'loading',
      openLinks: [
        {
          url: fakeString(15),
          name: fakeString(5),
        },
      ],
      productStatus: fakeString(4),
    });

    api
      .getAddonWithZone()
      .then(({ rawAddon, zone }) => {
        explorerUrl = context.explorerUrlPattern.replace(':id', addonId);

        updateComponent('state', {
          type: 'loaded',
          providerId: rawAddon.provider.name,
          providerLogoUrl: rawAddon.provider.logoUrl,
          name: rawAddon.name,
          id: rawAddon.realId,
          zone,
          openLinks: [
            {
              name: 'KV EXPLORER',
              url: explorerUrl,
            },
          ],
          productStatus,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });
  },
});
