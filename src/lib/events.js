/**
 * This is a utility handler that will help adding and removing an event listener from a DOM Element.
 * @template {Event} T
 */
export class EventHandler {
  /**
   * @param {Window | Document | HTMLElement} element The element to which the event listener should be attached to.
   * @param {string} event The name of the event to listen to.
   * @param {(event: T) => void} handler The function to execute when event occurs.
   */
  constructor(element, event, handler) {
    this._element = element;
    this._event = event;
    this._handler = handler;
    this._connected = false;
  }

  /**
   * Adds the event listener
   */
  connect() {
    if (!this._connected && this._castHandler(this._handler)) {
      this._element.addEventListener(this._event, this._handler);
      this._connected = true;
    }
  }

  /**
   * Removes the event listener
   */
  disconnect() {
    if (this._connected && this._castHandler(this._handler)) {
      this._element.removeEventListener(this._event, this._handler);
      this._connected = false;
    }
  }

  /**
   * This is just for helping Typescript to understand that an event handler with a generic event is a classic EventListener.
   * @param {(event: T) => void} _handler
   * @return {_handler is EventListener}
   */
  _castHandler(_handler) {
    return true;
  }
}

/**
 * @extends {CustomEvent<D>}
 * @template [D=void] detail
 */
export class CcEvent extends CustomEvent {
  /**
   * @param {string} type
   * @param {D} [detail]
   */
  constructor(type, detail) {
    super(type, { detail, bubbles: true, composed: true });
  }

  // this makes CcEvent unique for Typescript
  get ccEvent() {
    return true;
  }
}
