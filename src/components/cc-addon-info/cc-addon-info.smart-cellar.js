import { GetCellarInfoCommand } from '@clevercloud/client/cc-api-commands/cellar/get-cellar-info-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-info.js';

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoading } from './cc-addon-info.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="cellar"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonInfo>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    /**
     * @type {AddonInfoStateLoading}
     */
    const LOADING_STATE = {
      type: 'loading',
      creationDate: '2025-08-06 15:03:00',
      totalContent: {
        buckets: null,
        objects: null,
      },
      traffic: {
        inbound: null,
        outbound: null,
      },
      usedSpaces: {
        size: null,
      },
    };

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.cellar'),
      href: getDocUrl('/addons/cellar'),
    });

    ccApiClient
      .send(new GetCellarInfoCommand({ ownerId, addonId }), { signal })
      .then((cellarInfo) => {
        updateComponent('state', {
          type: 'loaded',
          creationDate: cellarInfo.createdAt,
          totalContent: {
            buckets: cellarInfo.buckets.count,
            objects: cellarInfo.buckets.objects,
          },
          traffic: {
            inbound: cellarInfo.traffic.inbound,
            outbound: cellarInfo.traffic.outbound,
          },
          usedSpaces: {
            size: cellarInfo.buckets.size,
          },
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
