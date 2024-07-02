import {
  addDomain,
  getAllDomains,
  getFavouriteDomain as getPrimaryDomain,
  removeDomain,
  markFavouriteDomain as markPrimaryDomain,
  unmarkFavouriteDomain as unmarkPrimaryDomain,
} from '@clevercloud/client/esm/api/v2/application.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { i18n } from '../../lib/i18n.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { CcDomainManagement } from './cc-domain-management.js';
import '../cc-smart-container/cc-smart-container.js';

/**
 * @typedef {import('./cc-domain-management.types.js').DomainManagementFormState} DomainManagementFormState
 * @typedef {import('./cc-domain-management.types.js').DomainManagementListStateLoaded} DomainManagementListStateLoaded
 * @typedef {import('./cc-domain-management.types.js').DomainStateIdle} DomainStateIdle
 * @typedef {import('./cc-domain-management.types.js').DomainState} DomainState
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {{ fqdn: string }} RawDomainFromApi
 */

defineSmartComponent({
  selector: 'cc-domain-management',
  params: {
    apiConfig: { type: Object },
    appId: { type: String },
    ownerId: { type: String },
  },
  onContextUpdate ({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, appId, ownerId } = context;

    /**
     * @param {string} fqdn
     * @param {(domainState: DomainState) => void} callback
     **/
    function updateDomain (fqdn, callback) {
      updateComponent('domainListState',
        /** @param {DomainManagementListStateLoaded} domainListState */
        (domainListState) => {
          const domainState = domainListState.domains.find((domain) => domain.fqdn === fqdn);
          if (domainState != null) {
            callback(domainState);
          }
        });
    }

    getDomains({ apiConfig, ownerId, appId, signal })
      .then((domains) => {
        updateComponent('domainListState', { type: 'loaded', domains });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('domainListState', { type: 'error' });
      });

    getDnsInfo({ apiConfig, ownerId, appId, signal })
      .then(({ cnameValue, aValues }) => {
        updateComponent('dnsInfoState', { type: 'loaded', cnameValue, aValues });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('dnsInfoState', { type: 'error' });
      });

    onEvent('cc-domain-management:add',
      /** @param {{ domainName: string, pathPrefix: string }} param */
      ({ domainName, pathPrefix }) => {
        updateComponent('domainFormState',
          /** @param {DomainManagementFormState} domainFormState */
          (domainFormState) => {
            domainFormState.type = 'adding';
          });

        postNewDomain({ apiConfig, ownerId, appId, domainName, pathPrefix })
          .then(() => {
            if (domainName.endsWith('cleverapps.io')) {
              notifySuccess(i18n('cc-domain-management.form.submit.success', { domain: domainName + pathPrefix }));
            }
            else {
              notify({
                intent: 'info',
                message: i18n('cc-domain-management.form.submit.success-config', { domain: domainName + pathPrefix }),
                options: {
                  timeout: 0,
                  closeable: true,
                },
              });
            }
            updateComponent('domainFormState', CcDomainManagement.INIT_DOMAIN_FORM_STATE);
            updateComponent('domainListState',
              /** @param {DomainManagementListStateLoaded} domainListState */
              (domainListState) => {
                const hasPathPrefix = pathPrefix != null && pathPrefix !== '/';
                const fqdn = hasPathPrefix ? domainName + pathPrefix : domainName;

                /** @type {DomainStateIdle} */
                const newDomain = {
                  type: 'idle',
                  fqdn,
                  isPrimary: false,
                };

                domainListState.domains.push(newDomain);
              });
          })
          .catch(
            /** @param {Error} error */
            (error) => {
              console.error(error);
              updateComponent('domainFormState',
                /** @param {DomainManagementFormState} domainFormState */
                (domainFormState) => {
                  domainFormState.type = 'idle';
                });

              // FIXME: ask the API for a proper id to map a message to an error
              if (error.message === 'Invalid domain' || error.message.includes('is invalid')) {
                updateComponent('domainFormState',
                  /** @param {DomainManagementFormState} domainFormState */
                  (domainFormState) => {
                    domainFormState.domain.error = 'invalid-format';
                  });
                return;
              }

              // FIXME: ask the API for a proper id to map a message to an error
              if (error.message.includes('is already taken') || error.message.includes('You are not allowed to use')) {
                notifyError(i18n('cc-domain-management.form.submit.error-duplicate.text', { domain: domainName + pathPrefix }), i18n('cc-domain-management.form.submit.error-duplicate.heading'));
                return;
              }

              notifyError(i18n('cc-domain-management.form.submit.error', { domain: domainName + pathPrefix }));
            });
      });

    onEvent('cc-domain-management:delete',
      /** @param {{ fqdn: string }} param */
      ({ fqdn }) => {
        updateDomain(fqdn, (domainState) => {
          domainState.type = 'deleting';
        });

        deleteDomain({ apiConfig, ownerId, appId, fqdn })
          .then(() => {
            updateComponent('domainListState',
              /** @param {DomainManagementListStateLoaded} domainListState */
              (domainListState) => {
                domainListState.domains = domainListState.domains
                  .filter((domain) => domain.fqdn !== fqdn);
              });
            notifySuccess(i18n('cc-domain-management.list.delete.success', { domain: fqdn }));
          })
          .catch((error) => {
            console.error(error);

            notifyError(i18n('cc-domain-management.list.delete.error', { domain: fqdn }));

            updateDomain(fqdn, (domainState) => {
              domainState.type = 'idle';
            });
          });
      });

    onEvent('cc-domain-management:mark-as-primary',
      /** @param {{ fqdn: string }}  params */
      ({ fqdn }) => {
        updateDomain(fqdn, (domainState) => {
          domainState.type = 'marking-primary';
        });

        markAsPrimaryDomain({ apiConfig, ownerId, appId, fqdn })
          .then(() => {
            updateComponent('domainListState',
              /** @param {DomainManagementListStateLoaded} domainListState */
              (domainListState) => {
                domainListState.domains = domainListState.domains.map((domainState) => ({
                  ...domainState,
                  type: 'idle',
                  isPrimary: domainState.fqdn === fqdn,
                }));
              });

            // Dispatch event to make the console refresh its UI
            const primarySuccessEvent = new CustomEvent('domain-management-primary-success', {
              detail: fqdn,
            });
            window.dispatchEvent(primarySuccessEvent);

            notifySuccess(i18n('cc-domain-management.list.primary.success', { domain: fqdn }));
          })
          .catch((error) => {
            console.error(error);
            updateDomain(fqdn, (domainState) => {
              domainState.type = 'idle';
            });

            if (error.id === 3004) {
              notifyError(i18n('cc-domain-management.list.error-not-found.text', { domain: fqdn }), i18n('cc-domain-management.list.error-not-found.heading'));
              return;
            }

            notifyError(i18n('cc-domain-management.list.primary.error', { domain: fqdn }));
          });
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
function getDomains ({ apiConfig, ownerId, appId, signal }) {
  return Promise.all([
    getPrimaryDomain({ id: ownerId, appId })
      .then(sendToApi({ apiConfig, signal }))
      .catch(
        /**
         * @param {Error & { response: { status: number }}} error
         * @returns {null|void}
         */
        (error) => {
          if (error.response.status === 404) {
            return null;
          }
        }),
    getAllDomains({ id: ownerId, appId })
      .then(sendToApi({ apiConfig })),
  ])
    .then(
      /**
       * @param {[RawDomainFromApi, RawDomainFromApi[]]} payload
       * @returns {DomainStateIdle[]}
       */
      ([primaryDomain, domains]) => {
        return domains
          .map(({ fqdn }) => {

            /** @type {DomainStateIdle} */
            const domainState = {
              type: 'idle',
              fqdn,
              isPrimary: primaryDomain?.fqdn === fqdn,
            };

            return domainState;
          });
      });
}

/**
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {string} params.domainName
 * @param {string} params.pathPrefix
 * @returns {Promise<DomainStateIdle[]>}
 */
function postNewDomain ({ apiConfig, ownerId, appId, domainName, pathPrefix }) {
  return addDomain({ id: ownerId, appId, domain: domainName + encodeURIComponent(pathPrefix) })
    .then(sendToApi({ apiConfig }));
}

/**
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {string} params.fqdn
 * @returns {Promise<DomainStateIdle[]>}
 */
function deleteDomain ({ apiConfig, ownerId, appId, fqdn }) {
  return removeDomain({ id: ownerId, appId, domain: encodeURIComponent(fqdn) })
    .then(sendToApi({ apiConfig }));
}

/**
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {string} params.fqdn
 * @returns {Promise<DomainStateIdle[]>}
 */
function markAsPrimaryDomain ({ apiConfig, ownerId, appId, fqdn }) {
  return unmarkPrimaryDomain({ id: ownerId, appId })
    .then(sendToApi({ apiConfig }))
    .then(() => markPrimaryDomain({ id: ownerId, appId }, { fqdn })
      .then(sendToApi({ apiConfig })));
}

/**
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {AbortSignal} params.signal
 * @returns {Promise<{ cnameValue: string, aValues: string[] }>}
 */
function getDnsInfo ({ apiConfig, ownerId, appId, signal }) {
  return getDefaultLoadBalancersDnsInfo({ appId, ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .then((defaultLoadBalancers) => {
      const defaultLoadBalancerData = defaultLoadBalancers[0];
      return {
        cnameValue: defaultLoadBalancerData?.dns?.cname,
        aValues: defaultLoadBalancerData?.dns?.a,
      };
    });
}

/**
 * TODO: move this to Clever Client
 *
 * @param {Object} params
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @returns {Promise<any>}
 */
function getDefaultLoadBalancersDnsInfo ({ appId, ownerId }) {
  return Promise.resolve({
    method: 'get',
    url: `/v4/load-balancers/organisations/${ownerId}/applications/${appId}/load-balancers/default`,
    headers: { Accept: 'application/json' },
  });
}
