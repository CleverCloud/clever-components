import { dispatchCustomEvent } from './events.js';

/**
 * @typedef {import('../components/common.types.js').Notification} Notification
 */

/**
 * @param {Notification} notification
 * @param {Window|Node} target
 * @return {CustomEvent} the <code>cc:notify</code> event that has been dispatched.
 */
export function notify(notification, target = window) {
  return dispatchCustomEvent(target, 'cc:notify', notification);
}

/**
 * @param {string|Node} message
 * @param {string} [title]
 * @return {CustomEvent} the <code>cc:notify</code> event that has been dispatched.
 */
export function notifyError(message, title) {
  return notify({
    message,
    title,
    intent: 'danger',
  });
}

/**
 * @param {string|Node} message
 * @param {string} [title]
 * @return {CustomEvent} the <code>cc:notify</code> event that has been dispatched.
 */
export function notifySuccess(message, title) {
  return notify({
    message,
    title,
    intent: 'success',
  });
}
