import { isResizeObserverLoopErrorMessage } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { addTranslations } from '../../src/lib/i18n/i18n.js';
import * as en from '../../src/translations/translations.en.js';
import { getStories, setupIgnoreIrrelevantErrors, storyConf, viewports } from './story-testing-utils.js';

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
export async function runA11yTests(storiesModule) {
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
