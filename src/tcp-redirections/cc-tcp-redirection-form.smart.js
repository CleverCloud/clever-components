import './cc-tcp-redirection-form.js';
import '../smart/cc-smart-container.js';
import { addTcpRedir, getTcpRedirs, removeTcpRedir } from '@clevercloud/client/esm/api/v2/application.js';
import { getNamespaces } from '@clevercloud/client/esm/api/v2/organisation.js';
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
    function updateRedirectionState (newState) {
      component.redirections = component.redirections.map((oldState) => {
        if (oldState.namespace === newState.namespace) {
          return { ...oldState, waiting: false, error: false, ...newState };
        }
        return oldState;
      });
    }

    unsubscribeWithSignal(disconnectSignal, [

      redirections_lp.error$.subscribe(console.error),
      redirections_lp.error$.subscribe((error) => (component.error = error.type)),
      redirections_lp.value$.subscribe((redirections) => (component.redirections = redirections)),

      onCreate$.subscribe(([redirection, { apiConfig, ownerId, appId }]) => {
        const { namespace } = redirection;
        updateRedirectionState({ ...redirection, waiting: true });
        createTcpRedirection({ apiConfig, ownerId, appId, namespace })
          .then(({ port }) => updateRedirectionState({ ...redirection, sourcePort: port }))
          .catch(() => updateRedirectionState({ ...redirection, error: true }));
      }),

      onDelete$.subscribe(([redirection, { apiConfig, ownerId, appId }]) => {
        const { namespace, sourcePort } = redirection;
        updateRedirectionState({ ...redirection, waiting: true });
        deleteTcpRedirection({ apiConfig, ownerId, appId, sourcePort, namespace })
          .then(() => updateRedirectionState({ ...redirection, sourcePort: null }))
          .catch(() => updateRedirectionState({ ...redirection, error: true }));
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = null;
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
