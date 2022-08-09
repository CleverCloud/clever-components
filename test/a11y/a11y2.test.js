import { fixture, expect } from '@open-wc/testing';
import manifest from '../../dist/custom-elements.json';
import * as storiesImported from '../../src/components/cc-button/cc-button.stories.js';
// console.log(manifest.modules.map((module) => module.path));

// manifest.modules.forEach((component) => {
//   // console.log('../../' + component.path.replace('.js', '.stories.js'));
//   // import('../../' + component.path.replace('.js', '.stories.js')).then((stories) => loopStories(stories));
// });

// import('../../src/components/cc-button/cc-button.stories.js').then((stories) => {
//   console.log('launching loop', stories);
//   loopStories(stories);
// });
// import('../../src/components/cc-button/cc-button.stories.js').then((btnStories) => {
//   console.log('btnStories', btnStories);
//   describe('btn-test', () => {
//     it('passes accessibility test', () => {
//       console.log('HELLO THERE');
//       // const element = fixtureSync(btnStories[1]({}, storyConf));
//       // console.log('element', element);
//       // expect(element).to.be.accessible();
//     });
//   });
// });

for (const module of manifest.modules) {
  describe('btn-test', () => {
    it('passes accessibility test', async () => {
      console.log('HELLO THERE');
      const componentStoriesModules = await import('../../' + module.path.replace('.js', '.stories.js'));
      const componentStories = Object.values(componentStoriesModules);
      for (const story of componentStories) {
        if (typeof story === 'function') {
          await itPassesAccess(story);
        }
      }
    });
  });

}

async function itPassesAccess (story) {
  const el = await fixture(story({}, storyConf));

  expect(el).to.be.accessible();
}

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

async function loopStories (stories) {
  // const allStories = Object.values(stories);
  // for (const story of allStories) {
  //     if (typeof story === 'function') {
  //         console.log('testin', story);
  //         it('passes accessibility test', async () => {
  //             CONSOLE.LOG('HELLO THERE');
  //             const element = await fixture(story({}, storyConf));
  //             console.log('element', element);
  //             await expect(element).to.be.accessible();
  //         });
  //     }
  // }
};

// loopStories(stories);
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
