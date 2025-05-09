import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a deployment cancellation is requested.
 * @extends {CcEvent}
 */
export class CcDeploymentCancelEvent extends CcEvent {
  static TYPE = 'cc-deployment-cancel';

  constructor() {
    super(CcDeploymentCancelEvent.TYPE);
  }
}

/**
 * Dispatch when an application restart is requested.
 * @extends {CcEvent<'normal'|'rebuild'|'last-commit'>}
 */
export class CcApplicationRestartEvent extends CcEvent {
  static TYPE = 'cc-application-restart';

  /**
   * @param {'normal'|'rebuild'|'last-commit'} [detail='normal']
   */
  constructor(detail) {
    super(CcApplicationRestartEvent.TYPE, detail ?? 'normal');
  }
}

/**
 * Dispatch when an application start is requested.
 * @extends {CcEvent<'normal'|'rebuild'|'last-commit'>}
 */
export class CcApplicationStartEvent extends CcEvent {
  static TYPE = 'cc-application-start';

  /**
   * @param {'normal'|'rebuild'|'last-commit'} [detail='normal']
   */
  constructor(detail) {
    super(CcApplicationStartEvent.TYPE, detail ?? 'normal');
  }
}

/**
 * Dispatch when an application stop is requested.
 * @extends {CcEvent}
 */
export class CcApplicationStopEvent extends CcEvent {
  static TYPE = 'cc-application-stop';

  constructor() {
    super(CcApplicationStopEvent.TYPE);
  }
}
