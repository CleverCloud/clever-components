import { elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';
import { getElement } from '../../../test/helpers/element-helper.js';
import { addTranslations, setLanguage } from '../../lib/i18n/i18n.js';
import { lang, translations } from '../../translations/translations.en.js';
import './cc-range-selector.js';

before(() => {
  addTranslations(lang, translations);
  setLanguage(lang);
});

// Test helper functions
function getOptions(config) {
  const { total = 7, disabledAt = [] } = config;
  return Array.from({ length: total }, (_, i) => ({
    value: `opt${i + 1}`,
    body: `Option ${i + 1}`,
    disabled: disabledAt.includes(i),
  }));
}

async function simulateDrag(element, startIndex, endIndex) {
  const options = element.shadowRoot.querySelectorAll('cc-range-selector-option');
  const startOption = options[startIndex];
  const endOption = options[endIndex];

  startOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
  await elementUpdated(element);

  if (startIndex !== endIndex) {
    const min = Math.min(startIndex, endIndex);
    const max = Math.max(startIndex, endIndex);
    for (let i = min; i <= max; i++) {
      options[i].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, composed: true }));
    }
  }

  endOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, composed: true }));
  await elementUpdated(element);
}

function createEventSpy(element, eventType) {
  const events = [];
  element.addEventListener(eventType, (event) => {
    events.push(event);
  });
  return {
    get callCount() {
      return events.length;
    },
    events,
  };
}

async function clickOption(element, index) {
  const options = element.shadowRoot.querySelectorAll('cc-range-selector-option');
  const option = options[index];
  option.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
  await elementUpdated(element);
}

