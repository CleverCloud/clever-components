import { DeleteAddonCommand } from '@clevercloud/client/cc-api-commands/addon/delete-addon-command.js';
import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { UpdateAddonCommand } from '@clevercloud/client/cc-api-commands/addon/update-addon-command.js';
import { ListTagCommand } from '@clevercloud/client/cc-api-commands/tag/list-tag-command.js';
import { UpdateTagCommand } from '@clevercloud/client/cc-api-commands/tag/update-tag-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { i18n } from '../../lib/i18n/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import {
  CcAddonNameWasChangedEvent,
  CcAddonTagsWasChangedEvent,
  CcAddonWasDeletedEvent,
} from './cc-addon-admin.events.js';
import './cc-addon-admin.js';

/**
 * @import { CcAddonAdmin } from './cc-addon-admin.js'
 * @import { Addon } from '@clevercloud/client/cc-api-commands/addon/addon.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-admin',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonAdmin>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;
    const api = new Api({ apiConfig, signal });

    updateComponent('state', { type: 'loading' });

    api
      .fetchAddonAndTags({ ownerId, addonId })
      .then(({ addon, tags }) => {
        updateComponent('state', { type: 'loaded', id: addon.id, name: addon.name, tags });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-addon-name-change', ({ name }) => {
      updateComponent('state', (state) => ({
        ...state,
        name,
        type: 'updating-name',
      }));
      api
        .onUpdateName({ ownerId, addonId, name })
        .then(() => {
          notifySuccess(i18n('cc-addon-admin.update-name.success'));
          component.dispatchEvent(new CcAddonNameWasChangedEvent({ id: addonId, name }));
          updateComponent('state', (state) => ({
            ...state,
            type: 'loaded',
          }));
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            notifyError(i18n('cc-addon-admin.update-name.error'));
            updateComponent('state', (state) => ({
              ...state,
              type: 'loaded',
            }));
          },
        );
    });

    onEvent('cc-addon-tags-change', ({ tags }) => {
      updateComponent('state', (state) => ({
        ...state,
        tags,
        type: 'updating-tags',
      }));
      api
        .onUpdateTags({ ownerId, addonId, tags })
        .then(() => {
          notifySuccess(i18n('cc-addon-admin.update-tags.success'));
          component.dispatchEvent(new CcAddonTagsWasChangedEvent({ id: addonId, tags }));
          updateComponent('state', (state) => ({
            ...state,
            type: 'loaded',
          }));
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            updateComponent('state', (state) => ({
              ...state,
              type: 'loaded',
            }));
            notifyError(i18n('cc-addon-admin.update-tags.error'));
          },
        );
    });

    onEvent('cc-addon-delete', ({ id, name }) => {
      updateComponent('state', (state) => ({
        ...state,
        type: 'deleting',
      }));
      api
        .onDeleteAddon({ ownerId, addonId })
        .then(() => {
          updateComponent('state', (state) => ({
            ...state,
            type: 'loaded',
          }));
          notifySuccess(i18n('cc-addon-admin.delete.success', { name }));
          component.dispatchEvent(new CcAddonWasDeletedEvent({ id, name }));
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-addon-admin.delete.error', { name }));
          updateComponent('state', (prevState) => ({ ...prevState, type: 'loaded' }));
        });
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
   * @param {string} params.addonId
   * @returns {Promise<Addon>}
   */
  fetchAddon({ ownerId, addonId }) {
    return this._ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal: this._signal });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @returns {Promise<string[]>}
   */
  fetchTags({ ownerId, addonId }) {
    return this._ccApiClient.send(new ListTagCommand({ ownerId, addonId }), { signal: this._signal });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @returns {Promise<{addon: Addon, tags: string[]}>}
   */
  async fetchAddonAndTags({ ownerId, addonId }) {
    return Promise.all([this.fetchAddon({ ownerId, addonId }), this.fetchTags({ ownerId, addonId })]).then(
      ([addon, tags]) => ({ addon, tags }),
    );
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {string} params.name
   */
  onUpdateName({ ownerId, addonId, name }) {
    return this._ccApiClient.send(new UpdateAddonCommand({ ownerId, addonId, name }), { signal: this._signal });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {string[]} params.tags
   */
  onUpdateTags({ ownerId, addonId, tags }) {
    return this._ccApiClient.send(new UpdateTagCommand({ ownerId, addonId, tags }), { signal: this._signal });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   */
  async onDeleteAddon({ ownerId, addonId }) {
    return this._ccApiClient.send(new DeleteAddonCommand({ ownerId, addonId }), { signal: this._signal });
  }
}
