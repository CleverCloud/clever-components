import {
  CREATE_DOMAIN_ERROR_CODES,
  CreateDomainCommand,
} from '@clevercloud/client/cc-api-commands/domain/create-domain-command.js';
import { DeleteDomainCommand } from '@clevercloud/client/cc-api-commands/domain/delete-domain-command.js';
import { ListDomainCommand } from '@clevercloud/client/cc-api-commands/domain/list-domain-command.js';
import {
  SET_PRIMARY_DOMAIN_ERROR_CODES,
  SetPrimaryDomainCommand,
} from '@clevercloud/client/cc-api-commands/domain/set-primary-domain-command.js';
import { UnsetPrimaryDomainCommand } from '@clevercloud/client/cc-api-commands/domain/unset-primary-domain-command.js';
import { GetLoadBalancerInfoCommand } from '@clevercloud/client/cc-api-commands/load-balancer/get-load-balancer-info-command.js';
import { getHostWithWildcard, isTestDomain, parseDomain } from '@clevercloud/client/utils/domain-utils.js';
import { isCcHttpErrorWithCode } from '@clevercloud/client/utils/error-utils.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcDomainPrimaryChangeEvent } from './cc-domain-management.events.js';
import { CcDomainManagement } from './cc-domain-management.js';

/**
 * @import { DomainManagementListStateLoaded, DomainStateIdle, DomainState } from './cc-domain-management.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-domain-management',
  params: {
    apiConfig: { type: Object },
    appId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcDomainManagement>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, appId, ownerId } = context;
    updateComponent('applicationId', appId);

    /**
     * @param {string} id
     * @param {(domainState: DomainState) => void} callback
     **/
    function updateDomain(id, callback) {
      updateComponent(
        'domainListState',
        /** @param {DomainManagementListStateLoaded} domainListState */
        (domainListState) => {
          const domainState = domainListState.domains.find((domain) => domain.id === id);
          if (domainState != null) {
            callback(domainState);
          }
        },
      );
    }

    /**
     * The primary domain is not always set on the application: when it isn't, the client guesses
     * one from the list itself. Adding or removing a domain can therefore move the primary flag,
     * so the list is refetched instead of being patched locally.
     *
     * @returns {Promise<void>}
     */
    function refreshDomainList() {
      return getDomains({ apiConfig, ownerId, appId, signal })
        .then((domains) => {
          updateComponent('domainListState', { type: 'loaded', domains });
        })
        .catch((error) => {
          console.error(error);
          updateComponent('domainListState', { type: 'error' });
        });
    }

    refreshDomainList();

    fetchDnsInfo({ apiConfig, ownerId, appId, signal })
      .then(({ cnameRecord, aRecords }) => {
        updateComponent('dnsInfoState', { type: 'loaded', cnameRecord, aRecords });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('dnsInfoState', { type: 'error' });
      });

    onEvent('cc-domain-add', ({ hostname, pathPrefix, isWildcard }) => {
      const domainWithPathAndWildcard = getHostWithWildcard(hostname + pathPrefix, isWildcard);
      updateComponent('domainFormState', (domainFormState) => {
        domainFormState.type = 'adding';
      });

      createNewDomain({ apiConfig, ownerId, appId, hostname, pathPrefix, isWildcard })
        .then(() => {
          if (isTestDomain(hostname)) {
            notifySuccess(i18n('cc-domain-management.form.submit.success', { domain: domainWithPathAndWildcard }));
          } else {
            notify({
              intent: 'info',
              message: i18n('cc-domain-management.form.submit.success-config', { domain: domainWithPathAndWildcard }),
              options: {
                timeout: 0,
                closeable: true,
              },
            });
          }
          updateComponent('domainFormState', CcDomainManagement.INIT_DOMAIN_FORM_STATE);
          return refreshDomainList();
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);

            updateComponent('domainFormState', (domainFormState) => {
              domainFormState.type = 'idle';
            });

            if (isCcHttpErrorWithCode(error, CREATE_DOMAIN_ERROR_CODES.INVALID_FORMAT)) {
              updateComponent('domainFormState', (domainFormState) => {
                domainFormState.hostname.error = { code: 'invalid-format' };
              });
              return;
            }

            if (isCcHttpErrorWithCode(error, CREATE_DOMAIN_ERROR_CODES.ALREADY_USED)) {
              notifyError(
                i18n('cc-domain-management.form.submit.error-duplicate.text', { domain: domainWithPathAndWildcard }),
                i18n('cc-domain-management.form.submit.error-duplicate.heading'),
              );
              return;
            }

            notifyError(i18n('cc-domain-management.form.submit.error', { domain: domainWithPathAndWildcard }));
          },
        );
    });

    onEvent('cc-domain-delete', ({ id, hostname, pathPrefix, isWildcard }) => {
      const domainWithPathAndWildcard = getHostWithWildcard(hostname + pathPrefix, isWildcard);
      updateDomain(id, (domainState) => {
        domainState.type = 'deleting';
      });

      deleteDomain({ apiConfig, ownerId, appId, id })
        .then(() => {
          notifySuccess(i18n('cc-domain-management.list.delete.success', { domain: domainWithPathAndWildcard }));
          return refreshDomainList();
        })
        .catch((error) => {
          console.error(error);

          notifyError(i18n('cc-domain-management.list.delete.error', { domain: domainWithPathAndWildcard }));

          updateDomain(id, (domainState) => {
            domainState.type = 'idle';
          });
        });
    });

    onEvent('cc-domain-mark-as-primary', ({ id, hostname, pathPrefix, isWildcard }) => {
      const domainWithPathAndWildcard = getHostWithWildcard(hostname + pathPrefix, isWildcard);
      updateDomain(id, (domainState) => {
        domainState.type = 'marking-primary';
      });

      markAsPrimaryDomain({ apiConfig, ownerId, appId, id })
        .then(() => {
          updateComponent(
            'domainListState',
            /** @param {DomainManagementListStateLoaded} domainListState */
            (domainListState) => {
              domainListState.domains = domainListState.domains.map((domainState) => ({
                ...domainState,
                type: 'idle',
                isPrimary: domainState.id === id,
              }));
            },
          );

          // Dispatch event to make the console refresh its UI
          component.dispatchEvent(new CcDomainPrimaryChangeEvent(id));

          notifySuccess(i18n('cc-domain-management.list.primary.success', { domain: domainWithPathAndWildcard }));
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            updateDomain(id, (domainState) => {
              domainState.type = 'idle';
            });

            if (isCcHttpErrorWithCode(error, SET_PRIMARY_DOMAIN_ERROR_CODES.NOT_FOUND)) {
              notifyError(
                i18n('cc-domain-management.list.error-not-found.text', { domain: domainWithPathAndWildcard }),
                i18n('cc-domain-management.list.error-not-found.heading'),
              );
              return;
            }

            notifyError(i18n('cc-domain-management.list.primary.error', { domain: domainWithPathAndWildcard }));
          },
        );
    });
  },
});

