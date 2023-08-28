import { expect, fixture, elementUpdated } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { addTranslations } from '../../src/lib/i18n.js';
import * as en from '../../src/translations/translations.en.js';

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

const storyConf = {
  globals: {
    locale: 'en',
  },
};

// Register languages
addTranslations(en.lang, en.translations);

// Catch irrelevant issues that could make tests fails
before(() => {
  const e = window.onerror;
  window.onerror = function (err) {
    switch (err) {
      case 'ResizeObserver loop limit exceeded':
        return false;
      case 'ResizeObserver loop completed with undelivered notifications.':
        return false;
      case 'Uncaught IndexSizeError: Failed to execute \'getImageData\' on \'CanvasRenderingContext2D\': The source width is 0.':
        return false;
      default:
        return e(...arguments);
    }
  };
});

/**
 * Loop through stories to run accessibility tests on their content both on desktop and mobile
 *
 * @param {Array} stories the story functions to execute and run a11y test
 * @param {Array} ignoredRules names of the rules to ignore
 */
export const testAccessibility = (stories, ignoredRules) => {
  stories.forEach((story) => {
    describe(`Story: ${story.storyName}`, function () {
      describe(`Accessibility`, function () {
        it(`Desktop: width = ${viewports.desktop.width} height = ${viewports.desktop.height}`, async function () {
          await setViewport(viewports.desktop);
          const element = await fixture(story({}, storyConf));

          await elementUpdated(element);

          await expect(element).to.be.accessible({ ignoredRules });
        });

        it(`Mobile: width = ${viewports.mobile.width} height = ${viewports.mobile.height}`, async function () {
          await setViewport(viewports.mobile);
          const element = await fixture(story({}, storyConf));

          await elementUpdated(element);

          await expect(element).to.be.accessible({ ignoredRules });
        });
      });
    });
  });
};
