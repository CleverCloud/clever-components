import './cc-env-var-form.js';
import '../smart/cc-smart-container.js';
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
import { fromCustomEvent, LastPromise, map, merge, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';
import { addErrorType } from '../lib/utils.js';

defineComponent({
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
    const onDismissedErrors$ = fromCustomEvent(component, 'cc-env-var-form:dismissed-error');

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe(console.error),
      error$.subscribe((error) => {
        component.error = error.type;
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

        component.error = null;
        component.saving = true;

        variables_lp.push(() => {
          return updateConfiguration({ apiConfig, realAddonId, variables })
            .then(() => variables)
            .catch(addErrorType('saving'));
        });
      }),

      onDismissedErrors$.subscribe(() => {
        component.error = null;
        component.saving = false;
      }),

      context$.subscribe(({ apiConfig, ownerId, addonId }) => {

        component.error = null;
        component.saving = false;
        component.variables = null;

        if (apiConfig != null && ownerId != null && addonId != null) {
          addon_lp.push((signal) => {
            return fetchAddon({ apiConfig, signal, ownerId, addonId }).catch(addErrorType('loading'));
          });
        }
      }),

      contextWithRealAddonId$.subscribe(({ apiConfig, realAddonId }) => {
        if (apiConfig != null && realAddonId != null) {
          variables_lp.push((signal) => {
            return fetchConfiguration({ apiConfig, signal, realAddonId }).catch(addErrorType('loading'));
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
  return updateConfigProviderEnv({ realAddonId }, variables).then(sendToApi({ apiConfig, signal }));
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
