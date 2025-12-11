import { nothing } from 'lit';
import { AsyncDirective, directive, PartType } from 'lit/async-directive.js';
import { EventHandler } from '../lib/events.js';

/**
 * @import { Part, PartInfo } from 'lit/directive.js'
 * @import { EventWithTarget } from '../lib/events.types.js'
 */

/**
 * A Lit directive that checks if an element has slotted children.
 * If it is the case, the directive adds an `${changedSlot.name}-is-slotted` attribute to the element.
 * If it is the default slot, the directive adds 'is-slotted' attribute to the element.
 * If not, the `${changedSlot.name}-is-slotted` (or 'is-slotted' in case of default slot) attribute is removed.
 */

class HasSlottedChildrenDirective extends AsyncDirective {
  /**
   * @param {PartInfo} partInfo
   */
  constructor(partInfo) {
    super(partInfo);
    /** @type {HTMLElement} element */
    this.element = null;
    this.eventHandler = null;
  }

  disconnected() {
    super.disconnected();
    this.eventHandler?.disconnect();
  }

  /**
   * @param {Part} part
   * @returns {unknown}
   */
  update(part) {
    if (part.type !== PartType.ELEMENT) {
      throw new Error('This directive must be set as on Element.');
    }
    if (!(part.element instanceof HTMLElement)) {
      throw new Error('This directive must be set on a HTMLElement.');
    }
    if (part.element !== this.element) {
      this.eventHandler?.disconnect();
      this.element = part.element;
      this.eventHandler = new EventHandler(
        this.element,
        'slotchange',
        /** @param {EventWithTarget<HTMLSlotElement>} e */
        (e) => {
          const container = e.currentTarget;
          const changedSlot = e.target;
          const slotName = changedSlot.name;
          const attributeName = slotName === '' ? 'is-slotted' : `${slotName}-is-slotted`;

          if (changedSlot.assignedNodes().length > 0) {
            container.setAttribute(attributeName, '');
          } else {
            container.removeAttribute(attributeName);
          }
        },
      );
      this.eventHandler.connect();
    }

    return this.render();
  }

  render() {
    return nothing;
  }
}

export const hasSlottedChildren = directive(HasSlottedChildrenDirective);
