import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the cancel button is clicked.
 * @extends {CcEvent<void>}
 */
export class CcApplicationDeployCancelEvent extends CcEvent {
  static TYPE = 'cc-application-deploy-cancel';

  constructor() {
    super(CcApplicationDeployCancelEvent.TYPE);
  }
}

/**
 * Fires when the restart button is clicked.
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
 * Fires when the start button is clicked.
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
 * Fires when the stop button is clicked.
 * @extends {CcEvent<void>}
 */
export class CcApplicationStopEvent extends CcEvent {
  static TYPE = 'cc-application-stop';

  constructor() {
    super(CcApplicationStopEvent.TYPE);
  }
}
