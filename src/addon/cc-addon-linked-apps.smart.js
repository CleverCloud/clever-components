import './cc-addon-linked-apps.js';
import '../smart/cc-smart-container.js';
import { getLinkedApplications } from '@clevercloud/client/esm/api/v2/addon.js';
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { combineLatest, LastPromise, merge, unsubscribeWithSignal } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-addon-linked-apps',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const zones_lp = new LastPromise();
    const linkedApps_lp = new LastPromise();

    const error$ = merge(zones_lp.error$, linkedApps_lp.error$);
    const linkedAppsAndZones = combineLatest(zones_lp.value$, linkedApps_lp.value$);

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe(console.error),
      error$.subscribe(() => (component.error = true)),
      linkedAppsAndZones.subscribe(([zones, applications]) => {
        component.applications = applications.map((app) => {
          const zone = zones.find((z) => z.name === app.zoneName);
          return { ...app, zone };
        });
      }),

      context$.subscribe(({ apiConfig, ownerId, addonId }) => {

        component.error = false;
        component.applications = null;

        if (apiConfig != null && ownerId != null && addonId != null) {
          zones_lp.push((signal) => fetchZones({ apiConfig, signal }));
          linkedApps_lp.push((signal) => fetchLinkedApplications({ apiConfig, signal, ownerId, addonId }));
        }

      }),

    ]);
  },
});

function fetchZones ({ apiConfig, signal }) {
  return getAllZones().then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
}

function fetchLinkedApplications ({ apiConfig, signal, ownerId, addonId }) {
  return getLinkedApplications({ id: ownerId, addonId })
    .then(sendToApi({ apiConfig, signal }))
    .then((linkedApps) => {
      return linkedApps.map((app) => {
        const { name, instance, zone } = app;
        const link = getApplicationLink(ownerId, app.id);
        return { name, link, instance, zoneName: zone };
      });
    });
}

function getApplicationLink (ownerId, appId) {
  return ownerId.startsWith('orga_')
    ? `/organisations/${ownerId}/applications/${appId}`
    : `/users/me/applications/${appId}`;
}
