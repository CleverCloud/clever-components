// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getOauthConsumer, getSecret } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { camelCase } from '../../lib/change-case.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-oauth-consumer-info.js';

/**
 * @typedef {import('./cc-oauth-consumer-info.js').CcOauthConsumerInfo} CcOauthConsumerInfo
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerInfoStateLoaded} OauthConsumerInfoStateLoaded
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerRights} OauthConsumerRights
 * @typedef {import('./cc-oauth-consumer-info.types.js').RawOauthConsumer} RawOauthConsumer
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcOauthConsumerInfo>} OnContextUpdateArgs
 */

/** @type {OauthConsumerRights} */
const DISABLED_RIGHTS_BY_DEFAULT = {
  almighty: false,
  accessOrganisations: false,
  accessOrganisationsBills: false,
  accessOrganisationsConsumptionStatistics: false,
  accessOrganisationsCreditCount: false,
  accessPersonalInformation: false,
  manageOrganisations: false,
  manageOrganisationsApplications: false,
  manageOrganisationsMembers: false,
  manageOrganisationsServices: false,
  managePersonalInformation: false,
  manageSshKeys: false,
};

defineSmartComponent({
  selector: 'cc-oauth-consumer-info',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    key: { type: String },
  },

  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent }) {
    const { apiConfig, ownerId, key } = context;
    const api = new Api(apiConfig, ownerId, key);

    updateComponent('state', { type: 'loading' });

    api.getOauthConsumerWithSecret().then(({ rawOauthConsumer, secret, errors }) => {
      if (rawOauthConsumer != null) {
        const rightsFromApiData = Object.fromEntries(
          Object.entries(rawOauthConsumer.rights).map(([name, isEnabled]) => {
            const camelCaseName = camelCase(name);
            return [camelCaseName, isEnabled];
          }),
        );
        const rights = {
          ...DISABLED_RIGHTS_BY_DEFAULT,
          ...rightsFromApiData,
        };
        updateComponent('state', {
          type: 'loaded',
          name: rawOauthConsumer.name,
          url: rawOauthConsumer.url,
          baseUrl: rawOauthConsumer.baseUrl,
          description: rawOauthConsumer.description,
          picture: rawOauthConsumer.picture,
          rights,
          key: rawOauthConsumer.key,
          secret,
        });
      } else if (rawOauthConsumer == null) {
        errors.forEach((error) => {
          console.error(error);
        });
        updateComponent('state', {
          type: 'error',
        });
      }
    });
  },
});

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {string} ownerId
   * @param {string} key
   */
  constructor(apiConfig, ownerId, key) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._key = key;
  }

  /**
   * @return {Promise<RawOauthConsumer>}
   */
  getOauthConsumer() {
    return getOauthConsumer({ id: this._ownerId, key: this._key }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @return {Promise<{secret: string}>}
   */
  getSecret() {
    return getSecret({ id: this._ownerId, key: this._key }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @returns {Promise<{ rawOauthConsumer: RawOauthConsumer, secret: string, errors: any[] }>} A promise that resolves when getOauthConsumer and getSecret are resolved
   */
  getOauthConsumerWithSecret() {
    return Promise.allSettled([this.getOauthConsumer(), this.getSecret()]).then(
      /** @param {[PromiseSettledResult<RawOauthConsumer>, PromiseSettledResult<{secret: string}>]} results */
      (results) => {
        const [getOauthConsumerResult, getSecretResult] = results;
        const rawOauthConsumer = getOauthConsumerResult.status === 'fulfilled' ? getOauthConsumerResult.value : null;
        const secret = getSecretResult.status === 'fulfilled' ? getSecretResult.value.secret : null;
        const errors = results.filter((result) => result.status === 'rejected');
        return { rawOauthConsumer, secret, errors };
      },
    );
  }
}
