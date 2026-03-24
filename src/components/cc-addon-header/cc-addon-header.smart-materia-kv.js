import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetZoneCommand } from '@clevercloud/client/cc-api-commands/zone/get-zone-command.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { fakeString } from '../../lib/fake-strings.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-header.js';

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
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

  /** @param {OnContextUpdateArgs<CcAddonHeader>} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, productStatus } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

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

    ccApiClient
      .send(new GetAddonCommand({ ownerId, addonId }), { signal, dedupe: true, cache: { ttl: ONE_SECOND } })
      .then((addon) => {
        return Promise.all([
          addon,
          ccApiClient.send(new GetZoneCommand({ zoneName: addon.zone, ownerId }), { signal }),
        ]);
      })
      .then(([addon, zone]) => {
        const explorerUrl = context.explorerUrlPattern.replace(':id', addonId);

        updateComponent('state', {
          type: 'loaded',
          providerId: addon.provider.name,
          providerLogoUrl: addon.provider.logoUrl,
          name: addon.name,
          id: addon.realId,
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
