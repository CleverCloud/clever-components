// All this file is written in a way so it can be the smallest possible,
// while keeping a reasonable readability level.
// It is not using lit* deps on purpose (keep small and not useful).

const createElement = (tagName) => document.createElement(tagName);
const appendChild = (parent, child) => parent.appendChild(child);

/**
 * A wrapper that changes its size (with a transition) according to the size of its children
 *
 * NOTE: The transition only works in browsers supporting ResizeObserver
 */
export class CcExpand extends HTMLElement {

  constructor () {
    super();

    // language=CSS
    const shadow = this.attachShadow({ mode: 'open' });
    const style = createElement('style');
    style.textContent = `:host{display:block;overflow:hidden}`;
    this._wrapper = createElement('div');
    const slot = createElement('slot');

    appendChild(shadow, style);
    appendChild(shadow, this._wrapper);
    appendChild(this._wrapper, slot);
  }

  connectedCallback () {
    if (window.ResizeObserver == null) {
      return;
    }
    this._ro = new ResizeObserver(() => {
      const height = getComputedStyle(this).height;
      if (this._oldHeight === height) {
        return;
      }
      if (this._oldHeight != null) {
        // This is not supported in Safari yet but it's purely decorative so let's keep it like that
        this.animate(
          [
            { height: this._oldHeight },
            { height },
          ],
          {
            duration: 300,
            easing: 'ease-in-out',
          },
        );
      }
      this._oldHeight = height;
    });
    // TODO: Should we debounce this?
    this._ro.observe(this._wrapper);
  }

  disconnectedCallback () {
    if (window.ResizeObserver == null) {
      return;
    }
    this._ro.unobserve(this._wrapper);
  }
}

window.customElements.define('cc-expand', CcExpand);
