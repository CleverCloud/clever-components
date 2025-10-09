/**
 * @typedef {import('lit').LitElement} LitElement
 */

/**
 * @callback ListFocusCallback
 * @param {LostFocusEvent} event
 * @returns {void}
 */

/**
 * @typedef {Object} LostFocusEvent
 * @property {Element[]} removedElements the element that has been removed from DOM
 * @property {number} firstRemovedElementIndex the index of the removedElement (before removal)
 * @property {Element|null} suggestedElement the element that we suggest to gain focus
 */

export class ListFocusManagementController {
  /** @type {string} */
  #selector;

  /** @type {LitElement} */
  #host;

  /** @type {Array<Element>} */
  #elementsCurrentlyMatchingSelector = [];

  /** @type {Array<Element>} */
  #previousElementsMatchingSelector = [];

  /** @type {ListFocusCallback} */
  #focusCallback;

  /**
   * @param {LitElement} host
   * @param {string} selector
   * @param {ListFocusCallback} focusCallback
   */
  constructor(host, selector, focusCallback) {
    host.addController(this);

    this.#host = host;

    this.#selector = selector;

    this.#focusCallback = focusCallback;
  }

  #queryElementsMatchingSelector() {
    return Array.from(this.#host.shadowRoot.querySelectorAll(this.#selector) ?? []);
  }

  hostUpdated() {
    this.#previousElementsMatchingSelector = this.#elementsCurrentlyMatchingSelector;
    this.#elementsCurrentlyMatchingSelector = this.#queryElementsMatchingSelector();
    const removedElements = this.#previousElementsMatchingSelector.filter((element) => !element.isConnected);
    if (removedElements.length > 0) {
      const firstRemovedElement = removedElements[0];
      const firstRemovedElementIndex = this.#previousElementsMatchingSelector.indexOf(firstRemovedElement);

      // we suggest a new element to have the focus
      const suggestedElementIndex = Math.min(
        this.#elementsCurrentlyMatchingSelector.length - 1,
        firstRemovedElementIndex,
      );
      const suggestedElement =
        suggestedElementIndex > -1 ? this.#elementsCurrentlyMatchingSelector[suggestedElementIndex] : null;
      this.#focusCallback({
        firstRemovedElementIndex,
        removedElements,
        suggestedElement,
      });
    }
  }
}
