import { isResizeObserverLoopErrorMessage } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { fixture } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
// @ts-expect-error the plugin types are not exposed properly
import { visualDiff } from '@web/test-runner-visual-regression';
import { kebabCase } from '../../src/lib/change-case.js';
import { addTranslations } from '../../src/lib/i18n/i18n.js';
import * as en from '../../src/translations/translations.en.js';
import {
  cancelAnimations,
  getAllElements,
  getStories,
  setupIgnoreIrrelevantErrors,
  storyConf,
  viewports,
  waitForAllImagesLoaded,
} from './story-testing-utils.js';

/**
 * @typedef {import('./story-testing-utils.types.js').RawStoriesModule} RawStoriesModule
 */

// Register languages
addTranslations(en.lang, en.translations);

setupIgnoreIrrelevantErrors(before, after, (message) => {
  return (
    isResizeObserverLoopErrorMessage(message) ||
    message.includes(
      "Uncaught IndexSizeError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The source width is 0",
    )
  );
});

/** @param {RawStoriesModule} storiesModule */
export async function runVisualTests(storiesModule) {
  const componentTag = storiesModule.default.component;
  const stories = getStories(storiesModule);
  const shouldRunTests = stories.some(({ storyFunction }) => storyFunction.parameters.tests.visual.enable);

  if (shouldRunTests) {
    describe(componentTag, function () {
      stories.forEach(({ storyName, storyFunction }) => {
        if (storyFunction.parameters.tests.visual.enable) {
          const storyNameWithKebabCase = kebabCase(storyName);
          describe(storyName, function () {
            describe('desktop', async function () {
              it('should have no visual changes', async function () {
                await setViewport(viewports.desktop);
                const element = await fixture(storyFunction({}, storyConf));

                const allElements = await getAllElements(element);
                await cancelAnimations(allElements);
                await waitForAllImagesLoaded(allElements).catch((error) => console.log(error.message));
                await visualDiff(element, `${componentTag}-${storyNameWithKebabCase}-desktop`);
              });
            });

            describe('mobile', async function () {
              it('should have no visual changes', async function () {
                await setViewport(viewports.mobile);
                const element = await fixture(storyFunction({}, storyConf));

                const allElements = await getAllElements(element);
                await cancelAnimations(allElements);
                await waitForAllImagesLoaded(allElements).catch((error) => console.log(error.message));
                await visualDiff(element, `${componentTag}-${storyNameWithKebabCase}-mobile`);
              });
            });
          });
        }
      });
    });
  }
}
