import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { ListAddonCommand } from '@clevercloud/client/cc-api-commands/addon/list-addon-command.js';
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
import { ListApplicationCommand } from '@clevercloud/client/cc-api-commands/application/list-application-command.js';
import { CreateNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/create-network-group-member-command.js';
import { DeleteNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/delete-network-group-member-command.js';
import { GetNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/get-network-group-command.js';
import { GetNetworkGroupWireguardConfigurationUrlCommand } from '@clevercloud/client/cc-api-commands/network-group/get-network-group-wireguard-configuration-url-command.js';
import { isNetworkGroupAddonCandidate } from '@clevercloud/client/cc-api-commands/network-group/network-group-utils.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-network-group-member-list.js';

const FIFTY_MINUTES = 50 * 60 * 1000;

/**
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { NetworkGroupMemberLinkFormStateIdle, NetworkGroupMemberLinkFormStateLinking } from './cc-network-group-member-list.types.js'
 * @import { NetworkGroupMember, NetworkGroupMemberLogo } from '../cc-network-group-member-card/cc-network-group-member-card.types.js';
 * @import { CcNetworkGroupMemberList } from './cc-network-group-member-list.js'
 * @import { NetworkGroupPeer } from '../cc-network-group-peer-card/cc-network-group-peer-card.types.js';
 * @import { NetworkGroup } from '@clevercloud/client/cc-api-commands/network-group/network-group.types.js';
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
    updateComponent('networkGroupId', networkGroupId);
    component.resetLinkForm();

    /** Fetches network group, applications, and addons, then updates both states. */
    async function refreshData() {
      const [memberList, resources] = await Promise.all([api.getNetworkGroupInfo(), api.listResources()]);

      // Get IDs of members already in the network group
      const memberIds = new Set(memberList.map((member) => member.id));

      /** @type {Array<Option>} */
      const selectOptions = resources
        .filter((resource) => !memberIds.has(resource.id))
        .map((resource) => ({
          label: `${resource.name} (${resource.id})`,
          value: resource.id,
        }));

      updateComponent('memberListState', {
        type: 'loaded',
        memberList,
      });

      updateComponent('linkFormState', {
        type: 'idle',
        selectOptions,
      });
      component.resetLinkForm();
    }

    /** Fetches data and sets both states to error on failure. */
    async function initialFetch() {
      try {
        await refreshData();
      } catch (error) {
        console.error(error);
        updateComponent('memberListState', { type: 'error' });
        updateComponent('linkFormState', { type: 'error' });
      }
    }

    // Initial data fetch
    initialFetch();

    // Refresh data every 50 minutes to keep presigned URLs valid
    const refreshInterval = setInterval(() => {
      initialFetch();
    }, FIFTY_MINUTES);

    signal.addEventListener('abort', () => {
      clearInterval(refreshInterval);
    });

    // Handle member unlink event
    onEvent('cc-network-group-member-unlink', async (memberId) => {
      updateComponent('memberListState', (memberListState) => {
        memberListState.type = 'unlinking';
      });

      try {
        await api.deleteMember(memberId);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        updateComponent('memberListState', (memberListState) => {
          memberListState.type = 'loaded';
        });
        notifyError(i18n('cc-network-group-member-list.member.unlink.error'));
        return;
      }

      try {
        await refreshData();
        notifySuccess(i18n('cc-network-group-member-list.member.unlink.success'));
      } catch (refreshError) {
        console.error(refreshError);
        updateComponent('memberListState', (memberListState) => {
          memberListState.type = 'loaded';
        });
        notify({
          message: i18n('cc-network-group-member-list.refresh.error'),
          intent: 'danger',
          options: { timeout: 0 },
        });
      }
    });

    // Handle member link event
    onEvent('cc-network-group-member-link', async (memberId) => {
      updateComponent(
        'linkFormState',
        /** @param {NetworkGroupMemberLinkFormStateIdle|NetworkGroupMemberLinkFormStateLinking} linkFormState */
        (linkFormState) => {
          linkFormState.type = 'linking';
        },
      );

      try {
        await api.createMember(memberId);
      } catch (error) {
        console.error(error);
        updateComponent(
          'linkFormState',
          /** @param {NetworkGroupMemberLinkFormStateIdle|NetworkGroupMemberLinkFormStateLinking} linkFormState */
          (linkFormState) => {
            linkFormState.type = 'idle';
          },
        );
        notifyError(i18n('cc-network-group-member-list.member.link.error'));
        return;
      }

      try {
        await refreshData();
        notifySuccess(i18n('cc-network-group-member-list.member.link.success'));
      } catch (refreshError) {
        console.error(refreshError);
        updateComponent(
          'linkFormState',
          /** @param {NetworkGroupMemberLinkFormStateIdle|NetworkGroupMemberLinkFormStateLinking} linkFormState */
          (linkFormState) => {
            linkFormState.type = 'idle';
          },
        );
        notify({
          message: i18n('cc-network-group-member-list.refresh.error'),
          intent: 'danger',
          options: { timeout: 0 },
        });
      }
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
    this.#ccApiClient = getCcApiClientWithOAuth(apiConfig);
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

  async getNetworkGroupInfo() {
    const networkGroupData = await this.#ccApiClient.send(
      new GetNetworkGroupCommand({ networkGroupId: this.#networkGroupId, ownerId: this.#ownerId }),
      { signal: this.#signal },
    );

    const memberListPromises = networkGroupData.members.map(async (member) =>
      this.#getMemberWithInfo(member, networkGroupData.peers),
    );

    return Promise.all(memberListPromises);
  }

  /**
   * Lists all applications and addons for the owner that can be linked to a network group.
   * @returns {Promise<Array<{ id: string, name: string }>>}
   */
  async listResources() {
    const [apps, addons] = await Promise.all([
      this.#ccApiClient.send(new ListApplicationCommand({ ownerId: this.#ownerId, withBranches: false }), {
        signal: this.#signal,
      }),
      this.#ccApiClient.send(new ListAddonCommand({ ownerId: this.#ownerId }), { signal: this.#signal }),
    ]);
    const supportedAddons = addons.filter((addon) => isNetworkGroupAddonCandidate(addon));
    return [
      ...apps.map((app) => ({
        id: app.id,
        name: app.name,
      })),
      ...supportedAddons.map((addon) => ({
        id: addon.realId,
        name: addon.name,
      })),
    ];
  }

  /**
   * @param {string} resourceId
   * @param {Exclude<NetworkGroupMember['kind'], 'DELETED'>} kind
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
      default:
        throw new Error(`Unsupported network group member kind: ${kind}`);
    }
  }

  /**
   * @param {string} resourceId
   * @param {Exclude<NetworkGroupMember['kind'], 'DELETED'>} kind
   * @returns {Promise<NetworkGroupMemberLogo>}
   */
  async #getMemberLogo(resourceId, kind) {
    switch (kind) {
      case 'APPLICATION': {
        const applicationData = await this.#ccApiClient.send(
          new GetApplicationCommand({ applicationId: resourceId, ownerId: this.#ownerId }),
          {
            signal: this.#signal,
          },
        );
        if (applicationData == null) {
          return null;
        }
        return {
          url: applicationData.instance.variant.logo,
          a11yName: applicationData.instance.variant.name,
        };
      }
      case 'ADDON': {
        const addonData = await this.#ccApiClient.send(
          new GetAddonCommand({ addonId: resourceId, ownerId: this.#ownerId }),
          { signal: this.#signal },
        );
        if (addonData == null) {
          return null;
        }
        return {
          url: addonData.provider.logoUrl,
          a11yName: addonData.provider.name,
        };
      }
      case 'EXTERNAL':
        return {
          url: getAssetUrl('/logos/external-peer.svg'),
          a11yName: i18n('cc-network-group-member-list.member.logo.a11y-name.external'),
        };
      default:
        throw new Error(`Unsupported network group member kind: ${kind}`);
    }
  }

  /**
   * @param {NetworkGroup['members'][number]} member
   * @param {NetworkGroup['peers']} rawPeerList
   * @returns {Promise<NetworkGroupMember>}
   * */
  async #getMemberWithInfo(member, rawPeerList) {
    // The network group API returns `kind` in lowercase (e.g. "application"), whereas the rest of
    // the codebase (and the client types) expect uppercase. Normalize it here so the kind-based
    // switches resolve correctly instead of silently falling through to a "DELETED" member.
    const kind = /** @type {Exclude<NetworkGroupMember['kind'], 'DELETED'>} */ (member.kind.toUpperCase());

    const [logo, peerList] = await Promise.all([
      this.#getMemberLogo(member.id, kind),
      Promise.all(
        rawPeerList.filter((peer) => peer.parentMember === member.id).map((peer) => this.#getPeerWithInfo(peer)),
      ),
    ]);

    if (logo == null) {
      return {
        kind: 'DELETED',
        id: member.id,
        label: member.label,
      };
    }

    return {
      id: member.id,
      label: member.label,
      domainName: member.domainName,
      logo,
      kind,
      dashboardUrl: this.#getMemberDashboardUrl(member.id, kind),
      peerList,
    };
  }

  /**
   * @param {string} peerId
   * @returns {Promise<string>} URL to the WireGuard configuration for the given peer ID
   */
  async #getPeerConfigLink(peerId) {
    const { url } = await this.#ccApiClient.send(
      new GetNetworkGroupWireguardConfigurationUrlCommand({
        networkGroupId: this.#networkGroupId,
        ownerId: this.#ownerId,
        peerId,
      }),
      { signal: this.#signal },
    );
    return url;
  }

  /** @param {NetworkGroup['peers'][number]} peer
   * @returns {Promise<NetworkGroupPeer>}
   */
  async #getPeerWithInfo(peer) {
    const configLink = peer.type === 'ExternalPeer' ? await this.#getPeerConfigLink(peer.id) : null;
    return {
      id: peer.id,
      label: peer.label,
      publicKey: peer.publicKey,
      ip: peer.endpoint.type === 'ServerEndpoint' ? peer.endpoint.ngTerm.host : peer.endpoint.ngIp,
      type: peer.type,
      configLink,
    };
  }
}
