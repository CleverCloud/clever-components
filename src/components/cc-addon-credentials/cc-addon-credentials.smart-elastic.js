import { GetElasticsearchInfoCommand } from '@clevercloud/client/cc-api-commands/elasticsearch/get-elasticsearch-info-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-credentials.js';

/** @type {AddonCredentialsStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    elastic: {
      content: [
        {
          code: 'host',
          value: 'fake-skeleton',
        },
        {
          code: 'user',
          value: 'fake-skeleton',
        },
        {
          code: 'password',
          value: 'fake-skeleton',
        },
      ],
    },
    apm: {
      content: [
        {
          code: 'user',
          value: 'fake-skeleton',
        },
        {
          code: 'password',
          value: 'fake-skeleton',
        },
        {
          code: 'token',
          value: 'fake-skeleton',
        },
      ],
    },
    kibana: {
      content: [
        {
          code: 'user',
          value: 'fake-skeleton',
        },
        {
          code: 'password',
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
  selector: 'cc-addon-credentials[smart-mode="elastic"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentials>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', LOADING_STATE);

    ccApiClient
      .send(new GetElasticsearchInfoCommand({ addonId }), { signal })
      .then((esInfo) => {
        const kibanaService = esInfo.services.find((service) => service.name === 'kibana');
        const apmService = esInfo.services.find((service) => service.name === 'apm');
        const isKibanaEnabled = kibanaService?.enabled ?? false;
        const isApmEnabled = apmService?.enabled ?? false;

        /** @type {AddonCredential[]} */
        const elasticCredentials = [
          {
            code: 'host',
            value: esInfo.config.host,
          },
          {
            code: 'user',
            value: esInfo.config.user,
          },
          {
            code: 'password',
            value: esInfo.config.password,
          },
        ];

        updateComponent(
          'state',
          /** @param {AddonCredentialsStateLoaded|AddonCredentialsStateLoading} state */
          (state) => {
            state.type = 'loaded';

            /** @type {Record<string, {content: AddonCredential[]}>} */
            const updatedTabs = {
              elastic: {
                ...state.tabs.elastic,
                content: elasticCredentials,
              },
            };

            if (isApmEnabled) {
              updatedTabs.apm = {
                ...state.tabs.apm,
                content: [
                  {
                    code: 'user',
                    value: esInfo.config.apmUser,
                  },
                  {
                    code: 'password',
                    value: esInfo.config.apmPassword,
                  },
                  {
                    code: 'token',
                    value: esInfo.config.apmAuthToken,
                  },
                ],
              };
            }

            if (isKibanaEnabled) {
              updatedTabs.kibana = {
                ...state.tabs.kibana,
                content: [
                  {
                    code: 'user',
                    value: esInfo.config.kibanaUser,
                  },
                  {
                    code: 'password',
                    value: esInfo.config.kibanaPassword,
                  },
                ],
              };
            }

            state.tabs = updatedTabs;
          },
        );
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
