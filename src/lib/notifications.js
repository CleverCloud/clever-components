import { CcNotifyEvent } from './notifications.events.js';

/**
 * @typedef {import('../components/common.types.js').Notification} Notification
 */

/**
 * @param {Notification} notification
 * @param {Window|Node} target
 */
export function notify(notification, target = window) {
  target.dispatchEvent(new CcNotifyEvent(notification));
}

/**
 * @param {string|Node} message
 * @param {string} [title]
 */
export function notifyError(message, title) {
  notify({
    message,
    title,
    intent: 'danger',
  });
}

/**
 * @param {string|Node} message
 * @param {string} [title]
 */
export function notifySuccess(message, title) {
  notify({
    message,
    title,
    intent: 'success',
  });
}
