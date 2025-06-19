import {
  ignoreWindowOnError,
  isResizeObserverLoopErrorMessage,
} from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { elementUpdated, fixture } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
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

const OriginalDate = Date;
beforeEach(async () => {
  // await executeServerCommand('install-clock');
  Date = class MockedDate extends OriginalDate {
    constructor() {
      super();

      return new OriginalDate('2024-02-02T10:00:00');
    }

    static now() {
      return new OriginalDate('2024-02-02T10:00:00');
    }

    getTime() {
      return new OriginalDate('2024-02-02T10:00:00').getTime();
    }
  };
});
// beforeEach(async () => {
//   await executeServerCommand('pause-clock');
// });
afterEach(async () => {
  // await executeServerCommand('resume-clock');
  Date = OriginalDate;
});

const IGNORE_PATTERNS_FOR_VISUAL_REGRESSIONS = ['simulation'];

/**
 * Recursively cancels all running animations in the subtree (including shadow roots),
 * and optionally injects a <style> tag with the given CSS into all shadow roots.
 * @param {Element|DocumentFragment} root - The root node to start searching from (usually document.body)
 */
export async function cancelAnimations(root) {
  const style = document.createElement('style');
  style.textContent = DISABLE_ANIMATIONS_CSS;
  if (root instanceof ShadowRoot || root instanceof DocumentFragment) {
    // Only inject if not already present
    if (
      ![...root.childNodes].some(
        (n) => n.nodeType === Node.ELEMENT_NODE && n.tagName === 'STYLE' && n.textContent === DISABLE_ANIMATIONS_CSS,
      )
    ) {
      root.insertBefore(style, root.firstChild);
    }
  } else if (root instanceof Element) {
    // Only inject if not already present
    if (
      ![...root.childNodes].some(
        (n) => n.nodeType === Node.ELEMENT_NODE && n.tagName === 'STYLE' && n.textContent === DISABLE_ANIMATIONS_CSS,
      )
    ) {
      root.insertBefore(style, root.firstChild);
    }
  }
  // Cancel all running animations on this node
  if (typeof root.getAnimations === 'function') {
    for (const anim of root.getAnimations()) {
      // console.log('no animations found for ', root);
      try {
        anim.pause();
        anim.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }

  // Traverse shadow root if present
  if (root instanceof Element && root.shadowRoot) {
    await cancelAnimations(root.shadowRoot);
  }

  // Traverse children (for both light DOM and shadow DOM)
  if (root instanceof Element || root instanceof DocumentFragment) {
    for (const child of root.children ? Array.from(root.children) : []) {
      await cancelAnimations(child);
    }
  }
}

const DISABLE_ANIMATIONS_CSS = `
  *, *::before, *::after, .skeleton {
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

export async function waitForAllImagesLoaded(root, timeoutMs = 5000) {
  /**
   * Recursively collects all <img> elements from the given root, including shadow roots.
   * @param {Element|DocumentFragment} node
   * @returns {HTMLImageElement[]}
   */
  function collectAllImages(node) {
    let images = [];
    if (node instanceof Element || node instanceof DocumentFragment) {
      // Collect images in the light DOM
      images.push(...node.querySelectorAll('img[src]'));
      // Traverse shadow root if present
      if (node.shadowRoot) {
        images.push(...collectAllImages(node.shadowRoot));
      }
      // Traverse children (for slot or DocumentFragment)
      for (const child of node.children || []) {
        images.push(...collectAllImages(child));
      }
    }
    return images;
  }

  const allImages = collectAllImages(root);

  const imagePromises = allImages.map((img) =>
    img.complete && img.naturalWidth > 0
      ? Promise.resolve()
      : new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }),
  );

  // Add a timeout to the whole operation
  await Promise.race([
    Promise.all(imagePromises),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for images to load')), timeoutMs)),
  ]);
}

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
                  await setViewport(viewports.desktop);
                  const element = await fixture(storyFunction({}, storyConf));

                  await elementUpdated(element);

                  await cancelAnimations(element);
                  try {
                    await waitForAllImagesLoaded(element);
                  } catch {
                    console.warn('Some images failed to load in time');
                  }
                  await visualDiff(element, `${componentTag}-${storyName}-desktop`);
                });
              }
            });

            describe('mobile', async function () {
              if (storyFunction.parameters.tests.visualRegressions.enable) {
                it('should have no visual regression', async function () {
                  await setViewport(viewports.desktop);
                  const element = await fixture(storyFunction({}, storyConf));

                  await elementUpdated(element);

                  await cancelAnimations(element);
                  try {
                    await waitForAllImagesLoaded(element);
                  } catch {
                    console.warn('Some images failed to load in time');
                  }
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
