/**
 * @typedef {{ width: number[] }} Breakpoints
 */

/**
 * For each given breakpoint, this function sets the following attributes:
 *
 * - `w-gte-${breakpoint}` if the element's width >= the breakpoint
 * - `w-lt-${breakpoint}` if the element's width is < the breakpoint
 *
 * @param {HTMLElement} element - the element to which you want to add / remove the attributes
 * @param {number} width - the current width of the element
 * @param {Breakpoints} breakpoints - the breakpoints
 */
export function setSizeAttributes (element, width, breakpoints) {
  if (breakpoints != null) {
    breakpoints.width.forEach((breakpoint) => {

>>>>>>>> a567e84f (feat(resize-controller): test lit-labs way):src/lib/set-size-attributes.js
      const gteAttr = 'w-gte-' + breakpoint;
      (breakpoint <= width)
        ? element.setAttribute(gteAttr, '')
        : element.removeAttribute(gteAttr);

      const ltAttr = 'w-lt-' + breakpoint;
      (width < breakpoint)
        ? element.setAttribute(ltAttr, '')
        : element.removeAttribute(ltAttr);
    });
  }

  if (component.onResize != null) {
    component.onResize({ width });
  }
}
