import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
import { GetExposedEnvironmentCommand } from '@clevercloud/client/cc-api-commands/environment/get-exposed-environment-command.js';
import { UpdateExposedEnvironmentCommand } from '@clevercloud/client/cc-api-commands/environment/update-exposed-environment-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-form.js';

/**
 * @import { CcEnvVarForm } from './cc-env-var-form.js'
 * @import { EnvVarFormState, EnvVarFormStateLoaded, EnvVarFormStateSaving } from './cc-env-var-form.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-env-var-form[context="exposed-config"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcEnvVarForm>} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    updateComponent('state', { type: 'loading' });
    updateComponent('resourceId', appId);

    Promise.all([
      ccApiClient.send(new GetApplicationCommand({ ownerId, applicationId: appId }), { signal }),
      ccApiClient.send(new GetExposedEnvironmentCommand({ ownerId, applicationId: appId }), { signal }),
    ])
      .then(([app, variables]) => {
        updateComponent('appName', app.name);
        updateComponent('state', { type: 'loaded', validationMode: 'simple', variables });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-env-var-form-submit', (variables) => {
      updateComponent(
        'state',
        /** @param {EnvVarFormState} state */
        (state) => {
          state.type = 'saving';
        },
      );
      ccApiClient
        .send(new UpdateExposedEnvironmentCommand({ ownerId, applicationId: appId, environment: variables }))
        .then(() => {
          updateComponent(
            'state',
            /** @param {EnvVarFormStateSaving} state */
            (state) => {
              state.variables = variables;
            },
          );
          notifySuccess(i18n('cc-env-var-form.update.success'));
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
  },
});
