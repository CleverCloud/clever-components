import { GetPulsarInfoCommand } from '@clevercloud/client/cc-api-commands/pulsar/get-pulsar-info-command.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-credentials.js';

/** @type {AddonCredentialsStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    api: {
      content: [
        {
          code: 'url',
          value: 'fake-skeleton',
        },
        {
          code: 'tenant-namespace',
          value: 'fake-skeleton',
        },
        {
          code: 'token',
          value: 'fake-skeleton',
        },
      ],
    },
    cli: {
      content: [
        {
          code: 'url',
          value: 'fake-skeleton',
        },
        {
          code: 'tenant-namespace',
          value: 'fake-skeleton',
        },
        {
          code: 'token',
          value: 'fake-skeleton',
        },
      ],
    },
  },
};

/**
 * @import { CcAddonCredentials } from './cc-addon-credentials.js'
 * @import { AddonCredentialsStateLoaded, AddonCredentialsStateLoading } from './cc-addon-credentials.types.js'
 * @import { AddonCredential } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials[smart-mode="pulsar"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentials>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', LOADING_STATE);

    ccApiClient
      .send(new GetPulsarInfoCommand({ addonId }), { signal, dedupe: true, cache: { ttl: ONE_SECOND } })
      .then((pulsarInfo) => {
        let cliUrl;
        if (pulsarInfo.cluster.pulsarTlsPort != null) {
          cliUrl = `pulsar+ssl://${pulsarInfo.cluster.url}:${pulsarInfo.cluster.pulsarTlsPort}`;
        } else if (pulsarInfo.cluster.pulsarPort != null) {
          cliUrl = `pulsar+ssl://${pulsarInfo.cluster.url}:${pulsarInfo.cluster.pulsarPort}`;
        } else {
          throw new Error('Missing TLS port and default port');
        }

        const tenantNamespace = `${pulsarInfo.tenant}/${pulsarInfo.namespace}`;

        /** @type {AddonCredential[]} */
        const apiCredentials = [
          {
            code: 'url',
            value: `https://${pulsarInfo.cluster.url}:${pulsarInfo.cluster.webTlsPort}`,
          },
          {
            code: 'tenant-namespace',
            value: tenantNamespace,
          },
          {
            code: 'token',
            value: pulsarInfo.token,
          },
        ];

        /** @type {AddonCredential[]} */
        const cliCredentials = [
          {
            code: 'url',
            value: cliUrl,
          },
          {
            code: 'tenant-namespace',
            value: tenantNamespace,
          },
          {
            code: 'token',
            value: pulsarInfo.token,
          },
        ];

        updateComponent(
          'state',
          /** @param {AddonCredentialsStateLoaded|AddonCredentialsStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs = {
              api: {
                ...state.tabs.api,
                content: apiCredentials,
              },
              cli: {
                ...state.tabs.cli,
                content: cliCredentials,
              },
            };
          },
        );
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
