import { makeStory } from '../../stories/lib/make-story.js';
import './cc-oauth-consumer.js';

export default {
  tags: ['autodocs'],
  title: '🛠 oAuth Consumer/<cc-oauth-consumer>',
  component: 'cc-oauth-consumer',
};

const conf = {
  component: 'cc-oauth-consumer',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        name: 'My oAuth Consumer',
        homePageUrl: 'http://toto.com',
        appBaseUrl: 'http://toto.com',
        description: 'lorem',
        image: 'toto',
        options: [],
        key: 'key',
        secret: 'secret',
      },
    },
  ],
});

export const loadedStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
      },
    },
  ],
});

export const loadingStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const errorStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});

export const dataLoadedStory = makeStory(conf, {});
