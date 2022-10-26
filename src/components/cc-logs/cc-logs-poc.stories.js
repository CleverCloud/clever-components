import './cc-logs-poc.js';
import './cc-logs-poc.smart.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Logs/<cc-logs-poc>',
  component: 'cc-logs-poc',
};

const conf = {
  component: 'cc-logs-poc',
  displayMode: 'flex-wrap',
};

export const defaultStory = makeStory(conf, {
  items: [
    { },
  ],
});

enhanceStoriesNames({
  defaultStory,
});
