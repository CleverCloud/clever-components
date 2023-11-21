/**
 * Send a custom event in the format node => tagName:eventSuffix
 * @param {Window|Node} node
 * @param {String} eventNameOrSuffix - In case of an eventName it will dispatch the event associated to the node or dispatch the event directly if there's a suffix in the eventName
 * @param {any} [detail]
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

/**
 * This a utility handler that will help adding and removing an event listener from a DOM Element.
 */
export class EventHandler {
  /**
   * @param {Window | Document | HTMLElement} element The element to which the event listener should be attached to.
   * @param {string} event The name of the event to listen to.
   * @param {(event: Event) => void} handler The function to execute when event occurs.
   */
  constructor (element, event, handler) {
    this._element = element;
    this._event = event;
    this._handler = handler;
    this._connected = false;
  }

  /**
   * Adds the event listener
   */
  connect () {
    if (!this._connected) {
      this._element.addEventListener(this._event, this._handler);
      this._connected = true;
    }
  }

  /**
   * Removes the event listener
   */
  disconnect () {
    if (this._connected) {
      this._element.removeEventListener(this._event, this._handler);
      this._connected = false;
    }
  }
}
