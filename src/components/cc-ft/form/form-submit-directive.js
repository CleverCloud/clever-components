import { nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';
import { EventHandler } from '../../../lib/events.js';

/**
 * Lit directive helping in handling form
 */
class FormSubmitDirective extends AsyncDirective {
  constructor (partInfo) {
    super(partInfo);

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
