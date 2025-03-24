import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-env-var-input.types.js').EnvVarName} EnvVarName
 */

/**
 * Fires when the input value changes.
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
 * Fires when the delete button is clicked.
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
 * Fires when the keep button is clicked.
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
