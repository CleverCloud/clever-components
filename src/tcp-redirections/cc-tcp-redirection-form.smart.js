import './cc-tcp-redirection-form.js';
import '../smart/cc-smart-container.js';
import { addTcpRedir, getTcpRedirs, removeTcpRedir } from '@clevercloud/client/esm/api/v2/application.js';
import { getNamespaces } from '@clevercloud/client/esm/api/v2/organisation.js';
import { fromCustomEvent, LastPromise, merge, unsubscribeWithSignal, withLatestFrom } from '../lib/observables.js';
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

    const namespaces_lp = new LastPromise();
    const redirections_lp = new LastPromise();

    const error$ = merge(namespaces_lp.error$, redirections_lp.error$);

    const redirections$ = redirections_lp.value$
      .pipe(withLatestFrom(namespaces_lp.value$));

    const onCreate$ = fromCustomEvent(component, 'cc-tcp-redirection:create')
      .pipe(withLatestFrom(context$));
    const onDelete$ = fromCustomEvent(component, 'cc-tcp-redirection:delete')
      .pipe(withLatestFrom(context$));

    function updateRedirectionState (newState) {
      component.redirections = component.redirections.map((oldState) => {
        if (oldState.namespace === newState.namespace) {
          return { ...oldState, waiting: false, error: false, ...newState };
        }
        return oldState;
      });
    }

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe(console.error),
      error$.subscribe((error) => {
        component.error = error.type;
      }),
      redirections$.subscribe(([redirections, namespaces]) => {
        component.redirections = namespaces.map((n) => {
          const sourcePort = redirections.find((r) => r.namespace === n.namespace)?.sourcePort;
          return { namespace: n.namespace, sourcePort };
        });
      }),

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
          namespaces_lp.push((signal) => fetchNamespaces({ apiConfig, signal, ownerId }));
          redirections_lp.push((signal) => fetchTcpRedirections({ apiConfig, signal, ownerId, appId }));
        }
      }),

    ]);
  },
});

function fetchNamespaces ({ apiConfig, signal, ownerId }) {
  return getNamespaces({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }));
}

function fetchTcpRedirections ({ apiConfig, signal, ownerId, appId }) {
  return getTcpRedirs({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }))
    .then((redirections) => {
      return redirections.map(({ namespace, port }) => ({ namespace, sourcePort: port }));
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
