import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
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
