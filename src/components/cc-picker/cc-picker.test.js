import { expect } from '@open-wc/testing';
import { elementUpdated, fixture, nextFrame } from '@open-wc/testing-helpers';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import { html } from 'lit';
import { createEventSpy } from '../../../test/helpers/event-helper.js';
import { CcSelectEvent } from '../common.events.js';
import './cc-picker.js';

function getRadios(element) {
  return Array.from(element.shadowRoot.querySelectorAll('input[type="radio"]'));
}

function getTiles(element) {
  return Array.from(element.shadowRoot.querySelectorAll('cc-picker-option'));
}

function getLabels(element) {
  return Array.from(element.shadowRoot.querySelectorAll('label'));
}

function getSelectedTileIndexes(element) {
  return getTiles(element).flatMap((tile, index) => (tile.hasAttribute('selected') ? [index] : []));
}

async function clickTileAt(element, index) {
  getLabels(element)[index].click();
  await elementUpdated(element);
}

/**
 * Clicks with a real pointer, so that the browser also focuses the radio and scrolls it into view.
 *
 * @param {HTMLElement} element
 * @param {number} index
 */
async function pointerClickTileAt(element, index) {
  const { left, top, width, height } = getLabels(element)[index].getBoundingClientRect();
  await sendMouse({ type: 'click', position: [Math.round(left + width / 2), Math.round(top + height / 2)] });
  await resetMouse();
  await elementUpdated(element);
}

const OPTIONS = [
  { body: 'One', value: 'ONE' },
  { body: 'Two', value: 'TWO' },
];

