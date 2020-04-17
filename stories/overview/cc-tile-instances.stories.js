import '../../components/overview/cc-tile-instances.js';
import notes from '../../.components-docs/cc-tile-instances.md';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Overview|<cc-tile-instances>',
  component: 'cc-tile-instances',
  parameters: { notes },
};

const conf = {
  component: 'cc-tile-instances',
  css: `cc-tile-instances {
    display: inline-grid;
    margin-bottom: 1rem;
    margin-right: 1rem;    
    width: 275px;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [
    { instances: { running: [{ flavorName: 'nano', count: 1 }], deploying: [] } },
    { instances: { running: [], deploying: [{ flavorName: 'nano', count: 1 }] } },
    { instances: { running: [{ flavorName: 'nano', count: 1 }], deploying: [{ flavorName: 'nano', count: 1 }] } },
  ],
});

export const loading = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoadedWithStopped = makeStory(conf, {
  items: [
    { instances: { running: [], deploying: [] } },
  ],
});

export const dataLoadedWithRunning = makeStory(conf, {
  items: [
    { instances: { running: [{ flavorName: 'nano', count: 1 }], deploying: [] } },
    { instances: { running: [{ flavorName: 'S', count: 2 }], deploying: [] } },
    { instances: { running: [{ flavorName: '2XL', count: 40 }], deploying: [] } },
  ],
});

export const dataLoadedWithDeploying = makeStory(conf, {
  items: [
    { instances: { running: [], deploying: [{ flavorName: 'nano', count: 1 }] } },
    { instances: { running: [], deploying: [{ flavorName: 'S', count: 2 }] } },
    { instances: { running: [], deploying: [{ flavorName: '2XL', count: 40 }] } },
  ],
});

export const dataLoadedWithRunningAndDeploying = makeStory(conf, {
  items: [
    { instances: { running: [{ flavorName: 'nano', count: 1 }], deploying: [{ flavorName: 'nano', count: 1 }] } },
    { instances: { running: [{ flavorName: 'S', count: 2 }], deploying: [{ flavorName: 'S', count: 1 }] } },
    { instances: { running: [{ flavorName: '2XL', count: 40 }], deploying: [{ flavorName: '2XL', count: 40 }] } },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.instances = { running: [{ flavorName: 'XS', count: 1 }], deploying: [] };
      componentError.error = true;
    }),
    storyWait(1000, ([component]) => {
      component.instances = { running: [{ flavorName: 'XS', count: 2 }], deploying: [] };
    }),
    storyWait(1000, ([component]) => {
      component.instances = { running: [{ flavorName: 'XS', count: 3 }], deploying: [] };
    }),
    storyWait(3000, ([component]) => {
      component.instances = { running: [{ flavorName: 'XS', count: 3 }], deploying: [{ flavorName: 'XS', count: 1 }] };
    }),
    storyWait(1000, ([component]) => {
      component.instances = { running: [{ flavorName: 'XS', count: 3 }], deploying: [{ flavorName: 'XS', count: 2 }] };
    }),
    storyWait(1000, ([component]) => {
      component.instances = { running: [{ flavorName: 'XS', count: 3 }], deploying: [{ flavorName: 'XS', count: 3 }] };
    }),
    storyWait(3000, ([component]) => {
      component.instances = { running: [{ flavorName: 'XS', count: 3 }], deploying: [] };
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
