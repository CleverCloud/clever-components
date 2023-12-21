import './cc-tile-instances.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Overview/<cc-tile-instances>',
  component: 'cc-tile-instances',
};

const conf = {
  component: 'cc-tile-instances',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-tile-instances {
      width: 275px;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { state: { type: 'loaded', running: [{ flavorName: 'nano', count: 1 }], deploying: [] } },
    { state: { type: 'loaded', running: [], deploying: [{ flavorName: 'nano', count: 1 }] } },
    { state: { type: 'loaded', running: [{ flavorName: 'nano', count: 1 }], deploying: [{ flavorName: 'nano', count: 1 }] } },
  ],
});

export const loading = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const dataLoadedWithStopped = makeStory(conf, {
  items: [
    { state: { type: 'loaded', running: [], deploying: [] } },
  ],
});

export const dataLoadedWithRunning = makeStory(conf, {
  items: [
    { state: { type: 'loaded', running: [{ flavorName: 'nano', count: 1 }], deploying: [] } },
    { state: { type: 'loaded', running: [{ flavorName: 'S', count: 2 }], deploying: [] } },
    { state: { type: 'loaded', running: [{ flavorName: '2XL', count: 40 }], deploying: [] } },
  ],
});

export const dataLoadedWithDeploying = makeStory(conf, {
  items: [
    { state: { type: 'loaded', running: [], deploying: [{ flavorName: 'nano', count: 1 }] } },
    { state: { type: 'loaded', running: [], deploying: [{ flavorName: 'S', count: 2 }] } },
    { state: { type: 'loaded', running: [], deploying: [{ flavorName: '2XL', count: 40 }] } },
  ],
});

export const dataLoadedWithRunningAndDeploying = makeStory(conf, {
  items: [
    { state: { type: 'loaded', running: [{ flavorName: 'nano', count: 1 }], deploying: [{ flavorName: 'nano', count: 1 }] } },
    { state: { type: 'loaded', running: [{ flavorName: 'S', count: 2 }], deploying: [{ flavorName: 'S', count: 1 }] } },
    { state: { type: 'loaded', running: [{ flavorName: '2XL', count: 40 }], deploying: [{ flavorName: '2XL', count: 40 }] } },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.state = { type: 'loaded', running: [{ flavorName: 'XS', count: 1 }], deploying: [] };
      componentError.state = { type: 'error' };
    }),
    storyWait(1000, ([component]) => {
      component.state = { type: 'loaded', running: [{ flavorName: 'XS', count: 2 }], deploying: [] };
    }),
    storyWait(1000, ([component]) => {
      component.state = { type: 'loaded', running: [{ flavorName: 'XS', count: 3 }], deploying: [] };
    }),
    storyWait(3000, ([component]) => {
      component.state = { type: 'loaded', running: [{ flavorName: 'XS', count: 3 }], deploying: [{ flavorName: 'XS', count: 1 }] };
    }),
    storyWait(1000, ([component]) => {
      component.state = { type: 'loaded', running: [{ flavorName: 'XS', count: 3 }], deploying: [{ flavorName: 'XS', count: 2 }] };
    }),
    storyWait(1000, ([component]) => {
      component.state = { type: 'loaded', running: [{ flavorName: 'XS', count: 3 }], deploying: [{ flavorName: 'XS', count: 3 }] };
    }),
    storyWait(3000, ([component]) => {
      component.state = { type: 'loaded', running: [{ flavorName: 'XS', count: 3 }], deploying: [] };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loading,
  error,
  dataLoadedWithStopped,
  dataLoadedWithRunning,
  dataLoadedWithDeploying,
  dataLoadedWithRunningAndDeploying,
  simulations,
});
