import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').EnvVar} EnvVar
 */

/**
 * Dispatched when the env var form is submitted.
 * @extends {CcEvent<Array<EnvVar>>}
 */
export class CcEnvVarFormSubmitEvent extends CcEvent {
  static TYPE = 'cc-env-var-form-submit';

  /**
   * @param {Array<EnvVar>} detail
   */
  constructor(detail) {
    super(CcEnvVarFormSubmitEvent.TYPE, detail);
  }
}

/**
 * Dispatched when env changes.
 * @extends {CcEvent<Array<EnvVar>>}
 */
export class CcEnvChangeEvent extends CcEvent {
  static TYPE = 'cc-env-change';

  /**
   * @param {Array<EnvVar>} detail
   */
  constructor(detail) {
    super(CcEnvChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when env vars have been updated successfully.
 * @extends {CcEvent<Array<EnvVar>>}
 */
export class CcEnvVarsWasUpdatedEvent extends CcEvent {
  static TYPE = 'cc-env-vars-was-updated';

  /**
   * @param {Array<EnvVar>} detail
   */
  constructor(detail) {
    super(CcEnvVarsWasUpdatedEvent.TYPE, detail);
  }
}
