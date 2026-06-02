import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetZoneCommand } from '@clevercloud/client/cc-api-commands/zone/get-zone-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-header.js';

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode="config-provider"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },

  /** @param {OnContextUpdateArgs<CcAddonHeader>} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', {
      type: 'loading',
    });

    ccApiClient
      .send(new GetAddonCommand({ ownerId, addonId }), { signal })
      .then((addon) => {
        return Promise.all([
          addon,
          ccApiClient.send(new GetZoneCommand({ zoneName: addon.zone, ownerId }), { signal }),
        ]);
      })
      .then(([addon, zone]) => {
        updateComponent('state', {
          type: 'loaded',
          providerId: addon.provider.name,
          providerLogoUrl: addon.provider.logoUrl,
          name: addon.name,
          id: addon.realId,
          zone,
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
