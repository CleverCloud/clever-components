import { GetMateriaInfoCommand } from '@clevercloud/client/cc-api-commands/materia/get-materia-info-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-credentials.js';

/** @type {AddonCredentialsStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    default: {
      content: [
        {
          code: 'host',
          value: 'fake-skeleton',
        },
        {
          code: 'port',
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
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials[smart-mode="materia-kv"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentials>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', LOADING_STATE);

    ccApiClient
      .send(new GetMateriaInfoCommand({ ownerId, addonId }), { signal })
      .then((materiaInfo) => {
        updateComponent(
          'state',
          /** @param {AddonCredentialsStateLoaded|AddonCredentialsStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs.default.content = [
              {
                code: 'host',
                value: materiaInfo.host,
              },
              {
                code: 'port',
                value: String(materiaInfo.port),
              },
              {
                code: 'token',
                value: materiaInfo.token,
              },
            ];
          },
        );
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
