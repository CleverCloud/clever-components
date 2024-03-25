import { elementUpdated, fixture, triggerFocusFor } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

/**
 * @param {any} template
 * @return {Promise<Element>}
 */
export async function getElement (template) {
  const element = await fixture(template);
  await elementUpdated(element);
  return element;
}

/**
 *
 * @param {HTMLElement} element
 * @param {string} value
 * @return {Promise<void>}
 */
export async function typeText (element, value) {
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
export async function replaceText (element, value) {
  await clearText(element);
  await sendKeys({ type: value });
  await elementUpdated(element);
}

/**
 *
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
export async function clearText (element) {
  await triggerFocusFor(element);
  await sendKeys({ down: 'Control' });
  await sendKeys({ press: 'KeyA' });
  await sendKeys({ up: 'Control' });
  await sendKeys({ press: 'Backspace' });
  await elementUpdated(element);
}

/**
 *
 * @param {HTMLElement} element
 * @param {number} position
 * @return {Promise<void>}
 */
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
