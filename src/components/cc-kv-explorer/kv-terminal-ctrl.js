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
      const { success, result } = await this._kvClient.sendCommandLine(commandLine);

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

      const errorCode = getErrorCode(e);
      if (errorCode === 'clever.redis-http.unknown-command' || errorCode === 'clever.redis-http.bad-command-format') {
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
 * @param {{responseBody?: { code?: string}}} e
 * @return {string | null} e
 */
function getErrorCode(e) {
  return e?.responseBody?.code;
}

/**
 * @param {{responseBody?: { message?: string}}} e
 * @return {string | null} e
 */
function getErrorMessage(e) {
  return e?.responseBody?.message;
}