describe('cc-picker', () => {
  describe('selection', () => {
    it('selects the clicked tile and dispatches its value', async () => {
      const element = await fixture(html`<cc-picker name="pick" .options=${OPTIONS}></cc-picker>`);
      const spy = createEventSpy(element, CcSelectEvent.TYPE);

      await clickTileAt(element, 1);

      expect(element.value).to.equal('TWO');
      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0].detail).to.equal('TWO');
      expect(getSelectedTileIndexes(element)).to.eql([1]);
    });

    it('reads the value from the option and not from the radio', async () => {
      const element = await fixture(html`<cc-picker name="pick" .options=${OPTIONS}></cc-picker>`);
      const spy = createEventSpy(element, CcSelectEvent.TYPE);

      // the radio stores a string copy of the value, it is not the source of truth
      // see https://github.com/CleverCloud/clever-components/issues/1831
      getRadios(element)[1].value = 'TAMPERED';

      await clickTileAt(element, 1);

      expect(element.value).to.equal('TWO');
      expect(spy.firstCall.args[0].detail).to.equal('TWO');
    });

    it('moves the selection when another tile is clicked', async () => {
      const element = await fixture(html`<cc-picker name="pick" .options=${OPTIONS} value="TWO"></cc-picker>`);

      expect(getSelectedTileIndexes(element)).to.eql([1]);

      await clickTileAt(element, 0);

      expect(element.value).to.equal('ONE');
      expect(getSelectedTileIndexes(element)).to.eql([0]);
    });

    it('ignores tile selection when readonly', async () => {
      const element = await fixture(html`<cc-picker name="pick" .options=${OPTIONS} value="TWO" readonly></cc-picker>`);
      const spy = createEventSpy(element, CcSelectEvent.TYPE);

      // the unselected radios are rendered disabled, so the click alone never reaches the handler
      await clickTileAt(element, 0);
      getRadios(element)[0].dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      await elementUpdated(element);

      expect(element.value).to.equal('TWO');
      expect(spy.callCount).to.equal(0);
    });

    it('ignores input events coming from the slotted content', async () => {
      const element = await fixture(
        html`<cc-picker name="pick" .options=${OPTIONS} value="TWO">
          <input slot="help" id="slotted" />
        </cc-picker>`,
      );
      const spy = createEventSpy(element, CcSelectEvent.TYPE);

      element.querySelector('#slotted').dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      await elementUpdated(element);

      expect(element.value).to.equal('TWO');
      expect(spy.callCount).to.equal(0);
    });

    it('ignores input events coming from an option body', async () => {
      const bodyInput = document.createElement('input');
      // a stray `data-index` inside an option body must not be mistaken for a tile
      bodyInput.dataset.index = '0';
      const options = [
        { body: bodyInput, value: 'ONE' },
        { body: 'Two', value: 'TWO' },
      ];
      const element = await fixture(html`<cc-picker name="pick" .options=${options} value="TWO"></cc-picker>`);
      const spy = createEventSpy(element, CcSelectEvent.TYPE);

      bodyInput.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      await elementUpdated(element);

      expect(element.value).to.equal('TWO');
      expect(spy.callCount).to.equal(0);
    });

    it('lets the input event bubble out with the value already set', async () => {
      const element = await fixture(html`<cc-picker name="pick" .options=${OPTIONS}></cc-picker>`);
      // cc-plan-picker listens on the host and reads `e.target.value`
      const spy = createEventSpy(element, 'input');

      await clickTileAt(element, 1);

      expect(spy.callCount).to.equal(1);
      expect(spy.firstCall.args[0].target).to.equal(element);
      expect(spy.firstCall.args[0].target.value).to.equal('TWO');
    });
  });

  describe('option ids', () => {
    it('builds radio ids from the option position, and links each label to its own radio', async () => {
      const options = [
        { body: 'One', value: 'same' },
        { body: 'Two', value: 'same' },
      ];
      const element = await fixture(html`<cc-picker name="pick" .options=${options}></cc-picker>`);
      const radios = getRadios(element);
      const labels = getLabels(element);

      expect(radios.map((radio) => radio.id)).to.eql(['pick-option-0', 'pick-option-1']);
      expect(labels.map((label) => label.getAttribute('for'))).to.eql(['pick-option-0', 'pick-option-1']);
    });
  });

  // a scroller that is not positioned, inside an ancestor that is: a radio placed outside of the picker would escape
  // the scroller, and focusing it would scroll the ancestor instead
  // see https://github.com/CleverCloud/clever-components/issues/1858
  describe('focus scroll', () => {
    it('does not scroll a positioned ancestor of the scroller when a tile is clicked', async () => {
      const frame = await fixture(html`
        <div style="position: relative; height: 200px; overflow: hidden">
          <div class="scroller" style="height: 100%; overflow-y: auto">
            <div style="height: 400px"></div>
            <cc-picker name="pick" .options=${OPTIONS}></cc-picker>
          </div>
        </div>
      `);
      const scroller = frame.querySelector('.scroller');
      const element = frame.querySelector('cc-picker');
      scroller.scrollTop = scroller.scrollHeight;
      const scrollerScrollTop = scroller.scrollTop;

      await pointerClickTileAt(element, 1);

      expect(element.value).to.equal('TWO');
      expect(element.shadowRoot.activeElement).to.equal(getRadios(element)[1]);
      expect(frame.scrollTop).to.equal(0);
      expect(scroller.scrollTop).to.equal(scrollerScrollTop);
    });

    it('scrolls each tile fully into view when moving the focus with the keyboard', async () => {
      const options = Array.from({ length: 8 }, (_, index) => ({ body: `Option ${index}`, value: `option-${index}` }));
      const frame = await fixture(html`
        <div style="position: relative; height: 200px; overflow: hidden">
          <div class="scroller" style="height: 100%; overflow-y: auto">
            <cc-picker name="pick" .options=${options}></cc-picker>
          </div>
        </div>
      `);
      const scroller = frame.querySelector('.scroller');
      const element = frame.querySelector('cc-picker');
      // stacks the tiles in a single column, as a consumer would do through the `tiles` part
      element.shadowRoot.querySelector('.tiles').style.flexDirection = 'column';
      await pointerClickTileAt(element, 0);

      for (let index = 1; index < options.length; index++) {
        await sendKeys({ press: 'ArrowDown' });
        await elementUpdated(element);
        await nextFrame();

        const tile = getLabels(element)[index].getBoundingClientRect();
        const viewport = scroller.getBoundingClientRect();
        expect(element.value).to.equal(`option-${index}`);
        expect(tile.top).to.be.at.least(viewport.top - 1);
        expect(tile.bottom).to.be.at.most(viewport.bottom + 1);
      }
      expect(frame.scrollTop).to.equal(0);
    });
  });

  describe('hidden label', () => {
    it('keeps the label as the group accessible name while hiding it visually', async () => {
      const element = await fixture(
        html`<cc-picker name="pick" label="Topology" hidden-label .options=${OPTIONS}></cc-picker>`,
      );
      const group = element.shadowRoot.querySelector('[role="group"]');
      const legend = element.shadowRoot.getElementById(group.getAttribute('aria-labelledby'));

      expect(legend.textContent.trim()).to.equal('Topology');
      expect(legend.classList.contains('visually-hidden')).to.equal(true);
      expect(legend.classList.contains('legend')).to.equal(false);
    });
  });
});
