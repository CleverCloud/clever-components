// Don't forget to import the component you're presenting!
import '../../src/saas/cc-heptapod-info.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 SaaS/<cc-heptapod-info>',
  component: 'cc-heptapod-info',
};

const conf = {
  component: 'cc-heptapod-info',
};

const statistics = {
  private_active_users: 12,
  public_active_users: 120,
  // 666.6 MB
  storage: 698966016,
  price: 17.50,
};

export const defaultStory = makeStory(conf, {
  items: [{ loading: false, statistics }],
});

export const loading = makeStory(conf, {
  items: [{ loading: true }],
});

export const empty = makeStory(conf, {
  items: [{ loading: false }],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(2000, ([component, componentNotUsed, componentError]) => {
      component.loading = false;
      component.statistics = statistics;

      componentNotUsed.loading = false;
      componentNotUsed.statistics = null;

      componentError.loading = false;
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loading,
  error,
  empty,
  simulations,
});
