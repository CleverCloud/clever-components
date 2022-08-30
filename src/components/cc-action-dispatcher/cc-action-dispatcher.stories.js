import './cc-action-dispatcher.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Action Dispatcher/<cc-action-dispatcher>',
  component: 'cc-action-dispatcher',
};

const conf = {
  component: 'cc-action-dispatcher',
};

const exampleResponse = {
  numberOfPings: 20,
  numberOfPongs: 17,
  unresponsiveInstances: [
    '4cf96434-4692-4e09-86d2-5d1777e200c2',
    '40bc890c-8785-4a69-8586-06d7d25f0c8b',
    '2cddf144-01ba-4462-8325-14914507a973',
  ],
};

export const defaultStory = makeStory(conf, {
  items: [{}],
});

export const waiting = makeStory(conf, {
  items: [{ waiting: true }],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoaded = makeStory(conf, {
  items: [{
    response: exampleResponse,
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.waiting = true;
      componentError.waiting = true;
    }),
    storyWait(2000, ([component, componentError]) => {
      component.response = exampleResponse;
      componentError.error = true;
      component.waiting = false;
      componentError.waiting = false;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  waiting,
  error,
  dataLoaded,
  simulations,
});
