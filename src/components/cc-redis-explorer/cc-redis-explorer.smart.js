import { pickNonNull } from '@clevercloud/client/esm/pick-non-null.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withCache } from '@clevercloud/client/esm/with-cache.js';
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-redis-explorer.js';
import { parseRedisCommand, transformResultForCLI } from './redis-cli.js';

/**
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerStateLoaded} CcRedisExplorerStateLoaded
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyEditorStateAdd} CcRedisExplorerKeyEditorStateAdd
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyEditorStateUpdate} CcRedisExplorerKeyEditorStateUpdate
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerShellState} CcRedisExplorerShellState
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
  async onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig } = context;
    const redisClient = new RedisClient(apiConfig);
    const redisKeysScroller = new RedisKeysVirtualScroller(redisClient, { signal });

    // -- handle events ---

    // todo: inline this method, or maybe put that into a util
    /**
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

    /**
     * @param {string} key
     * @param {'idle'|'loading'|'selected'|'deleting'} newState
     */
    function updateKeyState(key, newState) {
      updateComponent(
        'state',
        /** @param {CcRedisExplorerStateLoaded} state */
        (state) => {
          setKeyState(state, newState, (keyState) => keyState.key.key === key);
        },
      );
    }

    onEvent(
      'cc-redis-explorer:filter-change',
      /** @param { {type: CcRedisKeyType|null, match: string|null} } filter */
      async ({ type, match }) => {
        if (component.state.type !== 'loaded') {
          return;
        }

        redisKeysScroller.changeFilter({ type, match });
        await fetchKeys();
      },
    );

    onEvent('cc-redis-explorer:fetch-more-keys', async () => {
      if (component.state.type !== 'loaded') {
        return;
      }
      await fetchKeys();
    });

    onEvent(
      'cc-redis-explorer:selected-key-change',
      /** @param {string} key */
      async (key) => {
        if (component.state.type !== 'loaded') {
          return;
        }

        // we keep track of the selected key in case of an API error, for which we need to restore selection
        const previousSelectedKey = component.state.keys.find((keyState) => keyState.type === 'selected')?.key.key;
        const previousKeyEditorFormState = component.keyEditorFormState;

        // key
        const selectedKey = component.state.keys.find((k) => k.key.key === key)?.key;

        updateKeyState(key, 'loading');
        if (previousSelectedKey != null) {
          updateKeyState(previousSelectedKey, 'idle');
        }
        updateComponent('keyEditorFormState', { type: 'loading', key: selectedKey });

        try {
          const keyValue = await redisClient.describeKey(key, { signal });

          updateKeyState(key, 'selected');
          updateComponent('keyEditorFormState', {
            type: 'update',
            formState: { type: 'idle' },
            keyValue,
          });
        } catch (e) {
          console.error(e);
          notifyError(`Could not get key ${key}`);
          updateKeyState(key, 'idle');
          if (previousSelectedKey != null) {
            updateKeyState(previousSelectedKey, 'selected');
          }
          updateComponent('keyEditorFormState', previousKeyEditorFormState);
        }
      },
    );

    onEvent(
      'cc-redis-explorer:delete-key',
      /** @param {string} key */
      async (key) => {
        updateKeyState(key, 'deleting');

        try {
          await redisClient.deleteKey(key, { signal });

          updateComponent(
            'state',
            /** @param {CcRedisExplorerStateLoaded} state */
            (state) => {
              state.keys = state.keys.filter((keyState) => keyState.key.key !== key);
            },
          );

          if (component.keyEditorFormState.type === 'update' && component.keyEditorFormState.keyValue.key === key) {
            updateComponent('keyEditorFormState', { type: 'hidden' });
          }

          notifySuccess(`Key ${key} deleted`);
        } catch (e) {
          console.error(e);
          notifyError(`Could not delete key ${key}`);
          updateKeyState(key, 'idle');
        }
      },
    );

    onEvent(
      'cc-redis-explorer:add-key',
      /** @param {CcRedisKeyValue} keyValue */
      async (keyValue) => {
        updateComponent(
          'keyEditorFormState',
          /** @param {CcRedisExplorerKeyEditorStateAdd} keyEditorFormState*/
          (keyEditorFormState) => {
            keyEditorFormState.formState.type = 'adding';
          },
        );

        try {
          await redisClient.addKey(keyValue, { signal });

          /** @type {CcRedisKeyState} */
          const newKeyState = { type: 'selected', key: { key: keyValue.key, type: keyValue.type } };

          // add key to the list. and make it selected
          updateComponent(
            'state',
            /** @param {CcRedisExplorerStateLoaded} state */
            (state) => {
              state.keys = [newKeyState, ...state.keys];
            },
          );
          updateComponent('keyEditorFormState', {
            type: 'update',
            formState: { type: 'idle' },
            keyValue,
          });

          notifySuccess(`Key ${keyValue.key} added`);
        } catch (e) {
          console.error(e);
          notifyError(`Could not add key ${keyValue.key}`);

          updateComponent(
            'keyEditorFormState',
            /** @param {CcRedisExplorerKeyEditorStateAdd} keyEditorFormState*/
            (keyEditorFormState) => {
              keyEditorFormState.formState.type = 'idle';
            },
          );
        }
      },
    );

    onEvent(
      'cc-redis-explorer:update-key',
      /** @param {CcRedisKeyValue} keyValue */
      async (keyValue) => {
        updateComponent(
          'keyEditorFormState',
          /** @param {CcRedisExplorerKeyEditorStateUpdate} keyEditorFormState*/
          (keyEditorFormState) => {
            keyEditorFormState.formState.type = 'updating';
            keyEditorFormState.keyValue = keyValue;
          },
        );

        try {
          await redisClient.updateKey(keyValue, { signal });

          notifySuccess(`Key ${keyValue.key} updated`);
        } catch (e) {
          console.error(e);
          notifyError(`Could not update key ${keyValue.key}`);
        } finally {
          updateComponent(
            'keyEditorFormState',
            /** @param {CcRedisExplorerKeyEditorStateUpdate} keyEditorFormState*/
            (keyEditorFormState) => {
              keyEditorFormState.formState.type = 'idle';
            },
          );
        }
      },
    );

    onEvent(
      'cc-redis-explorer:send-command',
      /** @param {string} command */
      async (command) => {
        updateComponent(
          'shellState',
          /** @param {CcRedisExplorerShellState} commandState*/
          (commandState) => {
            commandState.runningCommand = command;
          },
        );

        /** @type {Array<string>} */
        let lines;
        let error = false;

        try {
          // todo: move this logic into API
          const result = await redisClient.sendCommand(command, { signal });
          lines = transformResultForCLI(result);
        } catch (e) {
          const err = /** @type {{responseBody: {statusCode: number, message: string}}} */ (e);
          console.error(e);
          lines = [err.responseBody.message];
          error = true;
          // todo: it depends on the kind of error!
        } finally {
          updateComponent(
            'shellState',
            /** @param {CcRedisExplorerShellState} commandState*/
            (commandState) => {
              commandState.history.push({ command, result: lines, error });
              commandState.runningCommand = null;
            },
          );
        }
      },
    );

    // -- init ---

    updateComponent('state', { type: 'loading' });
    updateComponent('keyEditorFormState', { type: 'hidden' });
    component.resetAddEditorForm();
    component.resetUpdateEditorForm();

    try {
      // todo: do more than a simple ping
      const pong = await redisClient.ping({ signal });
      if (pong) {
        await fetchKeys();
      } else {
        updateComponent('state', { type: 'error' });
      }
    } catch (e) {
      console.error(e);
      updateComponent('state', { type: 'error' });
    }

    /**
     * @return {Promise<void>}
     */
    async function fetchKeys() {
      /** @type {Array<CcRedisKeyState>} */
      let keys;
      /** @type {number} */
      let total;
      /** @type {boolean} */
      let hasMore;

      if (component.state.type === 'loaded') {
        keys = component.state.keys;
        total = component.state.total;
        hasMore = component.state.hasMore;
      }

      updateComponent('state', { type: 'fetching-keys', keys: keys ?? [], total });

      try {
        if (redisKeysScroller.hasMore()) {
          await redisKeysScroller.next();
          keys = redisKeysScroller.keys.map((key) => ({ type: 'idle', key }));
          total = redisKeysScroller.total;
          hasMore = redisKeysScroller.hasMore();
        }
      } catch (e) {
        console.error(e);
        notifyError(`Could not fetch keys`);
      } finally {
        updateComponent('state', { type: 'loaded', keys, total, hasMore });
      }
    }
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
   * @param signal
   * @return {Promise<boolean>}
   */
  async ping({ signal }) {
    return Promise.resolve({
      method: 'post',
      url: `/command/ping`,
      headers: { Accept: 'application/json, text/plain', 'Content-Type': 'application/json' },
    })
      .then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }))
      .then((result) => {
        return result === 'PONG';
      });
  }

  /**
   * @param {object} options
   * @param {number} [options.count]
   * @param {CcRedisKeyType} [options.type]
   * @param {string} [options.match]
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   * @return {Promise<{total: number, keys: Array<{key: string, type: CcRedisKeyType}>}>}
   */
  async describeKeys({ count, type, match }, { signal }) {
    return Promise.resolve({
      method: 'get',
      url: `/keys`,
      headers: { Accept: 'application/json' },
      queryParams: pickNonNull({ count: count ?? 100, type, match }, ['count', 'type', 'match']),
    }).then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }));
  }

  /**
   * @param {number} cursor
   * @param {object} options
   * @param {number} [options.count]
   * @param {CcRedisKeyType} [options.type]
   * @param {string} [options.match]
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   * @return {Promise<{cursor: number, total: number, keys: Array<{key: string, type: CcRedisKeyType}>}>}
   */
  async describeKeys2(cursor, { count, type, match }, { signal }) {
    return Promise.resolve({
      method: 'get',
      url: `/keys2/${cursor}`,
      headers: { Accept: 'application/json' },
      queryParams: pickNonNull({ count, type, match }, ['count', 'type', 'match']),
    }).then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }));
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
    }).then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }));
  }

  /**
   * @param {string} key
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   * @return {Promise<CcRedisKeyValue>}
   */
  async deleteKey(key, { signal }) {
    return Promise.resolve({
      method: 'delete',
      url: `/keys/${key}`,
      headers: { Accept: 'application/json' },
    }).then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }));
  }

  /**
   * @param {CcRedisKeyValue} keyValue
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   * @return {Promise<CcRedisKeyValue>}
   */
  async addKey(keyValue, { signal }) {
    const { key, ...body } = keyValue;

    return Promise.resolve({
      method: 'post',
      url: `/keys/${key}`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body,
    }).then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }));
  }

  /**
   * @param {CcRedisKeyValue} keyValue
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   * @return {Promise<CcRedisKeyValue>}
   */
  async updateKey(keyValue, { signal }) {
    const { key, ...body } = keyValue;

    return Promise.resolve({
      method: 'put',
      url: `/keys/${key}`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body,
    }).then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }));
  }

  /**
   * @param {string} commandLine
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   * @return {Promise<string>}
   */
  async sendCommand(commandLine, { signal }) {
    const { command, args } = parseRedisCommand(commandLine);

    return Promise.resolve({
      method: 'post',
      url: `/command/${command}`,
      headers: { Accept: 'application/json, text/plain', 'Content-Type': 'application/json' },
      body: args,
    })
      .then(sendToRedisProxy({ apiConfig: this._apiConfig, signal }))
      .then((result) => {
        return result;
      });
  }
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

