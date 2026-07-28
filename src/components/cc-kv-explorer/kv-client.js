import { RedisHttpClient } from '@clevercloud/client/redis-http-client.js';
import { CmdCliSendCommand } from '@clevercloud/client/redis-http-commands/cmd/cmd-cli-send-command.js';
import { CmdSendCommand } from '@clevercloud/client/redis-http-commands/cmd/cmd-send-command.js';
import { CreateHashKeyCommand } from '@clevercloud/client/redis-http-commands/hash-key/create-hash-key-command.js';
import { DeleteHashKeyElementCommand } from '@clevercloud/client/redis-http-commands/hash-key/delete-hash-key-element-command.js';
import { ScanHashKeyCommand } from '@clevercloud/client/redis-http-commands/hash-key/scan-hash-key-command.js';
import { SetHashKeyElementCommand } from '@clevercloud/client/redis-http-commands/hash-key/set-hash-key-element-command.js';
import { DeleteKeyCommand } from '@clevercloud/client/redis-http-commands/key/delete-key-command.js';
import { ScanKeyCommand } from '@clevercloud/client/redis-http-commands/key/scan-key-command.js';
import { AddListKeyElementCommand } from '@clevercloud/client/redis-http-commands/list-key/add-list-key-element-command.js';
import { CreateListKeyCommand } from '@clevercloud/client/redis-http-commands/list-key/create-list-key-command.js';
import { GetListKeyElementCommand } from '@clevercloud/client/redis-http-commands/list-key/get-list-key-element-command.js';
import { ScanListKeyCommand } from '@clevercloud/client/redis-http-commands/list-key/scan-list-key-command.js';
import { UpdateListKeyElementCommand } from '@clevercloud/client/redis-http-commands/list-key/update-list-key-element-command.js';
import { AddSetKeyElementCommand } from '@clevercloud/client/redis-http-commands/set-key/add-set-key-element-command.js';
import { CreateSetKeyCommand } from '@clevercloud/client/redis-http-commands/set-key/create-set-key-command.js';
import { DeleteSetKeyElementCommand } from '@clevercloud/client/redis-http-commands/set-key/delete-set-key-element-command.js';
import { ScanSetKeyCommand } from '@clevercloud/client/redis-http-commands/set-key/scan-set-key-command.js';
import { CreateStringKeyCommand } from '@clevercloud/client/redis-http-commands/string-key/create-string-key-command.js';
import { GetStringKeyCommand } from '@clevercloud/client/redis-http-commands/string-key/get-string-key-command.js';
import { UpdateStringKeyCommand } from '@clevercloud/client/redis-http-commands/string-key/update-string-key-command.js';

/**
 * @import { CcKvKeyType } from './cc-kv-explorer.types.js'
 * @import { ValueOrArray } from '../common.types.js'
 * @typedef {ValueOrArray<string|number|null>} CommandResult
 */

/**
 * A client to the kv proxy APIs.
 *
 * Thin facade around `@clevercloud/client`'s `RedisHttpClient`: keeps the same public method
 * signatures as before the migration (so the controllers in this directory don't need to change)
 * while adapting request/response/error shapes where the new client's commands differ from the
 * raw proxy payloads the previous hand-rolled implementation used.
 */
