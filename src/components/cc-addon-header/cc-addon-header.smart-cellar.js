import { fakeString } from '../../lib/fake-strings.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonHeaderClient } from './cc-addon-header.client.js';
import './cc-addon-header.js';

const PROVIDER_ID = 'cellar-addon';

/**
 * @typedef {import('./cc-addon-header.js').CcAddonHeader} CcAddonHeader
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonHeader>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode="cellar"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    explorerUrlPattern: { type: String },
  },

  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;
    const api = new CcAddonHeaderClient({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
    let explorerUrl = '';

    updateComponent('state', {
      type: 'loading',
      logsUrl: fakeString(15),
      openLinks: [
        {
          url: fakeString(15),
          name: fakeString(5),
        },
      ],
    });

    api
      .getAddonWithZone()
      .then(({ rawAddon, zone }) => {
        // TODO: Cellar Explorer link
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
              name: 'CELLAR EXPLORER',
              url: explorerUrl,
            },
          ],
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
