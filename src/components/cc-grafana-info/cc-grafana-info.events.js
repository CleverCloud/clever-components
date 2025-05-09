import { CcEvent } from '../../lib/events.js';

/**
 * Dispatch when grafana activation or deactivation is requested.
 * @extends {CcEvent<{isEnabled: boolean}>}
 */
export class CcGrafanaToggleEvent extends CcEvent {
  static TYPE = 'cc-grafana-toggle';

  /**
   * @param {{isEnabled: boolean}} detail
   */
  constructor(detail) {
    super(CcGrafanaToggleEvent.TYPE, detail);
  }
}

/**
 * Dispatch when grafana reset is requested.
 * @extends {CcEvent}
 */
export class CcGrafanaResetEvent extends CcEvent {
  static TYPE = 'cc-grafana-reset';

  constructor() {
    super(CcGrafanaResetEvent.TYPE);
  }
}
