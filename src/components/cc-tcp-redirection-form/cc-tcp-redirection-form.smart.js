import './cc-tcp-redirection-form.js';
import '../cc-smart-container/cc-smart-container.js';
import { addTcpRedir, getTcpRedirs, removeTcpRedir } from '@clevercloud/client/esm/api/v2/application.js';
import { getNamespaces } from '@clevercloud/client/esm/api/v2/organisation.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { i18n } from '../../lib/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';

defineSmartComponent({
  selector: 'cc-tcp-redirection-form',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onContextUpdate ({ container, component, context, onEvent, updateComponent, signal }) {

    const { apiConfig, ownerId, appId } = context;

    function updateRedirection (namespace, callback) {
      updateComponent('redirections', (redirections) => {
        const redirection = redirections.value.find((r) => r.namespace === namespace);
        if (redirection != null) {
          callback(redirection);
        }
      });
    }

    onEvent('cc-tcp-redirection:create', ({ namespace }) => {
      updateRedirection(namespace, (redirection) => {
        redirection.state = 'waiting';
      });
      createTcpRedirection({ apiConfig, ownerId, appId, namespace })
        .then(({ port }) => {
          notifySuccess(component, i18n('cc-tcp-redirection-form.create.success', { namespace }));
          updateRedirection(namespace, (redirection) => {
            redirection.state = 'loaded';
            redirection.sourcePort = port;
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(component, i18n('cc-tcp-redirection-form.create.error', { namespace }));
          updateRedirection(namespace, (redirection) => {
            redirection.state = 'loaded';
          });
        });
    });

    onEvent('cc-tcp-redirection:delete', ({ namespace, sourcePort }) => {
      updateRedirection(namespace, (redirection) => {
        redirection.state = 'waiting';
      });
      deleteTcpRedirection({ apiConfig, ownerId, appId, sourcePort, namespace })
        .then(() => {
          notifySuccess(component, i18n('cc-tcp-redirection-form.delete.success', { namespace }));
          updateRedirection(namespace, (redirection) => {
            redirection.state = 'loaded';
            redirection.sourcePort = null;
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(component, i18n('cc-tcp-redirection-form.delete.error', { namespace }));
          updateRedirection(namespace, (redirection) => {
            redirection.state = 'loaded';
          });
        });
    });

    updateComponent('redirections', { state: 'loading' });

    fetchTcpRedirectionsAndNamespaces({ apiConfig, ownerId, appId, signal })
      .then((redirections) => {
        updateComponent('redirections', {
          state: 'loaded',
          value: redirections.map((r) => ({ state: 'loaded', ...r })),
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('redirections', { state: 'error' });
      });
  },
});

async function fetchTcpRedirectionsAndNamespaces ({ apiConfig, signal, ownerId, appId }) {
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
  return addTcpRedir({ id: ownerId, appId, payment: 'accepted' }, { namespace })
    .then(sendToApi({ apiConfig }));
}

async function deleteTcpRedirection ({ apiConfig, ownerId, appId, sourcePort, namespace }) {
  return removeTcpRedir({ id: ownerId, appId, sourcePort, namespace })
    .then(sendToApi({ apiConfig }));
}
