import './cc-jenkins-info.js';
import '../smart/cc-smart-container.js';
import { getAddon, getJenkinsUpdates } from '@clevercloud/client/esm/api/v4/addon-providers.js';
import { combineLatest, LastPromise, merge, unsubscribeWithSignal } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-jenkins-info',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const addon_lp = new LastPromise();
    const jenkinsUpdates_lp = new LastPromise();
    const addonUpdateCenter = combineLatest(addon_lp.value$, jenkinsUpdates_lp.value$);

    const error$ = merge(addon_lp.error$, jenkinsUpdates_lp.error$);

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe(console.error),
      error$.subscribe(() => (component.error = true)),
      addonUpdateCenter.subscribe(([addon, updateCenter]) => {
        component.jenkinsLink = `https://${addon.host}`;
        component.jenkinsManageLink = updateCenter.manageLink;
        component.versions = updateCenter.versions;
      }),

      context$.subscribe(({ apiConfig, addonId }) => {

        component.error = false;
        component.jenkinsManageLink = null;
        component.versions = null;

        if (apiConfig != null && addonId != null) {
          addon_lp.push((signal) => fetchAddon({ apiConfig, signal, addonId }));
          jenkinsUpdates_lp.push((signal) => fetchUpdates({ apiConfig, signal, addonId }));
        }
      }),

    ]);
  },
});

function fetchUpdates ({ apiConfig, signal, addonId }) {
  return getJenkinsUpdates({ addonId }).then(sendToApi({ apiConfig, signal }));
}

function fetchAddon ({ apiConfig, signal, addonId }) {
  return getAddon({ providerId: 'jenkins', addonId }).then(sendToApi({ apiConfig, signal }));
}
