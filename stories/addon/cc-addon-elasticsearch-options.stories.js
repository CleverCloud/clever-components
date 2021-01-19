import '../../src/addon/cc-addon-elasticsearch-options.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Addon/<cc-addon-elasticsearch-options>',
  component: 'cc-addon-elasticsearch-options',
};

const conf = {
  component: 'cc-addon-elasticsearch-options',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      options: [
        {
          name: 'kibana',
          enabled: false,
          flavor: { name: 'L', mem: 8192, cpus: 6, gpus: 0, microservice: false, monthlyCost: 144 },
        },
        {
          name: 'apm',
          enabled: false,
          flavor: { name: 'M', mem: 4096, cpus: 4, gpus: 0, microservice: false, monthlyCost: 72 },
        },
        {
          name: 'encryption',
          enabled: false,
          price: 10.00,
        },
      ],
    },
  ],
});

export const noFlavorDetailsYet = makeStory(conf, {
  items: [
    {
      options: [
        {
          name: 'kibana',
          enabled: false,
        },
        {
          name: 'apm',
          enabled: false,
        },
        {
          name: 'encryption',
          enabled: false,
          price: 10.00,
        },
      ],
    },
  ],
});

export const preselectedKibana = makeStory(conf, {
  items: [
    {
      options: [
        {
          name: 'kibana',
          enabled: true,
          flavor: { name: 'L', mem: 8192, cpus: 6, gpus: 0, microservice: false, monthlyCost: 144 },
        },
        {
          name: 'apm',
          enabled: false,
          flavor: { name: 'M', mem: 4096, cpus: 4, gpus: 0, microservice: false, monthlyCost: 72 },
        },
        {
          name: 'encryption',
          enabled: false,
          price: 10.00,
        },
      ],
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
  noFlavorDetailsYet,
});
