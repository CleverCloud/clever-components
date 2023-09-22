/**
 * Function to be used as a callback of the `lib-labs resizeController`.
 * For better browser compatibility, it extracts the `width` of the observed element using `getBoundingClientRect()`.
 * The `width` is then stored inside the `value` property of the `resizeController`.
 *
 * @param {ResizeObserverEntry[]} entries - the resize observer entries.
 * @return {number|null} the current width of the observed element or `null` if no entries.
 */
export function getWidthOnResize (entries) {
  if (entries == null || entries?.length === 0) {
    return null;
  }

  const { width } = entries[0].target.getBoundingClientRect();

  return width;
}
