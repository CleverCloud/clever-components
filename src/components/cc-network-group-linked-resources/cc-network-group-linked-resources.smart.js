import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
import { DeleteNetworkGroupMemberCommand } from '@clevercloud/client/cc-api-commands/network-group/delete-network-group-member-command.js';
import { GetNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/get-network-group-command.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-network-group-linked-resources.js';

/**
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupLinkedResourcesStateLoaded} NetworkGroupLinkedResourcesStateLoaded
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupLinkedResourcesStateUnlinking} NetworkGroupLinkedResourcesStateUnlinking
 * @typedef {import('./cc-network-group-linked-resources.js').CcNetworkGroupLinkedResources} CcNetworkGroupLinkedResources
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupMember} NetworkGroupMember
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcNetworkGroupLinkedResources>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-network-group-linked-resources',
  params: {
    apiConfig: { type: Object },
    networkGroupId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const { apiConfig, networkGroupId, ownerId } = context;
    const api = new Api(apiConfig, networkGroupId, ownerId, signal);
    updateComponent('state', { type: 'loading' });

    api
      .getNetworkGroupInfo()
      .then((memberList) => {
        updateComponent('state', {
          type: 'loaded',
          memberList,
        });
      })
      .catch((error) => {
        console.error(error.message);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-network-group-member-unlink', (memberId) => {
      updateComponent('state', (state) => {
        state.type = 'unlinking';
      });

      setTimeout(() => {
        updateComponent(
          'state',
          /** @param {NetworkGroupLinkedResourcesStateLoaded|NetworkGroupLinkedResourcesStateUnlinking} state */
          (state) => {
            state.type = 'loaded';
            state.memberList = state.memberList.filter((member) => member.id !== memberId);
          },
        );

        // updateComponent('state', (state) => {
        //   state.type = 'loaded';
        // });
      }, 2000);

      // api
      //   .deleteMember(memberId)
      //   .then(() => {
      //     updateComponent(
      //       'state',
      //       /** @param {NetworkGroupLinkedResourcesStateLoaded|NetworkGroupLinkedResourcesStateUnlinking} state */
      //       (state) => {
      //         state.type = 'loaded';
      //         state.memberList = state.memberList.filter((member) => member.id !== memberId);
      //       },
      //     );
      //     notifySuccess(i18n('cc-network-group-linked-resources.member.unlink.success'));
      //   })
      //   .catch((error) => {
      //     console.error(error.message);
      //     updateComponent('state', (state) => {
      //       state.type = 'loaded';
      //     });
      //     notifyError(i18n('cc-network-group-linked-resources.member.unlink.error'));
      //   });
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

  /** @param {string} memberId */
  deleteMember(memberId) {
    return this.#ccApiClient.send(
      new DeleteNetworkGroupMemberCommand({ memberId, networkGroupId: this.#networkGroupId, ownerId: this.#ownerId }),
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
          a11yName: i18n('cc-network-group-linked-resources.member.logo.a11y-name.external'),
        };
    }
  }
}
