import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
import { GetEnvironmentCommand } from '@clevercloud/client/cc-api-commands/environment/get-environment-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-linked-services.js';

/**
 * @import { CcEnvVarLinkedServices } from './cc-env-var-linked-services.js'
 * @import { LinkedService } from './cc-env-var-linked-services.types.js'
 * @import { CcApiClient } from '@clevercloud/client/cc-api-client.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-env-var-linked-services[type="addon"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcEnvVarLinkedServices>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', { type: 'loading', name: '' });

    fetchAppName({ ccApiClient, signal, ownerId, appId }).then((name) => {
      updateComponent('appName', name);
    });

    fetchEnvVarLinkedAddons({ ccApiClient, signal, ownerId, appId })
      .then((linkedServices) => {
        updateComponent('state', {
          type: 'loaded',
          services: linkedServices,
        });
      })
      .catch((e) => {
        console.error(e);
        updateComponent('state', {
          type: 'error',
        });
      });
  },
});

/**
 * @param {object} params
 * @param {CcApiClient} params.ccApiClient
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @returns {Promise<Array<LinkedService>>}
 */
async function fetchEnvVarLinkedAddons({ ccApiClient, signal, ownerId, appId }) {
  const { linkedAddonsEnvironment } = await ccApiClient.send(
    new GetEnvironmentCommand({ ownerId, applicationId: appId, includeLinkedAddons: true }),
    { signal },
  );

  return linkedAddonsEnvironment.map((linkedAddon) => {
    return {
      id: linkedAddon.addonId,
      name: linkedAddon.addonName,
      variables: linkedAddon.environment,
    };
  });
}

/**
 * @param {object} params
 * @param {CcApiClient} params.ccApiClient
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @returns {Promise<string>}
 */
async function fetchAppName({ ccApiClient, signal, ownerId, appId }) {
  const app = await ccApiClient.send(new GetApplicationCommand({ ownerId, applicationId: appId }), { signal });
  return app.name;
}
