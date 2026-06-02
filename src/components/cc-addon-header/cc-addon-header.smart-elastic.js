import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetElasticsearchInfoCommand } from '@clevercloud/client/cc-api-commands/elasticsearch/get-elasticsearch-info-command.js';
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
  selector: 'cc-addon-header[smart-mode="elastic"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    logsUrlPattern: { type: String },
  },

  /** @param {OnContextUpdateArgs<CcAddonHeader>} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);
    let logsUrl = '';

    updateComponent('state', {
      type: 'loading',
      logsUrl: fakeString(15),
      openLinks: [
        {
          url: fakeString(15),
          name: fakeString(5),
        },
        {
          url: fakeString(15),
          name: fakeString(5),
        },
      ],
    });

    ccApiClient
      .send(new GetAddonCommand({ ownerId, addonId }), { signal })
      .then((addon) => {
        return Promise.all([
          addon,
          ccApiClient.send(new GetElasticsearchInfoCommand({ addonId }), { signal }),
          ccApiClient.send(new GetZoneCommand({ zoneName: addon.zone, ownerId }), { signal }),
        ]);
      })
      .then(([addon, esInfo, zone]) => {
        logsUrl = context.logsUrlPattern.replace(':id', addon.id);

        const openLinks = [];
        const apmService = esInfo.services.find((service) => service.name === 'apm');
        if (apmService?.enabled && esInfo.config.host != null) {
          const apmUrl = `https://kibana-${esInfo.config.host}/app/apm`;
          openLinks.push({
            name: 'APM',
            url: apmUrl,
          });
        }
        const kibanaService = esInfo.services.find((service) => service.name === 'kibana');
        if (kibanaService?.enabled && esInfo.config.host != null) {
          const kibanaUrl = `https://kibana-${esInfo.config.host}/`;
          openLinks.push({
            name: 'KIBANA',
            url: kibanaUrl,
          });
        }

        updateComponent('state', {
          type: 'loaded',
          providerId: addon.provider.name,
          providerLogoUrl: addon.provider.logoUrl,
          name: addon.name,
          id: addon.realId,
          zone,
          logsUrl,
          openLinks,
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
