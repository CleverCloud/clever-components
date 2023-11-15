import { nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';

const ELEMENT_EVENTS = {
  'cc-input-text:value': {
    bind: 'cc-input-text:input',
    submit: 'cc-input-text:requestimplicitsubmit',
    prop: 'value',
  },
  'cc-input-text:tags': {
    bind: 'cc-input-text:tags',
    submit: 'cc-input-text:requestimplicitsubmit',
    prop: 'tags',
  },
  'cc-toggle:value': {
    bind: 'cc-toggle:input',
    prop: 'value',
  },
  'cc-toggle:multipleValues': {
    bind: 'cc-toggle:input-multiple',
    prop: 'multipleValues',
  },
  'cc-input-number:value': {
    bind: 'cc-input-number:input',
    submit: 'cc-input-number:requestimplicitsubmit',
    prop: 'value',
  },
  'cc-select:value': {
    bind: 'cc-select:input',
    prop: 'value',
  },
  'input:checkbox': {
    bind: 'change',
    prop: 'checked',
  },
  select: {
    bind: 'change',
    prop: 'value',
  },
};

function simpleElementEvent (prop = 'value') {
  return {
    bind: 'input',
    prop,
  };
}

function getEvents (element, prop = 'value') {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'input') {
    return ELEMENT_EVENTS[`input:${element.type}`] ?? simpleElementEvent(prop);
  }

  if (tagName === 'cc-input-text') {
    return ELEMENT_EVENTS[`cc-input-text:${prop}`];
  }

  if (tagName === 'cc-toggle') {
    return ELEMENT_EVENTS[`cc-toggle:${prop}`];
  }

  return ELEMENT_EVENTS[tagName] ?? simpleElementEvent(prop);
}

class ElementHandler {
  constructor (element, bindEvent, submitEvent, prop) {
    this.element = element;
    this.bindEvent = bindEvent;
    this.submitEvent = submitEvent;
    this.prop = prop;
  }

  setValue (value) {
    this.element[this.prop] = value;
  }

  getValue () {
    return this.element[this.prop];
  }

  /**
   *
   * @param {FormController} ctrl
   * @param field
   */
  connect (ctrl, field) {
    this.eventHandlers = [];

    if (this.bindEvent != null) {
      this.eventHandlers.push(new EventHandler(
        this.element,
        this.bindEvent,
        () => {
          ctrl.setFieldValue(field, this.getValue());
        }));
    }

    if (this.submitEvent != null) {
      this.eventHandlers.push(new EventHandler(
        this.element,
        this.submitEvent,
        () => {
          ctrl.submit();
        }));
    }

    this.eventHandlers.forEach((handler) => handler.connect());
  }

  disconnect () {
    this.eventHandlers.forEach((handler) => handler.disconnect());
    this.eventHandlers = [];
  }
}

function getElementHandler (element, prop, bindEvent) {
  const event = getEvents(element, prop);
  return new ElementHandler(element, bindEvent ?? event.bind, event.submit, event.prop);
}

class FormInputDirective extends AsyncDirective {
  constructor (partInfo) {
    super(partInfo);
    this._element = null;
    /** @type {FormController} */
    this._formController = null;
    this._field = null;
    this._elementHandler = null;
  }

  render (...props) {
    return nothing;
  }

  /**
   *
   * @param {ElementPart} part
   * @param {FormController} formController
   * @param {string} field
   * @param {string} prop
   */
  update (part, [formController, field, prop, bindEvent]) {
    this._formController = formController;
    this._field = field;

    const fieldDefinition = this._formController?.getFieldDefinition(this._field);

    if (part.element !== this._element || prop !== this._prop || bindEvent !== this._bindEvent) {
      this._setElement(part.element, prop, bindEvent);
    }

    if (this._element != null && fieldDefinition != null) {
      part.element.setAttribute('name', this._field);

      // todo: maybe we should use setAttribute for those two below
      this._element.required = fieldDefinition.required;
      this._element.disabled = this._formController?.getState() === 'submitting';

      this._elementHandler.setValue(this._formController?.getFieldValue(this._field));
      this._element.setCustomValidator?.(fieldDefinition.validator);
      this._element.setCustomErrorMessages?.(fieldDefinition.customErrorMessages);
      const fieldError = this._formController.getFieldError(this._field);
      console.log('directive', field, 'error=', fieldError);
      if (fieldError != null) {
        this._element.setAttribute('data-cc-error', fieldError);
      }
      else {
        this._element.removeAttribute('data-cc-error');
      }
    }

    return this.render();
  }

  _setElement (element, prop, bindEvent) {
    if (this._element != null) {
      this._removeListeners();
    }

    this._prop = prop;
    this._bindEvent = bindEvent;
    this._element = element;
    this._elementHandler = getElementHandler(this._element, prop, bindEvent);

    this._addListeners();
  }

  _removeListeners () {
    this._elementHandler?.disconnect();
  }

  _addListeners () {
    this._elementHandler?.connect(this._formController, this._field);
  }

  disconnected () {
    this._removeListeners();
  }

  reconnected () {
    this._addListeners();
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
