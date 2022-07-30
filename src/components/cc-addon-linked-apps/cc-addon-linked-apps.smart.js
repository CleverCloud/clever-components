import './cc-addon-linked-apps.js';
import '../cc-smart-container/cc-smart-container.js';
import { getLinkedApplications } from '@clevercloud/client/esm/api/v2/addon.js';
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { LastPromise, unsubscribeWithSignal } from '../../lib/observables.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineComponent } from '../../lib/smart-manager.js';

defineComponent({
  selector: 'cc-addon-linked-apps',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const applications_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      applications_lp.error$.subscribe(console.error),
      applications_lp.error$.subscribe(() => (component.error = true)),
      applications_lp.value$.subscribe((applications) => (component.applications = applications)),

      context$.subscribe(({ apiConfig, ownerId, addonId }) => {

        component.error = false;
        component.applications = null;

        if (apiConfig != null && ownerId != null && addonId != null) {
          applications_lp.push((signal) => fetchApplications({ apiConfig, signal, ownerId, addonId }));
        }

      }),

    ]);
  },
});

function fetchApplications ({ apiConfig, signal, ownerId, addonId }) {
  return Promise
    .all([
      fetchZones({ apiConfig, signal }),
      fetchLinkedApplications({ apiConfig, signal, ownerId, addonId }),
    ])
    .then(([zones, applications]) => {
      return applications.map((app) => {
        const { name, instance } = app;
        const link = getApplicationLink(ownerId, app.id);
        const zone = zones.find((z) => z.name === app.zone);
        return { name, link, instance, zone };
      });
    });
}

function fetchZones ({ apiConfig, signal }) {
  return getAllZones().then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
}

function fetchLinkedApplications ({ apiConfig, signal, ownerId, addonId }) {
  return getLinkedApplications({ id: ownerId, addonId }).then(sendToApi({ apiConfig, signal }));
}

function getApplicationLink (ownerId, appId) {
  return ownerId.startsWith('orga_')
    ? `/organisations/${ownerId}/applications/${appId}`
    : `/users/me/applications/${appId}`;
}
