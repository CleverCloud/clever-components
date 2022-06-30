import './cc-tcp-redirection-form.js';
import '../smart/cc-smart-container.js';
import { addTcpRedir, getTcpRedirs, removeTcpRedir } from '@clevercloud/client/esm/api/v2/application.js';
import { getNamespaces } from '@clevercloud/client/esm/api/v2/organisation.js';
import { i18n } from '../lib/i18n.js';
import { notifyError, notifySuccess } from '../lib/notifications.js';
import { fromCustomEvent, LastPromise, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-tcp-redirection-form',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect: function (container, component, context$, disconnectSignal) {

    const redirections_lp = new LastPromise();

    const onCreate$ = fromCustomEvent(component, 'cc-tcp-redirection:create')
      .pipe(withLatestFrom(context$));
    const onDelete$ = fromCustomEvent(component, 'cc-tcp-redirection:delete')
      .pipe(withLatestFrom(context$));

    // TODO: we may need to rework this into something more "Observable" like
    function updateRedirectionState (namespace, newState) {
      component.redirections = component.redirections.map((redirection) => {
        if (redirection.namespace === namespace) {
          return { ...redirection, ...newState };
        }
        return redirection;
      });
    }

    unsubscribeWithSignal(disconnectSignal, [

      redirections_lp.error$.subscribe(console.error),
      redirections_lp.error$.subscribe(() => (component.error = true)),
      redirections_lp.value$.subscribe((redirections) => (component.redirections = redirections)),

      onCreate$.subscribe(([redirection, { apiConfig, ownerId, appId }]) => {
        const { namespace } = redirection;
        updateRedirectionState(namespace, { waiting: true });
        createTcpRedirection({ apiConfig, ownerId, appId, namespace })
          .then(({ port }) => {
            updateRedirectionState(namespace, { sourcePort: port });
            notifySuccess(component, i18n('cc-tcp-redirection-form.create.success', { namespace }));
          })
          .catch(() => notifyError(component, i18n('cc-tcp-redirection-form.create.error', { namespace })))
          .finally(() => updateRedirectionState(namespace, { waiting: false }));
      }),

      onDelete$.subscribe(([redirection, { apiConfig, ownerId, appId }]) => {
        const { namespace, sourcePort } = redirection;
        updateRedirectionState(namespace, { waiting: true });
        deleteTcpRedirection({ apiConfig, ownerId, appId, sourcePort, namespace })
          .then(() => {
            updateRedirectionState(namespace, { sourcePort: null });
            notifySuccess(component, i18n('cc-tcp-redirection-form.delete.success', { namespace }));
          })
          .catch(() => notifyError(component, i18n('cc-tcp-redirection-form.delete.error', { namespace })))
          .finally(() => updateRedirectionState(namespace, { waiting: false }));
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.redirections = null;

        if (apiConfig != null && ownerId != null && appId != null) {
          redirections_lp.push((signal) => fetchTcpRedirectionsAndNamespaces({ apiConfig, signal, ownerId, appId }));
        }
      }),

    ]);
  },
});

function fetchTcpRedirectionsAndNamespaces ({ apiConfig, signal, ownerId, appId }) {
  return Promise
    .all([
      getNamespaces({ id: ownerId }).then(sendToApi({ apiConfig, signal })),
      getTcpRedirs({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal })),
    ])
    .then(([namespaces, redirections]) => {
      return namespaces.map((n) => {
        const sourcePort = redirections.find((r) => r.namespace === n.namespace)?.port;
        return { namespace: n.namespace, sourcePort };
      });
    });
}

function createTcpRedirection ({ apiConfig, ownerId, appId, namespace }) {
  return addTcpRedir({ id: ownerId, appId, payment: 'accepted' }, { namespace })
    .then(sendToApi({ apiConfig }));
}

function deleteTcpRedirection ({ apiConfig, ownerId, appId, sourcePort, namespace }) {
  return removeTcpRedir({ id: ownerId, appId, sourcePort, namespace })
    .then(sendToApi({ apiConfig }));
}
