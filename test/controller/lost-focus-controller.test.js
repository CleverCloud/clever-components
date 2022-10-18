import { expect } from '@bundled-es-modules/chai';
import { fixture, defineCE, nextFrame } from '@open-wc/testing';
import * as hanbi from 'hanbi';
import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { LostFocusController } from '../../src/controllers/lost-focus-controller.js';
import { dispatchCustomEvent } from '../../src/lib/events.js';

describe('lost-focus-controller', () => {

  const ce = defineCE(
    class extends LitElement {
      static get properties () {
        return {
          items: { type: Array },
        };
      }

      constructor () {
        super();
        this.items = ['1', '2', '3'];

        new LostFocusController(this, '.item', (event) => {
          dispatchCustomEvent(this, 'my-element:lostFocus', event);
        });
      }

      removeItem (it) {
        this.items = this.items.filter((item) => item !== it);
      }

      clear () {
        this.items = [];
      }

      focusHeader () {
        this.shadowRoot.querySelector('.header').focus();
      }

      focusItem (it) {
        this.getItemElement(it)?.focus();
      }

      focusItemButton (it) {
        this.getItemElement(it)?.querySelector('button').focus();
      }

      getItemElement (it) {
        return this.shadowRoot.querySelector(`[data-item="${it}"]`);
      }

      render () {
        return html`
          <div class="header"></div>
          ${repeat(this.items, (item) => item, (item) => {
            return html`
              <div tabindex="0" class="item" data-item="${item}"><button>${item}</button></div>
            `;
          })}
        `;
      }
    },
  );

  /**
   * @return {Promise<{element: Element, spy: Stub}>}
   */
  const createElement = async () => {
    const element = await fixture(`<${ce}></${ce}>`);

    const spy = hanbi.spy();
    element.addEventListener('my-element:lostFocus', (e) => spy.handler(e.detail));

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

  it('should not notify focus lost when no items is not focused', async () => {
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
