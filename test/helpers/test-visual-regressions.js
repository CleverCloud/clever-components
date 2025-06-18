import {
  ignoreWindowOnError,
  isResizeObserverLoopErrorMessage,
} from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { elementUpdated, fixture } from '@open-wc/testing';
import { executeServerCommand, setViewport } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
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

const OriginalMathRandom = Math.random;
function setupFixedRandom(before, after) {
  before(() => {
    Math.random = () => 0.5;
  });
  after(() => {
    Math.random = OriginalMathRandom;
  });
}

setupFixedRandom(before, after);

const IGNORE_PATTERNS_FOR_VISUAL_REGRESSIONS = ['simulation'];

/**
 * Recursively injects a <style> tag with the given CSS into all shadow roots in the subtree.
 * @param {Node} root - The root node to start searching from (usually document.body)
 * @param {string} css - The CSS string to inject
 */
export function injectCssIntoAllShadowRoots(root, css) {
  if (root.shadowRoot) {
    const style = document.createElement('style');
    style.textContent = css;
    root.shadowRoot.appendChild(style);
  }
  // Traverse children (for both shadow and light DOM)
  if (root.children.length > 0) {
    Array.from(root.children).forEach((child) => injectCssIntoAllShadowRoots(child, css));
  }

  if (root.shadowRoot != null && root.shadowRoot.children.length > 0) {
    Array.from(root.shadowRoot.children).forEach((child) => injectCssIntoAllShadowRoots(child, css));
  }
}

const DISABLE_ANIMATIONS_CSS = `
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
    animation-duration: 0s !important;
  }
`;

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
      .map(([storyName, storyFunction]) => {
        const defaultTestsConfig = getDefaultTestsConfig(storyName);
        storyFunction.parameters.tests = mergeTestsConfig(defaultTestsConfig, storyFunction.parameters.tests);

        return { storyName, storyFunction };
      })
  );

  return filteredStories;
};

const mergeTestsConfig = (defaults, custom) => {
  return {
    accessibility: {
      ...defaults.accessibility,
      ...custom?.accessibility,
    },
    visualRegressions: {
      ...defaults.visualRegressions,
      ...custom?.visualRegressions,
    },
  };
};

const getDefaultTestsConfig = (storyName) => ({
  accessibility: {
    enable: !storyName.toLowerCase().includes('simulation'),
  },
  visualRegressions: {
    enable: !IGNORE_PATTERNS_FOR_VISUAL_REGRESSIONS.some((ignorePattern) =>
      storyName.toLowerCase().includes(ignorePattern),
    ),
  },
});

/** @param {RawStoriesModule} storiesModule */
export async function testStories(storiesModule) {
  const componentTag = storiesModule.default.component;
  const stories = getStories(storiesModule);
  const shouldRunTests = stories.some(
    ({ storyFunction }) =>
      storyFunction.parameters.tests.accessibility.enable || storyFunction.parameters.tests.visualRegressions.enable,
  );

  if (shouldRunTests) {
    describe(componentTag, function () {
      stories.forEach(({ storyName, storyFunction }) => {
        if (
          storyFunction.parameters.tests.accessibility.enable ||
          storyFunction.parameters.tests.visualRegressions.enable
        ) {
          describe(storyName, function () {
            describe(`desktop`, async function () {
              if (storyFunction.parameters.tests.visualRegressions.enable) {
                it('should have no visual regression', async function () {
                  await executeServerCommand('set-fixed-time');
                  // await executeServerCommand('set-predictible-random');
                  await setViewport(viewports.desktop);
                  const element = await fixture(storyFunction({}, storyConf));
                  injectCssIntoAllShadowRoots(element, DISABLE_ANIMATIONS_CSS);

                  await elementUpdated(element);
                  await executeServerCommand('wait-for-network-idle');

                  await visualDiff(element, `${componentTag}-${storyName}-desktop`);
                });
              }
            });

            describe('mobile', async function () {
              if (storyFunction.parameters.tests.visualRegressions.enable) {
                it('should have no visual regression', async function () {
                  await executeServerCommand('set-fixed-time');
                  // await executeServerCommand('set-predictible-random');
                  await setViewport(viewports.desktop);
                  const element = await fixture(storyFunction({}, storyConf));
                  injectCssIntoAllShadowRoots(element, DISABLE_ANIMATIONS_CSS);

                  await elementUpdated(element);
                  await executeServerCommand('wait-for-network-idle');

                  await visualDiff(element, `${componentTag}-${storyName}-mobile`);
                });
              }
            });
          });
        }
      });
    });
  }
}
