import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { GetNetworkGroupCommand } from '@clevercloud/client/cc-api-commands/network-group/get-network-group-command.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-network-group-linked-resources.js';

/**
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('./cc-network-group-linked-resources.js').CcNetworkGroupLinkedResources} CcNetworkGroupLinkedResources
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
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, networkGroupId, ownerId } = context;
    updateComponent('state', { type: 'loading' });

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
      baseUrl: apiConfig.API_HOST,
      defaultRequestConfig: {
        cors: true,
      },
    });

    ccApiClient.send(new GetNetworkGroupCommand({ networkGroupId, ownerId }), { signal }).then((networkGroupData) => {
      updateComponent('state', {
        type: 'loaded',
        memberList: networkGroupData.members.map((member) => ({
          id: member.id,
          label: member.label,
          domainName: member.domainName,
          // FIXME: have to fetch another API so great
          logo: {
            a11yName: 'placeholder',
            url: getAssetUrl('/logos/nodejs.svg'),
          },
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
        })),
      });

      // FIXME: a member may have 0 peer, in which case plural stuff fails + the button being in details makes no sense
      // {
      //     "id": "ng_1949d39f-4682-4b22-a18c-41ddfbac7858",
      //     "ownerId": "orga_3547a882-d464-4c34-8168-add4b3e0c135",
      //     "label": "ng-demo-smart",
      //     "description": null,
      //     "networkIp": "10.105.0.0/16",
      //     "lastAllocatedIp": "10.105.0.5",
      //     "tags": [],
      //     "peers": [
      //         {
      //             "id": "58684bbf-83ad-40f2-8449-be1b312b3275",
      //             "label": "Still luvdisc",
      //             "publicKey": "jEK6YLZhkUw+KRjJIGwrk5hfhwsBu07s4LJEtkGmZ1Q=",
      //             "endpoint": {
      //                 "ngTerm": {
      //                     "host": "10.105.0.5",
      //                     "port": 50377
      //                 },
      //                 "publicTerm": {
      //                     "host": "91.208.207.30",
      //                     "port": 45004
      //                 },
      //                 "type": "ServerEndpoint"
      //             },
      //             "hostname": "58684bbf-83ad-40f2-8449-be1b312b3275",
      //             "parentMember": "app_7c6f466c-3314-4753-9e06-f87912f6b856",
      //             "parentEvent": null,
      //             "hv": "hv-par6-020",
      //             "type": "CleverPeer"
      //         }
      //     ],
      //     "members": [
      //         {
      //             "id": "app_7c6f466c-3314-4753-9e06-f87912f6b856",
      //             "label": "app_7c6f466c-3314-4753-9e06-f87912f6b856",
      //             "domainName": "app_7c6f466c-3314-4753-9e06-f87912f6b856.m.ng_1949d39f-4682-4b22-a18c-41ddfbac7858.cc-ng.cloud",
      //             "kind": "APPLICATION"
      //         },
      //         {
      //             "id": "app_e048c5ba-dc84-4f01-a750-d053706805fd",
      //             "label": "app_e048c5ba-dc84-4f01-a750-d053706805fd",
      //             "domainName": "app_e048c5ba-dc84-4f01-a750-d053706805fd.m.ng_1949d39f-4682-4b22-a18c-41ddfbac7858.cc-ng.cloud",
      //             "kind": "APPLICATION"
      //         }
      //     ],
      //     "version": 1
      // }
    });
  },
});
