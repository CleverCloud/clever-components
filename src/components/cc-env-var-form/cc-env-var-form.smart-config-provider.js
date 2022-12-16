import './cc-env-var-form.js';
import '../cc-smart-container/cc-smart-container.js';
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
import { defineSmartComponentWithObservables } from '../../lib/define-smart-component-with-observables.js';
import { i18n } from '../../lib/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import {
  fromCustomEvent,
  LastPromise,
  map,
  merge,
  unsubscribeWithSignal,
  withLatestFrom,
} from '../../lib/observables.js';
import { sendToApi } from '../../lib/send-to-api.js';

defineSmartComponentWithObservables({
  selector: 'cc-env-var-form[context="config-provider"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const addon_lp = new LastPromise();
    const variables_lp = new LastPromise();

    const error$ = merge(addon_lp.error$, variables_lp.error$);

    const contextWithRealAddonId$ = addon_lp.value$
      .pipe(
        withLatestFrom(context$),
        map(([addon, context]) => ({ apiConfig: context.apiConfig, realAddonId: addon.realId })),
      );

    const onSubmit$ = fromCustomEvent(component, 'cc-env-var-form:submit')
      .pipe(withLatestFrom(contextWithRealAddonId$));

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe(console.error),
      error$.subscribe(() => {
        component.error = true;
        component.saving = false;
      }),
      addon_lp.value$.subscribe((addon) => {
        component.addonName = addon.name;
        component.saving = false;
      }),
      variables_lp.value$.subscribe((variables) => {
        component.variables = variables;
        component.saving = false;
      }),

      onSubmit$.subscribe(([variables, { apiConfig, realAddonId }]) => {

        component.error = false;
        component.saving = true;

        updateConfiguration({ apiConfig, realAddonId, variables })
          .then(() => {
            component.variables = variables;
            notifySuccess(i18n('cc-env-var-form.update.success'));
          })
          .catch(() => notifyError(i18n('cc-env-var-form.update.error')))
          .finally(() => {
            component.saving = false;
          });
      }),

      context$.subscribe(({ apiConfig, ownerId, addonId }) => {

        component.error = false;
        component.saving = false;
        component.variables = null;

        if (apiConfig != null && ownerId != null && addonId != null) {

          addon_lp.push((signal) => {
            return fetchAddon({ apiConfig, signal, ownerId, addonId });
          });
        }
      }),

      contextWithRealAddonId$.subscribe(({ apiConfig, realAddonId }) => {
        if (apiConfig != null && realAddonId != null) {
          variables_lp.push((signal) => {
            return fetchConfiguration({ apiConfig, signal, realAddonId });
          });
        }
      }),

    ]);
  },
});

function fetchAddon ({ apiConfig, signal, ownerId, addonId }) {

  return getAddon({ id: ownerId, addonId }).then(sendToApi({ apiConfig, signal }));
}

async function fetchConfiguration ({ apiConfig, signal, realAddonId }) {
  return getConfigProviderEnv({ realAddonId }).then(sendToApi({ apiConfig, signal }));
}

async function updateConfiguration ({ apiConfig, signal, realAddonId, variables }) {
  return updateConfigProviderEnv({ realAddonId }, variables)
    .then(sendToApi({ apiConfig, signal }));
}

// TODO clever-client
export function getConfigProviderEnv (params) {
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/config-provider/addons/${params.realAddonId}/env`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

// TODO clever-client
export function updateConfigProviderEnv (params, body) {
  return Promise.resolve({
    method: 'put',
    url: `/v4/addon-providers/config-provider/addons/${params.realAddonId}/env`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}
