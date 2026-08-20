import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import { CcPostgresqlClient } from '../cc-postgresql-admin/cc-postgresql-admin.client.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-info.js';

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoading } from './cc-addon-info.types.js'
 * @import { FormattedFeature } from '../common.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

/** Plan features displayed as specifications, in that order. */
const SPECIFICATION_CODES = ['cpu', 'memory', 'disk-size', 'max-db-size', 'connection-limit'];

/** @type {AddonInfoStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  version: {
    stateType: 'up-to-date',
    installed: '00',
    latest: '00',
  },
  creationDate: '2025-08-06 15:03:00',
  role: '???????',
  specifications: [
    {
      code: 'plan',
      type: 'string',
      value: 'XS',
    },
    {
      code: 'cpu',
      type: 'number',
      value: 2,
    },
    {
      code: 'memory',
      type: 'bytes',
      value: 4,
    },
  ],
  encryption: false,
};

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="postgresql"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonInfo>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;
    const ccApiClient = getCcApiClientWithOAuth(apiConfig);
    const postgresqlClient = new CcPostgresqlClient({ apiConfig, addonId, signal });

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.postgresql'),
      href: getDocUrl('/addons/postgresql'),
    });

    Promise.all([
      ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal }),
      postgresqlClient.getDashboard(),
    ])
      .then(([addon, dashboard]) => {
        updateComponent('state', {
          type: 'loaded',
          version: {
            stateType: 'up-to-date',
            installed: dashboard.version,
            latest: dashboard.version,
          },
          creationDate: addon.creationDate,
          role: dashboard.role === 'replica' ? i18n('cc-addon-info.role.replica') : i18n('cc-addon-info.role.primary'),
          specifications: getSpecifications(addon.plan),
          encryption: dashboard.encrypted,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
 * @param {{name: string, features: Array<{nameCode: string, name: string, type: string, computableValue: string}>}} plan
 * @returns {Array<FormattedFeature>}
 */
function getSpecifications(plan) {
  const features = SPECIFICATION_CODES.map((code) => plan.features.find((feature) => feature.nameCode === code))
    .filter((feature) => feature != null)
    .map(
      (feature) =>
        /** @type {FormattedFeature} */ ({
          code: feature.nameCode,
          type: /** @type {FormattedFeature['type']} */ (feature.type.toLowerCase()),
          value: feature.computableValue ?? '',
          name: feature.name,
        }),
    );

  return [
    /** @type {FormattedFeature} */ ({
      code: 'plan',
      type: 'string',
      value: plan.name,
    }),
    ...features,
  ];
}
