import { CcDialogFocusRestorationFail } from '../components/cc-dialog/cc-dialog.events.js';
import { EventHandler } from '../lib/events.js';
import { findActiveElement, isParentOf } from '../lib/shadow-dom-utils.js';

/**
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {import('lit').ReactiveController} ReactiveController
 */

/**
 * @callback LostFocusCallback
 * @param {LostFocusEvent} event
 * @returns {void}
 */

/**
 * @typedef {Object} LostFocusEvent
 * @property {Element} removedElement the element that has been removed from DOM
 * @property {Element} focusedElement the element that had focus just before removal (can be the removedElement itself or one of its children)
 * @property {number} index the index of the removedElement (before removal)
 * @property {Element|null} suggestedElement the element that we suggest to gain focus
 */

/**
 * This Reactive controller helps detect a focus lost situation that can occur when the focused element is removed from the DOM.
 *
 * You provide a query selector which will select the elements for which you're tracking removal.
 *
 * You provide a callback that will be fired when one of these elements is removed from the DOM.
 * The callback is fired in two situations:
 * 1. When the deleted element had focus (or one of its children had focus) at the time of removal
 * 2. When a cc-dialog fails to restore focus to an element that was removed (via cc-dialog-focus-restoration-fail event)
 *
 * The callback will suggest a new element to focus. It suggests the nearest element matching the same query selector.
 *
 * @implements {ReactiveController}
 */
export class LostFocusController {
  /**
   * @param {LitElement} host the custom element
   * @param {string} selector the query selector that will select the elements we want to listen to
   * @param {LostFocusCallback} callback the callback to be called when focus is lost
   * @param {() => Promise<void>} [additionalWaiter] optional function that returns a Promise to wait for before checking for removed elements (e.g. to wait for some async rendering to be done)
   */
  constructor(host, selector, callback, additionalWaiter) {
    host.addController(this);
    this.host = host;
    this.selector = selector;
    /** @type {Array<Element>} */
    this.elements = [];
    /** @type {Array<Element>} */
    this.previousElements = [];
    this.callback = callback;
    this.additionalWaiter = additionalWaiter;
  }

  hostConnected() {
    this.eventHandler = new EventHandler(
      this.host,
      CcDialogFocusRestorationFail.TYPE,
      /** @param {CcDialogFocusRestorationFail} event */
      async ({ detail: elementThatFailedToFocus }) => {
        await this.additionalWaiter?.();
        // compare elements to the previous one and check if some elements have been removed
        const removedElements = this.previousElements.filter((e) => !this.elements.includes(e));
        // find if the element the dialog tried to focus is part of what's been removed
        // may not be the focused element itself, it can be the element matching the query selector containing the focused element.
        const closestRemovedElement = removedElements.find(
          (e) => e === elementThatFailedToFocus || isParentOf(e, elementThatFailedToFocus),
        );
        if (closestRemovedElement != null) {
          this._onFocusLost(closestRemovedElement);
        }
      },
    );

    this.eventHandler.connect();
  }

  hostDisconnected() {
    this.eventHandler?.disconnect();
  }

  hostUpdate() {
    // memorize the active element so that we are able to check if a deleted element was a parent of the focused element.
    this.activeElement = findActiveElement();
  }

  async hostUpdated() {
    await this.additionalWaiter?.();

    // keep the previous elements because we will want to compare with the new ones
    this.previousElements = this.elements;
    // get the elements we are interested in
    this.elements = Array.from(this.host.shadowRoot.querySelectorAll(this.selector));

    // compare elements to the previous one and check if some elements have been removed
    const removedElements = this.previousElements.filter((e) => !this.elements.includes(e));

    if (removedElements.length > 0) {
      // among these removed elements, find the one containing the focused element
      // elementWithFocus may not be the focused element itself, it can be the element matching the query selector containing the focused element.
      const elementWithFocus = removedElements.find(
        (e) => e === this.activeElement || isParentOf(e, this.activeElement),
      );
      if (elementWithFocus != null) {
        this._onFocusLost(elementWithFocus);
      }
    }
  }

  /** @param {Element} removedElement */
  _onFocusLost(removedElement) {
    const index = this.previousElements.indexOf(removedElement);
    const suggestedElementIndex = Math.min(this.elements.length - 1, index);
    const suggestedElement = this.elements[suggestedElementIndex] ?? null;
    this.callback({
      removedElement,
      focusedElement: this.activeElement,
      index: index,
      suggestedElement,
    });
  }
}
