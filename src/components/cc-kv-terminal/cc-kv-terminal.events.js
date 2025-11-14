import { CcEvent } from '../../lib/events.js';

/**
 * @import { CcKvTerminalState } from './cc-kv-terminal.types.js'
 */

/**
 * Dispatched when KV terminal state changes.
 * @extends {CcEvent<CcKvTerminalState>}
 */
export class CcKvTerminalStateChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-terminal-state-change';

  /**
   * @param {CcKvTerminalState} detail
   */
  constructor(detail) {
    super(CcKvTerminalStateChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a KV command execution is requested.
 * @extends {CcEvent<string>}
 */
export class CcKvCommandExecuteEvent extends CcEvent {
  static TYPE = 'cc-kv-command-execute';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvCommandExecuteEvent.TYPE, detail);
  }
}
