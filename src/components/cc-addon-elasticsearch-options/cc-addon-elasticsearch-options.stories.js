import './cc-addon-elasticsearch-options.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
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
        },
      ],
    },
  ],
});
