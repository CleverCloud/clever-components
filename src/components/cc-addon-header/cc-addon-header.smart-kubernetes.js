// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { notify, notifyError } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-header.js';

const PROVIDER_ID = 'kubernetes';
const FIFTY_MINUTES = 50 * 60 * 1000;

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { DeploymentStatus, CcAddonHeaderStateLoaded, CcAddonHeaderStateLoading, KubeInfo } from './cc-addon-header.types.js'
 * @import { ZoneStateLoaded } from '../cc-zone/cc-zone.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
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
    const api = new Api({ apiConfig, ownerId, kubernetesId, signal });

    updateComponent('state', {
      type: 'loading',
      configLink: {
        href: fakeString(15),
        fileName: fakeString(15),
      },
      productStatus: fakeString(4),
    });

    // clear when the component handled by the smart is disconnected from the DOM
    const kubeConfigFetchInterval = setInterval(() => {
      api
        .getKubeConfig()
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

    api
      .getKubeInfoWithKubeConfig()
      .then(({ kubeInfo, kubeConfigUrl, zone }) => {
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

class Api {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig - API configuration
   * @param {string} params.ownerId - Owner identifier
   * @param {string} params.kubernetesId - Cluster identifier
   * @param {AbortSignal} params.signal - Signal to abort calls
   */
  constructor({ apiConfig, ownerId, kubernetesId, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._kubernetesId = kubernetesId;
    this._signal = signal;
  }

  /** @returns {Promise<KubeInfo>} */
  _getKubeInfo() {
    return getKubeInfo({ ownerId: this._ownerId, kubernetesId: this._kubernetesId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }))
      .then((kubeInfo) => {
        if (kubeInfo.status === 'DELETED' || kubeInfo.status === 'DELETING') {
          throw new Error('This cluster has been deleted');
        }
        return kubeInfo;
      });
  }

  /**
   * @return {Promise<string>}
   */
  getKubeConfig() {
    return getKubeConfig({ ownerId: this._ownerId, kubernetesId: this._kubernetesId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }))
      .then(({ url }) => url);
  }

  async getKubeInfoWithKubeConfig() {
    const kubeInfo = await this._getKubeInfo();
    const kubeConfigUrl = await this.getKubeConfig();
    /** @type ZoneStateLoaded */
    const zone = {
      type: 'loaded',
      name: 'par',
      country: 'France',
      countryCode: 'FR',
      city: 'Paris',
      displayName: null,
      lat: 48.8566,
      lon: 2.3522,
      tags: ['for:applications', 'for:par-only', 'infra:clever-cloud'],
    };

    return { kubeInfo, kubeConfigUrl, zone };
  }
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, kubernetesId: string }} params */
function getKubeInfo(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.kubernetesId}`,
    // no queryParams
    // no body
  });
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, kubernetesId: string }} params */
function getKubeConfig(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.kubernetesId}/kubeconfig/presigned-url`,
    // no queryParams
    // no body
  });
}
