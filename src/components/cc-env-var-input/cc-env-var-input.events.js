import { CcEvent } from '../../lib/events.js';

/**
 * @import { EnvVarName } from './cc-env-var-input.types.js'
 */

/**
 * Dispatched when an env var value changes.
 * @extends {CcEvent<{name: string, value: string}>}
 */
export class CcEnvVarChangeEvent extends CcEvent {
  static TYPE = 'cc-env-var-change';

  /**
   * @param {{name: string, value: string}} detail
   */
  constructor(detail) {
    super(CcEnvVarChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an env var deletion is requested.
 * @extends {CcEvent<EnvVarName>}
 */
export class CcEnvVarDeleteEvent extends CcEvent {
  static TYPE = 'cc-env-var-delete';

  /**
   * @param {EnvVarName} detail
   */
  constructor(detail) {
    super(CcEnvVarDeleteEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an env var restoration is requested.
 * @extends {CcEvent<EnvVarName>}
 */
export class CcEnvVarKeepEvent extends CcEvent {
  static TYPE = 'cc-env-var-keep';

  /**
   * @param {EnvVarName} detail
   */
  constructor(detail) {
    super(CcEnvVarKeepEvent.TYPE, detail);
  }
}
