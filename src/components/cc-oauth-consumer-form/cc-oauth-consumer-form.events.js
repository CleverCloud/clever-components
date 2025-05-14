import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerWithoutKeyAndSecret} OauthConsumerWithoutKeyAndSecret
 */

/**
 * Dispatched when an OAuth consumer creation is requested.
 * @extends {CcEvent<OauthConsumerWithoutKeyAndSecret>}
 */
export class CcOauthConsumerCreateEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-create';

  /** @param {OauthConsumerWithoutKeyAndSecret} detail */
  constructor(detail) {
    super(CcOauthConsumerCreateEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an OAuth consumer creation is requested.
 * We need to dispatch the key of an OAuth consumer for the redirection.
 * @extends {CcEvent<string>}
 */
export class CcOauthConsumerWasCreatedEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-was-created';

  /** @param {string} key */
  constructor(key) {
    super(CcOauthConsumerWasCreatedEvent.TYPE, key);
  }
}

/**
 * Dispatched when an OAuth consumer changes.
 * @extends {CcEvent<OauthConsumerWithoutKeyAndSecret>}
 */
export class CcOauthConsumerChangeEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-change';

  /** @param {OauthConsumerWithoutKeyAndSecret} detail */
  constructor(detail) {
    super(CcOauthConsumerChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an OAuth consumer was updated.
 * We need to dispatch the event for the redirection.
 * @extends {CcEvent<string>}
 */
export class CcOauthConsumerWasUpdatedEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-was-updated';

  constructor() {
    super(CcOauthConsumerWasUpdatedEvent.TYPE);
  }
}

/**
 * Dispatched when an OAuth consumer deletion is requested.
 * @extends {CcEvent<OauthConsumerWithoutKeyAndSecret>}
 */
export class CcOauthConsumerDeleteEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-delete';

  constructor() {
    super(CcOauthConsumerDeleteEvent.TYPE);
  }
}

/**
 * Dispatched when an OAuth consumer deletion is requested.
 * We need to dispatch the event for the redirection.
 * @extends {CcEvent<string>}
 */
export class CcOauthConsumerWasDeletedEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-was-deleted';

  constructor() {
    super(CcOauthConsumerWasDeletedEvent.TYPE);
  }
}
