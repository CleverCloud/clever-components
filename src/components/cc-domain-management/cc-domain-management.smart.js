import { DeleteDomainCommand } from '@clevercloud/client/cc-api-commands/domain/delete-domain-command.js';
import { getHostWithWildcard, isTestDomain, parseDomain } from '../../lib/domain.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcDomainPrimaryChangeEvent } from './cc-domain-management.events.js';
import { CcDomainManagement } from './cc-domain-management.js';

import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { CreateDomainCommand } from '@clevercloud/client/cc-api-commands/domain/create-domain-command.js';
import { ListDomainCommand } from '@clevercloud/client/cc-api-commands/domain/list-domain-command.js';
import { SetPrimaryDomainCommand } from '@clevercloud/client/cc-api-commands/domain/set-primary-domain-command.js';
import { GetLoadBalancerInfoCommand } from '@clevercloud/client/cc-api-commands/load-balancer/get-load-balancer-info-command.js';

/**
 * @typedef {import('./cc-domain-management.types.js').DomainManagementListStateLoaded} DomainManagementListStateLoaded
 * @typedef {import('./cc-domain-management.types.js').DomainStateIdle} DomainStateIdle
 * @typedef {import('./cc-domain-management.types.js').DomainState} DomainState
 * @typedef {import('./cc-domain-management.types.js').DomainInfo} DomainInfo
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcDomainManagement>} OnContextUpdateArgs
 * @typedef {{ fqdn: string }} RawDomainFromApi
 * @typedef {Omit<DomainInfo, 'isPrimary'>} DomainInfoWithoutIsPrimary
 */

defineSmartComponent({
  selector: 'cc-domain-management',
  params: {
    apiConfig: { type: Object },
    appId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, appId, ownerId } = context;

    const client = new CcApiClient({
      authMethod: {
        type: 'oauth-v1',
        oauthTokens: {
          consumerKey: apiConfig.OAUTH_CONSUMER_KEY,
          consumerSecret: apiConfig.OAUTH_CONSUMER_SECRET,
          token: apiConfig.API_OAUTH_TOKEN,
          secret: apiConfig.API_OAUTH_TOKEN_SECRET,
        },
      },
    });

    updateComponent('applicationId', appId);
    updateComponent('domainListState', { type: 'loading' });
    updateComponent('dnsInfoState', { type: 'loading' });
    updateComponent('domainFormState', CcDomainManagement.INIT_DOMAIN_FORM_STATE);

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

    client
      .send(new ListDomainCommand({ applicationId: appId, ownerId }), { signal })
      .then((domains) => {
        const domainsWithStates = domains.map((domain) => formatDomainState(domain));
        updateComponent('domainListState', { type: 'loaded', domains: domainsWithStates });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('domainListState', { type: 'error' });
      });

    client
      .send(new GetLoadBalancerInfoCommand({ applicationId: appId, ownerId }), { signal })
      .then(([loadBalancerInfo]) => {
        updateComponent('dnsInfoState', {
          type: 'loaded',
          cnameRecord: loadBalancerInfo.dns.cname,
          aRecords: loadBalancerInfo.dns.a,
        });
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

      client
        .send(new CreateDomainCommand({ applicationId: appId, domain: domainWithPathAndWildcard }))
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
          updateComponent(
            'domainListState',
            /** @param {DomainManagementListStateLoaded} domainListState */
            (domainListState) => {
              // TODO: once the API returns actual ids, this should be adapted (either refetch or use the API response)
              const id = hostname + pathPrefix;

              /** @type {DomainStateIdle} */
              const newDomain = {
                id,
                hostname: hostname,
                type: 'idle',
                pathPrefix,
                isWildcard,
                isPrimary: false,
              };

              domainListState.domains.push(newDomain);
            },
          );
        })
        .catch((error) => {
          console.error(error);
          const errorCode = convertApiError(error);

          updateComponent('domainFormState', (domainFormState) => {
            domainFormState.type = 'idle';
          });

          if (errorCode === 'invalid-format') {
            updateComponent('domainFormState', (domainFormState) => {
              domainFormState.hostname.error = { code: errorCode };
            });
            return;
          }

          if (errorCode === 'already-used') {
            notifyError(
              i18n('cc-domain-management.form.submit.error-duplicate.text', { domain: domainWithPathAndWildcard }),
              i18n('cc-domain-management.form.submit.error-duplicate.heading'),
            );
            return;
          }

          notifyError(i18n('cc-domain-management.form.submit.error', { domain: domainWithPathAndWildcard }));
        });
    });

    onEvent('cc-domain-delete', ({ id, hostname, pathPrefix, isWildcard }) => {
      const domainWithPathAndWildcard = getHostWithWildcard(hostname + pathPrefix, isWildcard);
      updateDomain(id, (domainState) => {
        domainState.type = 'deleting';
      });

      client
        .send(new DeleteDomainCommand({ applicationId: appId, ownerId, domain: domainWithPathAndWildcard }))
        .then(() => {
          updateComponent(
            'domainListState',
            /** @param {DomainManagementListStateLoaded} domainListState */
            (domainListState) => {
              domainListState.domains = domainListState.domains.filter((domain) => domain.id !== id);
            },
          );
          notifySuccess(i18n('cc-domain-management.list.delete.success', { domain: domainWithPathAndWildcard }));
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

      client
        .send(new SetPrimaryDomainCommand({ applicationId: appId, ownerId, domain: domainWithPathAndWildcard }))
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
        .catch((error) => {
          console.error(error);
          updateDomain(id, (domainState) => {
            domainState.type = 'idle';
          });

          if (error.id === 3004) {
            notifyError(
              i18n('cc-domain-management.list.error-not-found.text', { domain: domainWithPathAndWildcard }),
              i18n('cc-domain-management.list.error-not-found.heading'),
            );
            return;
          }

          notifyError(i18n('cc-domain-management.list.primary.error', { domain: domainWithPathAndWildcard }));
        });
    });
  },
});

/**
 * @param {Error} apiError
 * @returns {'invalid-format'|'already-used'|null}
 */
function convertApiError(apiError) {
  // FIXME: ask the API for a proper id to map a message to an error
  if (apiError.message === 'Invalid domain' || apiError.message.includes('is invalid')) {
    return 'invalid-format';
  }
  // FIXME: ask the API for a proper id to map a message to an error
  if (apiError.message.includes('is already taken') || apiError.message.includes('You are not allowed to use')) {
    return 'already-used';
  }
  return null;
}

/**
 * @param {object} rawDomainInfo
 * @param {string} rawDomainInfo.domain
 * @param {boolean} rawDomainInfo.isPrimary
 * @returns {DomainStateIdle}
 */
function formatDomainState({ domain, isPrimary }) {
  const { hostname, pathname, isWildcard } = parseDomain(domain);
  return {
    type: 'idle',
    id: domain,
    hostname,
    pathPrefix: pathname,
    isWildcard,
    isPrimary,
  };
}
