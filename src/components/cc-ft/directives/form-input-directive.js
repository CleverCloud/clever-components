import { html, nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';

const ELEMENT_HANDLERS = {
  'cc-input-text': {
    binding: {
      event: 'cc-input-text:input',
      value: (event) => event.detail,
    },
    submit: {
      event: 'cc-input-text:requestimplicitsubmit',
    },
    value: (element) => element.value,
  },
};

class FormInputDirective extends AsyncDirective {
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
  update (part, [formController, field]) {
    console.log(part);
    // console.log(field);

    if (formController !== this._formController) {
      this._formController = formController;
    }

    if (field !== this._field) {
      this._field = field;
    }

    const fieldDefinition = this._formController?.getFieldDefinition(this._field);

    if (part.element !== this._element) {
      this._setElement(part.element);
    }

    if (this._element != null && fieldDefinition != null) {
      const tagName = this._element.tagName.toLowerCase();

      part.element.setAttribute('name', this._field);

      if (tagName === 'cc-input-text') {
        this._element.required = fieldDefinition.required;
        this._element.disabled = this._formController?.formState?.state === 'submitting';
        this._element.value = this._formController?.getFieldValue(this._field);
      }
    }

    return this.render();
  }

  _setElement (element) {
    if (this._element != null) {
      this._removeListenersFromElement();
    }

    this._element = element;
    this._elementHandler = ELEMENT_HANDLERS[this._element.tagName.toLowerCase()];

    this._addListenersToElement();
  }

  _removeListenersFromElement () {
    this._eventHandlers.forEach((handler) => handler.disconnect());
    this._eventHandlers = [];
  }

  _addListenersToElement () {
    this._eventHandlers = this._getEventHandlers();
    this._eventHandlers.forEach((handler) => handler.connect());
  }

  disconnected () {
    this._removeListenersFromElement();
  }

  reconnected () {
    this._addListenersToElement();
  }

  _getEventHandlers (tagName) {
    if (this._elementHandler == null) {
      return [];
    }

    const eventHandlers = [];

    const bindingHandlerDef = this._elementHandler.binding;
    if (bindingHandlerDef != null) {
      eventHandlers.push(new EventHandler(
        this._element,
        bindingHandlerDef.event,
        (event) => {
          this._formController.setFieldValue(this._field, bindingHandlerDef.value(event));
        }));
    }

    const submitHandlerDef = this._elementHandler.submit;
    if (submitHandlerDef != null) {
      eventHandlers.push(new EventHandler(
        this._element,
        submitHandlerDef.event,
        (event) => {
          this._formController?.submit();
        }));
    }

    return eventHandlers;
  }
}

export const formInput = directive(FormInputDirective);

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
