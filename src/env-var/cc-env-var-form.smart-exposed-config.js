import './cc-env-var-form.js';
import '../smart/cc-smart-container.js';
import { getAllExposedEnvVars, updateAllExposedEnvVars } from '@clevercloud/client/esm/api/v2/application.js';
import { toNameValueObject } from '@clevercloud/client/esm/utils/env-vars.js';
import { fetchApp } from '../lib/api-helpers.js';
import { fromCustomEvent, LastPromise, merge, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';
import { addErrorType } from '../lib/utils.js';

defineComponent({
  selector: 'cc-env-var-form[context="exposed-config"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const app_lp = new LastPromise();
    const variables_lp = new LastPromise();

    const error$ = merge(app_lp.error$, variables_lp.error$);

    const onSubmit$ = fromCustomEvent(component, 'cc-env-var-form:submit')
      .pipe(withLatestFrom(context$));
    const onDismissedErrors$ = fromCustomEvent(component, 'cc-env-var-form:dismissed-error');

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe((error) => {
        component.error = error.type;
        component.saving = false;
      }),
      app_lp.value$.subscribe((app) => (component.appName = app.name)),
      variables_lp.value$.subscribe((variables) => {
        component.variables = variables;
        component.saving = false;
      }),

      onSubmit$.subscribe(([variables, { apiConfig, ownerId, appId }]) => {

        component.error = null;
        component.saving = true;

        variables_lp.push(() => {
          return updateExposedConfig({ apiConfig, ownerId, appId, variables })
            .then(() => variables)
            .catch(addErrorType('saving'));
        });
      }),

      onDismissedErrors$.subscribe(() => {
        component.error = null;
        component.saving = false;
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = null;
        component.saving = false;
        component.variables = null;

        if (ownerId != null && appId != null) {
          app_lp.push((signal) => {
            return fetchApp({ apiConfig, signal, ownerId, appId }).catch(addErrorType('loading'));
          });
          variables_lp.push((signal) => {
            return fetchExposedConfig({ apiConfig, signal, ownerId, appId }).catch(addErrorType('saving'));
          });
        }
      }),

    ]);
  },
});

function fetchExposedConfig ({ apiConfig, signal, ownerId, appId }) {
  return getAllExposedEnvVars({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal }))
    .then((exposedVarsObject) => {
      return Object.entries(exposedVarsObject)
        .map(([name, value]) => ({ name, value }));
    });
}

function updateExposedConfig ({ apiConfig, signal, ownerId, appId, variables }) {
  const variablesObject = toNameValueObject(variables);
  return updateAllExposedEnvVars({ id: ownerId, appId }, variablesObject).then(sendToApi({ apiConfig, signal }));
}
