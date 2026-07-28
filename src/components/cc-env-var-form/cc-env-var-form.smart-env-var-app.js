import {
  DEPLOY_APPLICATION_ERROR_CODES,
  DeployApplicationCommand,
} from '@clevercloud/client/cc-api-commands/application/deploy-application-command.js';
import { ListDeploymentCommand } from '@clevercloud/client/cc-api-commands/deployment/list-deployment-command.js';
import { GetEnvironmentCommand } from '@clevercloud/client/cc-api-commands/environment/get-environment-command.js';
import { UpdateEnvironmentCommand } from '@clevercloud/client/cc-api-commands/environment/update-environment-command.js';
import { isCcHttpErrorWithCode } from '@clevercloud/client/utils/error-utils.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcEnvVarsWasUpdatedEvent } from './cc-env-var-form.events.js';
import './cc-env-var-form.js';

/**
 * @import { CcEnvVarForm } from './cc-env-var-form.js'
 * @import { EnvVarFormState, EnvVarFormStateLoaded, EnvVarFormStateSaving } from './cc-env-var-form.types.js'
 * @import { EnvVar } from '../common.types.js'
 * @import { CcApiClient } from '@clevercloud/client/cc-api-client.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-env-var-form[context="env-var-app"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
    logsUrlPattern: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcEnvVarForm>} args
   */
  onContextUpdate({ context, onEvent, updateComponent, component, signal }) {
    const { apiConfig, ownerId, appId, logsUrlPattern } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', { type: 'loading' });
    updateComponent('resourceId', appId);
    updateComponent('restartApp', false);

    fetchEnvVars({ ccApiClient, signal, ownerId, appId })
      .then(
        /** @param {Array<EnvVar>} variables */
        (variables) => {
          updateComponent('state', { type: 'loaded', validationMode: 'simple', variables });
        },
      )
      .catch(
        /** @param {Error} error */
        (error) => {
          console.error(error);
          updateComponent('state', { type: 'error' });
        },
      );

    onEvent('cc-env-var-form-submit', (variables) => {
      updateComponent(
        'state',
        /** @param {EnvVarFormState} state */
        (state) => {
          state.type = 'saving';
        },
      );
      updateVariables({ ccApiClient, ownerId, appId, variables })
        .then(() => {
          updateComponent(
            'state',
            /** @param {EnvVarFormStateSaving} state */
            (state) => {
              state.variables = variables;
            },
          );
          notifySuccess(i18n('cc-env-var-form.update.success'));

          hasDeployments({ ccApiClient, ownerId, appId }).then((appHasDeployments) => {
            if (appHasDeployments) {
              updateComponent('restartApp', true);
            }
          });

          // Warn the console that env vars have been updated successfully so it can update the EOL variables list
          component.dispatchEvent(new CcEnvVarsWasUpdatedEvent(variables));
        })
        .catch(() => notifyError(i18n('cc-env-var-form.update.error')))
        .finally(() => {
          updateComponent(
            'state',
            /** @param {EnvVarFormStateLoaded} state */
            (state) => {
              state.type = 'loaded';
            },
          );
        });
    });

    onEvent('cc-application-restart', () => {
      redeployApp({ ccApiClient, ownerId, appId })
        .then(() => {
          updateComponent('restartApp', false);

          notifySuccess(
            i18n('cc-env-var-form.redeploy.success.text', { logsUrl: logsUrlPattern.replace(':id', appId) }),
            i18n('cc-env-var-form.redeploy.success.heading'),
          );
        })
        .catch((/** @type {Error} */ error) => {
          console.error(error);
          // The app has never been deployed at all, we cannot deploy it because there is no commit to deploy
          if (isCcHttpErrorWithCode(error, DEPLOY_APPLICATION_ERROR_CODES.NEVER_DEPLOYED)) {
            notifyError(i18n('cc-env-var-form.redeploy.error.app-stopped'));
          } else {
            notifyError(i18n('cc-env-var-form.redeploy.error'));
          }
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
 * @returns {Promise<Array<EnvVar>>}
 */
async function fetchEnvVars({ ccApiClient, signal, ownerId, appId }) {
  const { environment } = await ccApiClient.send(new GetEnvironmentCommand({ ownerId, applicationId: appId }), {
    signal,
  });
  return environment;
}

/**
 * @param {object} params
 * @param {CcApiClient} params.ccApiClient
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {Array<EnvVar>} params.variables
 * @returns {Promise<Array<EnvVar>>}
 */
function updateVariables({ ccApiClient, ownerId, appId, variables }) {
  return ccApiClient.send(new UpdateEnvironmentCommand({ ownerId, applicationId: appId, environment: variables }));
}

/**
 * @param {object} params
 * @param {CcApiClient} params.ccApiClient
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @returns {Promise<boolean>}
 */
async function hasDeployments({ ccApiClient, ownerId, appId }) {
  const deployments = await ccApiClient.send(new ListDeploymentCommand({ ownerId, applicationId: appId }));
  return deployments.length > 0;
}

/**
 * @param {object} params
 * @param {CcApiClient} params.ccApiClient
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @returns {Promise<{ deploymentId: string }>}
 */
function redeployApp({ ccApiClient, ownerId, appId }) {
  return ccApiClient.send(new DeployApplicationCommand({ ownerId, applicationId: appId }));
}
