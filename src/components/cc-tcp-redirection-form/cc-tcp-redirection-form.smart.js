import { addTcpRedir, getTcpRedirs, removeTcpRedir } from '@clevercloud/client/esm/api/v2/application.js';
import { getNamespaces } from '@clevercloud/client/esm/api/v2/organisation.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-tcp-redirection-form.js';

/**
 * @import { CcTcpRedirectionForm } from './cc-tcp-redirection-form.js'
 * @import { TcpRedirection, TcpRedirectionState } from '../cc-tcp-redirection/cc-tcp-redirection.types.js'
 * @import { TcpRedirectionFormStateLoaded } from '../cc-tcp-redirection-form/cc-tcp-redirection-form.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 * @typedef {[{namespace: string}]} NamespacesApiPayload
 * @typedef {[{namespace: string, port: number}]} RedirectionsApiPayload
 */

const PUBLIC_NAMESPACES = ['default', 'cleverapps'];

defineSmartComponent({
  selector: 'cc-tcp-redirection-form',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcTcpRedirectionForm>} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;

    /**
     * @param {string} namespace
     * @param {(redirectionState: TcpRedirectionState) => void} callback
     */
    function updateRedirection(namespace, callback) {
      updateComponent(
        'state',
        /** @param {TcpRedirectionFormStateLoaded} redirectionFormState */
        (redirectionFormState) => {
          const redirectionState = redirectionFormState.redirections.find(
            (redirectionState) => redirectionState.namespace === namespace,
          );
          if (redirectionState != null) {
            callback(redirectionState);
          }
        },
      );
    }

    onEvent('cc-tcp-redirection-create', ({ namespace }) => {
      updateRedirection(namespace, (redirectionState) => {
        redirectionState.type = 'waiting';
      });
      createTcpRedirection({ apiConfig, ownerId, appId, namespace })
        .then(({ port }) => {
          notifySuccess(i18n('cc-tcp-redirection-form.create.success', { namespace }));
          updateRedirection(namespace, (redirectionState) => {
            redirectionState.type = 'loaded';
            // @ts-expect-error TypeScript is unable to infer that the state type is 'loaded' because we defined it just above
            redirectionState.sourcePort = port;
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-tcp-redirection-form.create.error', { namespace }));
          updateRedirection(namespace, (redirectionState) => {
            redirectionState.type = 'loaded';
          });
        });
    });

    onEvent('cc-tcp-redirection-delete', ({ namespace, sourcePort }) => {
      updateRedirection(namespace, (redirectionState) => {
        redirectionState.type = 'waiting';
      });
      deleteTcpRedirection({ apiConfig, ownerId, appId, sourcePort, namespace })
        .then(() => {
          notifySuccess(i18n('cc-tcp-redirection-form.delete.success', { namespace }));
          updateRedirection(namespace, (redirectionState) => {
            redirectionState.type = 'loaded';
            // @ts-expect-error TypeScript is unable to infer that the state type is 'loaded' because we defined it just above
            redirectionState.sourcePort = null;
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-tcp-redirection-form.delete.error', { namespace }));
          updateRedirection(namespace, (redirectionState) => {
            redirectionState.type = 'loaded';
          });
        });
    });

    updateComponent('state', { type: 'loading' });
    updateComponent('applicationId', appId);

    fetchTcpRedirectionsAndNamespaces({ apiConfig, ownerId, appId, signal })
      .then((redirections) => {
        updateComponent('state', {
          type: 'loaded',
          redirections: redirections.map((redirection) => ({ type: 'loaded', ...redirection })),
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
 * @param {Object} settings
 * @param {ApiConfig} settings.apiConfig
 * @param {AbortSignal} settings.signal
 * @param {string} settings.ownerId
 * @param {string} settings.appId
 * @returns {Promise<TcpRedirection[]>}
 */
async function fetchTcpRedirectionsAndNamespaces({ apiConfig, signal, ownerId, appId }) {
  return Promise.all([
    getNamespaces({ id: ownerId }).then(sendToApi({ apiConfig, signal })),
    getTcpRedirs({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal })),
  ]).then(
    /** @param {[NamespacesApiPayload, RedirectionsApiPayload]} apiResponse */
    ([namespaces, redirections]) => {
      return namespaces.map(({ namespace }) => {
        const sourcePort = redirections.find((redirection) => redirection.namespace === namespace)?.port;
        const isPrivate = !PUBLIC_NAMESPACES.includes(namespace);
        return { namespace, sourcePort, isPrivate };
      });
    },
  );
}

/**
 * @param {Object} settings
 * @param {ApiConfig} settings.apiConfig
 * @param {string} settings.ownerId
 * @param {string} settings.appId
 * @param {string} settings.namespace
 * @returns {Promise<{ port: number }>}
 */
async function createTcpRedirection({ apiConfig, ownerId, appId, namespace }) {
  return addTcpRedir({ id: ownerId, appId }, { namespace }).then(sendToApi({ apiConfig }));
}

/**
 * @param {Object} settings
 * @param {ApiConfig} settings.apiConfig
 * @param {string} settings.ownerId
 * @param {string} settings.appId
 * @param {number|null} settings.sourcePort
 * @param {string} settings.namespace
 * @returns {Promise<void>}
 */
async function deleteTcpRedirection({ apiConfig, ownerId, appId, sourcePort, namespace }) {
  return removeTcpRedir({ id: ownerId, appId, sourcePort: sourcePort?.toString(), namespace }).then(
    sendToApi({ apiConfig }),
  );
}
