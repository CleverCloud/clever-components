import { isCcHttpError, isCcHttpErrorWithCode } from '@clevercloud/client/utils/error-utils.js';

/**
 * @import { CcKvExplorer } from './cc-kv-explorer.js'
 * @import { KvClient } from './kv-client.js'
 * @import { CcKvTerminalState } from '../cc-kv-terminal/cc-kv-terminal.types.js'
 * @import { ObjectOrFunction } from '../common.types.js'
 */

export class KvTerminalCtrl {
  /**
   * @param {CcKvExplorer} component
   * @param {(stateUpdater: ObjectOrFunction<CcKvTerminalState>) => void} updateTerminalState
   * @param {KvClient} kvClient
   */
  constructor(component, updateTerminalState, kvClient) {
    this._component = component;
    this._updateTerminalState = updateTerminalState;
    this._kvClient = kvClient;
  }

  /**
   * @param {string} commandLine
   */
  async runCommandLine(commandLine) {
    this._updateTerminalState({
      type: 'running',
      commandLine,
      history: this._component.terminalState.history,
    });

    try {
      const { isSuccess: success, result } = await this._kvClient.sendCommandLine(commandLine);

      this._updateTerminalState({
        type: 'idle',
        history: this._component.terminalState.history.concat({ commandLine, result, success }),
      });
    } catch (e) {
      this._updateTerminalState({
        type: 'idle',
        history: this._component.terminalState.history.concat({
          commandLine,
          result: [getErrorMessage(e)],
          success: false,
        }),
      });

      if (
        isCcHttpErrorWithCode(e, 'clever.redis-http.unknown-command') ||
        isCcHttpErrorWithCode(e, 'clever.redis-http.bad-command-format')
      ) {
        throw e;
      }
    }
  }

  clear() {
    this._updateTerminalState({
      type: 'idle',
      history: [],
    });
  }
}

/**
 * The message the kv proxy sent, which is the message Redis© itself returned for the command.
 *
 * It is read from the response body and not from `Error#message`, because the client prefixes that
 * one with the HTTP status. The terminal prints this line as the command output, so it has to be
 * the raw Redis© message.
 *
 * @param {unknown} e
 * @return {string | null}
 */
function getErrorMessage(e) {
  if (!isCcHttpError(e)) {
    return null;
  }
  const body = /** @type {{message?: string}} */ (e.response.body);
  return body?.message ?? null;
}
