import './cc-env-var-form.js';
import '../smart/cc-smart-container.js';
import { getAllEnvVars } from '@clevercloud/client/esm/api/v2/addon.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-env-var-form[context="env-var-addon"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const variables_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      variables_lp.error$.subscribe(console.error),
      variables_lp.error$.subscribe(() => (component.error = true)),
      variables_lp.value$.subscribe((variables) => (component.variables = variables)),

      context$.subscribe(({ apiConfig, ownerId, addonId }) => {

        component.error = false;
        component.variables = null;

        if (apiConfig != null && ownerId != null && addonId != null) {
          variables_lp.push((signal) => fetchEnvVars({ apiConfig, signal, ownerId, addonId }));
        }
      }),

    ]);
  },
});

function fetchEnvVars ({ apiConfig, signal, ownerId, addonId }) {
  return getAllEnvVars({ id: ownerId, addonId }).then(sendToApi({ apiConfig, signal }));
}
