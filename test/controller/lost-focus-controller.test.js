import { expect } from '@bundled-es-modules/chai';
import { defineCE, fixture, nextFrame } from '@open-wc/testing';
import * as hanbi from 'hanbi';
import { LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { CcFocusRestorationFailEvent } from '../../src/components/common.events.js';
import { LostFocusController } from '../../src/controllers/lost-focus-controller.js';

describe('lost-focus-controller', () => {
  describe('typical focus lost scenario', () => {
    /**
     * @return {Promise<{element: Element, spy: Stub}>}
     */
    const createElement = async () => {
      const spy = hanbi.spy();

      const ce = defineCE(
        class extends LitElement {
          static get properties() {
            return {
              items: { type: Array },
            };
          }

          constructor() {
            super();
            this.items = ['1', '2', '3'];

            new LostFocusController(this, '.item', (event) => {
              spy.handler(event);
            });
          }

          removeItem(it) {
            this.items = this.items.filter((item) => item !== it);
          }

          clear() {
            this.items = [];
          }

          focusHeader() {
            this.shadowRoot.querySelector('.header').focus();
          }

          focusItem(it) {
            this.getItemElement(it)?.focus();
          }

          focusItemButton(it) {
            this.getItemElement(it)?.querySelector('button').focus();
          }

          getItemElement(it) {
            return this.shadowRoot.querySelector(`[data-item="${it}"]`);
          }

          render() {
            return html`
              <div class="header"></div>
              ${repeat(
                this.items,
                (item) => item,
                (item) => {
                  return html` <div tabindex="0" class="item" data-item="${item}"><button>${item}</button></div> `;
                },
              )}
            `;
          }
        },
      );

      const element = await fixture(`<${ce}></${ce}>`);

      return { element, spy };
    };

    it('should notify focus lost when an item is focused', async () => {
      const { element, spy } = await createElement();

      element.focusItem('2');
      element.removeItem('2');

      await nextFrame();

      expect(spy.called).to.equal(true);
    });

    it('should notify focus lost when a child of item is focused', async () => {
      const { element, spy } = await createElement();

      element.focusItemButton('2');
      element.removeItem('2');

      await nextFrame();

      expect(spy.called).to.equal(true);
    });

    it('should not notify focus lost when an item is not focused', async () => {
      const { element, spy } = await createElement();

      element.focusItem('1');
      element.removeItem('2');

      await nextFrame();

      expect(spy.called).to.equal(false);
    });

    it('should not notify focus lost when no elements is not focused', async () => {
      const { element, spy } = await createElement();

      element.focusHeader();
      element.removeItem('2');

      await nextFrame();

      expect(spy.called).to.equal(false);
    });

    it('should not notify focus lost when an item is not focused', async () => {
      const { element, spy } = await createElement();

      element.focusHeader();
      element.removeItem('2');

      await nextFrame();

      expect(spy.called).to.equal(false);
    });

    it('should identify the deleted and focused item properly', async () => {
      const { element, spy } = await createElement();

      const expectedRemovedItem = element.getItemElement('2');
      const expectedFocusedItem = expectedRemovedItem.querySelector('button');

      element.focusItemButton('2');
      element.removeItem('2');

      await nextFrame();

      const event = spy.lastCall.args[0];
      expect(event.index).to.equal(1);
      expect(event.removedElement).to.equal(expectedRemovedItem);
      expect(event.focusedElement).to.equal(expectedFocusedItem);
    });

    it('should suggest the next item', async () => {
      const { element, spy } = await createElement();

      const expectedSuggestedItem = element.getItemElement('3');

      element.focusItemButton('2');
      element.removeItem('2');

      await nextFrame();

      const event = spy.lastCall.args[0];
      expect(event.suggestedElement).to.equal(expectedSuggestedItem);
    });

    it('should suggest the previous item when the removed element was the last one', async () => {
      const { element, spy } = await createElement();

      const expectedSuggestedItem = element.getItemElement('2');

      element.focusItemButton('3');
      element.removeItem('3');

      await nextFrame();

      const event = spy.lastCall.args[0];
      expect(event.suggestedElement).to.equal(expectedSuggestedItem);
    });

    it('should suggest nothing if there was no element left', async () => {
      const { element, spy } = await createElement();

      element.focusItemButton('2');
      element.clear();

      await nextFrame();

      const event = spy.lastCall.args[0];
      expect(event.suggestedElement).to.equal(null);
    });
  });

  describe('dialog focus lost scenario', () => {
    /**
     * @return {Promise<{element: Element, spy: Stub}>}
     */
    const createElement = async () => {
      const spy = hanbi.spy();

      const ce = defineCE(
        // eslint-disable-next-line wc/max-elements-per-file
        class extends LitElement {
          static get properties() {
            // the property sort plugin duplicates the items property
            // prettier-ignore
            return { items: { type: Array } };
          }

          constructor() {
            super();
            this.items = ['1', '2', '3'];

            new LostFocusController(this, '.item', (event) => {
              spy.handler(event);
            });
          }

          removeItem(it) {
            this.items = this.items.filter((item) => item !== it);
          }

          clear() {
            this.items = [];
          }

          getItemElement(it) {
            return this.shadowRoot.querySelector(`[data-item="${it}"]`);
          }

          getItemButton(it) {
            return this.getItemElement(it)?.querySelector('button');
          }

          dispatchFocusRestorationFail(element) {
            this.dispatchEvent(new CcFocusRestorationFailEvent(element));
          }

          render() {
            return html`
              ${repeat(
                this.items,
                (item) => item,
                (item) => {
                  return html` <div tabindex="0" class="item" data-item="${item}"><button>${item}</button></div> `;
                },
              )}
            `;
          }
        },
      );

      const element = await fixture(`<${ce}></${ce}>`);

      return { element, spy };
    };

    it('should notify focus lost when dialog fails to restore focus to removed item', async () => {
      const { element, spy } = await createElement();

      const itemButton = element.getItemButton('2');
      element.removeItem('2');

      await nextFrame();

      element.dispatchFocusRestorationFail(itemButton);

      await nextFrame();

      expect(spy.called).to.equal(true);
    });

    it('should not notify when dialog fails to restore focus to an element that was not removed', async () => {
      const { element, spy } = await createElement();

      const itemButton = element.getItemButton('2');
      // Remove item 1, not item 2
      element.removeItem('1');

      await nextFrame();

      element.dispatchFocusRestorationFail(itemButton);

      await nextFrame();

      expect(spy.called).to.equal(false);
    });

    it('should identify the removed item when dialog fails to restore focus to its child button', async () => {
      const { element, spy } = await createElement();

      const expectedRemovedItem = element.getItemElement('2');
      const itemButton = element.getItemButton('2');

      element.removeItem('2');

      await nextFrame();

      element.dispatchFocusRestorationFail(itemButton);

      await nextFrame();

      const event = spy.lastCall.args[0];
      expect(event.removedElement).to.equal(expectedRemovedItem);
      expect(event.index).to.equal(1);
    });

    it('should identify the removed item when dialog fails to restore focus to the item itself', async () => {
      const { element, spy } = await createElement();

      const expectedRemovedItem = element.getItemElement('2');

      element.removeItem('2');

      await nextFrame();

      element.dispatchFocusRestorationFail(expectedRemovedItem);

      await nextFrame();

      const event = spy.lastCall.args[0];
      expect(event.removedElement).to.equal(expectedRemovedItem);
      expect(event.index).to.equal(1);
    });

    it('should suggest the next item after dialog-triggered deletion', async () => {
      const { element, spy } = await createElement();

      const itemButton = element.getItemButton('2');
      const expectedSuggestedItem = element.getItemElement('3');

      element.removeItem('2');

      await nextFrame();

      element.dispatchFocusRestorationFail(itemButton);

      await nextFrame();

      const event = spy.lastCall.args[0];
      expect(event.suggestedElement).to.equal(expectedSuggestedItem);
    });

    it('should suggest the previous item when the removed element was the last one', async () => {
      const { element, spy } = await createElement();

      const itemButton = element.getItemButton('3');
      const expectedSuggestedItem = element.getItemElement('2');

      element.removeItem('3');

      await nextFrame();

      element.dispatchFocusRestorationFail(itemButton);

      await nextFrame();

      const event = spy.lastCall.args[0];
      expect(event.suggestedElement).to.equal(expectedSuggestedItem);
    });

    it('should suggest nothing if there are no elements left after dialog-triggered deletion', async () => {
      const { element, spy } = await createElement();

      const itemButton = element.getItemButton('2');

      element.clear();

      await nextFrame();

      element.dispatchFocusRestorationFail(itemButton);

      await nextFrame();

      const event = spy.lastCall.args[0];
      expect(event.suggestedElement).to.equal(null);
    });

    it('should handle multiple items being removed before dialog focus restoration fails', async () => {
      const { element, spy } = await createElement();

      const item2Button = element.getItemButton('2');

      // Remove multiple items including the one with the button
      element.removeItem('1');
      element.removeItem('2');

      await nextFrame();

      element.dispatchFocusRestorationFail(item2Button);

      await nextFrame();

      const event = spy.lastCall.args[0];
      // Should suggest item 3 since items 1 and 2 are gone
      expect(event.suggestedElement).to.equal(element.getItemElement('3'));
    });
  });
});
