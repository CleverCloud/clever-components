import * as hanbi from 'hanbi';

/**
 * @import { Stub } from 'hanbi'
 */

/**
 * Listens for `eventType` on `element` and records every event it receives.
 *
 * @param {EventTarget} element
 * @param {string} eventType
 * @return {Stub<(event: Event) => void>}
 */
export function createEventSpy(element, eventType) {
  const spy = hanbi.spy();
  element.addEventListener(eventType, spy.handler);
  return spy;
}
