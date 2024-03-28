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
  items: [{
    state: {
      type: 'loaded',
      statistics: statistics,
    },
  }],
});

export const skeleton = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
});

export const notUsed = makeStory(conf, {
  items: [{ state: { type: 'not-used' } }],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(2000, ([component, componentNotUsed, componentError]) => {
      component.state = {
        type: 'loaded',
        statistics: statistics,
      };
      componentNotUsed.state = { type: 'not-used' };
      componentError.state = { type: 'error' };
    }),
  ],
});
