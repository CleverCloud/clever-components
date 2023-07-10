/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env node, mocha */

import './cc-input-date.js';
import { expect, fixture, elementUpdated, triggerFocusFor } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';

/**
 *
 * @param template
 * @return {Promise<CcInputDate>}
 */
async function getElement (template) {
  const element = await fixture(template);
  await elementUpdated(element);
  return element;
}

/**
 *
 * @param {CcInputDate} element
 * @param {string} value
 * @return {Promise<void>}
 */
async function type (element, value) {
  await triggerFocusFor(element);
  await sendKeys({ type: value });
  await elementUpdated(element);
}

/**
 *
 * @param {CcInputDate} element
 * @param {string} value
 * @return {Promise<void>}
 */
async function replace (element, value) {
  await clear(element);
  await sendKeys({ type: value });
  await elementUpdated(element);
}

/**
 *
 * @param {CcInputDate} element
 * @return {Promise<void>}
 */
async function clear (element) {
  await triggerFocusFor(element);
  await sendKeys({ down: 'Control' });
  await sendKeys({ press: 'KeyA' });
  await sendKeys({ up: 'Control' });
  await sendKeys({ press: 'Backspace' });
  await elementUpdated(element);
}

async function moveInputCaretToPosition (element, position) {
  await triggerFocusFor(element);
  await sendKeys({ down: 'Control' });
  await sendKeys({ press: 'KeyA' });
  await sendKeys({ up: 'Control' });
  await sendKeys({ press: 'ArrowLeft' });
  for (let i = 0; i < position; i++) {
    await sendKeys({ press: 'ArrowRight' });
  }
}

function getInternalInput (element) {
  return element.shadowRoot.querySelector('#input-id');
}

