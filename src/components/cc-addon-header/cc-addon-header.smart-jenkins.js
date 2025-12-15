import { getAddon as getAddonProvider } from '@clevercloud/client/esm/api/v2/providers.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { fakeString } from '../../lib/fake-strings.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonHeaderClient } from './cc-addon-header.client.js';
import './cc-addon-header.js';

const PROVIDER_ID = 'jenkins';

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { JenkinsProviderInfo, RawAddon } from './cc-addon-header.types.js'
 * @import { ZoneStateLoaded } from '../cc-zone/cc-zone.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode="jenkins"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    logsUrlPattern: { type: String },
  },

  /** @param {OnContextUpdateArgs<CcAddonHeader>} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });
    let logsUrl = '';

    updateComponent('state', {
      type: 'loading',
      logsUrl: fakeString(15),
      openLinks: [
        {
          url: fakeString(15),
          name: fakeString(5),
        },
      ],
    });

    api
      .getProviderWithZone()
      .then(({ rawAddon, rawProvider, zone }) => {
        logsUrl = context.logsUrlPattern.replace(':id', rawAddon.id);
        const jenkinsUrl = `https://${rawProvider.host}`;

        updateComponent('state', {
          type: 'loaded',
          providerId: rawAddon.provider.name,
          providerLogoUrl: rawAddon.provider.logoUrl,
          name: rawAddon.name,
          id: rawAddon.realId,
          zone,
          logsUrl,
          openLinks: [
            {
              name: 'JENKINS',
              url: jenkinsUrl,
            },
          ],
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

class Api extends CcAddonHeaderClient {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
  }

  /** @return {Promise<JenkinsProviderInfo>} */
  _getAddonProvider() {
    return getAddonProvider({ providerId: this._provider, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @return {Promise<{rawAddon: RawAddon, rawProvider: JenkinsProviderInfo, zone: ZoneStateLoaded}>}
   */
  async getProviderWithZone() {
    const rawAddon = await this.getAddon();
    const [rawProvider, zone] = await Promise.all([this._getAddonProvider(), this.getZone(rawAddon.region)]);
    return { rawAddon, rawProvider, zone };
  }
}
