import { fixture, expect, aTimeout } from '@open-wc/testing';
import {
  defaultStory as story,
} from '../../src/components/cc-zone-input/cc-zone-input.stories.js';
import { addTranslations } from '../../src/lib/i18n.js';
import * as en from '../../src/translations/translations.en.js';

// Register languages
addTranslations(en.lang, en.translations);

const storyConf = {
  globals: {
    locale: 'en',
  },
};

before(() => {
  const e = window.onerror;
  window.onerror = function (err) {
    if (err === 'ResizeObserver loop limit exceeded') {
      console.warn('Ignored: ResizeObserver loop limit exceeded');
      return false;
    }
    else {
      return e(...arguments);
    }
  };
});

describe(`Component: ${story.component}`, function () {
  it(`Story: ${story.storyName}`, async () => {

    const element = await fixture(story({}, storyConf));
    await expect(element).to.be.accessible();
  });
});
