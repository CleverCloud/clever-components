import { nothing } from 'lit';
import { AsyncDirective, directive, PartType } from 'lit/async-directive.js';
import { EventHandler } from '../events.js';
import { formSubmitHandler } from './form-submit-handler.js';

/**
 * @typedef {import('lit/async-directive.js').PartInfo} PartInfo
 * @typedef {import('lit/async-directive.js').ElementPartInfo} ElementPartInfo
 * @typedef {import('lit/async-directive.js').Part} Part
 * @typedef {import('lit/async-directive.js').ElementPart} ElementPart
 * @typedef {import('lit/async-directive.js').DirectiveResult} DirectiveResult
 * @typedef {import('./form.types.js').HTMLFormElementEvent} HTMLFormElementEvent
 * @typedef {import('./form-controller.js').FormController} FormController
 */

class FormSubmitDirective extends AsyncDirective {
  /**
   * @param {PartInfo} partInfo
   */
  constructor (partInfo) {
    super(partInfo);

    /** @type {HTMLFormElement} */
    this._formElement = null;
    /** @type {EventHandler<HTMLFormElementEvent>} */
    this._elementHandler = null;
  }

  /**
   *
   * @param {Array<unknown>} _props
   * @return {unknown}
   */
  render (..._props) {
    return nothing;
  }

  /**
   * @param {Part} part
   * @param {Array<unknown>} _args
   */
  update (part, _args) {
    const formElement = this.getFormElement(part);

    if (formElement.hasChanged) {
      this.install(formElement.element);
    }

    return this.render();
  }

  disconnected () {
    this._elementHandler?.disconnect();
  }

  reconnected () {
    this._elementHandler?.connect();
  }

  /**
   * @param {Part} part
   * @return {{element: HTMLFormElement, hasChanged: boolean}}
   */
  getFormElement (part) {
    if (!isElementPart(part) || !isFormElement(part.element)) {
      throw new Error('This directive must be used on an `<form>` element');
    }

    /** @type {HTMLFormElement} */
    const element = part.element;
    const hasChanged = this._formElement !== element;

    return { element, hasChanged };
  }

  /**
   * @param {HTMLFormElement} formElement
   */
  install (formElement) {
    this._elementHandler?.disconnect();

    this._formElement = formElement;
    this._formElement.setAttribute('novalidate', '');

    this._elementHandler = new EventHandler(formElement, 'submit', formSubmitHandler());
    this._elementHandler.connect();
  }
}

/**
 * Lit directive helping in handling form submission with validation and error reporting.
 *
 * This directive is to be put on a `<form>` element.
 */
export const formSubmit = directive(FormSubmitDirective);

/**
 * This is a subclass of {@link FormSubmitDirective}. It also registers the `<form>` element on a {@link FormController} instance.
 */
class ControlledFormSubmitDirective extends FormSubmitDirective {
  /**
   * @param {PartInfo} partInfo
   */
  constructor (partInfo) {
    super(partInfo);

    /** @type {FormController} */
    this._formController = null;
  };

  /**
   * @param {Part} part
   * @param {[formController: FormController]} args
   */
  update (part, args) {
    const formElement = this.getFormElement(part);

    const formController = args[0];

    if (this._formController !== formController || formElement.hasChanged) {
      this._formController = formController;
      this.install(formElement.element);

      this._formController.register(formElement.element);
    }

    return this.render();
  }
}

/**
 * This Lit directive is not intended to be used directly, but through {@link FormController#handleSubmit()}.
 * It automatically registers the `<form>` element on the `FormController`.
 */
export const controlledFormSubmit = directive(ControlledFormSubmitDirective);

/**
 *
 * @param {Element} element
 * @return {element is HTMLFormElement}
 */
function isFormElement (element) {
  return element instanceof HTMLFormElement;
}

/**
 *
 * @param {Part} part
 * @return {part is ElementPart}
 */
function isElementPart (part) {
  return (part.type === PartType.ELEMENT);
}