export class KvClient {
  /**
   * @param {{url: string, backendUrl: string}} apiConfig
   */
  constructor(apiConfig) {
    this._abortController = new AbortController();
    this._client = new RedisHttpClient({
      baseUrl: apiConfig.url,
      backendUrl: apiConfig.backendUrl,
      // the kv-proxy is on a different origin than the app, same as the legacy implementation
      // which always forced `mode: 'cors'`.
      defaultRequestConfig: { isCorsEnabled: true },
    });
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
  async scanKeys({ cursor, count, type, match } = {}) {
    const result = await this._client
      .send(new ScanKeyCommand(omitNulls({ cursor, count, type, match })), { signal: this._signal() })
      .catch(rethrowAdapted);

    return {
      cursor: result.cursor,
      total: result.total,
      // `Key#type` is typed as a plain `string` by the client, narrow it back to `CcKvKeyType`.
      keys: result.keys.map((key) => ({ name: key.name, type: /** @type {CcKvKeyType} */ (key.type) })),
    };
  }

  /**
   * @param {string} keyName
   * @return {Promise<{key: string, wasDeleted: boolean}>}
   */
  deleteKey(keyName) {
    return this._client.send(new DeleteKeyCommand({ key: keyName }), { signal: this._signal() }).catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {AbortSignal} signal
   * @return {Promise<{key: string, value: string}>}
   */
  getStringKey(keyName, signal) {
    return this._client
      .send(new GetStringKeyCommand({ key: keyName }), { signal: this._signal(signal) })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {string} value
   * @return {Promise<{key: string, value: string}>}
   */
  createStringKey(keyName, value) {
    return this._client
      .send(new CreateStringKeyCommand({ key: keyName, value }), { signal: this._signal() })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {string} value
   * @return {Promise<{key: string, value: string}>}
   */
  updateStringKey(keyName, value) {
    return this._client
      .send(new UpdateStringKeyCommand({ key: keyName, value }), { signal: this._signal() })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {Array<{field: string, value: string}>} elements
   * @return {Promise<{key: string, elements: Array<{field: string, value: string}>}>}
   */
  createHashKey(keyName, elements) {
    return this._client
      .send(new CreateHashKeyCommand({ key: keyName, elements }), { signal: this._signal() })
      .catch(rethrowAdapted);
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
  async scanHash(keyName, signal, { cursor, count, match } = {}) {
    const result = await this._client
      .send(new ScanHashKeyCommand(omitNulls({ key: keyName, cursor, count, match })), {
        signal: this._signal(signal),
      })
      .catch(rethrowAdapted);

    return {
      cursor: result.cursor,
      // NOTE: `ScanHashKeyCommandOutput` doesn't declare `total` even though the underlying
      // endpoint (`POST /key/hash/_scan`, unchanged) still returns it. Read it dynamically.
      total: /** @type {any} */ (result).total,
      elements: result.elements,
    };
  }

  /**
   * @param {string} keyName
   * @param {string} field
   * @return {Promise<{key: string, field: string, wasDeleted: boolean}>}
   */
  deleteHashElement(keyName, field) {
    return this._client
      .send(new DeleteHashKeyElementCommand({ key: keyName, field }), { signal: this._signal() })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {string} field
   * @param {string} value
   * @return {Promise<{key: string, field: string, value: string, wasAdded: boolean}>}
   */
  setHashElement(keyName, field, value) {
    return this._client
      .send(new SetHashKeyElementCommand({ key: keyName, field, value }), { signal: this._signal() })
      .catch(rethrowAdapted);
  }

  /**
   * NOTE: unlike the other `list` methods, the new `CreateListKeyCommand` returns
   * `elements: Array<string>` (no `index`), whereas the legacy proxy response paired each value
   * with its index. The only caller (`KvKeyEditorListCtrl#create()`) ignores the resolved value
   * and rebuilds its own indexed elements from the input array, so this narrower shape has no
   * behavioral impact.
   *
   * @param {string} keyName
   * @param {Array<string>} elements
   * @return {Promise<{key: string, elements: Array<string>}>}
   */
  createListKey(keyName, elements) {
    return this._client
      .send(new CreateListKeyCommand({ key: keyName, elements }), { signal: this._signal() })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {AbortSignal} signal
   * @param {object} [options]
   * @param {number} [options.cursor]
   * @param {number} [options.count]
   * @param {number} [options.match] Kept for backward-compatibility but no longer forwarded: the
   *   new `ScanListKeyCommand` doesn't support a `match` filter (lists are only scanned by
   *   cursor/count, never by glob pattern). The only caller of this method already always passes
   *   `null` here.
   * @return {Promise<{cursor: number, total: number, elements: Array<{index: number, value: string}>}>}
   */
  async scanList(keyName, signal, { cursor, count } = {}) {
    const result = await this._client
      .send(new ScanListKeyCommand(omitNulls({ key: keyName, cursor, count })), { signal: this._signal(signal) })
      .catch(rethrowAdapted);

    return {
      cursor: result.cursor,
      // NOTE: same `total` caveat as `scanHash()`, see comment above.
      total: /** @type {any} */ (result).total,
      elements: result.elements,
    };
  }

  /**
   * @param {string} keyName
   * @param {number} index
   * @param {AbortSignal} signal
   * @return {Promise<{key: string, index: number, value: string}>}
   */
  getListElementAt(keyName, index, signal) {
    return this._client
      .send(new GetListKeyElementCommand({ key: keyName, index }), { signal: this._signal(signal) })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {number} index
   * @param {string} value
   * @return {Promise<{key: string, index: number, value: string}>}
   */
  updateListElement(keyName, index, value) {
    return this._client
      .send(new UpdateListKeyElementCommand({ key: keyName, index, value }), { signal: this._signal() })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {'tail'|'head'} position
   * @param {string} value
   * @return {Promise<{key: string, index: number, value: string}>}
   */
  pushListElement(keyName, position, value) {
    return this._client
      .send(new AddListKeyElementCommand({ key: keyName, position, value }), { signal: this._signal() })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {Array<string>} elements
   * @return {Promise<{key: string, elements: Array<string>}>}
   */
  createSetKey(keyName, elements) {
    return this._client
      .send(new CreateSetKeyCommand({ key: keyName, elements }), { signal: this._signal() })
      .catch(rethrowAdapted);
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
  async scanSet(keyName, signal, { cursor, count, match } = {}) {
    const result = await this._client
      .send(new ScanSetKeyCommand(omitNulls({ key: keyName, cursor, count, match })), {
        signal: this._signal(signal),
      })
      .catch(rethrowAdapted);

    return {
      cursor: result.cursor,
      // NOTE: same `total` caveat as `scanHash()`, see comment above.
      total: /** @type {any} */ (result).total,
      elements: result.elements,
    };
  }

  /**
   * @param {string} keyName
   * @param {string} element
   * @return {Promise<{key: string, element: string, wasDeleted: boolean}>}
   */
  deleteSetElement(keyName, element) {
    return this._client
      .send(new DeleteSetKeyElementCommand({ key: keyName, element }), { signal: this._signal() })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} keyName
   * @param {string} element
   * @return {Promise<{key: string, element: string, wasAdded: boolean}>}
   */
  addSetElement(keyName, element) {
    return this._client
      .send(new AddSetKeyElementCommand({ key: keyName, element }), { signal: this._signal() })
      .catch(rethrowAdapted);
  }

  /**
   * @param {string} commandLine
   * @return {Promise<{isSuccess: boolean, result: Array<string>}>}
   */
  sendCommandLine(commandLine) {
    return this._client.send(new CmdCliSendCommand({ commandLine }), { signal: this._signal() }).catch(rethrowAdapted);
  }

  /**
   * @param {string} command
   * @param {Array<string>} args
   * @return {Promise<{result: CommandResult}>}
   */
  sendCommand(command, args) {
    return this._client.send(new CmdSendCommand({ command, args }), { signal: this._signal() }).catch(rethrowAdapted);
  }

  /**
   * Combines the given per-call signal (if any) with the global "close-all" signal so that
   * calling `close()` still aborts every in-flight request, exactly like before.
   *
   * @param {AbortSignal} [localSignal] The signal to be used in addition to the global signal
   *   attached to this class.
   * @return {AbortSignal}
   */
  _signal(localSignal) {
    if (localSignal == null) {
      return this._abortController.signal;
    }
    return AbortSignal.any([localSignal, this._abortController.signal]);
  }
}

/**
 * Adapts an error thrown by `RedisHttpClient#send()` so that the rest of the KV explorer code
 * (which was written against the legacy `esm/request.fetch.js` error shape) keeps working
 * unchanged:
 * - aborted requests are normalized back into a native `DOMException`/`AbortError`, like a raw
 *   `fetch()` call would throw (the new client instead wraps them in a `CcRequestError` with
 *   `code: 'ABORTED'`). `src/lib/abortable.js` and `kv-details-ctrl.js` duck-type on that.
 * - HTTP errors get a `.responseBody` property aliasing the new `.response.body` getter, since
 *   `cc-kv-explorer.smart.js`, `kv-details-ctrl.js`, `kv-terminal-ctrl.js` and
 *   `kv-key-editor-list-ctrl.js` all read `error.responseBody.code` / `.context.key` / `.message`.
 *
 * @param {unknown} e
 * @return {never}
 */
function rethrowAdapted(e) {
  const err = /** @type {any} */ (e);
  if (err?.code === 'ABORTED') {
    throw new DOMException(err.message ?? 'The operation was aborted.', 'AbortError');
  }
  if (err?.response?.body != null) {
    err.responseBody = err.response.body;
  }
  throw err;
}

/**
 * @template {object} T
 * @param {T} object
 * @return {T}
 */
function omitNulls(object) {
  // `Object.fromEntries()` is typed as returning `{ [k: string]: any }`, which isn't assignable
  // to the specific command input types this is used for (e.g. `ScanHashKeyCommandInput`), even
  // though it structurally still is one. Cast back to `T` explicitly.
  return /** @type {T} */ (Object.fromEntries(Object.entries(object).filter(([, v]) => v != null)));
}
