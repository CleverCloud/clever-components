import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { ListBackupCommand } from '@clevercloud/client/cc-api-commands/backup/list-backup-command.js';
import { GetElasticsearchInfoCommand } from '@clevercloud/client/cc-api-commands/elasticsearch/get-elasticsearch-info-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-backups.js';

/**
 * @import { CcAddonBackups } from './cc-addon-backups.js'
 * @import { Backup, ProviderId } from './cc-addon-backups.types.js'
 * @import { Backup as RemoteBackup } from '@clevercloud/client/cc-api-commands/backup/backup.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */
defineSmartComponent({
  selector: 'cc-addon-backups',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonBackups>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;

    updateComponent('state', { type: 'loading' });
    updateComponent('addonId', addonId);

    const api = new Api({ apiConfig, signal });

    api
      .fetchBackupsData({ ownerId, addonId })
      .then(({ providerId, passwordForCommand, backups }) => {
        updateComponent('state', { type: 'loaded', providerId, passwordForCommand, backups });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

// -- API calls
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
   * @param {string} params.addonId
   */
  fetchAddon({ ownerId, addonId }) {
    return this._ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal: this._signal });
  }

  /**
   * @param {object} params
   * @param {string} params.addonId
   */
  fetchElasticsearchInfo({ addonId }) {
    return this._ccApiClient.send(new GetElasticsearchInfoCommand({ addonId }), { signal: this._signal });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @returns {Promise<RemoteBackup[]>}
   */
  fetchRawBackups({ ownerId, addonId }) {
    return this._ccApiClient.send(new ListBackupCommand({ ownerId, addonId, withCommands: true }), {
      signal: this._signal,
    });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @returns {Promise<{providerId: ProviderId, passwordForCommand: string, backups: Backup[]}>}
   */
  async fetchBackupsData({ ownerId, addonId }) {
    const [addon, rawBackups] = await Promise.all([
      this.fetchAddon({ ownerId, addonId }),
      this.fetchRawBackups({ ownerId, addonId }),
    ]);

    /** @type {ProviderId} */
    let providerId = /** @type {ProviderId} */ (addon.provider.id);
    // For most providers, the restore/delete command password (if any) is carried by the backups themselves.
    let passwordForCommand = rawBackups[0]?.commands?.password;

    // The "es-addon" / "es-addon-old" distinction (and its password) can only be resolved through
    // the Elasticsearch specific info endpoint (it depends on whether the Kibana service is enabled).
    if (addon.provider.id === 'es-addon') {
      const esInfo = await this.fetchElasticsearchInfo({ addonId });
      const kibana = esInfo.services.find((service) => service.name === 'kibana');
      providerId = kibana != null && kibana.isEnabled ? 'es-addon' : 'es-addon-old';
      passwordForCommand = esInfo.config.password;
    }

    return {
      providerId,
      passwordForCommand,
      backups: rawBackups.map(toBackup),
    };
  }
}

/**
 * @param {RemoteBackup} backup
 * @returns {Backup}
 */
function toBackup(backup) {
  return {
    createdAt: backup.createdAt,
    expiresAt: backup.expiresAt,
    url: backup.downloadUrl,
    restoreCommand: backup.commands?.restoreCommand,
    deleteCommand: backup.commands?.deleteCommand,
  };
}
