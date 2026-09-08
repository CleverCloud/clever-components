import { CreateTcpRedirectionCommand } from '@clevercloud/client/cc-api-commands/tcp-redirection/create-tcp-redirection-command.js';
import { DeleteTcpRedirectionCommand } from '@clevercloud/client/cc-api-commands/tcp-redirection/delete-tcp-redirection-command.js';
import { ListTcpRedirectionCommand } from '@clevercloud/client/cc-api-commands/tcp-redirection/list-tcp-redirection-command.js';
import { ListTcpRedirectionNamespaceCommand } from '@clevercloud/client/cc-api-commands/tcp-redirection/list-tcp-redirection-namespace-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
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
    const api = new Api({ apiConfig, signal });

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
      api
        .createTcpRedirection({ ownerId, appId, namespace })
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
      api
        .deleteTcpRedirection({ ownerId, appId, sourcePort, namespace })
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

    api
      .fetchTcpRedirectionsAndNamespaces({ ownerId, appId })
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

class Api {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, signal }) {
    this._ccApiClient = getCcApiClientWithOAuth(apiConfig);
    this._signal = signal;
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   */
  fetchNamespaces({ ownerId }) {
    return this._ccApiClient.send(new ListTcpRedirectionNamespaceCommand({ ownerId }), { signal: this._signal });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.appId
   */
  fetchRedirections({ ownerId, appId }) {
    return this._ccApiClient.send(new ListTcpRedirectionCommand({ ownerId, applicationId: appId }), {
      signal: this._signal,
    });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.appId
   * @returns {Promise<TcpRedirection[]>}
   */
  async fetchTcpRedirectionsAndNamespaces({ ownerId, appId }) {
    const [namespaces, redirections] = await Promise.all([
      this.fetchNamespaces({ ownerId }),
      this.fetchRedirections({ ownerId, appId }),
    ]);
    return namespaces.map(({ namespace }) => {
      const sourcePort = redirections.find((redirection) => redirection.namespace === namespace)?.port;
      const isPrivate = !PUBLIC_NAMESPACES.includes(namespace);
      return { namespace, sourcePort, isPrivate };
    });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.appId
   * @param {string} params.namespace
   * @returns {Promise<{ port: number }>}
   */
  createTcpRedirection({ ownerId, appId, namespace }) {
    return this._ccApiClient.send(new CreateTcpRedirectionCommand({ ownerId, applicationId: appId, namespace }), {
      signal: this._signal,
    });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.appId
   * @param {number|null} params.sourcePort
   * @param {string} params.namespace
   * @returns {Promise<void>}
   */
  deleteTcpRedirection({ ownerId, appId, sourcePort, namespace }) {
    return this._ccApiClient.send(
      new DeleteTcpRedirectionCommand({ ownerId, applicationId: appId, namespace, port: sourcePort }),
      { signal: this._signal },
    );
  }
}
