import { fixture, fixtureSync, expect } from '@open-wc/testing';
// import manifest from '../../dist/custom-elements.json';
import manifest from './custom-elements-sample.json';
import * as en from '../../src/translations/translations.en.js';

import { addTranslations, setLanguage } from '../../src/lib/i18n.js';

// Register languages
addTranslations(en.lang, en.translations);

const storyConf = {
  globals: {
    locale: 'en',
  },
};

// BUILD STORIES TO TEST
const importResults = await Promise.allSettled(manifest.modules.reduce((moduleList, module) => {
  if (module.path.includes('smart')) {
    return moduleList;
  }

  console.log(module);

  return [...moduleList, import(`../../${module.path.replace('.js', '.stories.js')}`)];
}, []));

const allStories = importResults.reduce((stories, importResult) => {
  if (importResult.status !== 'fulfilled') {
    return stories;
  }

  return [...stories, ...Object
    .values(importResult.value)
    .filter((story) => typeof story === 'function'),
  ];
}, []);

describe('Running Accessibility tests', function () {
  allStories.forEach(function (story) {
    console.log('--- STORY ---', story);
    describe(`A11Y - Testing component ${story.component}`, function () {
      it(`A11Y - Testing story ${story.storyName}`, async () => {
        const element = fixtureSync(story({}, storyConf));
        await expect(element).to.be.accessible();
      });
    });
  });
});
