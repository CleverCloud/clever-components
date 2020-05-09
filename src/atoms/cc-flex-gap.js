const createElement = (tagName) => document.createElement(tagName);
const appendChild = (parent, child) => parent.appendChild(child);

/**
 * A pure layout component used to overcome the lack of `gap` in CSS flex containers.
 *
 * 🎨 default CSS display: `grid`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/atoms/cc-flex-gap.js)
 *
 * ## Technical details
 *
 * * This component does not use lit* deps on purpose (keep small and not useful).
 * * The source code is written in a way so it can be the smallest possible, while keeping a reasonable readability level.
 * * This feature exist in Firefox: https://developer.mozilla.org/en-US/docs/Web/CSS/gap.
 *
 * Here is the technique:
 *
 * * Use `display: flex` on a container.
 * * Use a negative margin of half the gap on this container.
 * * Use a positive margin of half the gap on its children.
 * * Sadly, due to margin collapsing behaviour between the container with negative margins and its parent,
 * * the negative margin of the container will be displayed as white space in its parent.
 * * There are a few techniques to prevent this.
 * * We chose to use a `display: grid` on the parent to disable the margin collapsing while preserving potential overflow like focus rings etc...
 *
 * @cssprop {Number} --cc-gap - The gap between children.
 */
export class CcFlexGap extends HTMLElement {

  constructor () {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = createElement('style');
    style.textContent = `:host{display:grid}::slotted(*){margin:calc(var(--cc-gap)/2)}`;

    const flexContainer = createElement('div');
    flexContainer.style = `display:flex;flex-wrap:wrap;margin:calc(var(--cc-gap)/-2);`;

    const slot = createElement('slot');

    appendChild(shadow, style);
    appendChild(shadow, flexContainer);
    appendChild(flexContainer, slot);
  }
}

window.customElements.define('cc-flex-gap', CcFlexGap);
