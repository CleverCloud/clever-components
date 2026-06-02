import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetJenkinsInfoCommand } from '@clevercloud/client/cc-api-commands/jenkins/get-jenkins-info-command.js';
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
  selector: 'cc-addon-header[smart-mode="jenkins"]',
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
      ],
    });

    ccApiClient
      .send(new GetAddonCommand({ ownerId, addonId }), { signal })
      .then((addon) => {
        return Promise.all([
          addon,
          ccApiClient.send(new GetJenkinsInfoCommand({ addonId }), { signal }),
          ccApiClient.send(new GetZoneCommand({ zoneName: addon.zone, ownerId }), { signal }),
        ]);
      })
      .then(([addon, jenkinsInfo, zone]) => {
        logsUrl = context.logsUrlPattern.replace(':id', addon.id);
        const jenkinsUrl = `https://${jenkinsInfo.host}`;

        updateComponent('state', {
          type: 'loaded',
          providerId: addon.provider.name,
          providerLogoUrl: addon.provider.logoUrl,
          name: addon.name,
          id: addon.realId,
          zone,
          logsUrl,
          openLinks: [
            {
              name: 'JENKINS',
              url: jenkinsUrl,
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
