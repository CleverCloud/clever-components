import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { CcPostgresqlClient } from '../cc-postgresql-admin/cc-postgresql-admin.client.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-credentials.js';

/**
 * @import { CcAddonCredentials } from './cc-addon-credentials.js'
 * @import { AddonCredentialsStateLoading } from './cc-addon-credentials.types.js'
 * @import { AddonCredential } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { PostgresqlCredentials } from '../cc-postgresql-admin/cc-postgresql-admin.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

/** @type {AddonCredentialsStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    default: {
      content: [
        { code: 'host', value: 'fake-skeleton' },
        { code: 'port', value: 'fake' },
        { code: 'database-name', value: 'fake-skeleton' },
        { code: 'user', value: 'fake-skeleton' },
        { code: 'password', value: 'fake-skeleton-value' },
        { code: 'uri', value: 'fake-skeleton-value-longer' },
      ],
    },
  },
};

defineSmartComponent({
  selector: 'cc-addon-credentials[smart-mode="postgresql"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    // credentials change when the password is renewed or when a direct host is discovered:
    // the console changes this value to ask for a refresh
    credentialsRefreshToken: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentials>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId } = context;
    const api = new CcPostgresqlClient({ apiConfig, addonId, signal });

    updateComponent('state', LOADING_STATE);

    api
      .getDashboard()
      .then((dashboard) => {
        updateComponent('state', { type: 'loaded', tabs: getTabs(dashboard.credentials) });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
 * @param {PostgresqlCredentials} credentials
 * @returns {AddonCredentialsStateLoading['tabs']}
 */
function getTabs(credentials) {
  /** @type {Array<AddonCredential>} */
  const defaultCredentials = [
    { code: 'host', value: credentials.host },
    { code: 'port', value: String(credentials.port) },
    { code: 'database-name', value: credentials.database },
    { code: 'user', value: credentials.user },
    { code: 'password', value: credentials.password },
    { code: 'uri', value: credentials.uri },
  ];

  return {
    default: { content: defaultCredentials },
    ...(credentials.direct != null && {
      direct: {
        content: [
          { code: 'direct-host', value: credentials.direct.host },
          { code: 'direct-port', value: String(credentials.direct.port) },
          { code: 'direct-uri', value: credentials.direct.uri },
        ],
      },
    }),
    ...(credentials.ferretDB != null && {
      ferretdb: {
        content: [
          { code: 'host', value: credentials.ferretDB.host },
          { code: 'port', value: String(credentials.ferretDB.port) },
          { code: 'uri', value: credentials.ferretDB.uri },
          ...(credentials.ferretDB.direct != null
            ? [
                /** @type {AddonCredential} */ ({ code: 'direct-host', value: credentials.ferretDB.direct.host }),
                /** @type {AddonCredential} */ ({
                  code: 'direct-port',
                  value: String(credentials.ferretDB.direct.port),
                }),
                /** @type {AddonCredential} */ ({ code: 'direct-uri', value: credentials.ferretDB.direct.uri }),
              ]
            : []),
        ],
      },
    }),
  };
}
