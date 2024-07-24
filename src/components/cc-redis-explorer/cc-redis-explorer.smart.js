import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withCache } from '@clevercloud/client/esm/with-cache.js';
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-redis-explorer.js';

/**
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerStateLoaded} CcRedisExplorerStateLoaded
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyEditorStateAdd} CcRedisExplorerKeyEditorStateAdd
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyEditorStateEdit} CcRedisExplorerKeyEditorStateEdit
 * @typedef {import('./cc-redis-explorer.js').CcRedisExplorer} CcRedisExplorer
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyState} CcRedisKeyState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyType} CcRedisKeyType
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValue} CcRedisKeyValue
 */

defineSmartComponent({
  selector: 'cc-redis-explorer',
  params: {
    apiConfig: { type: Object },
  },
  /**
   *
   * @param {object} _
   * @param {CcRedisExplorer} _.component
   * @param {{apiConfig: {url: string, backendUrl: string}}} _.context
   * @param _.onEvent
   * @param _.updateComponent
   * @param {AbortSignal} _.signal
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig } = context;
    const api = new RedisClient(apiConfig);

    // -- handle events ---

    /**
     *
     * @param {CcRedisExplorerStateLoaded} state
     * @param {'idle'|'loading'|'selected'|'deleting'} newState
     * @param {(keyState: CcRedisKeyState) => boolean} where
     */
    function setKeyState(state, newState, where) {
      state.keys = state.keys.map((keyState) => {
        if (where(keyState)) {
          return {
            type: newState,
            key: keyState.key,
          };
        }
        return keyState;
      });
    }

    onEvent(
      'selected-key-change',
      /** @param {string} keyName */
      async (keyName) => {
        updateComponent(
          'state',
          /** @param {CcRedisExplorerStateLoaded} state */
          (state) => {
            setKeyState(state, 'loading', (keyState) => keyState.key.name === keyName);
            setKeyState(state, 'idle', (keyState) => keyState.type === 'selected');
          },
        );
        updateComponent('keyEditorFormState', { type: 'hidden' });

        const keyValue = await api.describeKey(keyName, { signal });

        updateComponent(
          'state',
          /** @param {CcRedisExplorerStateLoaded} state */
          (state) => {
            setKeyState(state, 'selected', (keyState) => keyState.key.name === keyName);
          },
        );
        updateComponent('keyEditorFormState', {
          type: 'edit',
          editFormState: { type: 'idle' },
          keyValue,
        });
      },
    );

    onEvent(
      'delete-key',
      /** @param {string} keyName */
      async (keyName) => {
        updateComponent(
          'state',
          /** @param {CcRedisExplorerStateLoaded} state */
          (state) => {
            setKeyState(state, 'deleting', (keyState) => keyState.key.name === keyName);
          },
        );

        await api.deleteKey(keyName, { signal });

        updateComponent(
          'state',
          /** @param {CcRedisExplorerStateLoaded} state */
          (state) => {
            state.keys = state.keys.filter((keyState) => keyState.key.name !== keyName);
          },
        );

        if (component.keyEditorFormState.type === 'edit' && component.keyEditorFormState.keyValue.name === keyName) {
          updateComponent('keyEditorFormState', { type: 'hidden' });
        }
      },
    );

    onEvent('key-add', () => {
      updateComponent(
        'keyEditorFormState',
        /** @param {CcRedisExplorerKeyEditorStateAdd} keyEditorFormState*/
        (keyEditorFormState) => {
          keyEditorFormState.addFormState.type = 'adding';
        },
      );
    });

    onEvent('key-edit', () => {
      updateComponent(
        'keyEditorFormState',
        /** @param {CcRedisExplorerKeyEditorStateEdit} keyEditorFormState*/
        (keyEditorFormState) => {
          keyEditorFormState.editFormState.type = 'saving';
        },
      );
    });

    // -- init ---
    updateComponent('state', { type: 'loading' });
    updateComponent('keyEditorFormState', { type: 'hidden' });
    component.resetAddEditorForm();
    component.resetEditEditorForm();

    api.describeKeys({ signal }).then(({ keys }) => {
      updateComponent('state', { type: 'loaded', keys: keys.map((key) => ({ type: 'idle', key })) });
    });
  },
});

class RedisClient {
  /**
   * @param {{url: string, backendUrl: string}} apiConfig
   */
  constructor(apiConfig) {
    this._apiConfig = apiConfig;
  }

  /**
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   * @return {Promise<{total: number, keys: Array<{key: string, type: CcRedisKeyType}>}>}
   */
  async describeKeys({ signal }) {
    return Promise.resolve({
      method: 'get',
      url: `/keys`,
      headers: { Accept: 'application/json' },
      queryParams: { count: 100 },
    })
      .then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }))
      .then((result) => {
        console.log(result);
        return result;
      });
  }

  /**
   * @param {string} key
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   * @return {Promise<CcRedisKeyValue>}
   */
  async describeKey(key, { signal }) {
    return Promise.resolve({
      method: 'get',
      url: `/keys/${key}`,
      headers: { Accept: 'application/json' },
    })
      .then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }))
      .then((result) => {
        console.log(result);
        return result;
      });
  }

  /**
   * @param {string} key
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   * @return {Promise<CcRedisKeyValue>}
   */
  async deleteKey(key, { signal }) {
    return Promise.resolve({
      method: 'get',
      url: `/keys/${key}`,
      headers: { Accept: 'application/json' },
    })
      .then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }))
      .then((result) => {
        console.log(result);
        return result;
      });
  }

  //   /**
  //    *
  //    * @param {string} path
  //    * @return {Promise<any>}
  //    */
  //   async get(path) {
  //     const response = await fetch(`${this._url}${path}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Cc-Backend-Url': this._backendUrl,
  //       },
  //     });
  //     return response.json();
  //   }
  //
  //   /**
  //    * @param {string} path
  //    * @param {Object} body
  //    * @return {Promise<any>}
  //    */
  //   async post(path, body) {
  //     const response = await fetch(`${this._url}${path}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Cc-Backend-Url': this._backendUrl,
  //       },
  //       body: JSON.stringify(body),
  //     });
  //     return response.json();
  //   }
  // }
}

/**
 *
 * @param {object} _
 * @param {{url: string, backendUrl: string}} _.apiConfig
 * @param {AbortSignal} [_.signal]
 * @param {number} [_.cacheDelay]
 * @param {number} [_.timeout]
 * @return {(requestParams: any) => Promise<any>}
 */
function sendToRedisProxy({ apiConfig, signal, cacheDelay, timeout }) {
  return (requestParams) => {
    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {
      const { url, backendUrl } = apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(url))
        .then((requestParams) => ({
          ...requestParams,
          headers: {
            ...requestParams.headers,
            'Cc-Backend-Url': backendUrl,
          },
        }))
        .then(withOptions({ signal, timeout }))
        .then(request)
        .catch((error) => {
          dispatchCustomEvent(window, 'cc-api:error', error);
          throw error;
        });
    });
  };
}
