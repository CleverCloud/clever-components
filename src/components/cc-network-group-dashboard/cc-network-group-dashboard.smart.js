import { DeleteNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/delete-network-group-command.js';
import { GetNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/get-network-group-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcNetworkGroupWasDeletedEvent } from './cc-network-group-dashboard.events.js';
import './cc-network-group-dashboard.js';

/**
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 * @import { CcNetworkGroupDashboard } from './cc-network-group-dashboard.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 */

defineSmartComponent({
  selector: 'cc-network-group-dashboard',
  params: {
    ownerId: { type: String },
    networkGroupId: { type: String },
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs<CcNetworkGroupDashboard>} _ */
  onContextUpdate({ component, context, updateComponent, onEvent, signal }) {
    const { ownerId, networkGroupId, apiConfig } =
      /** @type {{ ownerId: string, networkGroupId: string, apiConfig: ApiConfig }} */ (context);

    updateComponent('state', { type: 'loading' });

    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    ccApiClient
      .send(new GetNetworkGroupCommand({ networkGroupId, ownerId }), { signal, cache: { ttl: 1000 } })
      .then((ng) => {
        updateComponent('state', {
          type: 'loaded',
          name: ng.label,
          id: ng.id,
          subnet: ng.networkIp,
          lastIp: ng.lastAllocatedIp,
          numberOfMembers: ng.members.length,
          numberOfPeers: ng.peers.length,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-network-group-delete', (networkGroupId) => {
      updateComponent('state', (state) => {
        state.type = 'deleting';
      });

      ccApiClient
        .send(new DeleteNetworkGroupCommand({ networkGroupId, ownerId }))
        .then(() => {
          updateComponent('state', (state) => {
            state.type = 'loaded';
          });
          notifySuccess(i18n('cc-network-group-dashboard.delete.success'));
          component.dispatchEvent(new CcNetworkGroupWasDeletedEvent(networkGroupId));
        })
        .catch((error) => {
          console.error(error);
          updateComponent('state', (state) => {
            state.type = 'loaded';
          });
          notifyError(i18n('cc-network-group-dashboard.delete.error'));
        });
    });
  },
});
