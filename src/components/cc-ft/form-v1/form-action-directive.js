import { nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';
import { EventHandler } from '../../../lib/events.js';

/**
 * @typedef {Object} ElementHandlerSpec
 * @property {(element: HTMLElement, formController:FormController) => void} refreshElement
 * @property {Array<string>} actionEvents
 */

/**
 * @typedef {Object} FormActionDirectiveSpec
 * @property {(formController:FormController) => void} action
 * @property {{[tagName: string]: ElementHandlerSpec}} elements
 */

class FormActionDirective extends AsyncDirective {
  /**
   *
   * @param partInfo
   * @param {FormActionDirectiveSpec} spec
   */
  constructor (partInfo, spec) {
    super(partInfo);

    this._spec = spec;

    /** @type {ButtonElementHandler} */
    this._elementHandler = null;
  }

  render (...props) {
    return nothing;
  }

  /**
   * @param {ElementPart} part
   * @param {FormController} formController
   */
  update (part, [formController]) {
    if (this._elementHandler == null || !this._elementHandler.handles(part.element, formController)) {
      this._elementHandler?.disconnect();
      this._elementHandler = createElementHandler(part.element, formController, this._spec);
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

// - submit directive ---

/** @type {FormActionDirectiveSpec} */
const SUBMIT_SPEC = {
  action: (formController) => formController.submit(),
  elements: {
    'cc-button': {
      refreshElement: (element, formController) => {
        setAttribute(element, 'waiting', formController.getState() === 'submitting');
      },
      actionEvents: ['cc-button:click'],
    },
    button: {
      refreshElement: (element, formController) => {
        setAttribute(element, 'disabled', formController.getState() === 'submitting');
      },
      actionEvents: ['click'],
    },
  },
};

/**
 * Lit directive helping in synchronizing a submit button with a `FormController`.
 *
 * This directive can be set on `<cc-button>` or `<button>` elements.
 *
 * * binds the right click event with the form submission.
 * * for `<cc-button>`, setup the `waiting` attribute according to the form state (set to `true` when submitting)
 * * for `<button>`, setup the `disabled` attribute according to the form state (set to `true` when submitting)
 */
class FormSubmitDirective extends FormActionDirective {
  constructor (partInfo) {
    super(partInfo, SUBMIT_SPEC);

    /** @type {ButtonElementHandler} */
    this._elementHandler = null;
  }
}

export const formSubmitV1 = directive(FormSubmitDirective);

// - reset directive ---

const RESET_SPEC = {
  action: (formController) => formController.reset(),
  elements: {
    'cc-button': {
      refreshElement: (element, formController) => {
        setAttribute(element, 'waiting', formController.getState() === 'submitting');
      },
      actionEvents: ['cc-button:click'],
    },
    button: {
      refreshElement: (element, formController) => {
        setAttribute(element, 'type', 'reset');
        setAttribute(element, 'disabled', formController.getState() === 'submitting');
      },
      actionEvents: ['click'],
    },
  },
};

/**
 * Lit directive helping in synchronizing a submit button with a `FormController`.
 *
 * This directive can be set on `<cc-button>` or `<button>` elements.
 *
 * * binds the right click event with the form submission.
 * * for `<cc-button>`, setup the `waiting` attribute according to the form state (set to `true` when submitting)
 * * for `<button>`, setup the `disabled` attribute according to the form state (set to `true` when submitting)
 */
class FormResetDirective extends FormActionDirective {
  constructor (partInfo) {
    super(partInfo, RESET_SPEC);

    /** @type {ButtonElementHandler} */
    this._elementHandler = null;
  }
}

export const formReset = directive(FormResetDirective);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

/**
 * @param {HTMLElement} element
 * @param {FormController} formController
 * @param {FormActionDirectiveSpec} spec
 * @return {ButtonElementHandler}
 */
function createElementHandler (element, formController, spec) {
  const tagName = element.tagName.toLowerCase();
  const handler = spec.elements[tagName];

  if (handler == null) {
    console.warn(`Element <${tagName}> is not supported.`);
  }
  else {
    return new ButtonElementHandler(element, formController, handler.refreshElement, handler.actionEvents, spec.action);
  }
}

class ButtonElementHandler {
  /**
   *
   * @param {HTMLElement} element
   * @param {FormController} formController
   * @param {(e: HTMLElement, formController: FormController) => void} refreshElementCallback
   * @param {Array<string>} actionEvents
   * @param {(formController: FormController) => void} actionCallback
   */
  constructor (element, formController, refreshElementCallback, actionEvents, actionCallback) {
    /** @type {HTMLElement} */
    this._element = element;
    /** @type {FormController} */
    this._formController = formController;
    /** @type {(e: HTMLElement, formController: FormController) => void} */
    this._refreshElementCallback = refreshElementCallback;

    const action = (e) => {
      e.preventDefault();
      actionCallback(this._formController);
    };
    /** @type {Array<EventHandler>} */
    this._eventHandlers = actionEvents.map((e) => {
      return new EventHandler(this._element, e, action);
    });
  }

  refreshElement () {
    this._refreshElementCallback(this._element, this._formController);
  }

  connect () {
    this._eventHandlers.forEach((handler) => handler.connect());
  }

  disconnect () {
    this._eventHandlers.forEach((handler) => handler.disconnect());
  }

  handles (element, formController) {
    return element === this._element
      && formController === this._formController;
  }
}

export function setAttribute (e, attr, val) {
  if (val) {
    e.setAttribute(attr, val);
  }
  else {
    e.removeAttribute(attr);
  }
}
