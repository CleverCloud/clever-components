import './cc-logs-simple.js';
import './cc-logs-simple.smart.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Logs/<cc-logs-simple>',
  component: 'cc-logs-simple',
};

const conf = {
  component: 'cc-logs-simple',
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
