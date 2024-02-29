import './cc-matomo-info.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-matomo-info>',
  component: 'cc-matomo-info',
};

const conf = {
  component: 'cc-matomo-info',
};

const matomoUrl = 'https://my-matomo.example.com';
const phpUrl = '/php';
const mysqlUrl = '/mysql';
const redisUrl = '/redis';

export const defaultStory = makeStory(conf, {
  items: [{
    state: {
      type: 'loaded',
      matomoUrl,
      phpUrl,
      mysqlUrl,
      redisUrl,
    },
  }],
});

export const skeleton = makeStory(conf, {
  items: [{
    state: {
      type: 'loading',
    },
  }],
});

export const errorStory = makeStory(conf, {
  items: [{
    state: {
      type: 'error',
    },
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.state = {
        type: 'loaded',
        matomoUrl,
        phpUrl,
        mysqlUrl,
        redisUrl,
      };
      componentError.state = {
        type: 'error',
      };
    }),
  ],
});
