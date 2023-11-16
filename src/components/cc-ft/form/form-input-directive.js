import { nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';
import { EventHandler } from '../../../lib/events.js';
import { objectEquals } from '../../../lib/utils.js';

/**
 * @typedef {import('./form.types.js').InputIO} InputIO
 * @typedef {import('./form.types.js').FieldDefinition} FieldDefinition
 */

/**
 * Lit directive helping in synchronizing an input element with a `FormController`.
 *
 * * two-way bindings (element <-> FormController).
 * * implicit form submitting.
 * * setup `name` attribute according to form field definition.
 * * setup `required` attribute according to form field definition.
 * * setup `disabled` attribute according to form state (disabled when form is submitting).
 * * setup `data-cc-error` attribute according to form field error.
 * * if the element support it, it sets the custom validator and the customErrorMessages according to the form field definition.
 *
 * It supports all Clever Cloud input components and native elements (`<input>`, `<select>`).
 *
 * For any other elements, the value binding is done with the `element.value` property and with the `input` event name.
 * One can change this defaults by passing a custom `InputIO` to the directive.
 */
class FormInputDirective extends AsyncDirective {
  constructor (partInfo) {
    super(partInfo);
    this._element = null;
    /** @type {FormController} */
    this._formController = null;
    /** @type {InputElementHandler} */
    this._elementHandler = null;
  }

  render (...props) {
    return nothing;
  }

  /**
   * @param {ElementPart} part
   * @param {FormController} formController
   * @param {string} fieldName
   * @param {Partial<InputIO>} [customInputIO]
   */
  update (part, [formController, fieldName, customInputIO]) {
    console.log('input directive', part.element);

    if (
      this._elementHandler == null
      || !this._elementHandler.handles(part.element, formController, fieldName, customInputIO)
    ) {
      this._elementHandler?.disconnect();
      this._elementHandler = createElementHandler(part.element, formController, fieldName, customInputIO);
      this._elementHandler?.connect();
    }

    this._elementHandler?.refreshElement();

    return this.render();
  }

  disconnected () {
    this._elementHandler?.disconnect();
  }

  reconnected () {
    this._elementHandler?.connect();
  }
}

export const formInput = directive(FormInputDirective);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

/** @type {{[p: string]: InputIO}} */
const DEFAULT_INPUT_IOS = {
  'cc-input-text:value': {
    bindEventName: 'cc-input-text:input',
    submitEventName: 'cc-input-text:requestimplicitsubmit',
    valueProperty: 'value',
  },
  'cc-input-text:tags': {
    bindEventName: 'cc-input-text:tags',
    submitEventName: 'cc-input-text:requestimplicitsubmit',
    valueProperty: 'tags',
  },
  'cc-toggle:value': {
    bindEventName: 'cc-toggle:input',
    valueProperty: 'value',
  },
  'cc-toggle:multipleValues': {
    bindEventName: 'cc-toggle:input-multiple',
    valueProperty: 'multipleValues',
  },
  'cc-input-number:value': {
    bindEventName: 'cc-input-number:input',
    submitEventName: 'cc-input-number:requestimplicitsubmit',
    valueProperty: 'value',
  },
  'cc-select:value': {
    bindEventName: 'cc-select:input',
    valueProperty: 'value',
  },
  'input:checkbox': {
    bindEventName: 'change',
    valueProperty: 'checked',
  },
  select: {
    bindEventName: 'change',
    valueProperty: 'value',
  },
};

/**
 * @param {string} valueProperty
 * @return {InputIO}
 */
function fallbackInputIO (valueProperty = 'value') {
  return {
    bindEventName: 'input',
    valueProperty,
  };
}

/**
 *
 * @param {HTMLElement} element
 * @param {string} valueProperty
 * @return {InputIO}
 */
function getDefaultInputIO (element, valueProperty = 'value') {
  const tagName = element.tagName.toLowerCase();

  // clever components input
  if (tagName.startsWith('cc-')) {
    return DEFAULT_INPUT_IOS[`${tagName}:${valueProperty}`];
  }

  // input
  if (tagName === 'input') {
    return DEFAULT_INPUT_IOS[`input:${element.type}`] ?? fallbackInputIO(valueProperty);
  }

  // any other element
  return DEFAULT_INPUT_IOS[tagName] ?? fallbackInputIO(valueProperty);
}

/**
 *
 * @param {HTMLElement} element
 * @param {FormController} formController
 * @param {string} fieldName
 * @param {Partial<InputIO>} [customInputIO]
 * @return {InputElementHandler}
 */
function createElementHandler (element, formController, fieldName, customInputIO = { }) {
  if (formController.getFieldDefinition(fieldName) == null) {
    console.error(`Cannot handle field "${fieldName}" because it is not defined in form controller.`);
    return null;
  }

  /** @type {InputIO} */
  const defaultInputIO = getDefaultInputIO(element, customInputIO?.bindEventName);

  /** @type {InputIO} */
  const mergedInputIO = {
    ...defaultInputIO,
    ...customInputIO,
  };

  console.log(fieldName, {
    defaultInputIO,
    inputIO: customInputIO,
    mergedInputIO,
  });

  return new InputElementHandler(element, formController, fieldName, mergedInputIO);
}

class InputElementHandler {
  /**
   * @param {HTMLElement} element
   * @param {FormController} formController
   * @param {string} fieldName
   * @param {InputIO} inputIO
   */
  constructor (element, formController, fieldName, inputIO) {
    /** @type {HTMLElement} */
    this._element = element;
    /** @type {FormController} */
    this._formController = formController;
    /** @type {InputIO} */
    this._inputIO = inputIO;
    /** @type {FieldDefinition} */
    this._fieldDefinition = this._formController.getFieldDefinition(fieldName);

    /** @type {Array<EventHandler>} */
    this._eventHandlers = [new EventHandler(this._element, inputIO.bindEventName, () => this._setFormValue())];
    if (inputIO.submitEventName != null) {
      this._eventHandlers.push(new EventHandler(this._element, inputIO.submitEventName, () => this._submit()));
    }
  }

  refreshElement () {
    setAttribute(this._element, 'name', this._fieldDefinition.name);
    setAttribute(this._element, 'required', this._fieldDefinition.required);
    setAttribute(this._element, 'disabled', this._formController?.getState() === 'submitting');
    setAttribute(this._element, 'data-cc-error', this._formController.getFieldError(this._fieldDefinition.name));

    // for clever components, we configure the validation directly inside the component.
    this._element.setCustomValidator?.(this._fieldDefinition.validator);
    this._element.setCustomErrorMessages?.(this._fieldDefinition.customErrorMessages);

    this._setElementValue();
  }

  connect () {
    this._eventHandlers.forEach((handler) => handler.connect());
  }

  disconnect () {
    this._eventHandlers.forEach((handler) => handler.disconnect());
  }

  /**
   * This method should be used to make sure that we really need to create a new instance of `InputElementHandler`
   *
   * @param {HTMLElement} element
   * @param {FormController} formController
   * @param {string} fieldName
   * @param {Partial<InputIO>} inputIO
   * @return {boolean} Whether this instance is valid for handling the given parameters.
   */
  handles (element, formController, fieldName, inputIO) {
    return element === this._element
      && formController === this._formController
      && fieldName === this._fieldDefinition.name
      && objectEquals(inputIO, this._inputIO)
    ;
  }

  /**
   * Binding `FormController` -> `Element`: Take the form controller value, and set it into the element.
   */
  _setElementValue () {
    this._element[this._inputIO.valueProperty] = this._formController.getFieldValue(this._fieldDefinition.name);
  }

  /**
   * Binding `Element` -> `FormController`: Take the element value, and set it into the form controller.
   */
  _setFormValue () {
    this._formController.setFieldValue(this._fieldDefinition.name, this._element[this._inputIO.valueProperty]);
  }

  _submit () {
    this._formController.submit();
  }
}

function setAttribute (e, attr, val) {
  if (val) {
    e.setAttribute(attr, val);
  }
  else {
    e.removeAttribute(attr);
  }
}
