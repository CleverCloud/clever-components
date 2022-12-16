import './cc-env-var-form.js';
import '../cc-smart-container/cc-smart-container.js';
import { getAllExposedEnvVars, updateAllExposedEnvVars } from '@clevercloud/client/esm/api/v2/application.js';
import { toNameValueObject } from '@clevercloud/client/esm/utils/env-vars.js';
import { fetchApp } from '../../lib/api-helpers.js';
import { defineSmartComponentWithObservables } from '../../lib/define-smart-component-with-observables.js';
import { i18n } from '../../lib/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { fromCustomEvent, LastPromise, merge, unsubscribeWithSignal, withLatestFrom } from '../../lib/observables.js';
import { sendToApi } from '../../lib/send-to-api.js';

defineSmartComponentWithObservables({
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

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe(console.error),
      error$.subscribe(() => {
        component.error = true;
        component.saving = false;
      }),
      app_lp.value$.subscribe((app) => (component.appName = app.name)),
      variables_lp.value$.subscribe((variables) => {
        component.variables = variables;
        component.saving = false;
      }),

      onSubmit$.subscribe(([variables, { apiConfig, ownerId, appId }]) => {

        component.error = false;
        component.saving = true;

        updateExposedConfig({ apiConfig, ownerId, appId, variables })
          .then(() => {
            component.variables = variables;
            notifySuccess(i18n('cc-env-var-form.update.success'));
          })
          .catch(() => notifyError(i18n('cc-env-var-form.update.error')))
          .finally(() => {
            component.saving = false;
          });
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.saving = false;
        component.variables = null;

        if (apiConfig != null && ownerId != null && appId != null) {
          app_lp.push((signal) => {
            return fetchApp({ apiConfig, signal, ownerId, appId });
          });
          variables_lp.push((signal) => {
            return fetchExposedConfig({ apiConfig, signal, ownerId, appId });
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
  return updateAllExposedEnvVars({ id: ownerId, appId }, variablesObject)
    .then(sendToApi({ apiConfig, signal }));
}
