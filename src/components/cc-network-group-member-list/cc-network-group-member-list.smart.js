import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { ListAddonCommand } from '@clevercloud/client/cc-api-commands/addon/list-addon-command.js';
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
import { ListApplicationCommand } from '@clevercloud/client/cc-api-commands/application/list-application-command.js';
import { CreateNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/create-network-group-member-command.js';
import { DeleteNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/delete-network-group-member-command.js';
import { GetNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/get-network-group-command.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { getCcApiClient } from '../../lib/cc-api-client.js';
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
    appOverviewUrlPattern: { type: String },
    addonDashboardUrlPattern: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcNetworkGroupMemberList>} args
   */
  onContextUpdate({ context, component, updateComponent, onEvent, signal }) {
    const { apiConfig, networkGroupId, ownerId, appOverviewUrlPattern, addonDashboardUrlPattern } = context;
    const api = new Api({
      apiConfig,
      networkGroupId,
      ownerId,
      appOverviewUrlPattern,
      addonDashboardUrlPattern,
      signal,
    });

    updateComponent('memberListState', { type: 'loading' });
    updateComponent('linkFormState', { type: 'loading' });
    component.resetLinkForm();

    /** Fetches network group, applications, and addons, then updates both states. */
    async function refreshData() {
      try {
        const [memberList, applications, addons] = await Promise.all([
          api.getNetworkGroupInfo(),
          api.listApplications(),
          api.listAddons(),
        ]);

        // Get IDs of members already in the network group
        const memberIds = new Set(memberList.map((member) => member.id));

        // Build select options for apps and addons not already members
        /** @type {Array<Option>} */
        const selectOptions = [
          ...applications
            .filter((app) => !memberIds.has(app.id))
            .map((app) => ({
              label: `${app.name} (${app.id})`,
              value: app.id,
            })),
          ...addons
            .filter((addon) => !memberIds.has(addon.id))
            .map((addon) => ({
              label: `${addon.name} (${addon.realId})`,
              value: addon.id,
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
        component.resetLinkForm();
      } catch (error) {
        console.error(error);
        updateComponent('memberListState', { type: 'error' });
        updateComponent('linkFormState', { type: 'error' });
      }
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
        .then(async () => {
          await refreshData();
          notifySuccess(i18n('cc-network-group-member-list.member.unlink.success'));
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
        .then(async () => {
          await refreshData();
          notifySuccess(i18n('cc-network-group-member-list.member.link.success'));
        })
        .catch((error) => {
          console.error(error);
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
  #appOverviewUrlPattern;
  #addonDashboardUrlPattern;
  #signal;
  #ccApiClient;

  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.networkGroupId
   * @param {string} params.ownerId
   * @param {string} params.appOverviewUrlPattern
   * @param {string} params.addonDashboardUrlPattern
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, networkGroupId, ownerId, appOverviewUrlPattern, addonDashboardUrlPattern, signal }) {
    this.#ownerId = ownerId;
    this.#networkGroupId = networkGroupId;
    this.#appOverviewUrlPattern = appOverviewUrlPattern;
    this.#addonDashboardUrlPattern = addonDashboardUrlPattern;
    this.#signal = signal;
    this.#ccApiClient = getCcApiClient(apiConfig);
  }

  async getNetworkGroupInfo() {
    const networkGroupData = await this.#ccApiClient.send(
      new GetNetworkGroupCommand({ networkGroupId: this.#networkGroupId, ownerId: this.#ownerId }),
      { signal: this.#signal },
    );

    const memberListPromises = networkGroupData.members.map(async (member) => {
      const logo = await this.#getMemberLogo(member.id, member.kind);
      const peerList = networkGroupData.peers
        .filter((peer) => peer.parentMember === member.id)
        .map((peer) => ({
          id: peer.id,
          label: peer.label,
          publicKey: peer.publicKey,
          ip: peer.endpoint.type === 'ServerEndpoint' ? peer.endpoint.ngTerm.host : peer.endpoint.ngIp,
          type: peer.type,
        }));

      return {
        id: member.id,
        label: member.label,
        domainName: member.domainName,
        logo,
        kind: member.kind,
        dashboardUrl: this.#getMemberDashboardUrl(member.id, member.kind),
        peerList,
      };
    });

    return Promise.all(memberListPromises);
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
   * @returns {Promise<Array<{ id: string, realId: string, name: string }>>}
   */
  async listAddons() {
    const addons = await this.#ccApiClient.send(new ListAddonCommand({ ownerId: this.#ownerId }), {
      signal: this.#signal,
    });
    return addons.map((addon) => ({
      id: addon.id,
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
   * @returns {string|null}
   */
  #getMemberDashboardUrl(resourceId, kind) {
    switch (kind) {
      case 'APPLICATION':
        return this.#appOverviewUrlPattern.replace(':id', resourceId);
      case 'ADDON':
        return this.#addonDashboardUrlPattern.replace(':id', resourceId);
      case 'EXTERNAL':
        return null;
    }
  }
}
