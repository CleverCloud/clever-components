// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-header.js';

const PROVIDER_ID = 'kubernetes';
const FIFTY_MINUTES = 50 * 60 * 1000;

/**
 * @typedef {import('./cc-addon-header.js').CcAddonHeader} CcAddonHeader
 * @typedef {import('./cc-addon-header.types.js').DeploymentStatus} DeploymentStatus
 * @typedef {import('./cc-addon-header.types.js').CcAddonHeaderStateLoaded} CcAddonHeaderStateLoaded
 * @typedef {import('./cc-addon-header.types.js').CcAddonHeaderStateLoading} CcAddonHeaderStateLoading
 * @typedef {import('./cc-addon-header.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-addon-header.types.js').KubeInfo} KubeInfo
 * @typedef {import('../cc-zone/cc-zone.types.js').ZoneStateLoaded} ZoneStateLoaded
 * @typedef {import('../../operators.types.js').RawOperator} RawOperator
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonHeader>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode=kubernetes]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    clusterId: { type: String },
    productStatus: { type: String, optional: true },
  },

  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, clusterId, productStatus } = context;
    const api = new Api({ apiConfig, ownerId, clusterId, signal });

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
      api.getKubeConfig().then((kubeConfigUrl) => {
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
      });
    }, FIFTY_MINUTES);

    signal.addEventListener('abort', () => {
      clearInterval(kubeConfigFetchInterval);
    });

    api
      .getKubeInfoWithKubeConfig()
      .then(({ kubeInfo, kubeConfigUrl }) => {
        updateComponent('state', {
          type: 'loaded',
          providerId: PROVIDER_ID,
          providerLogoUrl: getAssetUrl('/logos/kubernetes.svg'),
          name: kubeInfo.name,
          id: kubeInfo.id,
          zone: {
            type: 'loaded',
            name: 'par',
            country: 'France',
            countryCode: 'FR',
            city: 'Paris',
            displayName: null,
            lat: 48.8566,
            lon: 2.3522,
            tags: ['for:applications', 'for:par-only', 'infra:clever-cloud'],
          },
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
   * @param {string} params.clusterId - Cluster identifier
   * @param {AbortSignal} params.signal - Signal to abort calls
   */
  constructor({ apiConfig, ownerId, clusterId, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._clusterId = clusterId;
    this._signal = signal;
  }

  /** @returns {Promise<KubeInfo>} */
  _getKubeInfo() {
    return getKubeInfo({ ownerId: this._ownerId, clusterId: this._clusterId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }))
      .then((kubeInfo) => {
        if (kubeInfo.status === 'DELETED') {
          throw new Error('This cluster has been deleted');
        }
        return kubeInfo;
      });
  }

  /**
   * @return {Promise<string>}
   */
  getKubeConfig() {
    return getKubeConfig({ ownerId: this._ownerId, clusterId: this._clusterId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }))
      .then(({ url }) => url);
  }

  async getKubeInfoWithKubeConfig() {
    const kubeInfo = await this._getKubeInfo();
    const kubeConfigUrl = await this.getKubeConfig();

    return { kubeInfo, kubeConfigUrl };
  }
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, clusterId: string }} params */
function getKubeInfo(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}`,
    // no queryParams
    // no body
  });
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, clusterId: string }} params */
function getKubeConfig(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/kubeconfig/presigned-url`,
    // no queryParams
    // no body
  });
}
