import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when an env var creation is requested.
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
