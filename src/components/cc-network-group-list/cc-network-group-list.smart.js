import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { CreateNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/create-network-group-member-command.js';
import { ListNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/list-network-group-command.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-network-group-list.js';

/**
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js';
 * @import { CcNetworkGroupList } from './cc-network-group-list.js';
 * @import { ApiConfig } from '../../lib/send-to-api.types.js';
 */

defineSmartComponent({
  selector: 'cc-network-group-list',
  params: {
    apiConfig: { type: 'Object' },
    resourceId: { type: 'String' },
    ownerId: { type: 'String' },
    networkGroupDashboardUrlPattern: { type: 'String' },
  },
  /** @param {OnContextUpdateArgs<CcNetworkGroupList>} _ */
  onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const { apiConfig, resourceId, ownerId, networkGroupDashboardUrlPattern } =
      /** @type {{ apiConfig: ApiConfig, resourceId: string, ownerId: string, networkGroupDashboardUrlPattern: string }} */ (
        context
      );
    updateComponent('linkFormState', { type: 'loading' });
    updateComponent('listState', { type: 'loading' });

    const ccApiClient = new CcApiClient({
      authMethod: {
        type: 'oauth-v1',
        oauthTokens: {
          consumerKey: apiConfig.OAUTH_CONSUMER_KEY,
          consumerSecret: apiConfig.OAUTH_CONSUMER_SECRET,
          token: apiConfig.API_OAUTH_TOKEN,
          secret: apiConfig.API_OAUTH_TOKEN_SECRET,
        },
      },
      defaultRequestConfig: { cors: true },
    });

    function refreshFormAndList() {
      ccApiClient.send(new ListNetworkGroupCommand({ ownerId }), { signal }).then((networkGroupList) => {
        const linkedNetworkGroups = networkGroupList.filter((ng) =>
          ng.members.some((member) => member.id === resourceId),
        );
        const unlinkedNetworkGroups = networkGroupList.filter(
          (ng) => !ng.members.some((member) => member.id === resourceId),
        );
        console.log({ linkedNetworkGroups, unlinkedNetworkGroups });
        // FIXME: handle empty list case

        updateComponent('linkFormState', {
          type: 'idle',
          selectOptions: unlinkedNetworkGroups.map((networkGroup) => ({
            label: networkGroup.label,
            value: networkGroup.id,
          })),
        });

        updateComponent('listState', {
          type: 'loaded',
          linkedNetworkGroupList: linkedNetworkGroups.map((networkGroup) => ({
            id: networkGroup.id,
            name: networkGroup.label,
            dashboardUrl: networkGroupDashboardUrlPattern.replace(':id', networkGroup.id),
            peerList: networkGroup.peers.map((peer) => ({
              id: peer.id,
              label: peer.label,
              publicKey: peer.publicKey,
              ip: peer.endpoint.type === 'ServerEndpoint' ? peer.endpoint.ngTerm.host : peer.endpoint.ngIp,
              type: peer.type,
            })),
          })),
        });
      });
    }

    refreshFormAndList();

    onEvent('cc-network-group-link', (networkGroupId) => {
      updateComponent('linkFormState', (linkFormState) => {
        linkFormState.type = 'linking';
      });

      ccApiClient
        .send(new CreateNetworkGroupMemberCommand({ ownerId, memberId: resourceId, networkGroupId }))
        .then(() => {
          refreshFormAndList();
        });
    });
  },
});
