// @ts-expect-error FIXME: remove when clever-client exports types
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { request } from '@clevercloud/client/esm/request.fetch.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { withOptions } from '@clevercloud/client/esm/with-options.js';

/**
 * @typedef {import('./cc-kv-explorer.types.js').CcKvKeyType} CcKvKeyType
 * @typedef {import('../common.types.js').ValueOrArray<string|number|null>} CommandResult
 */

/**
 * A client to the kv proxy APIs
 */
export class KvClient {
  /**
   * @param {{url: string, backendUrl: string}} apiConfig
   */
  constructor(apiConfig) {
    this._apiConfig = apiConfig;
    this._abortController = new AbortController();
  }

  /**
   * Once this method is called, all other methods will fail with abort error.
   */
  close() {
    this._abortController.abort();
  }

  /**
   * @return {Promise<boolean>}
   */
  async ping() {
    const pong = await this.sendCommand('PING', []);
    return pong.result === 'PONG';
  }

  /**
   * @param {object} [options]
   * @param {number} [options.cursor]
   * @param {number} [options.count]
   * @param {CcKvKeyType} [options.type]
   * @param {string} [options.match]
   * @return {Promise<{cursor: number, total: number, keys: Array<{name: string, type: CcKvKeyType}>}>}
   */
  scanKeys({ cursor, count, type, match } = {}) {
    return Promise.resolve({
      method: 'post',
      url: `/keys/_scan`,
      body: { cursor, count, type, match },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @return {Promise<{key: string, deleted: boolean}>}
   */
  deleteKey(keyName) {
    return Promise.resolve({
      method: 'post',
      url: `/key/_delete`,
      body: { key: keyName },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {AbortSignal} signal
   * @return {Promise<{key: string, value: string}>}
   */
  getStringKey(keyName, signal) {
    return Promise.resolve({
      method: 'post',
      url: `/key/string/_get`,
      body: { key: keyName },
    }).then(this._sendToKvProxy(signal));
  }

  /**
   * @param {string} keyName
   * @param {string} value
   * @return {Promise<{key: string, value: string}>}
   */
  createStringKey(keyName, value) {
    return Promise.resolve({
      method: 'post',
      url: `/key/string/_create`,
      body: { key: keyName, value },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {string} value
   * @return {Promise<{key: string, value: string}>}
   */
  updateStringKey(keyName, value) {
    return Promise.resolve({
      method: 'post',
      url: `/key/string/_update`,
      body: { key: keyName, value },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {Array<{field: string, value: string}>} elements
   * @return {Promise<{key: string, elements: Array<{field: string, value: string}>}>}
   */
  createHashKey(keyName, elements) {
    return Promise.resolve({
      method: 'post',
      url: `/key/hash/_create`,
      body: { key: keyName, elements },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {AbortSignal} signal
   * @param {object} [options]
   * @param {number} [options.cursor]
   * @param {number} [options.count]
   * @param {string} [options.match]
   * @return {Promise<{cursor: number, total: number, elements: Array<{field: string, value: string}>}>}
   */
  scanHash(keyName, signal, { cursor, count, match } = {}) {
    return Promise.resolve({
      method: 'post',
      url: `/key/hash/_scan`,
      body: { key: keyName, cursor, count, match },
    }).then(this._sendToKvProxy(signal));
  }

  /**
   * @param {string} keyName
   * @param {string} field
   * @return {Promise<{key: string, field: string, deleted: boolean}>}
   */
  deleteHashElement(keyName, field) {
    return Promise.resolve({
      method: 'post',
      url: `/key/hash/_delete`,
      body: { key: keyName, field },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {string} field
   * @param {string} value
   * @return {Promise<{key: string, field: string, value: string, added: boolean}>}
   */
  setHashElement(keyName, field, value) {
    return Promise.resolve({
      method: 'post',
      url: `/key/hash/_set`,
      body: { key: keyName, field, value },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {Array<string>} elements
   * @return {Promise<{key: string, elements: Array<{index: number, value: string}>}>}
   */
  createListKey(keyName, elements) {
    return Promise.resolve({
      method: 'post',
      url: `/key/list/_create`,
      body: { key: keyName, elements },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {AbortSignal} signal
   * @param {object} [options]
   * @param {number} [options.cursor]
   * @param {number} [options.count]
   * @param {number} [options.match]
   * @return {Promise<{cursor: number, total: number, elements: Array<{index: number, value: string}>}>}
   */
  scanList(keyName, signal, { cursor, count, match } = {}) {
    return Promise.resolve({
      method: 'post',
      url: `/key/list/_scan`,
      body: { key: keyName, cursor, count, match },
    }).then(this._sendToKvProxy(signal));
  }

  /**
   * @param {string} keyName
   * @param {number} index
   * @param {AbortSignal} signal
   * @return {Promise<{key: string, index: number, value: string}>}
   */
  getListElementAt(keyName, index, signal) {
    return Promise.resolve({
      method: 'post',
      url: `/key/list/_get`,
      body: { key: keyName, index },
    }).then(this._sendToKvProxy(signal));
  }

  /**
   * @param {string} keyName
   * @param {number} index
   * @param {string} value
   * @return {Promise<{key: string, index: number, value: string}>}
   */
  updateListElement(keyName, index, value) {
    return Promise.resolve({
      method: 'post',
      url: `/key/list/_update`,
      body: { key: keyName, index, value },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {'tail'|'head'} position
   * @param {string} value
   * @return {Promise<{key: string, index: number, value: string}>}
   */
  pushListElement(keyName, position, value) {
    return Promise.resolve({
      method: 'post',
      url: `/key/list/_push`,
      body: { key: keyName, position, value },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {Array<string>} elements
   * @return {Promise<{key: string, elements: Array<string>}>}
   */
  createSetKey(keyName, elements) {
    return Promise.resolve({
      method: 'post',
      url: `/key/set/_create`,
      body: { key: keyName, elements },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {AbortSignal} signal
   * @param {object} [options]
   * @param {number} [options.cursor]
   * @param {number} [options.count]
   * @param {string} [options.match]
   * @return {Promise<{cursor: number, total: number, elements: Array<string>}>}
   */
  scanSet(keyName, signal, { cursor, count, match } = {}) {
    return Promise.resolve({
      method: 'post',
      url: `/key/set/_scan`,
      body: { key: keyName, cursor, count, match },
    }).then(this._sendToKvProxy(signal));
  }

  /**
   * @param {string} keyName
   * @param {string} element
   * @return {Promise<{key: string, element: string, deleted: boolean}>}
   */
  deleteSetElement(keyName, element) {
    return Promise.resolve({
      method: 'post',
      url: `/key/set/_delete`,
      body: { key: keyName, element },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} keyName
   * @param {string} element
   * @return {Promise<{key: string, element: string, added: boolean}>}
   */
  addSetElement(keyName, element) {
    return Promise.resolve({
      method: 'post',
      url: `/key/set/_set`,
      body: { key: keyName, element },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} commandLine
   * @return {Promise<{success: boolean, result: Array<string>}>}
   */
  sendCommandLine(commandLine) {
    return Promise.resolve({
      method: 'post',
      url: `/command/cli`,
      body: { commandLine },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {string} command
   * @param {Array<string>} args
   * @return {Promise<{result: CommandResult}>}
   */
  sendCommand(command, args) {
    return Promise.resolve({
      method: 'post',
      url: `/command`,
      body: { command, args },
    }).then(this._sendToKvProxy());
  }

  /**
   * @param {AbortSignal} [localSignal] The signal to be used instead of the global signal attached to this class.
   * @return {(requestParams: any) => Promise<any>}
   */
  _sendToKvProxy(localSignal) {
    return (requestParams) => {
      const { url, backendUrl } = this._apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(url))
        .then((requestParams) => {
          return {
            ...requestParams,
            body: { ...omitNulls(requestParams.body), backendUrl },
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          };
        })
        .then(withOptions({ signal: localSignal ?? this._abortController.signal }))
        .then(request);
    };
  }
}

/**
 *
 * @param {Partial<T>} object
 * @template {object} T
 */
function omitNulls(object) {
  return Object.fromEntries(Object.entries(object).filter(([, v]) => v != null));
}
