import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').EnvVar} EnvVar
 */

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
