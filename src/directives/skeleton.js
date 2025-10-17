import { nothing } from 'lit';
import { AsyncDirective, directive, PartType } from 'lit/async-directive.js';

/**
 * @typedef {import('lit/directive.js').Part} Part
 * @typedef {import('lit/directive.js').PartInfo} PartInfo
 */

class skeletonDirective extends AsyncDirective {
  /**
   * @param {PartInfo} partInfo
   */
  constructor(partInfo) {
    super(partInfo);
    /** @type {HTMLElement} element */
    this.element = null;
  }

  /**
   * @param {boolean} isLoading
   * @returns {unknown}
   */
  render(isLoading) {
    return nothing;
  }

  /**
   * @param {Part} part
   * @param {[boolean]} args
   * @returns {unknown}
   */
  update(part, [isLoading]) {
    if (part.type !== PartType.ELEMENT) {
      throw new Error('This directive must be set as on Element.');
    }
    if (!(part.element instanceof HTMLElement)) {
      throw new Error('This directive must be set on a HTMLElement.');
    }
    if (part.element !== this.element) {
      this.element = part.element;
    }
    if (isLoading) {
      console.log('adding skeleton class to', part.element);
      part.element.classList.add('skeleton');
    } else {
      console.log('removing skeleton class from', part.element);
      part.element.classList.remove('skeleton');
    }

    return this.render(isLoading);
  }
}

export const skeleton = directive(skeletonDirective);
