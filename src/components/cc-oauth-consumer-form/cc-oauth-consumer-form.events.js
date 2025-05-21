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
export class CcOauthConsumerCreatedEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-created';

  /** @param {string} key */
  constructor(key) {
    super(CcOauthConsumerCreatedEvent.TYPE, key);
  }
}

/**
 * Dispatched when an OAuth consumer update is requested.
 * @extends {CcEvent<OauthConsumerWithoutKeyAndSecret>}
 */
export class CcOauthConsumerUpdateEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-update';

  /** @param {OauthConsumerWithoutKeyAndSecret} detail */
  constructor(detail) {
    super(CcOauthConsumerUpdateEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an OAuth consumer update is requested.
 * We need to dispatch the event for the redirection.
 * @extends {CcEvent<string>}
 */
export class CcOauthConsumerUpdatedEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-updated';

  constructor() {
    super(CcOauthConsumerUpdatedEvent.TYPE);
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
export class CcOauthConsumerDeletedEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-deleted';

  constructor() {
    super(CcOauthConsumerDeletedEvent.TYPE);
  }
}
