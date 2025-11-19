import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a Cellar bucket creation is requested.
 * @extends {CcEvent<{bucketName: string}>}
 */
export class CcCellarBucketCreateEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-create';

  /**
   * @param {{bucketName: string}} details
   */
  constructor(details) {
    super(CcCellarBucketCreateEvent.TYPE, details);
  }
}

/**
 * Dispatched when a Cellar bucket detail show is requested.
 * @extends {CcEvent<string>}
 */
export class CcCellarBucketShowEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-show';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarBucketShowEvent.TYPE, details);
  }
}

/**
 * Dispatched when a Cellar bucket detail show is requested.
 * @extends {CcEvent<string>}
 */
export class CcCellarBucketHideEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-hide';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarBucketHideEvent.TYPE, details);
  }
}

/**
 * Dispatched when a Cellar bucket deletion is requested.
 * @extends {CcEvent<string>}
 */
export class CcCellarBucketDeleteEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-delete';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarBucketDeleteEvent.TYPE, details);
  }
}

/**
 * @extends {CcEvent}
 */
export class CcCellarHomeNavigateHomeEvent extends CcEvent {
  static TYPE = 'cc-cellar-home-navigate';

  constructor() {
    super(CcCellarHomeNavigateHomeEvent.TYPE);
  }
}

/**
 * @extends {CcEvent<{ bucketName: string, path?: Array<string> }>}
 */
export class CcCellarObjectNavigateEvent extends CcEvent {
  static TYPE = 'cc-cellar-object-navigate';

  /**
   * @param {{ bucketName: string, path?: Array<string> }} details
   */
  constructor(details) {
    super(CcCellarObjectNavigateEvent.TYPE, details);
  }
}

/**
 * @extends {CcEvent}
 */
export class CcCellarObjectNextPageEvent extends CcEvent {
  static TYPE = 'cc-cellar-object-next-page';

  constructor() {
    super(CcCellarObjectNextPageEvent.TYPE);
  }
}

/**
 * @extends {CcEvent}
 */
export class CcCellarObjectPreviousPageEvent extends CcEvent {
  static TYPE = 'cc-cellar-object-previous-page';

  constructor() {
    super(CcCellarObjectPreviousPageEvent.TYPE);
  }
}

/**
 * @extends {CcEvent<{ bucketName: string, path?: Array<string>, file: File }>}
 */
export class CcCellarObjectUploadEvent extends CcEvent {
  static TYPE = 'cc-cellar-object-upload';

  /**
   * @param {{ bucketName: string, path: Array<string>, file: File }} details
   */
  constructor(details) {
    super(CcCellarObjectUploadEvent.TYPE, details);
  }
}