class RedisKeysVirtualScroller {
  /**
   * @param {RedisClient} redisClient
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   */
  constructor(redisClient, { signal }) {
    this._redisClient = redisClient;
    this._signal = signal;
    /** @type {Map<string, {key: string, type: CcRedisKeyType}>} */
    this._keysMap = new Map();
    /** @type {Array<{key: string, type: CcRedisKeyType}>} */
    this._keys = [];
    /** @type {number|null} */
    this._cursor = null;
  }

  /**
   * @param {object} options
   * @param {CcRedisKeyType} [options.type]
   * @param {string} [options.match]
   */
  changeFilter({ type, match }) {
    this._type = type;
    this._match = match;
    this._cursor = null;
    this._keysMap.clear();
    this._keys = [];
  }

  /**
   * @return {Array<{key: string, type: CcRedisKeyType}>}
   */
  get keys() {
    return this._keys;
  }

  /**
   * @return {number}
   */
  get total() {
    return this._total;
  }

  /**
   * @return {boolean}
   */
  hasMore() {
    return this._cursor !== 0;
  }

  /**
   * @param {number} [count]
   * @return {Promise<void>}
   */
  async next(count = 100) {
    if (this._cursor !== 0) {
      const f = await this._fetch(this._cursor, count);
      f.keys.forEach((k) => {
        this._keysMap.set(k.key, k);
      });
      this._keys = Array.from(this._keysMap.values());
      this._cursor = f.cursor;
      this._total = f.total;
    }
  }

