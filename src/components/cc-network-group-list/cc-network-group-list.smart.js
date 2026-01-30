import { CreateNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/create-network-group-member-command.js';
import { ListNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/list-network-group-command.js';
import { getCcApiClient } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
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

    const ccApiClient = getCcApiClient(apiConfig);

    function refreshFormAndList() {
      return ccApiClient
        .send(new ListNetworkGroupCommand({ ownerId }), { signal })
        .then((networkGroupList) => {
          const linkedNetworkGroups = networkGroupList.filter((ng) =>
            ng.members.some((member) => member.id === resourceId),
          );
          const unlinkedNetworkGroups = networkGroupList.filter(
            (ng) => !ng.members.some((member) => member.id === resourceId),
          );
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
        })
        .catch((error) => {
          console.error(error);
          updateComponent('linkFormState', { type: 'error' });
          updateComponent('listState', { type: 'error' });
        });
    }

    refreshFormAndList();

    onEvent('cc-network-group-link', (networkGroupId) => {
      updateComponent('linkFormState', (linkFormState) => {
        linkFormState.type = 'linking';
      });

      ccApiClient
        .send(new CreateNetworkGroupMemberCommand({ ownerId, memberId: resourceId, networkGroupId }))
        .then(async () => {
          await refreshFormAndList();
          notifySuccess(i18n('cc-network-group-list.link.success'));
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-network-group-list.link.error'));
          updateComponent('linkFormState', (state) => {
            state.type = 'idle';
          });
        });
    });
  },
});
