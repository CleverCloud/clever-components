import { produce } from './immer.js';

/**
 * Send a custom event in the format node => tagName:eventSuffix
 * @param {Window|Node} node
 * @param {String} eventNameOrSuffix - In case of an eventName it will dispatch the event associated to the node or dispatch the event directly if there's a suffix in the eventName
 * @param {any?} detail
 * @return {CustomEvent} the event that has been dispatched.
 */
export function dispatchCustomEvent (node, eventNameOrSuffix, detail) {
  const eventName = eventNameOrSuffix.includes(':')
    ? eventNameOrSuffix
    : `${node.nodeName?.toLocaleLowerCase()}:${eventNameOrSuffix}`;
  const event = new CustomEvent(eventName, { detail, bubbles: true, composed: true });
  node.dispatchEvent(event);
  return event;
}

export class CcEventTarget extends EventTarget {

  dispatch (type, data) {
    const event = new Event(type);
    event.data = data;
    super.dispatchEvent(event);
  }

  on (type, callback, options) {
    super.addEventListener(type, (event) => callback(event.data, event), options);
  }
}

export function getComponentUpdater (component, signal) {
  const target = new CcEventTarget();

  target.on('update-component', ({ property, callback }) => {
    if (typeof callback === 'function') {
      component[property] = produce(component[property], callback);
    }
    else {
      component[property] = callback;
    }
  }, { signal });

  return (property, callback) => {
    target.dispatch('update-component', { property, callback });
  };
}
