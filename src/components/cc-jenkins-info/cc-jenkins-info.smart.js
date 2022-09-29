import './cc-jenkins-info.js';
import '../cc-smart-container/cc-smart-container.js';
import { getAddon, getJenkinsUpdates } from '@clevercloud/client/esm/api/v4/addon-providers.js';
import { defineSmartComponentWithObservables } from '../../lib/define-smart-component-with-observables.js';
import { LastPromise, unsubscribeWithSignal } from '../../lib/observables.js';
import { sendToApi } from '../../lib/send-to-api.js';

defineSmartComponentWithObservables({
  selector: 'cc-jenkins-info',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const jenkinsAddon_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      jenkinsAddon_lp.error$.subscribe(console.error),
      jenkinsAddon_lp.error$.subscribe(() => (component.error = true)),
      jenkinsAddon_lp.value$.subscribe((jenkinsAddon) => {
        component.jenkinsLink = jenkinsAddon.jenkinsLink;
        component.jenkinsManageLink = jenkinsAddon.jenkinsManageLink;
        component.versions = jenkinsAddon.versions;
      }),

      context$.subscribe(({ apiConfig, addonId }) => {

        component.error = false;
        component.jenkinsLink = null;
        component.jenkinsManageLink = null;
        component.versions = null;

        if (apiConfig != null && addonId != null) {
          jenkinsAddon_lp.push((signal) => fetchJenkinsAddon({ apiConfig, signal, addonId }));
        }
      }),

    ]);
  },
});

function fetchJenkinsAddon ({ apiConfig, signal, addonId }) {
  return Promise
    .all([
      getAddon({ providerId: 'jenkins', addonId }).then(sendToApi({ apiConfig, signal })),
      getJenkinsUpdates({ addonId }).then(sendToApi({ apiConfig, signal })),
    ])
    .then(([addon, jenkinsUpdates]) => {
      return {
        jenkinsLink: `https://${addon.host}`,
        jenkinsManageLink: jenkinsUpdates.manageLink,
        versions: jenkinsUpdates.versions,
      };
    });
}
