import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { CreateNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/create-network-group-member-command.js';
import { DeleteNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/delete-network-group-member-command.js';
import { ListNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/list-network-group-command.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-network-group-list.js';

/**
 * @typedef Context
 * @property {ApiConfig} apiConfig
 * @property {string} resourceId
 * @property {string} ownerId
 * @property {string} networkGroupDashboardUrlPattern
 * @property {string} networkGroupCreationUrl
 * @property {string} [addonMigrationScreenUrl]
 */

/**
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js';
 * @import { CcNetworkGroupList } from './cc-network-group-list.js';
 * @import { ApiConfig } from '../../lib/send-to-api.types.js';
 * @import { NetworkGroupListStateLoaded } from './cc-network-group-list.types.js';
 */

defineSmartComponent({
  selector: 'cc-network-group-list',
  params: {
    apiConfig: { type: Object },
    resourceId: { type: String },
    ownerId: { type: String },
    networkGroupDashboardUrlPattern: { type: String },
    networkGroupCreationUrl: { type: String },
    addonMigrationScreenUrl: { type: String, optional: true },
  },
  /** @param {OnContextUpdateArgs<CcNetworkGroupList>} _ */
  async onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const {
      apiConfig,
      resourceId,
      ownerId,
      networkGroupDashboardUrlPattern,
      networkGroupCreationUrl,
      addonMigrationScreenUrl,
    } = /** @type {Context} */ context;
    updateComponent('state', { type: 'loading' });
    updateComponent('resourceId', resourceId);

    const ccApiClient = getCcApiClientWithOAuth(apiConfig);
    let resolvedResourceId;

    async function resolveResource() {
      if (!resourceId.startsWith('addon_')) {
        return { resolvedResourceId: resourceId, isSupported: true };
      }
      const addon = await ccApiClient.send(new GetAddonCommand({ ownerId, addonId: resourceId }), {
        signal,
        cache: { ttl: ONE_DAY },
      });
      return {
        resolvedResourceId: addon.realId,
        isSupported: addon.plan.slug !== 'dev',
      };
    }

    /** @param {string} resolvedResourceId */
    async function refreshFormAndList(resolvedResourceId) {
      const networkGroupList = await ccApiClient.send(new ListNetworkGroupCommand({ ownerId }), { signal });

      const unlinkedNetworkGroups = networkGroupList.filter(
        (ng) => !ng.members.some((member) => member.id === resolvedResourceId),
      );

      const linkedNetworkGroups = networkGroupList.filter((ng) =>
        ng.members.some((member) => member.id === resolvedResourceId),
      );

      updateComponent('state', {
        type: 'loaded',
        linkFormState:
          unlinkedNetworkGroups.length === 0
            ? {
                type: 'empty',
                networkGroupDashboardUrl: networkGroupCreationUrl,
              }
            : {
                type: 'idle',
                selectOptions: unlinkedNetworkGroups.map((networkGroup) => ({
                  label: networkGroup.label,
                  value: networkGroup.id,
                })),
              },
        listState: {
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
        },
      });
    }

    try {
      const resource = await resolveResource();
      resolvedResourceId = resource.resolvedResourceId;
      if (!resource.isSupported) {
        updateComponent('state', {
          type: 'unsupported',
          addonMigrationScreenUrl,
        });
        return;
      }
      await refreshFormAndList(resolvedResourceId);
    } catch (error) {
      console.error(error);
      updateComponent('state', { type: 'error' });
      return;
    }

    onEvent('cc-network-group-link', async (networkGroupId) => {
      updateComponent('state', (state) => {
        /** @type {NetworkGroupListStateLoaded} */ (state).linkFormState.type = 'linking';
      });

      try {
        await ccApiClient.send(
          new CreateNetworkGroupMemberCommand({ ownerId, memberId: resolvedResourceId, networkGroupId }),
        );
      } catch (error) {
        console.error(error);
        updateComponent('state', (state) => {
          /** @type {NetworkGroupListStateLoaded} */ (state).linkFormState.type = 'idle';
        });
        notifyError(i18n('cc-network-group-list.link.error'));
        return;
      }

      notifySuccess(i18n('cc-network-group-list.link.success'));

      try {
        await refreshFormAndList(resolvedResourceId);
      } catch (refreshError) {
        console.error(refreshError);
        updateComponent('state', (state) => {
          /** @type {NetworkGroupListStateLoaded} */ (state).linkFormState.type = 'idle';
        });
        notify({
          message: i18n('cc-network-group-list.refresh.error'),
          intent: 'danger',
          options: { timeout: 0 },
        });
      }
    });

    onEvent('cc-network-group-unlink', async (networkGroupId) => {
      updateComponent('state', (state) => {
        /** @type {NetworkGroupListStateLoaded} */ (state).listState.type = 'unlinking';
      });

      try {
        await ccApiClient.send(
          new DeleteNetworkGroupMemberCommand({ memberId: resolvedResourceId, networkGroupId, ownerId }),
        );
      } catch (error) {
        console.error(error);
        updateComponent('state', (state) => {
          /** @type {NetworkGroupListStateLoaded} */ (state).listState.type = 'loaded';
        });
        notifyError(i18n('cc-network-group-list.unlink.error'));
        return;
      }

      notifySuccess(i18n('cc-network-group-list.unlink.success'));

      try {
        await refreshFormAndList(resolvedResourceId);
      } catch (refreshError) {
        console.error(refreshError);
        updateComponent('state', (state) => {
          /** @type {NetworkGroupListStateLoaded} */ (state).listState.type = 'loaded';
        });
        notify({
          message: i18n('cc-network-group-list.refresh.error'),
          intent: 'danger',
          options: { timeout: 0 },
        });
      }
    });
  },
});
