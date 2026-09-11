import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetCellarInfoCommand } from '@clevercloud/client/cc-api-commands/cellar/get-cellar-info-command.js';
import { GetZoneCommand } from '@clevercloud/client/cc-api-commands/zone/get-zone-command.js';
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
  selector: 'cc-addon-header[smart-mode="cellar"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    explorerUrlPattern: { type: String, optional: true },
  },

  /** @param {OnContextUpdateArgs<CcAddonHeader>} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, explorerUrlPattern } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', {
      type: 'loading',
      ...(explorerUrlPattern != null && {
        openLinks: [
          {
            url: fakeString(15),
            name: fakeString(5),
          },
        ],
      }),
    });

    ccApiClient
      .send(new GetAddonCommand({ ownerId, addonId }), { signal })
      .then((addon) => {
        return Promise.all([
          addon,
          ccApiClient.send(new GetCellarInfoCommand({ ownerId, addonId }), { signal }),
          ccApiClient.send(new GetZoneCommand({ zoneName: addon.zone, ownerId }), { signal }),
        ]);
      })
      .then(([addon, cellarInfo, zone]) => {
        updateComponent('state', {
          type: 'loaded',
          providerId: addon.provider.name,
          providerLogoUrl: addon.provider.logoUrl,
          name: cellarInfo.name,
          id: cellarInfo.id,
          zone,
          ...(explorerUrlPattern != null && {
            openLinks: [
              {
                name: 'CELLAR EXPLORER',
                url: explorerUrlPattern.replace(':id', addonId),
              },
            ],
          }),
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
