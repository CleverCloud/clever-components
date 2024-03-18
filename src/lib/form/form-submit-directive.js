import { nothing } from 'lit';
import { AsyncDirective, directive, PartType } from 'lit/async-directive.js';
import { EventHandler } from '../events.js';
import { formSubmitHandler } from './form-submit-handler.js';

/**
 * @typedef {import('lit/async-directive.js').ElementPart} ElementPart
 */

/**
 * Lit directive helping in handling form
 */
class FormSubmitDirective extends AsyncDirective {
  constructor (partInfo) {
    super(partInfo);

    if (partInfo.type !== PartType.ELEMENT || partInfo.element.tagName !== 'FORM') {
      throw new Error('This directive must be used on a `<form>` element');
    }

    /** @type {EventHandler} */
    this._elementHandler = null;
  }

  render (...props) {
    return nothing;
  }

  /**
   * @param {ElementPart} part
   * @param {[formController]} args
   */
  update (part, args) {
    /** @type {HTMLFormElement} */
    const formElement = part.element;

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
}

export const formSubmit = directive(FormSubmitDirective);

class ControlledFormSubmitDirective extends FormSubmitDirective {
  constructor (partInfo) {
    super(partInfo);

    /** @type {FormController} */
    this._formController = null;
  };

  /**
   * @param {ElementPart} part
   * @param {[formController: FormController]} args
   */
  update (part, args) {
    const formController = args[0];

    if (this._formController !== formController) {
      this._formController = formController;
      this._formController.register(part.element);

      super.update(part, []);
    }

    return this.render();
  }
}

export const controlledFormSubmit = directive(ControlledFormSubmitDirective);
