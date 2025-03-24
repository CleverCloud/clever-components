import { CcEvent } from '../../lib/events.js';

/**
 * Fires when a new environment variable is created.
 * @extends {CcEvent<{name: string, value: string}>}
 */
export class CcEnvVarCreateEvent extends CcEvent {
  static TYPE = 'cc-env-var-create';

  /**
   * @param {{name: string, value: string}} detail
   */
  constructor(detail) {
    super(CcEnvVarCreateEvent.TYPE, detail);
  }
}
