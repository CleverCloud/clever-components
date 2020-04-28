import '../../src/addon/cc-elasticsearch-options.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Addon|<cc-elasticsearch-options>',
  component: 'cc-elasticsearch-options',
};

const conf = {
  component: 'cc-elasticsearch-options',
  events: ['cc-elasticsearch-options:submit'],
};

export const defaultStory = makeStory(conf, {
  items: [{
    kibanaFlavor: { name: 'L', mem: 8192, cpus: 6, gpus: 0, microservice: false, monthlyCost: 144 },
    apmFlavor: { name: 'M', mem: 4096, cpus: 4, gpus: 0, microservice: false, monthlyCost: 72 },
  }],
});

export const noFlavorDetailsYet = makeStory(conf, {
  items: [{}],
});

enhanceStoriesNames({
  defaultStory,
  noFlavorDetailsYet,
});
