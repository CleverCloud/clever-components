import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when pause of the logs stream is requested.
 * @extends {CcEvent}
 */
export class CcLogsLoadingPauseEvent extends CcEvent {
  static TYPE = 'cc-logs-loading-pause';

  constructor() {
    super(CcLogsLoadingPauseEvent.TYPE);
  }
}

/**
 * Dispatched when resume of the logs stream is requested.
 * @extends {CcEvent}
 */
export class CcLogsLoadingResumeEvent extends CcEvent {
  static TYPE = 'cc-logs-loading-resume';

  constructor() {
    super(CcLogsLoadingResumeEvent.TYPE);
  }
}

/**
 * Dispatched when the logs stream overflow is accepted.
 * @extends {CcEvent}
 */
export class CcLogsLoadingOverflowAcceptEvent extends CcEvent {
  static TYPE = 'cc-logs-loading-overflow-accept';

  constructor() {
    super(CcLogsLoadingOverflowAcceptEvent.TYPE);
  }
}

/**
 * Dispatched when the logs stream overflow is discarded.
 * @extends {CcEvent}
 */
export class CcLogsLoadingOverflowDiscardEvent extends CcEvent {
  static TYPE = 'cc-logs-loading-overflow-discard';

  constructor() {
    super(CcLogsLoadingOverflowDiscardEvent.TYPE);
  }
}