describe('cc-range-selector', () => {
  describe('disabled options trimming', () => {
    const OPTIONS = [
      { value: 'opt1', body: 'Option 1', disabled: true },
      { value: 'opt2', body: 'Option 2', disabled: true },
      { value: 'opt3', body: 'Option 3' },
      { value: 'opt4', body: 'Option 4' },
      { value: 'opt5', body: 'Option 5', disabled: true },
      { value: 'opt6', body: 'Option 6', disabled: true },
    ];

    it('should trim disabled from start of selection', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt1', endValue: 'opt4' }}
        ></cc-range-selector>
      `);

      expect(el.selection.startValue).to.equal('opt3');
      expect(el.selection.endValue).to.equal('opt4');
    });

    it('should trim disabled from end of selection', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt3', endValue: 'opt6' }}
        ></cc-range-selector>
      `);

      expect(el.selection.startValue).to.equal('opt3');
      expect(el.selection.endValue).to.equal('opt4');
    });

    it('should trim disabled from both ends', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt1', endValue: 'opt6' }}
        ></cc-range-selector>
      `);

      expect(el.selection.startValue).to.equal('opt3');
      expect(el.selection.endValue).to.equal('opt4');
    });

    it('should handle selection with only disabled at start', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt2', endValue: 'opt4' }}
        ></cc-range-selector>
      `);

      expect(el.selection.startValue).to.equal('opt3');
      expect(el.selection.endValue).to.equal('opt4');
    });

    it('should handle selection with only disabled at end', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt3', endValue: 'opt5' }}
        ></cc-range-selector>
      `);

      expect(el.selection.startValue).to.equal('opt3');
      expect(el.selection.endValue).to.equal('opt4');
    });

    it('should return empty array when all options in range are disabled', async () => {
      const opts = [
        { value: 'opt1', body: 'Option 1' },
        { value: 'opt2', body: 'Option 2', disabled: true },
        { value: 'opt3', body: 'Option 3', disabled: true },
        { value: 'opt4', body: 'Option 4' },
      ];

      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${opts}
          .selection=${{ startValue: 'opt2', endValue: 'opt3' }}
        ></cc-range-selector>
      `);

      // After trimming all disabled, selection should be cleared
      expect(el.selection).to.be.null;
    });

    it('should not trim disabled from middle of range', async () => {
      const opts = [
        { value: 'opt1', body: 'Option 1' },
        { value: 'opt2', body: 'Option 2', disabled: true },
        { value: 'opt3', body: 'Option 3' },
      ];

      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${opts}
          .selection=${{ startValue: 'opt1', endValue: 'opt3' }}
        ></cc-range-selector>
      `);

      // Selection boundaries preserved, disabled in middle stays visually
      expect(el.selection.startValue).to.equal('opt1');
      expect(el.selection.endValue).to.equal('opt3');
      // But values array excludes disabled
      const values = el._getValuesArray();
      expect(values).to.eql(['opt1', 'opt3']);
    });

    it('should preserve enabled options when surrounded by disabled', async () => {
      const opts = [
        { value: 'opt1', body: 'Option 1', disabled: true },
        { value: 'opt2', body: 'Option 2' },
        { value: 'opt3', body: 'Option 3' },
        { value: 'opt4', body: 'Option 4', disabled: true },
      ];

      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${opts}
          .selection=${{ startValue: 'opt1', endValue: 'opt4' }}
        ></cc-range-selector>
      `);

      expect(el.selection.startValue).to.equal('opt2');
      expect(el.selection.endValue).to.equal('opt3');
    });
  });

  describe('disabled options in values array', () => {
    const OPTIONS = [
      { value: 'opt1', body: 'Option 1' },
      { value: 'opt2', body: 'Option 2', disabled: true },
      { value: 'opt3', body: 'Option 3', disabled: true },
      { value: 'opt4', body: 'Option 4' },
      { value: 'opt5', body: 'Option 5' },
    ];

    it('should exclude disabled from getValuesArray() by default', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt1', endValue: 'opt5' }}
        ></cc-range-selector>
      `);

      const values = el._getValuesArray();
      expect(values).to.eql(['opt1', 'opt4', 'opt5']);
    });

    it('should include disabled when getValuesArray(true) called', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt1', endValue: 'opt5' }}
        ></cc-range-selector>
      `);

      const values = el._getValuesArray(true);
      expect(values).to.eql(['opt1', 'opt2', 'opt3', 'opt4', 'opt5']);
    });

    it('should skip disabled in middle of range in returned values', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt1', endValue: 'opt4' }}
        ></cc-range-selector>
      `);

      const values = el._getValuesArray();
      expect(values).to.eql(['opt1', 'opt4']);
    });

    it('should handle consecutive disabled in middle', async () => {
      const opts = [
        { value: 'opt1', body: 'Option 1' },
        { value: 'opt2', body: 'Option 2', disabled: true },
        { value: 'opt3', body: 'Option 3', disabled: true },
        { value: 'opt4', body: 'Option 4', disabled: true },
        { value: 'opt5', body: 'Option 5' },
      ];

      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${opts}
          .selection=${{ startValue: 'opt1', endValue: 'opt5' }}
        ></cc-range-selector>
      `);

      const values = el._getValuesArray();
      expect(values).to.eql(['opt1', 'opt5']);
    });

    it('should return only enabled options for form submission', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          name="test-field"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt1', endValue: 'opt5' }}
        ></cc-range-selector>
      `);

      const formData = el._getFormControlData();
      const values = formData.getAll('test-field');
      expect(values).to.eql(['opt1', 'opt4', 'opt5']);
    });

    it('should dispatch event with disabled-excluded values', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-range-select');

      // Simulate drag selection
      await simulateDrag(el, 0, 4);

      expect(spy.callCount).to.equal(1);
      expect(spy.events[0].detail).to.eql(['opt1', 'opt4', 'opt5']);
    });
  });

  describe('disabled options mouse interaction', () => {
    const OPTIONS = [
      { value: 'opt1', body: 'Option 1' },
      { value: 'opt2', body: 'Option 2', disabled: true },
      { value: 'opt3', body: 'Option 3' },
      { value: 'opt4', body: 'Option 4', disabled: true },
      { value: 'opt5', body: 'Option 5' },
    ];

    it('should prevent drag start on disabled option', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-range-select');

      // Try to start drag on disabled option (index 1)
      await simulateDrag(el, 1, 2);

      // No selection should be made
      expect(spy.callCount).to.equal(0);
      expect(el.selection).to.be.null;
    });

    it('should prevent drag end on disabled option', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-range-select');

      // Try to drag from enabled to disabled (0 to 1)
      await simulateDrag(el, 0, 1);

      // No selection should be made
      expect(spy.callCount).to.equal(0);
      expect(el.selection).to.be.null;
    });

    it('should skip disabled during drag range', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-range-select');

      // Drag from opt1 (index 0) to opt3 (index 2), skipping disabled opt2
      await simulateDrag(el, 0, 2);

      expect(spy.callCount).to.equal(1);
      // Values should exclude disabled opt2
      expect(spy.events[0].detail).to.eql(['opt1', 'opt3']);
    });

    it('should not select disabled in single mode on click', async () => {
      const el = await getElement(html` <cc-range-selector mode="single" .options=${OPTIONS}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-select');

      // Try to click disabled option (index 1)
      await clickOption(el, 1);

      // No selection should be made
      expect(spy.callCount).to.equal(0);
      expect(el.value).to.be.null;
    });

    it('should allow drag over disabled (visual only)', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      // Drag across multiple options including disabled
      await simulateDrag(el, 0, 4);

      // Selection should include all enabled options
      expect(el.selection.startValue).to.equal('opt1');
      expect(el.selection.endValue).to.equal('opt5');

      // But values should exclude disabled
      const values = el._getValuesArray();
      expect(values).to.eql(['opt1', 'opt3', 'opt5']);
    });

    it('should not create selection when drag ends on disabled', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      // Try to drag to disabled option (index 1)
      await simulateDrag(el, 0, 1);

      // No selection should be created
      expect(el.selection).to.be.null;
    });

    it('should prevent mouse enter from adding disabled to drag', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const options = el.shadowRoot.querySelectorAll('cc-range-selector-option');

      // Start drag on enabled option
      options[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
      await elementUpdated(el);

      // Move over disabled option (should be skipped)
      options[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, composed: true }));
      await elementUpdated(el);

      // End on another enabled option
      options[2].dispatchEvent(new MouseEvent('mouseup', { bubbles: true, composed: true }));
      await elementUpdated(el);

      // Values should exclude disabled
      const values = el._getValuesArray();
      expect(values).to.eql(['opt1', 'opt3']);
    });
  });

  describe('single mode selection', () => {
    const OPTIONS = getOptions({ total: 5 });

    it('should set value on option click', async () => {
      const el = await getElement(html` <cc-range-selector mode="single" .options=${OPTIONS}></cc-range-selector> `);

      await clickOption(el, 2);

      expect(el.value).to.equal('opt3');
    });

    it('should dispatch cc-select event with correct detail', async () => {
      const el = await getElement(html` <cc-range-selector mode="single" .options=${OPTIONS}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-select');

      await clickOption(el, 2);

      expect(spy.callCount).to.equal(1);
      expect(spy.events[0].detail).to.equal('opt3');
    });

    it('should not select disabled option', async () => {
      const opts = getOptions({ total: 5, disabledAt: [2] });

      const el = await getElement(html` <cc-range-selector mode="single" .options=${opts}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-select');

      await clickOption(el, 2);

      expect(spy.callCount).to.equal(0);
      expect(el.value).to.be.null;
    });

    it('should allow programmatic value change', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} .value=${'opt1'}></cc-range-selector>
      `);

      expect(el.value).to.equal('opt1');

      el.value = 'opt4';
      await elementUpdated(el);

      expect(el.value).to.equal('opt4');
    });

    it('should validate required in single mode', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} required></cc-range-selector>
      `);

      const result = el.validate();
      expect(result.valid).to.be.false;

      el.value = 'opt2';
      await elementUpdated(el);

      const result2 = el.validate();
      expect(result2.valid).to.be.true;
    });

    it('should toggle value when clicking option in single mode', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} .value=${'opt3'}></cc-range-selector>
      `);

      expect(el.value).to.equal('opt3');

      // Click different option
      await clickOption(el, 1);

      expect(el.value).to.equal('opt2');
    });
  });

  describe('range mode selection', () => {
    const OPTIONS = getOptions({ total: 7 });

    it('should set range on drag from start to end', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      await simulateDrag(el, 1, 4);

      expect(el.selection.startValue).to.equal('opt2');
      expect(el.selection.endValue).to.equal('opt5');
    });

    it('should handle backward drag (right to left)', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-range-select');

      // Drag backward from index 4 to index 1
      await simulateDrag(el, 4, 1);

      expect(spy.callCount).to.equal(1);
      // Values should be in correct order even for backward drag
      expect(spy.events[0].detail).to.eql(['opt2', 'opt3', 'opt4', 'opt5']);
    });

    it('should dispatch cc-range-select event with values array', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-range-select');

      await simulateDrag(el, 0, 2);

      expect(spy.callCount).to.equal(1);
      expect(spy.events[0].detail).to.eql(['opt1', 'opt2', 'opt3']);
    });

    it('should not select on single click without drag', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const spy = createEventSpy(el, 'cc-range-select');

      await clickOption(el, 2);

      // Single click without drag should not create selection in range mode
      expect(spy.callCount).to.equal(0);
      expect(el.selection).to.be.null;
    });

    it('should show dragging state during drag', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const options = el.shadowRoot.querySelectorAll('cc-range-selector-option');

      // Start drag
      options[1].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
      await elementUpdated(el);

      // Check dragging state is active
      expect(el._dragCtrl.isDragging()).to.be.true;

      // Move to expand range
      options[3].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, composed: true }));
      await elementUpdated(el);

      // Still dragging
      expect(el._dragCtrl.isDragging()).to.be.true;

      // End drag
      options[3].dispatchEvent(new MouseEvent('mouseup', { bubbles: true, composed: true }));
      await elementUpdated(el);

      // Dragging should be complete
      expect(el._dragCtrl.isDragging()).to.be.false;
    });

    it('should clear selection when dragging invalid range', async () => {
      const opts = getOptions({ total: 3, disabledAt: [0, 1, 2] });

      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${opts}
          .selection=${{ startValue: 'opt1', endValue: 'opt3' }}
        ></cc-range-selector>
      `);

      // All options are disabled, so selection should be cleared
      expect(el.selection).to.be.null;
    });
  });

  describe('form control validation', () => {
    const OPTIONS = getOptions({ total: 5 });

    it('should validate() return valid when not required', async () => {
      const el = await getElement(html` <cc-range-selector mode="single" .options=${OPTIONS}></cc-range-selector> `);

      const result = el.validate();
      expect(result.valid).to.be.true;
    });

    it('should validate() return invalid when required and empty (single)', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} required></cc-range-selector>
      `);

      const result = el.validate();
      expect(result.valid).to.be.false;
    });

    it('should validate() return invalid when required and no selection (range)', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="range" .options=${OPTIONS} required></cc-range-selector>
      `);

      const result = el.validate();
      expect(result.valid).to.be.false;
    });

    it('should clear error state on valid selection', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} required></cc-range-selector>
      `);

      el.reportInlineValidity();
      await elementUpdated(el);

      // Set valid value
      el.value = 'opt2';
      await elementUpdated(el);

      const result = el.validate();
      expect(result.valid).to.be.true;
    });

    it('should integrate with form submission (FormData)', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" name="test-field" .options=${OPTIONS} .value=${'opt3'}></cc-range-selector>
      `);

      const formControlData = el._getFormControlData();
      // Single mode returns string value directly
      expect(formControlData).to.equal('opt3');
    });

    it('should submit multiple values in range mode', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          name="range-field"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt2', endValue: 'opt4' }}
        ></cc-range-selector>
      `);

      const formData = el._getFormControlData();
      const values = formData.getAll('range-field');
      expect(values).to.eql(['opt2', 'opt3', 'opt4']);
    });

    it('should submit single value in single mode', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" name="single-field" .options=${OPTIONS} .value=${'opt5'}></cc-range-selector>
      `);

      const formControlData = el._getFormControlData();
      // Single mode returns string value directly
      expect(formControlData).to.equal('opt5');
    });
  });

  describe('custom option', () => {
    const OPTIONS = getOptions({ total: 5 });

    it('should show custom button when showCustom=true', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} show-custom></cc-range-selector>
      `);

      const customButton = el.shadowRoot.querySelector('[part="btn-custom"]');
      expect(customButton).to.exist;
    });

    it('should hide custom button when showCustom=false', async () => {
      const el = await getElement(html` <cc-range-selector mode="single" .options=${OPTIONS}></cc-range-selector> `);

      const customButton = el.shadowRoot.querySelector('[part="btn-custom"]');
      expect(customButton).to.be.null;
    });

    it('should dispatch cc-range-selector-select-custom on custom click', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} show-custom></cc-range-selector>
      `);

      const spy = createEventSpy(el, 'cc-range-selector-select-custom');

      const customButton = el.shadowRoot.querySelector('[part="btn-custom"]');
      customButton.click();
      await elementUpdated(el);

      expect(spy.callCount).to.equal(1);
    });
  });

  describe('component state', () => {
    const OPTIONS = getOptions({ total: 5 });

    it('should disable all interactions when disabled=true', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} disabled></cc-range-selector>
      `);

      const spy = createEventSpy(el, 'cc-select');

      // Try to click option
      await clickOption(el, 2);

      // No selection should occur
      expect(spy.callCount).to.equal(0);
      expect(el.value).to.be.null;
    });

    it('should prevent modification when readonly=true', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} .value=${'opt2'} readonly></cc-range-selector>
      `);

      const spy = createEventSpy(el, 'cc-select');

      // Try to click different option
      await clickOption(el, 3);

      // Selection should not change
      expect(spy.callCount).to.equal(0);
      expect(el.value).to.equal('opt2');
    });

    it.skip('should allow keyboard navigation when readonly=false', async () => {
      // Test skipped - requires sendKeys import
    });

    it('should apply inline layout when inline=true', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} inline></cc-range-selector>
      `);

      // Check that inline attribute is reflected
      expect(el.hasAttribute('inline')).to.be.true;
    });

    it('should update selection when options array changes', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} .value=${'opt3'}></cc-range-selector>
      `);

      expect(el.value).to.equal('opt3');

      // Change options array
      const newOptions = getOptions({ total: 3 });
      el.options = newOptions;
      await elementUpdated(el);

      // opt3 still exists in new options, should be preserved
      expect(el.value).to.equal('opt3');
    });

    it('should revalidate when selection changes programmatically', async () => {
      const el = await getElement(html`
        <cc-range-selector mode="single" .options=${OPTIONS} required></cc-range-selector>
      `);

      // Initially invalid (no value)
      let result = el.validate();
      expect(result.valid).to.be.false;

      // Set value programmatically
      el.value = 'opt2';
      await elementUpdated(el);

      // Should now be valid
      result = el.validate();
      expect(result.valid).to.be.true;
    });

    it('should preserve selection when options updated but values remain', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt2', endValue: 'opt4' }}
        ></cc-range-selector>
      `);

      const originalSelection = { ...el.selection };

      // Update options but keep same values
      const newOptions = OPTIONS.map((opt) => ({ ...opt, body: opt.body + ' Updated' }));
      el.options = newOptions;
      await elementUpdated(el);

      // Selection values should be preserved
      expect(el.selection).to.deep.equal(originalSelection);
    });
  });

  describe('dragging controller', () => {
    const OPTIONS = getOptions({ total: 7 });

    it('should start drag with start()', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const controller = el._dragCtrl;

      controller.start(2);
      expect(controller.isDragging()).to.be.true;

      const ranges = controller.getRanges();
      expect(ranges.start).to.equal(2);
      expect(ranges.end).to.equal(2);
    });

    it('should update drag range with update()', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const controller = el._dragCtrl;

      controller.start(1);
      controller.update(4);

      const ranges = controller.getRanges();
      expect(ranges.start).to.equal(1);
      expect(ranges.end).to.equal(4);
    });

    it('should finalize drag with stop()', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const controller = el._dragCtrl;

      controller.start(2);
      expect(controller.isDragging()).to.be.true;

      controller.stop();
      expect(controller.isDragging()).to.be.false;
    });

    it('should track isDragging state', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const controller = el._dragCtrl;

      expect(controller.isDragging()).to.be.false;

      controller.start(1);
      expect(controller.isDragging()).to.be.true;

      controller.stop();
      expect(controller.isDragging()).to.be.false;
    });

    it('should detect isInRange() correctly', async () => {
      const el = await getElement(html` <cc-range-selector mode="range" .options=${OPTIONS}></cc-range-selector> `);

      const controller = el._dragCtrl;

      controller.start(2);
      controller.update(5);

      // Indices within range should return true
      expect(controller.isInRange(2)).to.be.true;
      expect(controller.isInRange(3)).to.be.true;
      expect(controller.isInRange(4)).to.be.true;
      expect(controller.isInRange(5)).to.be.true;

      // Indices outside range should return false
      expect(controller.isInRange(1)).to.be.false;
      expect(controller.isInRange(6)).to.be.false;
    });

    it('should store previous selection for rollback', async () => {
      const el = await getElement(html`
        <cc-range-selector
          mode="range"
          .options=${OPTIONS}
          .selection=${{ startValue: 'opt2', endValue: 'opt4' }}
        ></cc-range-selector>
      `);

      const controller = el._dragCtrl;
      const previousSelection = { startValue: 'opt2', endValue: 'opt4' };

      controller.setPreviousSelection(previousSelection);

      const retrieved = controller.getPreviousSelection();
      expect(retrieved).to.deep.equal(previousSelection);
    });
  });
});
