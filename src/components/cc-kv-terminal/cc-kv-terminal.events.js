import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-kv-terminal.types.d.ts').CcKvTerminalState} CcKvTerminalState
 */

/**
 * Fires when the terminal state changes.
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
 * Fires when a command is sent.
 * @extends {CcEvent<string>}
 */
export class CcKvTerminalCommandSendEvent extends CcEvent {
  static TYPE = 'cc-kv-terminal-command-send';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvTerminalCommandSendEvent.TYPE, detail);
  }
}
