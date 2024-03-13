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
      throw new Error('The `formSubmit` directive must be used on a `form` element');
    }

    this._host = null;
    this._customValidation = null;

    /** @type {EventHandler} */
    this._elementHandler = null;
  }

  render (...props) {
    return nothing;
  }

  /**
   * @param {ElementPart} part
   * @param {[host: HTMLElement, ]} args
   */
  update (part, args) {
    part.element.setAttribute('novalidate', '');

    const host = args[0];
    const customValidation = args[1];

    if (this._host !== host || this._customValidation !== customValidation) {
      this._elementHandler?.disconnect();

      this._host = host;
      this._customValidation = customValidation;

      this._elementHandler = new EventHandler(part.element, 'submit', formSubmitHandler(this._host, this._customValidation));
      this._elementHandler?.connect();
    }

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
