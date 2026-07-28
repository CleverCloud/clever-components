import { GetKubernetesClusterCommand } from '@clevercloud/client/cc-api-commands/kubernetes/get-kubernetes-cluster-command.js';
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

/** @type {AddonInfoStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  version: {
    stateType: 'up-to-date',
    installed: '0.0.0',
    latest: '0.0.0',
  },
  creationDate: '2025-08-06 15:03:00',
};

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="kubernetes"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    kubernetesId: { type: String },
  },
  /** @param {OnContextUpdateArgs<CcAddonInfo>} _ */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, kubernetesId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.kubernetes'),
      href: getDocUrl('/kubernetes'),
    });

    ccApiClient
      .send(new GetKubernetesClusterCommand({ ownerId, clusterId: kubernetesId }), { signal })
      .then((kubeInfo) => {
        if (kubeInfo.status === 'DELETED') {
          throw new Error('This cluster has been deleted');
        }

        updateComponent('state', {
          type: 'loaded',
          version: { stateType: 'up-to-date', installed: kubeInfo.version, latest: kubeInfo.version },
          creationDate: kubeInfo.createdAt,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
