import { GetKubernetesClusterCommand } from '@clevercloud/client/cc-api-commands/kubernetes/get-kubernetes-cluster-command.js';
import { GetKubernetesKubeconfigPresignedUrlCommand } from '@clevercloud/client/cc-api-commands/kubernetes/get-kubernetes-kubeconfig-presigned-url-command.js';
import { isCcHttpErrorWithStatus, isRateLimitError } from '@clevercloud/client/utils/error-utils.js';
import { unlessAborted } from '../../lib/abortable.js';
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
 * Kubernetes clusters only run in Paris, and the cluster payload does not carry a zone.
 *
 * @type {Zone}
 */
const DEFAULT_ZONE = {
  id: 'aad32a21-24f8-40b3-a750-baab218d927b',
  name: 'par',
  country: 'France',
  countryCode: 'FR',
  city: 'Paris',
  displayName: null,
  lat: 48.8566,
  lon: 2.3522,
  outboundIps: [],
  tags: ['for:applications', 'for:par-only', 'infra:clever-cloud'],
};

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { DeploymentStatus, CcAddonHeaderState } from './cc-addon-header.types.js'
 * @import { Zone } from '@clevercloud/client/cc-api-commands/zone/zone.types.js'
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

    /**
     * @param {string} kubeConfigUrl
     * @returns {{ href: string, fileName: string }}
     */
    function toConfigLink(kubeConfigUrl) {
      return { href: kubeConfigUrl, fileName: 'kubeconfig.yaml' };
    }

    /**
     * A 403 means the current user's role may not get a kubeconfig: the header is displayed without the config link
     * and the refresh is stopped. Any other error is notified once, and the refresh goes on.
     *
     * @param {unknown} error
     */
    function handleKubeConfigError(error) {
      unlessAborted(signal, error, () => {
        if (isCcHttpErrorWithStatus(error, 403) && !isRateLimitError(error)) {
          clearInterval(kubeConfigFetchInterval);
          updateComponent(
            'state',
            /** @param {CcAddonHeaderState} state */
            (state) => {
              if (state.type !== 'error') {
                delete state.configLink;
              }
            },
          );
          return;
        }
        console.error(error);
        if (!hasNotifiedKubeConfigError) {
          hasNotifiedKubeConfigError = true;
          notify({
            intent: 'danger',
            message: i18n('cc-addon-header.error.fetch-kubeconfig'),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        }
      });
    }

    let hasNotifiedKubeConfigError = false;

    // clear when the component handled by the smart is disconnected from the DOM
    const kubeConfigFetchInterval = setInterval(() => {
      getKubeConfigUrl()
        .then((kubeConfigUrl) => {
          updateComponent(
            'state',
            /** @param {CcAddonHeaderState} state */
            (state) => {
              if (state.type !== 'error') {
                state.configLink = toConfigLink(kubeConfigUrl);
              }
            },
          );
        })
        .catch(handleKubeConfigError);
    }, FIFTY_MINUTES);

    signal.addEventListener('abort', () => {
      clearInterval(kubeConfigFetchInterval);
    });

    // the kubeconfig is fetched alongside the cluster but its failure must not prevent the header from loading
    /** @type {Promise<{ url: string } | { error: unknown }>} */
    const kubeConfigUrlResult = getKubeConfigUrl().then(
      (url) => ({ url }),
      (error) => ({ error }),
    );

    ccApiClient
      .send(new GetKubernetesClusterCommand({ ownerId, clusterId: kubernetesId }), { signal })
      .then(async (kubeInfo) => {
        if (kubeInfo.status === 'DELETED' || kubeInfo.status === 'DELETING') {
          throw new Error('This cluster has been deleted');
        }

        const kubeConfigResult = await kubeConfigUrlResult;

        updateComponent('state', {
          type: 'loaded',
          providerId: PROVIDER_ID,
          providerLogoUrl: getAssetUrl('/logos/kubernetes.svg'),
          name: kubeInfo.name,
          id: kubeInfo.id,
          zone: DEFAULT_ZONE,
          configLink: 'url' in kubeConfigResult ? toConfigLink(kubeConfigResult.url) : undefined,
          productStatus,
          deploymentStatus: /** @type {DeploymentStatus} */ (kubeInfo.status.toLowerCase()),
        });

        if ('error' in kubeConfigResult) {
          handleKubeConfigError(kubeConfigResult.error);
        }
      })
      .catch((error) =>
        unlessAborted(signal, error, () => {
          console.error(error);
          clearInterval(kubeConfigFetchInterval);
          notifyError(i18n('cc-addon-header.error'));
          updateComponent('state', {
            type: 'error',
          });
        }),
      );
  },
});
