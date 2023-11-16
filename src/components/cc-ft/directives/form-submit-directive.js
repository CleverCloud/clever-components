import { nothing } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';
import { EventHandler } from '../../../lib/events.js';

/**
 * Lit directive helping in synchronizing a submit button with a `FormController`.
 *
 * This directive can be set on `<cc-button>` or `<button>` elements.
 *
 * * binds the right click event with the form submission.
 * * for `<cc-button>`, setup the `waiting` attribute according to the form state (set to `true` when submitting)
 * * for `<button>`, setup the `disabled` attribute according to the form state (set to `true` when submitting)
 */
class FormSubmitDirective extends AsyncDirective {
  constructor (partInfo) {
    super(partInfo);

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
      this._elementHandler = createElementHandler(part.element, formController);
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

export const formSubmit = directive(FormSubmitDirective);

// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------

const HANDLERS_SPEC = {
  'cc-button': {
    refreshElement: (element, formController) => {
      setAttribute(element, 'waiting', formController.getState() === 'submitting');
    },
    submitEvents: ['cc-button:click'],
  },
  button: {
    refreshElement: (element, formController) => {
      setAttribute(element, 'disabled', formController.getState() === 'submitting');
    },
    submitEvents: ['click'],
  },
};

/**
 * @param {HTMLElement} element
 * @param {FormController} formController
 * @return {ButtonElementHandler}
 */
function createElementHandler (element, formController) {
  const tagName = element.tagName.toLowerCase();
  const handler = HANDLERS_SPEC[tagName];
  if (handler == null) {
    console.warn(`Element <${tagName}> is not supported.`);
  }
  else {
    return new ButtonElementHandler(element, formController, handler.refreshElement, handler.submitEvents);
  }
}

class ButtonElementHandler {
  /**
   *
   * @param {HTMLElement} element
   * @param {FormController} formController
   * @param {(e: HTMLElement, formController: FormController) => void} refreshElementCallback
   * @param {Array<string>} submitEvents
   */
  constructor (element, formController, refreshElementCallback, submitEvents) {
    /** @type {HTMLElement} */
    this._element = element;
    /** @type {FormController} */
    this._formController = formController;
    /** @type {(e: HTMLElement, formController: FormController) => void} */
    this._refreshElementCallback = refreshElementCallback;

    const submit = () => this._formController.submit();
    /** @type {Array<EventHandler>} */
    this._eventHandlers = submitEvents.map((e) => {
      return new EventHandler(this._element, e, submit);
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

function setAttribute (e, attr, val) {
  if (val) {
    e.setAttribute(attr, val);
  }
  else {
    e.removeAttribute(attr);
  }
}
