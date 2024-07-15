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
 * @typedef {import('./form.types.js').SubmitHandlerCallbacks} SubmitHandlerCallbacks
 * @typedef {import('./form.types.js').OnValidCallback} OnValidCallback
 * @typedef {import('./form.types.js').OnInvalidCallback} OnInvalidCallback
 * @typedef {import('../events.js').EventHandler<HTMLFormElementEvent>} FormEventHandler
 */

class FormSubmitDirective extends AsyncDirective {
  /**
   * @param {PartInfo} partInfo
   */
  constructor(partInfo) {
    super(partInfo);

    /** @type {HTMLFormElement} */
    this._formElement = null;
    /** @type {FormEventHandler} */
    this._eventHandler = null;
  }

  /**
   *
   * @param {Array<unknown>} _props
   * @return {unknown}
   */
  render(..._props) {
    return nothing;
  }

  /**
   * @param {Part} part
   * @param {Array<any>} args
   */
  update(part, args) {
    const formElement = this.getFormElement(part);
    /** @type {OnValidCallback} */
    const onValid = getArgAt(args, 0);
    /** @type {OnInvalidCallback} */
    const onInvalid = getArgAt(args, 1);

    if (formElement !== this._formElement || this._onValid !== onValid || this._onInvalid === onInvalid) {
      this._eventHandler?.disconnect();

      this._formElement = formElement;
      this._onValid = onValid;
      this._onInvalid = onInvalid;
      // we don't want the native form validation
      this._formElement.setAttribute('novalidate', '');

      this._eventHandler = new EventHandler(formElement, 'submit', formSubmitHandler({ onValid, onInvalid }));
      this._eventHandler.connect();
    }

    return this.render();
  }

  disconnected() {
    this._eventHandler?.disconnect();
  }

  reconnected() {
    this._eventHandler?.connect();
  }

  /**
   * @param {Part} part
   * @return {HTMLFormElement}
   */
  getFormElement(part) {
    if (!isElementPart(part) || !isFormElement(part.element)) {
      throw new Error('This directive must be used on an `<form>` element');
    }

    return part.element;
  }
}

/**
 * Lit directive helping in handling form submission with validation and error reporting.
 *
 * This directive is to be put on a `<form>` element.
 */
export const formSubmit = directive(FormSubmitDirective);

/**
 *
 * @param {Element} element
 * @return {element is HTMLFormElement}
 */
function isFormElement(element) {
  return element instanceof HTMLFormElement;
}

/**
 *
 * @param {Part} part
 * @return {part is ElementPart}
 */
function isElementPart(part) {
  return part.type === PartType.ELEMENT;
}

/**
 * @param {Array<any>} args
 * @param {number} index
 * @return {any|null}
 */
function getArgAt(args, index) {
  if (args == null) {
    return null;
  }
  if (args.length === 0) {
    return null;
  }
  if (args.length < index + 1) {
    return null;
  }
  return args[index];
}