describe('cc-input-date', () => {
  describe('getValueAsDate() method', () => {
    it('should return null when initial value is null', async () => {
      const element = await getElement(`<cc-input-date></cc-input-date>`);
      expect(element.getValueAsDate()).to.eql(null);
    });

    it('should return null when initial value is empty', async () => {
      const element = await getElement(`<cc-input-date value=""></cc-input-date>`);
      expect(element.getValueAsDate()).to.eql(null);
    });

    it('should return null when initial value is an invalid string', async () => {
      const element = await getElement(`<cc-input-date value="invalid date"></cc-input-date>`);
      expect(element.getValueAsDate()).to.eql(null);
    });

    it('should return null when initial value is an invalid date', async () => {
      const invalidDate = new Date('invalid date');
      const element = await getElement(html`<cc-input-date .value=${invalidDate}></cc-input-date>`);
      expect(element.getValueAsDate()).to.eql(null);
    });

    it('should return null after user types a invalid value', async () => {
      const element = await getElement(`<cc-input-date></cc-input-date>`);
      await type(element, 'invalid value');
      expect(element.getValueAsDate()).to.eql(null);
    });

    it('should return the right date after user types a valid value with ISO format', async () => {
      const element = await getElement(`<cc-input-date></cc-input-date>`);
      await type(element, '2023-07-31T20:11:12.259Z');
      expect(element.getValueAsDate()?.toISOString()).to.eql('2023-07-31T20:11:12.259Z');
    });

    it('should return the right date after user types a valid value with simple format', async () => {
      const element = await getElement(`<cc-input-date></cc-input-date>`);
      await type(element, '2023-07-31 20:11:12');
      expect(element.getValueAsDate()?.toISOString()).to.eql('2023-07-31T20:11:12.000Z');
    });

    it('should return null after user modifies the valid value to an invalid value', async () => {
      const element = await getElement(`<cc-input-date value="2023-07-31T20:11:12.259Z"></cc-input-date>`);
      await type(element, 'will-become-invalid-date');
      expect(element.getValueAsDate()).to.eql(null);
    });

    describe('with local timezone', () => {
      it('should return the right date after user types a valid value with ISO format', async () => {
        const element = await getElement(`<cc-input-date timezone="local"></cc-input-date>`);
        await type(element, '2023-07-31T20:11:12.259Z');
        expect(element.getValueAsDate()?.toISOString()).to.eql('2023-07-31T20:11:12.259Z');
      });

      it('should return the right date after user types a valid value with simple format', async () => {
        const element = await getElement(`<cc-input-date timezone="local"></cc-input-date>`);
        await type(element, '2023-07-31 20:11:12');
        expect(element.getValueAsDate()?.toISOString()).to.eql('2023-07-31T18:11:12.000Z');
      });
    });
  });

  describe('getValidity() method', () => {
    it('should be valid with empty validity with default props', async () => {
      const element = await getElement(`<cc-input-date></cc-input-date>`);
      expect(element.getValidity()).to.eql({
        valid: true,
        validity: 'empty',
      });
    });

    it('should be valid with empty validity when not required and value is empty', async () => {
      const element = await getElement(`<cc-input-date value=""></cc-input-date>`);
      expect(element.getValidity()).to.eql({
        valid: true,
        validity: 'empty',
      });
    });

    it('should be invalid with empty validity when required and value is empty', async () => {
      const element = await getElement(`<cc-input-date required value=""></cc-input-date>`);
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'empty',
      });
    });

    it('should become invalid with empty validity when required property becomes true and value is empty', async () => {
      const element = await getElement(`<cc-input-date value=""></cc-input-date>`);
      expect(element.getValidity()).to.eql({
        valid: true,
        validity: 'empty',
      });
      element.required = true;
      await elementUpdated(element);
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'empty',
      });
    });

    it('should become valid with empty validity when required property becomes false and value is empty', async () => {
      const element = await getElement(`<cc-input-date required value=""></cc-input-date>`);
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'empty',
      });
      element.required = false;
      await elementUpdated(element);
      expect(element.getValidity()).to.eql({
        valid: true,
        validity: 'empty',
      });
    });

    it('should be valid with empty validity when initial value is an invalid date', async () => {
      // when setting invalid date from outside the component resets the value to null
      const element = await getElement(`<cc-input-date value="invalid date"></cc-input-date>`);
      expect(element.getValidity()).to.eql({
        valid: true,
        validity: 'empty',
      });
    });

    it('should be valid with valid validity when value is an valid date', async () => {
      const element = await getElement(`<cc-input-date value="2023-07-31T20:11:12.259Z"></cc-input-date>`);
      expect(element.getValidity()).to.eql({
        valid: true,
        validity: 'valid',
      });
    });

    it('should become valid with valid validity when user types a valid date with ISO format', async () => {
      const element = await getElement(`<cc-input-date></cc-input-date>`);
      await type(element, '2023-07-31T20:11:12.259Z');
      expect(element.getValidity()).to.eql({
        valid: true,
        validity: 'valid',
      });
    });

    it('should become valid with valid validity when user types a valid date with simple format', async () => {
      const element = await getElement(`<cc-input-date></cc-input-date>`);
      await type(element, '2023-07-31 20:11:12');
      expect(element.getValidity()).to.eql({
        valid: true,
        validity: 'valid',
      });
    });

    it('should become invalid with badFormat validity when user types a invalid date', async () => {
      const element = await getElement(`<cc-input-date></cc-input-date>`);
      await type(element, 'invalid date');
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'badFormat',
      });
    });

    it('should be invalid with tooLow validity when value is lower that min', async () => {
      const element = await getElement(`<cc-input-date min="2023-07-31T21:00:00.000Z" value="2023-07-31T20:11:12.259Z"></cc-input-date>`);
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'tooLow',
      });
    });

    it('should become invalid with tooLow validity when min changes', async () => {
      const element = await getElement(`<cc-input-date min="2023-07-31T20:00:00.000Z" value="2023-07-31T20:11:12.259Z"></cc-input-date>`);
      element.min = '2023-07-31T21:00:00.000Z';
      await elementUpdated(element);
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'tooLow',
      });
    });

    it('should become invalid with tooLow validity when user types a too low value', async () => {
      const element = await getElement(`<cc-input-date min="2023-07-31T21:00:00.000Z" value="2023-07-31T21:11:12.259Z"></cc-input-date>`);
      await replace(element, '2023-07-31 20:11:12');
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'tooLow',
      });
    });

    it('should be invalid with tooHigh validity when value is higher that max', async () => {
      const element = await getElement(`<cc-input-date max="2023-07-31T20:00:00.000Z" value="2023-07-31T20:11:12.259Z"></cc-input-date>`);
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'tooHigh',
      });
    });

    it('should become invalid with tooHigh validity when max changes', async () => {
      const element = await getElement(`<cc-input-date max="2023-07-31T21:00:00.000Z" value="2023-07-31T20:11:12.259Z"></cc-input-date>`);
      element.max = '2023-07-31T20:00:00.000Z';
      await elementUpdated(element);
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'tooHigh',
      });
    });

    it('should become invalid with tooHigh validity when user types a too high value', async () => {
      const element = await getElement(`<cc-input-date max="2023-07-31T21:00:00.000Z" value="2023-07-31T20:11:12.259Z"></cc-input-date>`);
      await replace(element, '2023-07-31 21:11:12');
      expect(element.getValidity()).to.eql({
        valid: false,
        validity: 'tooHigh',
      });
    });

    it('should become valid when user types a date in min-max bounds', async () => {
      const element = await getElement(`<cc-input-date min="2023-07-31T20:00:00.000Z" max="2023-07-31T21:00:00.000Z" value="2023-07-31T19:11:12.259Z"></cc-input-date>`);
      await replace(element, '2023-07-31 20:11:12');
      expect(element.getValidity()).to.eql({
        valid: true,
        validity: 'valid',
      });
    });
  });

  describe('error class', () => {
    it('should be placed on internal input when error slot is set', async () => {
      const element = await fixture('<cc-input-date value="2023-07-31T19:11:12.259Z"><p slot="error">Error</p></cc-input-date>');
      await elementUpdated(element);
      const input = getInternalInput(element);
      expect(input).to.have.class('error');
    });

    it('should be removed from internal input when error slot is removed', async () => {
      const element = await fixture('<cc-input-date value="2023-07-31T19:11:12.259Z"><p slot="error">Error</p></cc-input-date>');
      await elementUpdated(element);
      element.innerHTML = '';
      await elementUpdated(element);
      const input = getInternalInput(element);
      expect(input).to.not.have.class('error');
    });

    it('should be not set on internal input when no error slot defined', async () => {
      const element = await fixture('<cc-input-date value="2023-07-31T19:11:12.259Z"></cc-input-date>');
      await elementUpdated(element);

      const input = getInternalInput(element);
      expect(input).to.not.have.class('error');
    });
  });

  describe('get value() method', () => {
    it('should return null when setting invalid value property', async () => {
      const element = await getElement('<cc-input-date value="invalid"></cc-input-date>');
      expect(element.value).to.equal(null);
    });

    it('should return null when changing value property to an invalid value', async () => {
      const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z"></cc-input-date>');
      element.value = 'invalid value';
      expect(element.value).to.equal(null);
    });

    it('should return the right value when setting value from iso string', async () => {
      const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z"></cc-input-date>');
      expect(element.value).to.equal('2023-07-31T19:11:12.259Z');
    });

    it('should return the right value when setting value from date', async () => {
      const date = new Date('2023-07-31T19:11:12.259Z');
      const element = await getElement(html`<cc-input-date .value=${date}></cc-input-date>`);
      expect(element.value).to.equal('2023-07-31T19:11:12.259Z');
    });

    it('should return the right value when modifying value with iso string', async () => {
      const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z"></cc-input-date>');
      element.value = '2023-07-31T20:11:12.259Z';
      expect(element.value).to.equal('2023-07-31T20:11:12.259Z');
    });

    it('should return the right value when setting value from date', async () => {
      const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z"></cc-input-date>');
      element.value = new Date('2023-07-31T20:11:12.259Z');
      expect(element.value).to.equal('2023-07-31T20:11:12.259Z');
    });
  });

  describe('internal input value', () => {
    describe('with UTC timezone', () => {
      it('should have the right value after init', async () => {
        const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z"></cc-input-date>');
        const input = getInternalInput(element);
        expect(input.value).to.equal('2023-07-31 19:11:12');
      });

      it('should have the right value after modifying value', async () => {
        const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z"></cc-input-date>');
        element.value = '2023-07-31T20:11:12.259Z';
        await elementUpdated(element);
        const input = getInternalInput(element);
        expect(input.value).to.equal('2023-07-31 20:11:12');
      });

      it('should have the formatted value after user typed an ISO date', async () => {
        const element = await getElement('<cc-input-date value=""></cc-input-date>');
        const input = getInternalInput(element);

        await type(element, '2023-07-31T20:11:12.259Z');
        expect(input.value).to.equal('2023-07-31 20:11:12');
        await elementUpdated(element);
        expect(input.value).to.equal('2023-07-31 20:11:12');
      });
    });

    describe('with local timezone', () => {
      it('should have the right value after init', async () => {
        const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z" timezone="local"></cc-input-date>');
        const input = getInternalInput(element);
        expect(input.value).to.equal('2023-07-31 21:11:12');
      });

      it('should have the right value after modifying value', async () => {
        const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z" timezone="local"></cc-input-date>');
        element.value = '2023-07-31T20:11:12.259Z';
        await elementUpdated(element);
        const input = getInternalInput(element);
        expect(input.value).to.equal('2023-07-31 22:11:12');
      });

      it('should have the formatted value after user typed an ISO date', async () => {
        const element = await getElement('<cc-input-date value="" timezone="local"></cc-input-date>');
        const input = getInternalInput(element);

        await type(element, '2023-07-31T20:11:12.259Z');
        expect(input.value).to.equal('2023-07-31 22:11:12');
        await elementUpdated(element);
        expect(input.value).to.equal('2023-07-31 22:11:12');
      });
    });

    it('should have empty value when initializing with invalid value', async () => {
      const element = await getElement('<cc-input-date value="invalid value" timezone="local"></cc-input-date>');
      const input = getInternalInput(element);
      expect(input.value).to.equal('');
    });

    it('should have empty value after setting an invalid value', async () => {
      const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z" timezone="local"></cc-input-date>');
      element.value = 'invalid value';
      await elementUpdated(element);
      const input = getInternalInput(element);
      expect(input.value).to.equal('');
    });

    it('should have the value that has been just typed by user', async () => {
      const element = await getElement('<cc-input-date value=""></cc-input-date>');
      const input = getInternalInput(element);

      await type(element, 'invalid');
      expect(input.value).to.equal('invalid');
      await elementUpdated(element);
      expect(input.value).to.equal('invalid');

      await type(element, ' value');
      expect(input.value).to.equal('invalid value');
      await elementUpdated(element);
      expect(input.value).to.equal('invalid value');
    });

    it('should have the right value after changing the timezone from local to UTC', async () => {
      const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z" timezone="local"></cc-input-date>');

      element.timezone = 'UTC';
      await elementUpdated(element);
      const input = getInternalInput(element);
      expect(input.value).to.equal('2023-07-31 19:11:12');
    });

    it('should have the right value after changing the timezone from UTC to local', async () => {
      const element = await getElement('<cc-input-date value="2023-07-31T19:11:12.259Z"></cc-input-date>');
      element.timezone = 'local';
      await elementUpdated(element);
      const input = getInternalInput(element);
      expect(input.value).to.equal('2023-07-31 21:11:12');
    });
  });

  describe('when user presses key', () => {
    async function checkAfterShift (initialDate, position, key, expectedDate) {
      const element = await getElement(html`<cc-input-date .value="${initialDate}"></cc-input-date>`);
      await moveInputCaretToPosition(element, position);
      await sendKeys({ press: key });
      await elementUpdated(element);
      expect(element.value).to.equal(expectedDate);
    }

    describe('ArrowUp', () => {
      for (const position of [0, 1, 2, 3, 4]) {
        it(`should shift up date year when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowUp', '2024-07-31T19:11:12.259Z');
        });
      }
      for (const position of [5, 6, 7]) {
        it(`should shift up date month when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowUp', '2023-08-31T19:11:12.259Z');
        });
      }
      for (const position of [8, 9, 10]) {
        it(`should shift up date day when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowUp', '2023-08-01T19:11:12.259Z');
        });
      }
      for (const position of [11, 12, 13]) {
        it(`should shift up date hour when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowUp', '2023-07-31T20:11:12.259Z');
        });
      }
      for (const position of [14, 15, 16]) {
        it(`should shift up date minute when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowUp', '2023-07-31T19:12:12.259Z');
        });
      }
      for (const position of [17, 18, 19]) {
        it(`should shift up date second when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowUp', '2023-07-31T19:11:13.259Z');
        });
      }
    });

    describe('ArrowDown', () => {
      for (const position of [0, 1, 2, 3, 4]) {
        it(`should shift down date year when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowDown', '2022-07-31T19:11:12.259Z');
        });
      }
      for (const position of [5, 6, 7]) {
        it(`should shift down date month when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowDown', '2023-06-30T19:11:12.259Z');
        });
      }
      for (const position of [8, 9, 10]) {
        it(`should shift down date day when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowDown', '2023-07-30T19:11:12.259Z');
        });
      }
      for (const position of [11, 12, 13]) {
        it(`should shift down date hour when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowDown', '2023-07-31T18:11:12.259Z');
        });
      }
      for (const position of [14, 15, 16]) {
        it(`should shift down date minute when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowDown', '2023-07-31T19:10:12.259Z');
        });
      }
      for (const position of [17, 18, 19]) {
        it(`should shift down date second when cursor position is ${position}`, async () => {
          await checkAfterShift('2023-07-31T19:11:12.259Z', position, 'ArrowDown', '2023-07-31T19:11:11.259Z');
        });
      }
    });
  });
});
