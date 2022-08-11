import { fixture, expect } from '@open-wc/testing';
import manifest from '../../dist/custom-elements.json';
// import manifest from './custom-elements-sample.json';
import * as en from '../../src/translations/translations.en.js';

import { addTranslations } from '../../src/lib/i18n.js';

// Register languages
addTranslations(en.lang, en.translations);

const storyConf = {
  globals: {
    locale: 'en',
  },
};

// Import all content from stories files
const importResults = await Promise.allSettled(manifest.modules.reduce((moduleList, module) => {
  if (module.path.includes('smart')) {
    return moduleList;
  }

  return [...moduleList, import(`../../${module.path.replace('.js', '.stories.js')}`)];
}, []));

// Only keep stories
const allStories = importResults.reduce((stories, importResult) => {
  if (importResult.status !== 'fulfilled') {
    return stories;
  }

  return [
      ...stories,
      ...Object
        .values(importResult.value)
        .filter((story) => typeof story === 'function' && !story?.storyName?.includes('Simulations')  && !story?.storyName?.includes('Not a story') && story.storyName != null && story.storyName !== 'undefined' && story.component != null && story.component !== 'undefined' && story.component !== 'cc-invoice-list' && story.component !== 'cc-invoice-table' && story.component !== 'cc-pricing-estimation'&& story.component !== 'cc-zone-input'),
  ];
}, []);

// Run test on all stories
describe('A11Y tests', function () {
  allStories.forEach(function (story) {
    describe(`Component -- ${story.component}`, function () {
      it(`Story -- ${story.storyName}`, async () => {
        const element = await fixture(story({}, storyConf));

        await expect(element).to.be.accessible({
          ignoredRules: ['color-contrast'],
        });
      });
    });
  });
});
