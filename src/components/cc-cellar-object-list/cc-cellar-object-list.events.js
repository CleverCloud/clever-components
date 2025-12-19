import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a Cellar objects filtering is requested.
 * @extends {CcEvent<string>}
 */
export class CcCellarObjectFilterEvent extends CcEvent {
  static TYPE = 'cc-cellar-object-filter';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarObjectFilterEvent.TYPE, details);
  }
}

/**
 * Dispatched when a Cellar navigation to bucket is requested.
 * @extends {CcEvent}
 */
export class CcCellarNavigateToHomeEvent extends CcEvent {
  static TYPE = 'cc-cellar-navigate-to-home';

  constructor() {
    super(CcCellarNavigateToHomeEvent.TYPE);
  }
}

/**
 * Dispatched when a Cellar navigation to bucket is requested.
 * @extends {CcEvent<string>}
 */
export class CcCellarNavigateToBucketEvent extends CcEvent {
  static TYPE = 'cc-cellar-navigate-to-bucket';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarNavigateToBucketEvent.TYPE, details);
  }
}

/**
 * Dispatched when a Cellar navigation to path is requested.
 * @extends {CcEvent<Array<string>>}
 */
export class CcCellarNavigateToPathEvent extends CcEvent {
  static TYPE = 'cc-cellar-navigate-to-path';

  /**
   * @param {Array<string>} details
   */
  constructor(details) {
    super(CcCellarNavigateToPathEvent.TYPE, details);
  }
}

/**
 * Dispatched when a Cellar navigation to previous page is requested.
 * @extends {CcEvent}
 */
export class CcCellarNavigateToPreviousPageEvent extends CcEvent {
  static TYPE = 'cc-cellar-navigate-to-previous-page';

  constructor() {
    super(CcCellarNavigateToPreviousPageEvent.TYPE);
  }
}

/**
 * Dispatched when a Cellar navigation to next page is requested.
 * @extends {CcEvent}
 */
export class CcCellarNavigateToNextPageEvent extends CcEvent {
  static TYPE = 'cc-cellar-navigate-to-next-page';

  constructor() {
    super(CcCellarNavigateToNextPageEvent.TYPE);
  }
}
