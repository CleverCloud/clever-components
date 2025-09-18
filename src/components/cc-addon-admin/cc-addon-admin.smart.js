//prettier-ignore
// @ts-expect-error FIXME: remove when clever-client exports types
import { remove as deleteAddon,get as getAddon,getAllTags,replaceAddonTags,update as updateAddon } from '@clevercloud/client/esm/api/v2/addon.js';
import { i18n } from '../../lib/i18n/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonWasDeletedEvent } from './cc-addon-admin.events.js';
import './cc-addon-admin.js';

/**
 * @typedef {import('./cc-addon-admin.js').CcAddonAdmin} CcAddonAdmin
 * @typedef {import('../common.types.js').Addon} Addon
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonAdmin>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-admin',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
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
    this._apiConfig = apiConfig;
    this._signal = signal;
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @returns {Promise<Addon>}
   */
  fetchAddon({ ownerId, addonId }) {
    return getAddon({ id: ownerId, addonId }).then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }));
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @returns {Promise<string[]>}
   */
  fetchTags({ ownerId, addonId }) {
    return getAllTags({ id: ownerId, addonId }).then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }));
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
    return updateAddon({ id: ownerId, addonId }, { name }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {string[]} params.tags
   */
  onUpdateTags({ ownerId, addonId, tags }) {
    return replaceAddonTags({ id: ownerId, addonId }, tags).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.addonId
   */
  async onDeleteAddon({ ownerId, addonId }) {
    return deleteAddon({ id: ownerId, addonId }).then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }));
  }
}
