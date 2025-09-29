import { ignoreWindowOnError } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { LitElement } from 'lit';

/**
 * @typedef {import('./story-testing-utils.types.js').RawStoriesModule} RawStoriesModule
 * @typedef {import('./story-testing-utils.types.js').AnnotatedStoryFnClever} AnnotatedStoryFnClever
 * @typedef {import('./story-testing-utils.types.js').ModuleEntryWithStoryFunction} ModuleEntryWithStoryFunction
 * @typedef {import('./story-testing-utils.types.js').ArrayOfStoryFunctions} ArrayOfStoryFunctions
 * @typedef {import('@storybook/web-components').WebComponentsRenderer} WebComponentsRenderer
 * @typedef {import('@storybook/web-components').StoryContext<WebComponentsRenderer>} StoryContext
 */

export const viewports = {
  desktop: {
    width: 1200,
    height: 640,
  },
  mobile: {
    width: 375,
    height: 640,
  },
};

/** @type {StoryContext} */
// @ts-ignore we don't need to provide all options because the story won't be displayed in storybook
export const storyConf = {
  globals: {
    locale: 'en',
  },
};

/**
 * Sets up error handling to ignore specific errors during test execution
 *
 * @param {Function} before - Function to execute before test
 * @param {Function} after - Function to execute after test
 * @param {(message: string) => boolean} messagePredicate - Function that determines which error messages to ignore
 */
export function setupIgnoreIrrelevantErrors(before, after, messagePredicate) {
  /** @type {Function|null} */
  let teardown;
  before(() => {
    teardown = ignoreWindowOnError(messagePredicate);
  });
  after(() => {
    teardown?.();
    teardown = undefined;
  });
}

/**
 * Transform the result of an imported module from a story file into an array of story functions that can be used to render every story.
 * The imported module is an object containing every named export (story functions mostly) as well as the default export (metadata about the stories).
 *
 * @param {RawStoriesModule} importedModule the result of a story file import.
 * @returns {ArrayOfStoryFunctions} the story functions. These functions can be used to render each story.
 */
export const getStories = (importedModule) => {
  const filteredStories = /** @type {ArrayOfStoryFunctions} */ (
    Object.entries(importedModule)
      .filter(
        ([_moduleEntryName, moduleEntryValue]) =>
          typeof moduleEntryValue === 'function' && 'component' in moduleEntryValue,
      )
      .map(([storyName, storyFunction]) => ({ storyName, storyFunction }))
  );

  return filteredStories;
};

/**
 * @param {Element} root
 * @returns {Promise<Array<HTMLElement>>}
 */
export async function getAllElements(root) {
  /** @type {Array<HTMLElement>} */
  const allElements = [];

  /** @param {Element|DocumentFragment} root */
  async function collectAllElements(root) {
    if (root instanceof HTMLElement) {
      allElements.push(root);
    }

    if (root instanceof LitElement) {
      await root.updateComplete;
    }

    // special case for the virtualizer, we need to wait a little bit for it to place its children
    // we cannot wait for `layoutComplete` because it hangs if no layout is pending
    if ('layoutComplete' in root) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (root instanceof HTMLElement && root.shadowRoot != null) {
      await collectAllElements(root.shadowRoot);
    }

    for (const child of root.children ? Array.from(root.children) : []) {
      await collectAllElements(child);
    }
  }

  await collectAllElements(root);

  return allElements;
}
/**
 * Cancels all JS animations and disables CSS animations/transitions for the given elements.
 *
 * @param {Array<HTMLElement>} elements
 */
export async function cancelAnimations(elements) {
  /** @type {Array<HTMLElement['tagName']>} */
  let processedElements = [];

  for (const element of elements) {
    if (element.shadowRoot != null && !processedElements.includes(element.tagName)) {
      // AdoptedStylesheets are shared for all component instances so we only need to process them once
      const nbOfSheets = element.shadowRoot.adoptedStyleSheets.length;
      // Append last stylesheet or create one
      const sheet = element.shadowRoot.adoptedStyleSheets[nbOfSheets - 1] ?? new CSSStyleSheet();
      sheet.insertRule(`
        * {
          transition: none !important;
          animation: none !important;
        }
      `);
      element.shadowRoot.adoptedStyleSheets.push(sheet);
      processedElements.push(element.tagName);
    }

    element.getAnimations().forEach((animation) => {
      animation.cancel();
    });
  }
}

/**
 * Waits until all `<img>` tags within the provided elements have loaded.
 *
 * @param {Array<HTMLElement>} elements
 */
export async function waitForAllImagesLoaded(elements, timeoutMs = 5000) {
  const allImages = /** @type {Array<HTMLImageElement>} */ (
    elements.filter((element) => element instanceof HTMLImageElement)
  );

  const imagePromises = allImages.map((img) =>
    img.complete
      ? Promise.resolve()
      : Promise.race([
          new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout waiting for images to load')), timeoutMs),
          ),
        ]),
  );

  await Promise.all(imagePromises);
}