/**
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {AbortSignal} params.signal
 * @returns {Promise<DomainStateIdle[]>}
 */
function getDomains({ apiConfig, ownerId, appId, signal }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  return ccApiClient.send(new ListDomainCommand({ ownerId, applicationId: appId }), { signal }).then((domains) => {
    return domains.map(({ domain, isPrimary }) => {
      const { hostname, pathPrefix, isWildcard } = parseDomain(domain);

      /** @type {DomainStateIdle} */
      const formattedDomain = {
        id: domain,
        type: 'idle',
        hostname,
        pathPrefix,
        isWildcard,
        isPrimary,
      };

      return formattedDomain;
    });
  });
}

/**
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {string} params.hostname
 * @param {string} params.pathPrefix
 * @param {boolean} params.isWildcard
 * @returns {Promise<void>}
 */
function createNewDomain({ apiConfig, ownerId, appId, hostname, pathPrefix, isWildcard }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  const domainWithPathAndWildcard = getHostWithWildcard(hostname, isWildcard) + pathPrefix;
  return ccApiClient.send(
    new CreateDomainCommand({ ownerId, applicationId: appId, domain: domainWithPathAndWildcard }),
  );
}

/**
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {string} params.id
 * @returns {Promise<void>}
 */
function deleteDomain({ apiConfig, ownerId, appId, id }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  return ccApiClient.send(new DeleteDomainCommand({ ownerId, applicationId: appId, domain: id }));
}

/**
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {string} params.id
 * @returns {Promise<void>}
 */
async function markAsPrimaryDomain({ apiConfig, ownerId, appId, id }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  await ccApiClient.send(new UnsetPrimaryDomainCommand({ ownerId, applicationId: appId }));
  await ccApiClient.send(new SetPrimaryDomainCommand({ ownerId, applicationId: appId, domain: id }));
}

/**
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {AbortSignal} params.signal
 * @returns {Promise<{ cnameRecord: string, aRecords: string[] }>}
 */
function fetchDnsInfo({ apiConfig, ownerId, appId, signal }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  return ccApiClient
    .send(new GetLoadBalancerInfoCommand({ ownerId, applicationId: appId }), { signal })
    .then((defaultLoadBalancers) => {
      const defaultLoadBalancerData = defaultLoadBalancers[0];
      return {
        cnameRecord: defaultLoadBalancerData?.dns?.cname,
        aRecords: defaultLoadBalancerData?.dns?.aRecords,
      };
    });
}
