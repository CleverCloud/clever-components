import { GetKubernetesClusterCommand } from '@clevercloud/client/cc-api-commands/kubernetes/get-kubernetes-cluster-command.js';
import { GetKubernetesKubeconfigPresignedUrlCommand } from '@clevercloud/client/cc-api-commands/kubernetes/get-kubernetes-kubeconfig-presigned-url-command.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { fakeString } from '../../lib/fake-strings.js';
import { notify, notifyError } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-header.js';

const PROVIDER_ID = 'kubernetes';
const FIFTY_MINUTES = 50 * 60 * 1000;

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { DeploymentStatus, CcAddonHeaderStateLoaded, CcAddonHeaderStateLoading } from './cc-addon-header.types.js'
 * @import { Zone } from '../common.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode=kubernetes]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    kubernetesId: { type: String },
    productStatus: { type: String, optional: true },
  },

  /** @param {OnContextUpdateArgs<CcAddonHeader>} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, kubernetesId, productStatus } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', {
      type: 'loading',
      configLink: {
        href: fakeString(15),
        fileName: fakeString(15),
      },
      productStatus: fakeString(4),
    });

    /** @returns {Promise<string>} */
    function getKubeConfigUrl() {
      return ccApiClient
        .send(new GetKubernetesKubeconfigPresignedUrlCommand({ ownerId, clusterId: kubernetesId }), { signal })
        .then(({ url }) => url);
    }

    // clear when the component handled by the smart is disconnected from the DOM
    const kubeConfigFetchInterval = setInterval(() => {
      getKubeConfigUrl()
        .then((kubeConfigUrl) => {
          updateComponent(
            'state',
            /** @param {CcAddonHeaderStateLoaded|CcAddonHeaderStateLoading} state */
            (state) => {
              state.configLink = {
                fileName: 'kubeconfig.yaml',
                href: kubeConfigUrl,
              };
            },
          );
        })
        .catch((error) => {
          console.error(error);
          notify({
            intent: 'danger',
            message: i18n('cc-addon-header.error.fetch-kubeconfig'),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
          updateComponent('state', {
            type: 'error',
          });
        });
    }, FIFTY_MINUTES);

    signal.addEventListener('abort', () => {
      clearInterval(kubeConfigFetchInterval);
    });

    Promise.all([
      ccApiClient.send(new GetKubernetesClusterCommand({ ownerId, clusterId: kubernetesId }), { signal }),
      getKubeConfigUrl(),
    ])
      .then(([kubeInfo, kubeConfigUrl]) => {
        if (kubeInfo.status === 'DELETED' || kubeInfo.status === 'DELETING') {
          throw new Error('This cluster has been deleted');
        }

        /** @type {Zone} */
        const zone = {
          name: 'par',
          country: 'France',
          countryCode: 'FR',
          city: 'Paris',
          displayName: null,
          lat: 48.8566,
          lon: 2.3522,
          tags: ['for:applications', 'for:par-only', 'infra:clever-cloud'],
        };

        updateComponent('state', {
          type: 'loaded',
          providerId: PROVIDER_ID,
          providerLogoUrl: getAssetUrl('/logos/kubernetes.svg'),
          name: kubeInfo.name,
          id: kubeInfo.id,
          zone,
          configLink: {
            href: kubeConfigUrl,
            fileName: 'kubeconfig.yaml',
          },
          productStatus,
          deploymentStatus: /** @type {DeploymentStatus} */ (kubeInfo.status.toLowerCase()),
        });
      })
      .catch((error) => {
        console.error(error);
        notifyError(i18n('cc-addon-header.error'));
        updateComponent('state', {
          type: 'error',
        });
      });
  },
});
