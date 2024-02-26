/* eslint-disable import/no-extraneous-dependencies */
import { elementUpdated, triggerFocusFor } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

/**
 * @param {HTMLElement} element
 * @param {string} value
 * @return {Promise<void>}
 */
export async function type (element, value) {
  await triggerFocusFor(element);
  await sendKeys({ type: value });
  await elementUpdated(element);
}

/**
 *
 * @param {HTMLElement} element
 * @param {string} value
 * @return {Promise<void>}
 */
export async function replace (element, value) {
  await clear(element);
  await sendKeys({ type: value });
  await elementUpdated(element);
}

/**
 *
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
export async function clear (element) {
  await triggerFocusFor(element);
  await sendKeys({ down: 'Control' });
  await sendKeys({ press: 'KeyA' });
  await sendKeys({ up: 'Control' });
  await sendKeys({ press: 'Backspace' });
  await elementUpdated(element);
}

export async function moveInputCaretToPosition (element, position) {
  await triggerFocusFor(element);
  await sendKeys({ down: 'Control' });
  await sendKeys({ press: 'KeyA' });
  await sendKeys({ up: 'Control' });
  await sendKeys({ press: 'ArrowLeft' });
  for (let i = 0; i < position; i++) {
    await sendKeys({ press: 'ArrowRight' });
  }
}
