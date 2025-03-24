import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').EnvVar} EnvVar
 */

/**
 * Fires when the form is submitted.
 * @extends {CcEvent<EnvVar[]>}
 */
export class CcEnvVarFormSubmitEvent extends CcEvent {
  static TYPE = 'cc-env-var-form-submit';

  /**
   * @param {EnvVar[]} detail
   */
  constructor(detail) {
    super(CcEnvVarFormSubmitEvent.TYPE, detail);
  }
}

/**
 * Fires when the environment variables are changed.
 * @extends {CcEvent<EnvVar[]>}
 */
export class CcEnvChangeEvent extends CcEvent {
  static TYPE = 'cc-env-change';

  /**
   * @param {EnvVar[]} detail
   */
  constructor(detail) {
    super(CcEnvChangeEvent.TYPE, detail);
  }
}
