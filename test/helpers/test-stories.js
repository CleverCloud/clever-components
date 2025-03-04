import {
  ignoreWindowOnError,
  isResizeObserverLoopErrorMessage,
} from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { addTranslations } from '../../src/lib/i18n/i18n.js';
import * as en from '../../src/translations/translations.en.js';

/**
 * @typedef {import('./test-stories.types.js').RawStoriesModule} RawStoriesModule
 * @typedef {import('./test-stories.types.js').AnnotatedStoryFnClever} AnnotatedStoryFnClever
 * @typedef {import('./test-stories.types.js').ModuleEntryWithStoryFunction} ModuleEntryWithStoryFunction
 * @typedef {import('./test-stories.types.js').ArrayOfStoryFunctions} ArrayOfStoryFunctions
 * @typedef {import('@storybook/web-components').WebComponentsRenderer} WebComponentsRenderer
 * @typedef {import('@storybook/web-components').StoryContext<WebComponentsRenderer>} StoryContext
 */

const viewports = {
  desktop: {
    width: 1200,
    height: 640,
  },
  mobile: {
    width: 360,
    height: 640,
  },
};

/** @type {StoryContext} */
// @ts-ignore we don't need to provide all options because the story won't be displayed in storybook
const storyConf = {
  globals: {
    locale: 'en',
  },
};

// Register languages
addTranslations(en.lang, en.translations);

/**
 * Sets up error handling to ignore specific errors during test execution
 *
 * @param {Function} before - Function to execute before test
 * @param {Function} after - Function to execute after test
 * @param {(message: string) => boolean} messagePredicate - Function that determines which error messages to ignore
 */
function setupIgnoreIrrelevantErrors(before, after, messagePredicate) {
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

setupIgnoreIrrelevantErrors(before, after, (message) => {
  return (
    isResizeObserverLoopErrorMessage(message) ||
    message.includes(
      "Uncaught IndexSizeError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The source width is 0",
    )
  );
});

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

/** @param {RawStoriesModule} storiesModule */
export async function testStories(storiesModule) {
  const componentTag = storiesModule.default.component;
  const stories = getStories(storiesModule);
  const shouldRunTests = stories.some(({ storyFunction }) => storyFunction.parameters.tests.accessibility.enable);

  if (shouldRunTests) {
    describe(`Component: ${componentTag}`, function () {
      stories.forEach(({ storyName, storyFunction }) => {
        if (storyFunction.parameters.tests.accessibility.enable) {
          describe(`Story: ${storyName}`, function () {
            describe(`Desktop: width = ${viewports.desktop.width} height = ${viewports.desktop.height}`, async function () {
              it('should be accessible', async function () {
                await setViewport(viewports.desktop);
                const element = await fixture(storyFunction({}, storyConf));

                await elementUpdated(element);

                await expect(element).to.be.accessible({
                  ignoredRules: storyFunction.parameters.tests.accessibility.ignoredRules,
                });
              });
            });

            describe(`Mobile: width = ${viewports.mobile.width} height = ${viewports.mobile.height}`, async function () {
              it('should be accessible', async function () {
                await setViewport(viewports.mobile);
                const element = await fixture(storyFunction({}, storyConf));

                await elementUpdated(element);

                await expect(element).to.be.accessible({
                  ignoredRules: storyFunction.parameters.tests.accessibility.ignoredRules,
                });
              });
            });
          });
        }
      });
    });
  }
}
