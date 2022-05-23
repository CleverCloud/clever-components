import './cc-grafana-info.js';
import '../smart/cc-smart-container.js';
import {
  createGrafanaOrganisation,
  deleteGrafanaOrganisation,
  getGrafanaOrganisation,
  resetGrafanaOrganisation,
} from '../lib/api-helpers.js';
import { fromCustomEvent, LastPromise, merge, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';
import { addErrorType } from '../lib/utils.js';

// TODO, we need to refactor this one to make it more like the others
defineComponent({
  selector: 'cc-grafana-info',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    grafanaBaseLink: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const grafana_lp = new LastPromise();
    const reset_lp = new LastPromise();

    const onReset$ = fromCustomEvent(component, 'cc-grafana-info:reset')
      .pipe(withLatestFrom(context$));
    const onDisable$ = fromCustomEvent(component, 'cc-grafana-info:disable')
      .pipe(withLatestFrom(context$));
    const onEnable$ = fromCustomEvent(component, 'cc-grafana-info:enable')
      .pipe(withLatestFrom(context$));

    const error$ = merge(grafana_lp.error$, reset_lp.error$);

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe(console.error),
      error$.subscribe((error) => {
        component.error = error.type;
        component.waiting = false;
      }),

      grafana_lp.value$.subscribe((product) => {
        component.status = product.status;
        if (component.status === 'enabled' && product.link == null) {
          component.error = 'link-grafana';
        }
        else {
          component.link = product.link;
        }
        component.waiting = false;
      }),

      reset_lp.value$.subscribe(() => {
        component.waiting = false;
      }),

      onReset$.subscribe(([variables, { apiConfig, ownerId }]) => {

        component.error = false;
        component.waiting = 'resetting';

        if (apiConfig != null && ownerId != null) {
          reset_lp.push((signal) => doResetGrafanaOrganisation({ apiConfig, signal, ownerId }));
        }
        else {
          component.error = 'resetting';
        }
      }),

      onDisable$.subscribe(([variables, { apiConfig, ownerId }]) => {

        component.error = false;
        component.waiting = 'disabling';

        if (apiConfig != null && ownerId != null) {
          grafana_lp.push((signal) => disableGrafanaOrganisation({ apiConfig, signal, ownerId }));
        }
        else {
          component.error = 'disabling';
        }
      }),

      onEnable$.subscribe(([variables, { apiConfig, ownerId, grafanaBaseLink }]) => {

        component.error = false;
        component.waiting = 'enabling';

        if (apiConfig != null && ownerId != null && grafanaBaseLink != null) {
          grafana_lp.push((signal) => enableGrafanaOrganisation({ apiConfig, signal, ownerId, grafanaBaseLink }));
        }
        else {
          component.error = 'enabling';
        }
      }),

      context$.subscribe(({ apiConfig, ownerId, grafanaBaseLink }) => {

        component.error = false;
        component.link = null;
        component.status = null;
        component.waiting = false;

        if (apiConfig != null && ownerId != null && grafanaBaseLink != null) {
          grafana_lp.push((signal) => fetchGrafanaOrganisation({ apiConfig, signal, ownerId, grafanaBaseLink }));
        }
      }),

    ]);

  },
});

const DISABLED_GRAFANA = { status: 'disabled', link: null };

function fetchGrafanaOrganisation ({ apiConfig, signal, ownerId, grafanaBaseLink }) {
  return getGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .then((exposedVarsObject) => {
      const grafanaLink = new URL('/d/home/clever-cloud-metrics-home', grafanaBaseLink);
      grafanaLink.searchParams.set('orgId', exposedVarsObject.id);
      return { status: 'enabled', link: grafanaLink.toString() };
    })
    .catch((error) => {
      if (error.response?.status === 404 && error.toString().startsWith('Error: Grafana organization not found')) {
        return DISABLED_GRAFANA;
      }
      else {
        throw error;
      }
    })
    .catch(addErrorType('loading'));
}

function doResetGrafanaOrganisation ({ apiConfig, signal, ownerId }) {
  return resetGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .catch(addErrorType('resetting'));
}

function disableGrafanaOrganisation ({ apiConfig, signal, ownerId }) {
  return deleteGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .then(() => DISABLED_GRAFANA)
    .catch(addErrorType('disabling'));
}

async function enableGrafanaOrganisation ({ apiConfig, signal, ownerId, grafanaBaseLink }) {
  await createGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .catch(addErrorType('enabling'));
  return await fetchGrafanaOrganisation({ apiConfig, signal, ownerId, grafanaBaseLink });
}
