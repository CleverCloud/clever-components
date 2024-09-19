import { findActiveElement, isParentOf } from '../lib/shadow-dom-utils.js';

/**
 * @typedef {import('lit').LitElement} LitElement
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
 * The callback is fired only if the deleted element had focus (or one of its children had focus)
 *
 * The callback will suggest a new element to focus. It suggests the nearest element matching the same query selector.
 */
export class LostFocusController {
  /**
   * @param {LitElement} host the custom element
   * @param {string} selector the query selector that will select the elements we want to listen to
   * @param {LostFocusCallback} callback
   * @param {() => Promise<void>} [additionalWaiter]
   */
  constructor(host, selector, callback, additionalWaiter) {
    host.addController(this);
    this.host = host;
    this.selector = selector;
    /** @type {Array<Element>} */
    this.elements = [];
    this.callback = callback;
    this.additionalWaiter = additionalWaiter;
  }

  hostUpdate() {
    // memorize the active element so that we are able to check if a deleted element was a parent of the focused element.
    this.activeElement = findActiveElement();
  }

  async hostUpdated() {
    if (this.additionalWaiter) {
      await this.additionalWaiter();
    }

    // keep the previous elements because we will want to compare with the new ones
    const previousElements = this.elements;
    // get the elements we are interested in
    this.elements = Array.from(this.host.shadowRoot.querySelectorAll(this.selector));

    // compare elements to the previous one and check if some elements have been removed
    const removedElements = previousElements.filter((e) => !this.elements.includes(e));
    if (removedElements.length > 0) {
      // among these removed elements, find the one containing the focused element
      // elementWithFocus may not be the focused element itself, it can be the element matching the query selector containing the focused element.
      const elementWithFocus = removedElements.find(
        (e) => e === this.activeElement || isParentOf(e, this.activeElement),
      );
      if (elementWithFocus != null) {
        // we find the index of the removed element in the previous list
        const index = previousElements.indexOf(elementWithFocus);

        // we suggest a new element to have the focus
        const suggestedElementIndex = Math.min(this.elements.length - 1, index);
        const suggestedElement = suggestedElementIndex > -1 ? this.elements[suggestedElementIndex] : null;

        this.callback({
          removedElement: elementWithFocus,
          focusedElement: this.activeElement,
          index: index,
          suggestedElement,
        });
      }
    }
  }
}
