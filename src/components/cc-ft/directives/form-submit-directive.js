import { nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';

const ELEMENT_EVENTS = {
  'cc-button': ['cc-button:click'],
  button: ['click'],
};

class FormSubmitDirective extends AsyncDirective {
  constructor (partInfo) {
    super(partInfo);
    this._element = null;
    this._formController = null;
    this._field = null;
    this._eventHandlers = [];
  }

  render (...props) {
    return nothing;
  }

  /**
   *
   * @param {ElementPart} part
   * @param {FormController} formController
   * @param {string} field
   */
  update (part, [formController]) {
    if (formController !== this._formController) {
      this._formController = formController;
    }

    if (part.element !== this._element) {
      this._setElement(part.element);
    }

    if (this._element != null) {
      const tagName = this._element.tagName.toLowerCase();

      const submitting = this._formController?.formState?.state === 'submitting';

      if (tagName === 'cc-button') {
        this._element.waiting = submitting;
      }
      else if (tagName === 'button') {
        this._element.disabled = submitting;
      }
    }

    return this.render();
  }

  _setElement (element) {
    if (this._element != null) {
      this._removeListeners();
    }

    this._element = element;
    this._elementHandler = ELEMENT_EVENTS[this._element.tagName.toLowerCase()];

    this._addListeners();
  }

  _removeListeners () {
    this._eventHandlers.forEach((handler) => handler.disconnect());
    this._eventHandlers = [];
  }

  _addListeners () {
    this._eventHandlers = this._getEventHandlers();
    this._eventHandlers.forEach((handler) => handler.connect());
  }

  disconnected () {
    this._removeListeners();
  }

  reconnected () {
    this._addListeners();
  }

  _getEventHandlers (tagName) {
    if (this._elementHandler == null) {
      return [];
    }

    return this._elementHandler.map((e) => {
      return new EventHandler(
        this._element,
        e,
        () => {
          this._formController?.submit();
        });
    });
  }
}

export const formSubmit = directive(FormSubmitDirective);

// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

/**
 * This a utility handler that will help adding and removing an event listener from a DOM Element.
 */
class EventHandler {
  /**
   * @param {Window | Document | HTMLElement} element The element where to attach the event listener.
   * @param {string} event The event to listen.
   * @param {(event: Event) => void} handler The function to execute when event occurs.
   */
  constructor (element, event, handler) {
    this._element = element;
    this._event = event;
    this._handler = handler;
  }

  /**
   * Adds the event listener
   */
  connect () {
    this._element.addEventListener(this._event, this._handler);
    this._connected = true;
  }

  /**
   * Removes the event listener
   */
  disconnect () {
    if (this._connected) {
      this._element.removeEventListener(this._event, this._handler);
    }
  }
}
