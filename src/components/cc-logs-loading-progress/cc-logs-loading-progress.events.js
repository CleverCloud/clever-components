import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the pause button is clicked.
 * @extends {CcEvent<void>}
 */
export class CcLogsLoadingPauseEvent extends CcEvent {
  static TYPE = 'cc-logs-loading-pause';

  constructor() {
    super(CcLogsLoadingPauseEvent.TYPE);
  }
}

/**
 * Fires when the resume button is clicked.
 * @extends {CcEvent<void>}
 */
export class CcLogsLoadingResumeEvent extends CcEvent {
  static TYPE = 'cc-logs-loading-resume';

  constructor() {
    super(CcLogsLoadingResumeEvent.TYPE);
  }
}

/**
 * Fires when the accept overflow button is clicked.
 * @extends {CcEvent<void>}
 */
export class CcLogsLoadingOverflowAcceptEvent extends CcEvent {
  static TYPE = 'cc-logs-loading-overflow-accept';

  constructor() {
    super(CcLogsLoadingOverflowAcceptEvent.TYPE);
  }
}

/**
 * Fires when the discard overflow button is clicked.
 * @extends {CcEvent<void>}
 */
export class CcLogsLoadingOverflowDiscardEvent extends CcEvent {
  static TYPE = 'cc-logs-loading-overflow-discard';

  constructor() {
    super(CcLogsLoadingOverflowDiscardEvent.TYPE);
  }
}
