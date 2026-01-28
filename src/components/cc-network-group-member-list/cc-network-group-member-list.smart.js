import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { ListAddonCommand } from '@clevercloud/client/cc-api-commands/addon/list-addon-command.js';
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
import { ListApplicationCommand } from '@clevercloud/client/cc-api-commands/application/list-application-command.js';
import { CreateNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/create-network-group-member-command.js';
import { DeleteNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/delete-network-group-member-command.js';
import { GetNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/get-network-group-command.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-network-group-member-list.js';

/**
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { NetworkGroupMember, NetworkGroupMemberLinkFormStateIdle, NetworkGroupMemberLinkFormStateLinking } from './cc-network-group-member-list.types.js'
 * @import { CcNetworkGroupMemberList } from './cc-network-group-member-list.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 * @import { Option } from '../cc-select/cc-select.types.js'
 */

defineSmartComponent({
  selector: 'cc-network-group-member-list',
  params: {
    apiConfig: { type: Object },
    networkGroupId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcNetworkGroupMemberList>} args
   */
  onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const { apiConfig, networkGroupId, ownerId } = context;
    const api = new Api(apiConfig, networkGroupId, ownerId, signal);

    updateComponent('memberListState', { type: 'loading' });
    updateComponent('linkFormState', { type: 'loading' });

    /**
     * Fetches network group, applications, and addons, then updates both states.
     */
    function refreshData() {
      Promise.all([api.getNetworkGroupInfo(), api.listApplications(), api.listAddons()])
        .then(([memberList, applications, addons]) => {
          // Get IDs of members already in the network group
          const memberIds = new Set(memberList.map((member) => member.id));

          // Build select options for apps and addons not already members
          /** @type {Array<Option>} */
          const selectOptions = [
            ...applications
              .filter((app) => !memberIds.has(app.id))
              .map((app) => ({
                label: `${app.name} (${i18n('cc-network-group-member-list.link-form.resource-type.application')})`,
                value: app.id,
              })),
            ...addons
              .filter((addon) => !memberIds.has(addon.realId))
              .map((addon) => ({
                label: `${addon.name} (${i18n('cc-network-group-member-list.link-form.resource-type.addon')})`,
                value: addon.realId,
              })),
          ];

          updateComponent('memberListState', {
            type: 'loaded',
            memberList,
          });

          updateComponent('linkFormState', {
            type: 'idle',
            selectOptions,
          });
        })
        .catch((error) => {
          console.error(error.message);
          updateComponent('memberListState', { type: 'error' });
          updateComponent('linkFormState', { type: 'idle', selectOptions: [] });
        });
    }

    // Initial data fetch
    refreshData();

    // Handle member unlink event
    onEvent('cc-network-group-member-unlink', (memberId) => {
      updateComponent('memberListState', (memberListState) => {
        memberListState.type = 'unlinking';
      });

      api
        .deleteMember(memberId)
        .then(() => {
          notifySuccess(i18n('cc-network-group-member-list.member.unlink.success'));
          refreshData();
        })
        .catch((error) => {
          console.error(error.message);
          updateComponent('memberListState', (memberListState) => {
            memberListState.type = 'loaded';
          });
          notifyError(i18n('cc-network-group-member-list.member.unlink.error'));
        });
    });

    // Handle member link event
    onEvent('cc-network-group-member-link', (memberId) => {
      updateComponent(
        'linkFormState',
        /** @param {NetworkGroupMemberLinkFormStateIdle|NetworkGroupMemberLinkFormStateLinking} linkFormState */
        (linkFormState) => {
          linkFormState.type = 'linking';
        },
      );

      api
        .createMember(memberId)
        .then(() => {
          notifySuccess(i18n('cc-network-group-member-list.member.link.success'));
          refreshData();
        })
        .catch((error) => {
          console.error(error.message);
          updateComponent(
            'linkFormState',
            /** @param {NetworkGroupMemberLinkFormStateIdle|NetworkGroupMemberLinkFormStateLinking} linkFormState */
            (linkFormState) => {
              linkFormState.type = 'idle';
            },
          );
          notifyError(i18n('cc-network-group-member-list.member.link.error'));
        });
    });
  },
});

class Api {
  #ownerId;
  #networkGroupId;
  #signal;
  #ccApiClient;

  /**
   * @param {ApiConfig} apiConfig
   * @param {string} networkGroupId
   * @param {string} ownerId
   * @param {AbortSignal} signal
   */
  constructor(apiConfig, networkGroupId, ownerId, signal) {
    this.#ownerId = ownerId;
    this.#networkGroupId = networkGroupId;
    this.#signal = signal;

    this.#ccApiClient = new CcApiClient({
      authMethod: {
        type: 'oauth-v1',
        oauthTokens: {
          consumerKey: apiConfig.OAUTH_CONSUMER_KEY,
          consumerSecret: apiConfig.OAUTH_CONSUMER_SECRET,
          token: apiConfig.API_OAUTH_TOKEN,
          secret: apiConfig.API_OAUTH_TOKEN_SECRET,
        },
      },
      baseUrl: apiConfig.API_HOST,
      defaultRequestConfig: {
        cors: true,
      },
    });
  }

  async getNetworkGroupInfo() {
    const networkGroupData = await this.#ccApiClient.send(
      new GetNetworkGroupCommand({ networkGroupId: this.#networkGroupId, ownerId: this.#ownerId }),
      { signal: this.#signal },
    );
    const memberListWithPeerLogosPromises = networkGroupData.members.map(async (member) => ({
      id: member.id,
      label: member.label,
      domainName: member.domainName,
      logo: await this.#getMemberLogo(member.id, member.kind),
      kind: member.kind,
      dashboardUrl: this.#getMemberDashboardUrl(member.id, member.kind),
      peerList: networkGroupData.peers
        .filter((peer) => peer.parentMember === member.id)
        .map((peer) => ({
          id: peer.id,
          label: peer.label,
          publicKey: peer.publicKey,
          ip: peer.endpoint.type === 'ServerEndpoint' ? peer.endpoint.ngTerm.host : peer.endpoint.ngIp,
          type: peer.type,
        })),
    }));
    return Promise.all(memberListWithPeerLogosPromises);
  }

  /**
   * Lists all applications for the owner.
   * @returns {Promise<Array<{ id: string, name: string }>>}
   */
  async listApplications() {
    const applications = await this.#ccApiClient.send(
      new ListApplicationCommand({ ownerId: this.#ownerId, withBranches: false }),
      { signal: this.#signal },
    );
    return applications.map((app) => ({
      id: app.id,
      name: app.name,
    }));
  }

  /**
   * Lists all addons for the owner.
   * @returns {Promise<Array<{ realId: string, name: string }>>}
   */
  async listAddons() {
    const addons = await this.#ccApiClient.send(new ListAddonCommand({ ownerId: this.#ownerId }), {
      signal: this.#signal,
    });
    return addons.map((addon) => ({
      realId: addon.realId,
      name: addon.name,
    }));
  }

  /**
   * Creates a new member in the network group.
   * @param {string} memberId
   */
  createMember(memberId) {
    return this.#ccApiClient.send(
      new CreateNetworkGroupMemberCommand({
        memberId,
        networkGroupId: this.#networkGroupId,
        ownerId: this.#ownerId,
      }),
      { signal: this.#signal },
    );
  }

  /**
   * Deletes a member from the network group.
   * @param {string} memberId
   */
  deleteMember(memberId) {
    return this.#ccApiClient.send(
      new DeleteNetworkGroupMemberCommand({ memberId, networkGroupId: this.#networkGroupId, ownerId: this.#ownerId }),
      { signal: this.#signal },
    );
  }

  /**
   * @param {string} resourceId
   * @param {NetworkGroupMember['kind']} kind
   * @returns {Promise<NetworkGroupMember['logo']>|NetworkGroupMember['logo']}
   */
  #getMemberLogo(resourceId, kind) {
    switch (kind) {
      case 'APPLICATION':
        return this.#ccApiClient
          .send(new GetApplicationCommand({ applicationId: resourceId, ownerId: this.#ownerId }))
          .then((applicationData) => ({
            url: applicationData.instance.variant.logo,
            a11yName: applicationData.instance.variant.name,
          }));
      case 'ADDON':
        return this.#ccApiClient
          .send(new GetAddonCommand({ addonId: resourceId, ownerId: this.#ownerId }))
          .then((addonData) => ({
            url: addonData.provider.logoUrl,
            a11yName: addonData.provider.name,
          }));
      case 'EXTERNAL':
        return {
          url: getAssetUrl('/logos/external-resource.svg'),
          a11yName: i18n('cc-network-group-member-list.member.logo.a11y-name.external'),
        };
    }
  }

  /**
   * @param {string} resourceId
   * @param {NetworkGroupMember['kind']} kind
   * @returns {string|undefined}
   */
  #getMemberDashboardUrl(resourceId, kind) {
    const baseUrl = this.#ownerId.startsWith('orga_')
      ? `/organisations/${this.#ownerId}`
      : `/users/me`;

    switch (kind) {
      case 'APPLICATION':
        return `${baseUrl}/applications/${resourceId}`;
      case 'ADDON':
        return `${baseUrl}/addons/${resourceId}`;
      case 'EXTERNAL':
        return undefined;
    }
  }
}
