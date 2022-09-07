import './cc-tcp-redirection-form.js';
import '../cc-smart-container/cc-smart-container.js';
import { addTcpRedir, getTcpRedirs, removeTcpRedir } from '@clevercloud/client/esm/api/v2/application.js';
import { getNamespaces } from '@clevercloud/client/esm/api/v2/organisation.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineComponent } from '../../lib/smart-manager.js';
import { CcEventTarget } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';

document.addEventListener('click', (e) => {
  if (e.target.matches('button.toggle')) {
    const $container = document.querySelector('cc-smart-container');
    $container.context = {
      ...$container.context,
      appId: e.target.dataset.id,
    };
  }
  if (e.target.matches('button.connect')) {
    const $component = document.querySelector('cc-tcp-redirection-form');
    const $container = document.querySelector('cc-smart-container');
    $container.appendChild($component);
  }
  if (e.target.matches('button.disconnect')) {
    const $component = document.querySelector('cc-tcp-redirection-form');
    const $container = document.querySelector('.inert');
    $container.appendChild($component);
  }
});

defineComponent({
  selector: 'cc-tcp-redirection-form',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onContextUpdate ({ component, context, updateSignal }) {

    const target = new CcEventTarget();

    // Pierre : c'est un peu chiant de devoir check si tout est différent de null pour faire le fetch
    // Pierre : plus de magie pour faciliter l'écriture de tout ça avec des helpers
    // Pierre : nommage sur le onContextUpdate et sur le updateSignal, il faut creuser un peu

    const { apiConfig, ownerId, appId } = context;

    if (apiConfig == null || ownerId == null || appId == null) {
      return;
    }

    component.redirections = { state: 'loading' };

    target.on('redirections', (redirections) => {
      component.redirections = redirections;
    }, { signal: updateSignal });

    target.on('update-redirection', (newRedirection) => {
      component.redirections = {
        ...component.redirections,
        value: component.redirections.value.map((redirection) => {
          if (redirection.namespace === newRedirection.namespace) {
            return { ...redirection, ...newRedirection };
          }
          return redirection;
        }),
      };
    }, { signal: updateSignal });

    component.addEventListener('cc-tcp-redirection:create', ({ detail }) => {
      const namespace = detail.namespace;
      target.dispatch('update-redirection', { namespace, state: 'waiting' });
      createTcpRedirection({ apiConfig, ownerId, appId, namespace })
        .then((redirection) => {
          target.dispatch('update-redirection', { namespace, state: 'loaded', sourcePort: redirection.port });
          notifySuccess(component, i18n('cc-tcp-redirection-form.create.success', { namespace }));
        })
        .catch(() => {
          target.dispatch('update-redirection', { namespace, state: 'loaded' });
          notifyError(component, i18n('cc-tcp-redirection-form.create.error', { namespace }));
        });
    }, { signal: updateSignal });

    component.addEventListener('cc-tcp-redirection:delete', ({ detail }) => {
      const { namespace, sourcePort } = detail;
      target.dispatch('update-redirection', { namespace, state: 'waiting' });
      deleteTcpRedirection({ apiConfig, ownerId, appId, namespace, sourcePort })
        .then((redirection) => {
          target.dispatch('update-redirection', { namespace, state: 'loaded', sourcePort: null });
          notifySuccess(component, i18n('cc-tcp-redirection-form.delete.success', { namespace }));
        })
        .catch(() => {
          target.dispatch('update-redirection', { namespace, state: 'loaded' });
          notifyError(component, i18n('cc-tcp-redirection-form.delete.error', { namespace }));
        });
    }, { signal: updateSignal });

    fetchTcpRedirectionsAndNamespaces({ apiConfig, signal: updateSignal, ownerId, appId })
      .then((redirections) => {
        target.dispatch('redirections', {
          state: 'loaded',
          value: redirections.map((r) => ({ state: 'loaded', ...r })),
        });
      })
      .catch((error) => {
        console.error(error);
        target.dispatch('redirections', {
          state: 'error-loading',
        });
      });
  },
});

function sleep (delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

async function fetchTcpRedirectionsAndNamespaces ({ apiConfig, signal, ownerId, appId }) {

  if (appId === 'app_8f5610ab-1d9f-41b6-854f-85d9a115e417') {
    await sleep(2000);
  }

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

async function createTcpRedirection ({ apiConfig, ownerId, appId, namespace }) {
  if (appId === 'app_8f5610ab-1d9f-41b6-854f-85d9a115e417') {
    await sleep(2000);
  }
  return addTcpRedir({ id: ownerId, appId, payment: 'accepted' }, { namespace })
    .then(sendToApi({ apiConfig }));
}

async function deleteTcpRedirection ({ apiConfig, ownerId, appId, sourcePort, namespace }) {
  if (appId === 'app_8f5610ab-1d9f-41b6-854f-85d9a115e417') {
    await sleep(2000);
  }
  return removeTcpRedir({ id: ownerId, appId, sourcePort, namespace })
    .then(sendToApi({ apiConfig }));
}
