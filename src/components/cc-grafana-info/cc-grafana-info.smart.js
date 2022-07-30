import './cc-grafana-info.js';
import '../cc-smart-container/cc-smart-container.js';
import {
  createGrafanaOrganisation,
  deleteGrafanaOrganisation,
  getGrafanaOrganisation,
  resetGrafanaOrganisation,
} from '../../lib/api-helpers.js';
import { i18n } from '../../lib/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { fromCustomEvent, LastPromise, unsubscribeWithSignal, withLatestFrom } from '../../lib/observables.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineComponent } from '../../lib/smart-manager.js';

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

    const onReset$ = fromCustomEvent(component, 'cc-grafana-info:reset')
      .pipe(withLatestFrom(context$));
    const onDisable$ = fromCustomEvent(component, 'cc-grafana-info:disable')
      .pipe(withLatestFrom(context$));
    const onEnable$ = fromCustomEvent(component, 'cc-grafana-info:enable')
      .pipe(withLatestFrom(context$));

    unsubscribeWithSignal(disconnectSignal, [

      grafana_lp.error$.subscribe(console.error),
      grafana_lp.error$.subscribe(() => {
        component.error = 'loading';
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

      onReset$.subscribe(([variables, { apiConfig, ownerId }]) => {

        component.error = false;
        component.waiting = 'resetting';

        doResetGrafanaOrganisation({ apiConfig, ownerId })
          .then(() => notifySuccess(component, i18n('cc-grafana-info.reset.success')))
          .catch(() => notifyError(component, i18n('cc-grafana-info.reset.error')))
          .finally(() => {
            component.waiting = false;
          });
      }),

      onDisable$.subscribe(([variables, { apiConfig, ownerId }]) => {

        component.error = false;
        component.waiting = 'disabling';

        disableGrafanaOrganisation({ apiConfig, ownerId })
          .then(() => {
            component.status = 'disabled';
            component.link = null;
            notifySuccess(component, i18n('cc-grafana-info.disable.success'));
          })
          .catch(() => notifyError(component, i18n('cc-grafana-info.disable.error')))
          .finally(() => {
            component.waiting = false;
          });
      }),

      onEnable$.subscribe(([_, { apiConfig, ownerId, grafanaBaseLink }]) => {

        component.error = false;
        component.waiting = 'enabling';

        enableGrafanaOrganisation({ apiConfig, ownerId })
          .then(() => {
            grafana_lp.push((signal) => fetchGrafanaOrganisation({ apiConfig, signal, ownerId, grafanaBaseLink }));
            notifySuccess(component, i18n('cc-grafana-info.enable.success'));
          })
          .catch(() => notifyError(component, i18n('cc-grafana-info.enable.error')))
          .finally(() => {
            component.waiting = false;
          });
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
        return { status: 'disabled', link: null };
      }
      else {
        throw error;
      }
    });
}

function doResetGrafanaOrganisation ({ apiConfig, ownerId }) {
  return resetGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig }));
}

function disableGrafanaOrganisation ({ apiConfig, ownerId }) {
  return deleteGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig }));
}

function enableGrafanaOrganisation ({ apiConfig, ownerId }) {
  return createGrafanaOrganisation({ id: ownerId })
    .then(sendToApi({ apiConfig }));
}
