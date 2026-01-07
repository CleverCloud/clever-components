import { render } from 'lit';
import { userEvent } from 'vitest/browser';

let fixtureContainer = null;

/**
 * Creates a fixture container in the DOM for testing
 * @returns {HTMLDivElement}
 */
function getFixtureContainer() {
  if (!fixtureContainer || !fixtureContainer.isConnected) {
    fixtureContainer = document.createElement('div');
    fixtureContainer.id = 'fixture-container';
    document.body.appendChild(fixtureContainer);
  }
  return fixtureContainer;
}

/**
 * Cleans up the fixture container
 */
export function cleanupFixtures() {
  if (fixtureContainer) {
    fixtureContainer.innerHTML = '';
  }
}

/**
 * Renders a Lit template and returns the first element
 * Replacement for @open-wc/testing's fixture()
 * @param {import('lit').TemplateResult} template
 * @returns {Promise<Element>}
 */
export async function fixture(template) {
  // Create a fresh container each time to avoid Lit's render caching
  const parent = getFixtureContainer();
  parent.innerHTML = '';
  const container = document.createElement('div');
  parent.appendChild(container);
  render(template, container);
  const element = container.firstElementChild;
  await elementUpdated(element);
  return element;
}

/**
 * Waits for a Lit element to complete its update cycle
 * Replacement for @open-wc/testing's elementUpdated()
 * @param {Element} element
 * @returns {Promise<void>}
 */
export async function elementUpdated(element) {
  // Wait for Lit's updateComplete if available
  if (element && typeof element.updateComplete !== 'undefined') {
    await element.updateComplete;
  }
  // Additional frame for rendering
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * Waits for the next animation frame
 * Replacement for @open-wc/testing's nextFrame()
 * @returns {Promise<void>}
 */
export async function nextFrame() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * Triggers focus on an element
 * Replacement for @open-wc/testing's triggerFocusFor()
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 */
export async function triggerFocusFor(element) {
  element.focus();
  await nextFrame();
}

/**
 * Defines a custom element with a unique tag name
 * Replacement for @open-wc/testing's defineCE()
 * @param {CustomElementConstructor} ElementClass
 * @returns {string}
 */
let ceCounter = 0;
export function defineCE(ElementClass) {
  const tagName = `test-element-${ceCounter++}-${Math.random().toString(36).slice(2, 8)}`;
  customElements.define(tagName, ElementClass);
  return tagName;
}

/**
 * @param {any} template
 * @return {Promise<Element>}
 */
export async function getElement(template) {
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
export async function typeText(element, value) {
  await triggerFocusFor(element);
  await userEvent.type(element, value);
  await elementUpdated(element);
}

/**
 *
 * @param {HTMLElement} element
 * @param {string} value
 * @return {Promise<void>}
 */
export async function replaceText(element, value) {
  await clearText(element);
  await userEvent.type(element, value);
  await elementUpdated(element);
}

/**
 *
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
export async function clearText(element) {
  await triggerFocusFor(element);
  await userEvent.keyboard('{Control>}a{/Control}');
  await userEvent.keyboard('{Backspace}');
  await elementUpdated(element);
}

/**
 *
 * @param {HTMLElement} element
 * @param {number} position
 * @return {Promise<void>}
 */
export async function moveInputCaretToPosition(element, position) {
  await triggerFocusFor(element);
  await userEvent.keyboard('{Control>}a{/Control}');
  await userEvent.keyboard('{ArrowLeft}');
  for (let i = 0; i < position; i++) {
    await userEvent.keyboard('{ArrowRight}');
  }
}
