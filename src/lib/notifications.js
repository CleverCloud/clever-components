import { dispatchCustomEvent } from './events.js';

/**
 * @typedef {import('../toast/types.js').Notification} Notification
 */

/**
 * @param {EventTarget} target
 * @param {Notification} notification
 * @return {CustomEvent} the <code>cc:notify</code> event that has been dispatched.
 */
export function notify (target, notification) {
  return dispatchCustomEvent(target, 'cc:notify', notification);
}

/**
 * @param {EventTarget} target
 * @param {string} message
 * @param {string?} title
 * @return {CustomEvent} the <code>cc:notify</code> event that has been dispatched.
 */
export function notifyError (target, message, title) {
  return notify(target, {
    message,
    title,
    intent: 'danger',
  });
}

/**
 * @param {EventTarget} target
 * @param {string} message
 * @param {string?} title
 * @return {CustomEvent} the <code>cc:notify</code> event that has been dispatched.
 */
export function notifySuccess (target, message, title) {
  return notify(target, {
    message,
    title,
    intent: 'success',
  });
}
