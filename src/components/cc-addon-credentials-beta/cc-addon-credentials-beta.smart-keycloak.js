import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonCredentialsBetaClient } from './cc-addon-credentials-beta.client.js';
import './cc-addon-credentials-beta.js';

/** @type {AddonCredentialsBetaStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    default: {
      content: [
        {
          code: 'user',
          value: 'fake-skeleton',
        },
        {
          code: 'password',
          value: 'fake-skeleton',
        },
        {
          code: 'ng',
          kind: 'multi-instances',
          value: {
            status: 'disabled',
          },
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials-beta.doc-link.keycloak'),
        href: generateDocsHref('/addons/keycloak/#secured-multi-instances'),
      },
    },
  },
};
const PROVIDER_ID = 'keycloak';

/**
 * @typedef {import('./cc-addon-credentials-beta.js').CcAddonCredentialsBeta} CcAddonCredentialsBeta
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaStateLoaded} AddonCredentialsBetaStateLoaded
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaStateLoading} AddonCredentialsBetaStateLoading
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredential} AddonCredential
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNg} AddonCredentialNg
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNgEnabled} AddonCredentialNgEnabled
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNgDisabled} AddonCredentialNgDisabled
 * @typedef {import('../../operators.types.js').KeycloakOperatorInfo} KeycloakOperatorInfo
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonCredentialsBeta>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="keycloak"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    /** @param {AddonCredentialNg|((param: AddonCredentialNg) => AddonCredential)} newNgInfoOrCallback */
    function updateNg(newNgInfoOrCallback) {
      updateComponent(
        'state',
        /** @param {AddonCredentialsBetaStateLoaded} state */
        (state) => {
          state.tabs.default.content = [...state.tabs.default.content].map((addonInfo) => {
            if (addonInfo.code === 'ng') {
              if (typeof newNgInfoOrCallback === 'function') {
                return newNgInfoOrCallback(addonInfo);
              } else {
                return newNgInfoOrCallback;
              }
            }
            return addonInfo;
          });
        },
      );
    }

    updateComponent('state', LOADING_STATE);

    api
      .getCredentials()
      .then((credentials) => {
        updateComponent(
          'state',
          /** @param {AddonCredentialsBetaStateLoaded|AddonCredentialsBetaStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs.default.content = credentials;
          },
        );
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-ng-enable', () => {
      updateNg({
        code: 'ng',
        kind: 'multi-instances',
        value: {
          status: 'enabling',
        },
      });

      api
        .createNg()
        .then((updatedOperator) => {
          updateNg({
            code: 'ng',
            kind: 'multi-instances',
            value: {
              status: 'enabled',
              id: updatedOperator.features.networkGroup.id,
            },
          });

          notifySuccess(i18n('cc-addon-credentials-beta.ng-multi-instances.enabling.success'));
        })
        .catch((error) => {
          console.error(error);
          updateNg({
            code: 'ng',
            kind: 'multi-instances',
            value: {
              status: 'disabled',
            },
          });
          notifyError(i18n('cc-addon-credentials-beta.ng-multi-instances.enabling.error'));
        });
    });

    onEvent('cc-ng-disable', () => {
      updateNg((addonInfo) => ({
        code: 'ng',
        kind: 'multi-instances',
        value: {
          id: /** @type {AddonCredentialNgEnabled} */ (addonInfo.value).id,
          status: 'disabling',
        },
      }));

      api
        .deleteNg()
        .then(() => {
          updateNg({
            code: 'ng',
            kind: 'multi-instances',
            value: {
              status: 'disabled',
            },
          });
          notifySuccess(i18n('cc-addon-credentials-beta.ng-multi-instances.disabling.success'));
        })
        .catch((error) => {
          console.error(error);
          updateNg((addonInfo) => ({
            code: 'ng',
            kind: 'multi-instances',
            value: {
              id: /** @type {AddonCredentialNgEnabled} */ (addonInfo.value).id,
              kind: 'multi-instances',
              status: 'enabled',
            },
          }));
          notifyError(i18n('cc-addon-credentials-beta.ng-multi-instances.disabling.error'));
        });
    });
  },
});

/**
 *
 * @param {{ id: string } | null} data
 * @returns {AddonCredentialNgEnabled | AddonCredentialNgDisabled}
 */
function formatNgData(data) {
  if (data == null) {
    return { status: 'disabled' };
  }

  return {
    status: 'enabled',
    id: data.id,
  };
}

class Api extends CcAddonCredentialsBetaClient {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
  }

  /**
   * @return {Promise<AddonCredential[]>}
   */
  async getCredentials() {
    const operator = /** @type {KeycloakOperatorInfo} */ (await this.getAddonWithOperator());
    return [
      {
        code: 'initial-user',
        value: operator.initialCredentials.user,
      },
      {
        code: 'initial-password',
        value: operator.initialCredentials.password,
      },
      {
        code: 'ng',
        kind: 'multi-instances',
        value: formatNgData(operator.features.networkGroup),
      },
    ];
  }
}
