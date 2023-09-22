/**
 * To be used as a callback of Lit-Labs `ResizeController` or `ResizeObserver`.
 * For this to work, the component needs to have AT LEAST ONE of the following:
 *
 * - a public `onResize` method with `{ width: number }` as its parameter. It is called everytime a resize happens, with the current width of the component.
 * - a public `breakpoints` property whose type matches the following @type {{ width: number[] }}.
 *
 * This callback does the following everytime the element is resized:
 *
 * - calls the `onResize` with the current `width` of the component.
 * - adds / removes the `w-lt-${breakpoint}` or `w-gte-${breakpoint}` attributes to the component depending its current `width`.
 *
 * @param {ResizeObserverEntry[]} entries - the resize observer entries
 * @param {breakpoints} breakpoints - breakpoints
 */
export function resizeCallback (entries) {
  if (entries.length === 0) {
    return;
  }

  const component = entries[0].target;
  const { width } = component.getBoundingClientRect();

  if (component.onResize != null) {
    component.onResize({ width });
  }

  if (component.breakpoints != null) {
    component.breakpoints.width.forEach((breakpoint) => {

      const gteAttr = 'w-gte-' + breakpoint;
      (breakpoint <= width)
        ? component.setAttribute(gteAttr, '')
        : component.removeAttribute(gteAttr);

      const ltAttr = 'w-lt-' + breakpoint;
      (width < breakpoint)
        ? component.setAttribute(ltAttr, '')
        : component.removeAttribute(ltAttr);
    });
  }
}
