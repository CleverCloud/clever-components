import '../../components/overview/cc-tile-instances.js';
import notes from '../../.components-docs/cc-tile-instances.md';
import { createContainer } from '../lib/dom.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { sequence } from '../lib/sequence.js';

function createComponent (instances) {
  const component = document.createElement('cc-tile-instances');
  component.style.width = '275px';
  component.style.display = 'inline-grid';
  component.style.marginBottom = '1rem';
  component.style.marginRight = '1rem';
  component.instances = instances;
  return component;
}

export default {
  title: '2. Overview|<cc-tile-instances>',
  parameters: { notes },
};

export const skeleton = () => {
  return createComponent();
};

export const error = () => {
  const component = createComponent();
  component.error = true;
  return component;
};

export const dataLoaded = () => {
  return createContainer([
    'Stopped',
    createComponent({
      running: [],
      deploying: [],
    }),
    'Just deploying',
    createComponent({
      running: [],
      deploying: [{ flavorName: 'nano', count: 1 }],
    }),
    createComponent({
      running: [],
      deploying: [{ flavorName: 'S', count: 2 }],
    }),
    createComponent({
      running: [],
      deploying: [{ flavorName: '2XL', count: 3 }],
    }),
    'Just running',
    createComponent({
      running: [{ flavorName: 'nano', count: 1 }],
      deploying: [],
    }),
    createComponent({
      running: [{ flavorName: 'S', count: 2 }],
      deploying: [],
    }),
    createComponent({
      running: [{ flavorName: '2XL', count: 3 }],
      deploying: [],
    }),
    'Deploying and running',
    createComponent({
      running: [{ flavorName: 'nano', count: 1 }],
      deploying: [{ flavorName: 'nano', count: 1 }],
    }),
    createComponent({
      running: [{ flavorName: 'S', count: 2 }],
      deploying: [{ flavorName: 'S', count: 1 }],
    }),
    createComponent({
      running: [{ flavorName: '2XL', count: 3 }],
      deploying: [{ flavorName: '2XL', count: 2 }],
    }),
  ]);
};

export const simulations = () => {
  const errorComponent = createComponent();
  const component = createComponent();

  sequence(async wait => {
    await wait(2000);
    errorComponent.error = true;
    component.instances = {
      running: [{ flavorName: 'XS', count: 1 }],
      deploying: [],
    };

    await wait(1000);
    component.instances = {
      running: [{ flavorName: 'XS', count: 2 }],
      deploying: [],
    };

    await wait(1000);
    component.instances = {
      running: [{ flavorName: 'XS', count: 3 }],
      deploying: [],
    };

    await wait(3000);

    component.instances = {
      running: [{ flavorName: 'XS', count: 3 }],
      deploying: [{ flavorName: 'XS', count: 1 }],
    };

    await wait(1000);
    component.instances = {
      running: [{ flavorName: 'XS', count: 3 }],
      deploying: [{ flavorName: 'XS', count: 2 }],
    };

    await wait(1000);
    component.instances = {
      running: [{ flavorName: 'XS', count: 3 }],
      deploying: [{ flavorName: 'XS', count: 3 }],
    };

    await wait(3000);
    component.instances = {
      running: [{ flavorName: 'XS', count: 3 }],
      deploying: [],
    };
  });

  return createContainer([
    'Loading, then error',
    errorComponent,
    'Loading, then running, then deploying, then just running',
    component,
  ]);
};

enhanceStoriesNames({ skeleton, error, dataLoaded, simulations });
