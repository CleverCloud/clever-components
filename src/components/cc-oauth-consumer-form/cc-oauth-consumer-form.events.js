import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerWithoutKeyAndSecret} OauthConsumerWithoutKeyAndSecret
 */

/**
 * Dispatched when an OAuth consumer creation is requested.
 * @extends {CcEvent<OauthConsumerWithoutKeyAndSecret>}
 */
export class CcOauthConsumerFormCreateEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-form-create';

  /** @param {OauthConsumerWithoutKeyAndSecret} detail */
  constructor(detail) {
    super(CcOauthConsumerFormCreateEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an OAuth consumer update is requested.
 * @extends {CcEvent<OauthConsumerWithoutKeyAndSecret>}
 */
export class CcOauthConsumerFormUpdateEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-form-update';

  /** @param {OauthConsumerWithoutKeyAndSecret} detail */
  constructor(detail) {
    super(CcOauthConsumerFormUpdateEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an OAuth consumer deletion is requested.
 * @extends {CcEvent<OauthConsumerWithoutKeyAndSecret>}
 */
export class CcOauthConsumerFormDeleteEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-form-delete';

  constructor() {
    super(CcOauthConsumerFormDeleteEvent.TYPE);
  }
}

/**
 * Dispatched when an OAuth consumer creation is requested.
 * We need to dispatch the key of an OAuth consumer for the redirection.
 * @extends {CcEvent<string>}
 */
export class CcOauthConsumerFormDispatchKeyEvent extends CcEvent {
  static TYPE = 'cc-oauth-consumer-form-dispatch-key';

  /** @param {string} key */
  constructor(key) {
    super(CcOauthConsumerFormDispatchKeyEvent.TYPE, key);
  }
}