  /**
   *
   * @param {number} cursor
   * @param {number} count
   * @return {Promise<{cursor: number, total: number, keys: Array<{key: string, type: CcRedisKeyType}>}>}
   * @private
   */
  async _fetch(cursor, count) {
    return await this._redisClient.describeKeys2(
      cursor ?? 0,
      { count, type: this._type, match: this._match },
      { signal: this._signal },
    );
  }
}
//
// class RedisKeysVirtualPager {
//   /**
//    *
//    * @param {RedisClient} client
//    * @param {number} pageSize
//    * @param {object} options
//    * @param {CcRedisKeyType} [options.type]
//    * @param {string} [options.match]
//    * @param {object} _
//    * @param {AbortSignal} [_.signal]
//    */
//   constructor(client, pageSize, {type, match}, { signal }) {
//     this._redisClient = client;
//     this._pageSize = pageSize;
//     this._currentPage = null;
//     this._type = type;
//     this._match = match;
//     this._signal = signal;
//
//     /** @type {Array<{key: string, type: CcRedisKeyType}>} */
//     this._keys = [];
//
//     this._cursor = null;
//
//     this._currentPage = null;
//     this._pageCount = null;
//   }
//
//   async init() {
//     // goes to the first page
//     const f = await this._fetch(0);
//
//     this._keys = f.keys;
//     this._total = f.total;
//     this._cursor = f.cursor;
//     this._currentPage = 0;
//     this._pageCount = Math.floor(this._total / this._pageSize) + 1;
//   }
//
//   getCurrentPage() {
//     // need
//     return {
//       index: this._currentPage,
//       items: ...
//     }
//   }
//
//   hasNext() {
//     return this._currentPage < this._pageCount;
//   }
//
//   next() {
//     if (this.hasNext()) {
//
//     }
//   }
//
//   hasPrevious() {
//     return this._currentPage > 0;
//   }
//
//   previous() {
//     if (this.hasPrevious()) {
//       this._currentPage--;
//     }
//   }
//
//   goToPage(pageIndex) {
//
//   }
//
//   /**
//    *
//    * @param {number} cursor
//    * @return {Promise<{cursor: number, total: number, keys: Array<{key: string, type: CcRedisKeyType}>}>}
//    * @private
//    */
//   async _fetch(cursor) {
//     return await this._redisClient.describeKeys2(
//       cursor,
//       {count: this._pageSize, type: this._type, match: this._match},
//       {signal: this._signal}
//     );
//   }
// }
