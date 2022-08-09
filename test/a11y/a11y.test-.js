import { fixture, expect } from '@open-wc/testing';
import manifest from '../../dist/custom-elements.json';
import * as stories from '../../src/components/cc-button/cc-button.stories.js';
// console.log(manifest.modules.map((module) => module.path));

// manifest.modules.forEach((component) => {
//   // console.log('../../' + component.path.replace('.js', '.stories.js'));
//   // import('../../' + component.path.replace('.js', '.stories.js')).then((stories) => loopStories(stories));
// });

// import('../../src/components/cc-button/cc-button.stories.js').then((stories) => {
//   console.log('launching loop');
//   loopStories(stories);
// });

const storyConf = {
  globals: {
    locale: {
      name: 'Language',
      description: 'i18n language',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: 'en',
      },
    },
  },
};

function loopStories (stories) {
  const allStories = Object.values(stories);
  console.log('looping', allStories);
  for (const story of allStories) {
    if (typeof story === 'function') {
      console.log('testing', story);
      it('passes accessibility test', async () => {
        const element = await fixture(story({}, storyConf));
        console.log('element', element);
        await expect(element).to.be.accessible();
      });
    }
  }
};

loopStories(stories);
// const testOne = async function (story) {
//   if (typeof story === 'function') {
//     console.log(story);
//     console.log(story({}, storyConf));
//     const element = await fixture(story({}, storyConf));
//     console.log(element);
//     test(element);
//   }
//   else {
//   }
// };
// testOne(Object.values(stories)[16]);

// async function test (element) {
//   it('passes accessibility test', async () => {
//     await expect(element).to.be.accessible();
//   });
// }
// it('passes accessibility test', async () => {
//   const el = await getStory(story);
//   await expect(el).to.be.accessible();
// });
