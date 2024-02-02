import './cc-heptapod-info.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 SaaS/<cc-heptapod-info>',
  component: 'cc-heptapod-info',
};

const conf = {
  component: 'cc-heptapod-info',
  // language=CSS
  css: `
    cc-heptapod-info {
      max-width: 40em;
    }
  `,
};

const statistics = {
  privateActiveUsers: 12,
  publicActiveUsers: 120,
  // 666.6 MB
  storage: 698980762,
  price: 17.50,
};

export const defaultStory = makeStory(conf, {
  items: [{ statistics }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const notUsed = makeStory(conf, {
  items: [{ statistics: 'not-used' }],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(2000, ([component, componentNotUsed, componentError]) => {
      component.statistics = statistics;
      componentNotUsed.statistics = 'not-used';
      componentError.error = true;
    }),
  ],
});
