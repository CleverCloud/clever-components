/**
 * @param {Element|ShadowRoot|Document} element The root element on which the querySelector is made (can be `null`)
 * @param {string} selector The query selector
 * @param {() => void} [orElse] The optional function to call when the result of the query selector is `null`
 */
export function focusBySelector(element, selector, orElse = null) {
  /** @type {Element & { focus?: () => void}} */
  const elementToFocus = element?.querySelector(selector);
  if (typeof elementToFocus?.focus === 'function') {
    elementToFocus.focus();
  } else {
    orElse?.();
  }
}
