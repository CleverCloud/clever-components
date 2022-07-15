import '../../src/addon/cc-matomo-info.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Addon/<cc-matomo-info>',
  component: 'cc-matomo-info',
};

const conf = {
  component: 'cc-matomo-info',
};

const matomoLink = 'https://my-matomo.example.com';
const phpLink = '/php';
const mysqlLink = '/mysql';
const redisLink = '/redis';

export const defaultStory = makeStory(conf, {
  items: [{ matomoLink, phpLink, mysqlLink, redisLink }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const errorStory = makeStory(conf, {
  items: [{ error: true }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.matomoLink = matomoLink;
      component.phpLink = phpLink;
      component.mysqlLink = mysqlLink;
      component.redisLink = redisLink;
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  errorStory,
  simulations,
});
