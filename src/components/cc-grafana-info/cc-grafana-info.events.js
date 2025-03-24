import { CcEvent } from '../../lib/events.js';

/**
 * Fires when grafana is enabled or disabled.
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
 * Fires when grafana is reset.
 * @extends {CcEvent<void>}
 */
export class CcGrafanaResetEvent extends CcEvent {
  static TYPE = 'cc-grafana-reset';

  constructor() {
    super(CcGrafanaResetEvent.TYPE);
  }
}
