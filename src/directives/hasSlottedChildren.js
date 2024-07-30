import { nothing } from 'lit';
import { AsyncDirective, directive, PartType } from 'lit/async-directive.js';
import { EventHandler } from '../lib/events.js';

/**
 * @typedef {import('lit/directive.js').Part} Part
 * @typedef {import('lit/directive.js').PartInfo} PartInfo
 */

class HasSlottedChildrenDirective extends AsyncDirective {

  /**
   * @param {PartInfo} partInfo
   */
  constructor (partInfo) {
    super(partInfo);
    /** @type {HTMLSlotElement} element */
    this.element = null;
    this.eventHandler = null;
  }

  disconnected () {
    super.disconnected();
    this.eventHandler?.disconnect();
  }

  /**
   * @param {Part} part
   * @param {[attributeName: string]} args
   * @returns {unknown}
   */
  update (part, [attributeName]) {
    if (part.type !== PartType.ELEMENT) {
      throw new Error('This directive must be set as on Element.');
    }
    if (!(part.element instanceof HTMLSlotElement)) {
      throw new Error('This directive must be set on a HTMLSlotElement.');
    }
    if (part.element !== this.element) {
      this.eventHandler?.disconnect();
      this.element = part.element;
      this.eventHandler = new EventHandler(this.element, 'slotchange',
        /** @param {Event & {target: HTMLSlotElement}} e */
        (e) => {
          if (e.target === e.currentTarget) {
            const slot = e.target;
            // TODO explain assignedNodes() returns the children nodes assigned to the slot
            const assignedNodes = slot.assignedNodes();
            // TODO explain: Also test that AssignedNodes...
            const isSlotted = assignedNodes.some((node) => {
              const isSlotElement = node instanceof HTMLSlotElement;
              return !isSlotElement || node.assignedNodes().length > 0;
            });
            if (isSlotted) {
              slot.setAttribute(attributeName ?? 'is-slotted', '');
            }
            else {
              slot.removeAttribute(attributeName ?? 'is-slotted');
            }
          }
        });
      this.eventHandler.connect();
    }

    return this.render();

  }

  render () {
    return nothing;
  }
}

export const hasSlottedChildren = directive(HasSlottedChildrenDirective);
