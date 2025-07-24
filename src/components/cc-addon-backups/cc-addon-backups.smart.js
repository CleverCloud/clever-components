import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-backups.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getBackups } from '@clevercloud/client/esm/api/v2/backups.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon as getAddonFromProvider } from '@clevercloud/client/esm/api/v4/addon-providers.js';

/**
 * @typedef {import('../common.types.js').Addon} Addon
 * @typedef {import('../common.types.js').AddonProvider} AddonProvider
 * @typedef {import('./cc-addon-backups.js').CcAddonBackups} CcAddonBackups
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonBackups>} OnContextUpdateArgs
 */
defineSmartComponent({
  selector: 'cc-addon-backups',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  async onContextUpdate({ context, updateComponent, signal }) {
    updateComponent('state', { type: 'loading' });
    const { apiConfig, ownerId, addonId } = context;

    const api = getApi(apiConfig, signal);
    const addon = await api.fetchAddon({ ownerId, addonId });
    const addonDetails = await api.fetchAddonDetails({ addon, addonId });
    const rawBackups = await api.fetchBackups({ addon, ownerId, addonDetails });
    const backups = rawBackups.sort(
      (
        /** @type {{ createdAt: string | number | Date; }} */ a,
        /** @type {{ createdAt: string | number | Date; }} */ b,
      ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    updateComponent('state', {
      type: 'loaded',
      providerId: api.getProviderId({ addon, addonDetails }),
      passwordForCommand: addonDetails.password,
      backups: backups,
    });
    updateComponent('addonId', addonId);
  },
});

// -- API calls
/**
 * @param {ApiConfig} apiConfig
 * @param {AbortSignal} signal
 */
function getApi(apiConfig, signal) {
  return {
    /**
     * @param {object} params
     * @param {string} params.ownerId
     * @param {string} params.addonId
     */
    fetchAddon({ ownerId, addonId }) {
      return getAddon({ id: ownerId, addonId }).then(sendToApi({ apiConfig, signal }));
    },

    /**
     * @param {object} params
     * @param {Addon} params.addon
     * @param {string} params.addonId
     */
    fetchAddonDetails({ addon, addonId }) {
      // @ts-ignore
      return getAddonFromProvider({ providerId: addon.provider.id, addonId }).then(sendToApi({ apiConfig, signal }));
    },

    /**
     * @param {object} params
     * @param {Addon} params.addon
     * @param {string} params.ownerId
     * @param {any} params.addonDetails
     */
    fetchBackups({ addon, ownerId, addonDetails }) {
      switch (this.getProviderId({ addon, addonDetails })) {
        case 'es-addon':
          return this.getElasticsearchBackups({ addon, ownerId });
        default:
          return this.getDefaultBackups({ addon, addonDetails, ownerId });
      }
    },

    /**
     * @param {object} params
     * @param {Addon} params.addon
     * @param {string} params.ownerId
     */
    getElasticsearchBackups({ addon, ownerId }) {
      return getBackups({ ownerId, ref: addon.realId })
        .then(sendToApi)
        .then((/** @type {any[]} */ backups) => {
          return backups.map((b) => {
            return {
              createdAt: b.creation_date,
              url: b.link,
              expiresAt: b.delete_at,
              restoreCommand: b.restore_command,
              deleteCommand: b.delete_command,
            };
          });
        });
    },

    /**
     * @param {object} params
     * @param {Addon} params.addon
     * @param {any} params.addonDetails
     * @param {string} params.ownerId
     */
    getDefaultBackups({ addon, addonDetails, ownerId }) {
      return getBackups({ ownerId, ref: addon.realId })
        .then(sendToApi({ apiConfig, signal }))
        .then((/** @type {any[]} */ backups) => {
          return backups.map((backup) => {
            return {
              createdAt: backup.creation_date,
              url: backup.download_url,
              expiresAt: backup.delete_at,
              restoreCommand: this.getRestoreCommand({ addon, addonDetails }),
              deleteCommand: null,
            };
          });
        });
    },

    /**
     * @param {object} params
     * @param {Addon} params.addon
     * @param {any} params.addonDetails
     */
    getRestoreCommand({ addon, addonDetails }) {
      switch (this.getProviderId({ addon, addonDetails })) {
        case 'postgresql-addon':
          return `pg_restore -h ${addonDetails.host} -p ${addonDetails.port} -U ${addonDetails.user} -d ${addonDetails.database} --no-owner --no-privileges --no-comments --format=c YOUR_BACKUP_FILE`;
        case 'mysql-addon':
          return `mysql -h ${addonDetails.host} -P ${addonDetails.port} -u ${addonDetails.user} -p ${addonDetails.database} < YOUR_BACKUP_FILE`;
        case 'mongodb-addon':
          return `mongorestore --host=${addonDetails.host} --port=${addonDetails.port} --username=${addonDetails.user} --nsFrom="${addonDetails.database}.*" --nsTo="${addonDetails.database}.*" --authenticationDatabase="${addonDetails.database}" --archive={YOUR_BACKUP_FILE} --gzip`;
        default:
          return null;
      }
    },

    /**
     * @param {object} params
     * @param {Addon} params.addon
     * @param {any} params.addonDetails
     */
    getProviderId({ addon, addonDetails }) {
      // @ts-ignore
      if (addon.provider.id === 'es-addon') {
        const kibana = addonDetails.services.find((/** @type {{ name: string; }} */ s) => s.name === 'kibana');
        return kibana != null && kibana.enabled ? 'es-addon' : 'es-addon-old';
      }
      // @ts-ignore
      return addon.provider.id;
    },
  };
}
