import './cc-logs-view.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Logs/<cc-logs-view>',
  component: 'cc-logs-view',
};

const conf = {
  component: 'cc-logs-view',
  // language=CSS
  css: `
    cc-logs-view {
      height: 500px;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    {},
  ],
});

enhanceStoriesNames({
  defaultStory,
});
