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
 */

/**
 * Lit directive helping in handling form
 */
class FormSubmitDirective extends AsyncDirective {
  /**
   * @param {PartInfo} partInfo
   */
  constructor (partInfo) {
    super(partInfo);

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

    formElement.setAttribute('novalidate', '');
    this._elementHandler?.disconnect();
    this._elementHandler = new EventHandler(formElement, 'submit', formSubmitHandler());
    this._elementHandler.connect();

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
   * @return {HTMLFormElement}
   */
  getFormElement (part) {
    if (!isElementPart(part) || !isFormElement(part.element)) {
      throw new Error('This directive must be used on an <form> element');
    }

    return part.element;
  }

  /**
   * @param {HTMLFormElement} formElement
   */
  install (formElement) {
    formElement.setAttribute('novalidate', '');
    this._elementHandler?.disconnect();
    this._elementHandler = new EventHandler(formElement, 'submit', formSubmitHandler());
    this._elementHandler.connect();
  }
}

export const formSubmit = directive(FormSubmitDirective);

/**
 * @template {string} I
 * @template {string} E
 * @template {any} S
 */
class ControlledFormSubmitDirective extends FormSubmitDirective {
  /**
   * @typedef {import('./form-controller.js').FormController<I, E, S>} SpecificFormController
   */

  /**
   * @param {PartInfo} partInfo
   */
  constructor (partInfo) {
    super(partInfo);

    /** @type {SpecificFormController} */
    this._formController = null;
  };

  /**
   * @param {Part} part
   * @param {[formController: SpecificFormController]} args
   */
  update (part, args) {
    const formElement = this.getFormElement(part);

    const formController = args[0];

    if (this._formController !== formController) {
      this._formController = formController;
      this._formController.register(formElement);

      this.install(formElement);
    }

    return this.render();
  }
}

export const controlledFormSubmit = directive(ControlledFormSubmitDirective);

/**
 *
 * @param {Element} element
 * @return {element is HTMLFormElement}
 */
function isFormElement (element) {
  return (element.nodeName === 'FORM');
}

/**
 *
 * @param {Part} part
 * @return {part is ElementPart}
 */
function isElementPart (part) {
  return (part.type === PartType.ELEMENT);
}
