import { nothing } from 'lit';
import { AsyncDirective, directive, PartType } from 'lit/async-directive.js';
import { EventHandler } from '../../../lib/events.js';

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

    this._submitHandler = null;

    /** @type {EventHandler} */
    this._elementHandler = null;
  }

  render (...props) {
    return nothing;
  }

  /**
   * @param {ElementPart} part
   * @param {(event:Event) => void} submitHandler
   */
  update (part, [submitHandler]) {
    part.element.setAttribute('novalidate', '');

    if (this._submitHandler !== submitHandler) {
      this._elementHandler?.disconnect();
      this._elementHandler = new EventHandler(part.element, 'submit', submitHandler);
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
