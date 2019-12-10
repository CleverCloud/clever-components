import '../../components/overview/cc-tile-scalability.js';
import notes from '../../.components-docs/cc-tile-scalability.md';
import { createContainer } from '../lib/dom.js';
import { sequence } from '../lib/sequence.js';

const flavors = {
  pico: {
    name: 'pico',
    mem: 256,
    cpus: 1,
    gpus: 0,
    microservice: true,
  },
  nano: {
    name: 'nano',
    mem: 512,
    cpus: 1,
    gpus: 0,
    microservice: true,
  },
  XS: {
    name: 'XS',
    mem: 1024,
    cpus: 1,
    gpus: 0,
    microservice: false,
  },
  S: {
    name: 'S',
    mem: 2048,
    cpus: 2,
    gpus: 0,
    microservice: false,
  },
  M: {
    name: 'M',
    mem: 4096,
    cpus: 4,
    gpus: 0,
    microservice: false,
  },
  L: {
    name: 'L',
    mem: 8192,
    cpus: 6,
    gpus: 0,
    microservice: false,
  },
  XL: {
    name: 'XL',
    mem: 16384,
    cpus: 8,
    gpus: 0,
    microservice: false,
  },
  '2XL': {
    name: '2XL',
    mem: 24576,
    cpus: 12,
    gpus: 0,
    microservice: false,
  },
  '3XL': {
    name: '3XL',
    mem: 32768,
    cpus: 16,
    gpus: 0,
    microservice: false,
  },
  ML_XS: {
    name: 'ML_XS',
    mem: 6144,
    cpus: 8,
    gpus: 1,
    microservice: false,
  },
  ML_S: {
    name: 'ML_S',
    mem: 14336,
    cpus: 8,
    gpus: 1,
    microservice: false,
  },
  ML_M: {
    name: 'ML_M',
    mem: 22528,
    cpus: 16,
    gpus: 2,
    microservice: false,
  },
  ML_L: {
    name: 'ML_L',
    mem: 26624,
    cpus: 16,
    gpus: 2,
    microservice: false,
  },
  ML_XL: {
    name: 'ML_XL',
    mem: 36864,
    cpus: 24,
    gpus: 3,
    microservice: false,
  },
  ML_2XL: {
    name: 'ML_2XL',
    mem: 40960,
    cpus: 24,
    gpus: 3,
    microservice: false,
  },
  ML_3XL: {
    name: 'ML_3XL',
    mem: 53248,
    cpus: 32,
    gpus: 4,
    microservice: false,
  },
};

function createComponent (scalability) {
  const component = document.createElement('cc-tile-scalability');
  component.style.width = '275px';
  component.style.display = 'inline-grid';
  component.style.marginBottom = '1rem';
  component.style.marginRight = '1rem';
  component.scalability = scalability;
  return component;
}

export default {
  title: '2. Overview|<cc-tile-scalability>',
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
    'No auto-scalability',
    createComponent({
      minFlavor: flavors.pico,
      maxFlavor: flavors.pico,
      minInstances: 1,
      maxInstances: 1,
    }),
    createComponent({
      minFlavor: flavors.S,
      maxFlavor: flavors.S,
      minInstances: 2,
      maxInstances: 2,
    }),
    createComponent({
      minFlavor: flavors['2XL'],
      maxFlavor: flavors['2XL'],
      minInstances: 3,
      maxInstances: 3,
    }),
    'Horizontal scalability',
    createComponent({
      minFlavor: flavors.pico,
      maxFlavor: flavors.pico,
      minInstances: 1,
      maxInstances: 2,
    }),
    createComponent({
      minFlavor: flavors.S,
      maxFlavor: flavors.S,
      minInstances: 2,
      maxInstances: 4,
    }),
    createComponent({
      minFlavor: flavors['2XL'],
      maxFlavor: flavors['2XL'],
      minInstances: 3,
      maxInstances: 6,
    }),
    'Vertical scalability',
    createComponent({
      minFlavor: flavors.pico,
      maxFlavor: flavors.S,
      minInstances: 1,
      maxInstances: 1,
    }),
    createComponent({
      minFlavor: flavors.S,
      maxFlavor: flavors.L,
      minInstances: 2,
      maxInstances: 2,
    }),
    createComponent({
      minFlavor: flavors['2XL'],
      maxFlavor: flavors['3XL'],
      minInstances: 3,
      maxInstances: 3,
    }),
    'Horizontal & vertical scalability',
    createComponent({
      minFlavor: flavors.pico,
      maxFlavor: flavors.S,
      minInstances: 1,
      maxInstances: 2,
    }),
    createComponent({
      minFlavor: flavors.S,
      maxFlavor: flavors.L,
      minInstances: 2,
      maxInstances: 4,
    }),
    createComponent({
      minFlavor: flavors['2XL'],
      maxFlavor: flavors['3XL'],
      minInstances: 3,
      maxInstances: 6,
    }),
  ]);
};

export const dataLoadedWithMachineLearningFlavors = () => {
  return createContainer([
    'No auto-scalability',
    createComponent({
      minFlavor: flavors.ML_XS,
      maxFlavor: flavors.ML_XS,
      minInstances: 1,
      maxInstances: 1,
    }),
    createComponent({
      minFlavor: flavors.ML_S,
      maxFlavor: flavors.ML_S,
      minInstances: 2,
      maxInstances: 2,
    }),
    createComponent({
      minFlavor: flavors.ML_2XL,
      maxFlavor: flavors.ML_2XL,
      minInstances: 3,
      maxInstances: 3,
    }),
    'Horizontal scalability',
    createComponent({
      minFlavor: flavors.ML_XS,
      maxFlavor: flavors.ML_XS,
      minInstances: 1,
      maxInstances: 2,
    }),
    createComponent({
      minFlavor: flavors.ML_S,
      maxFlavor: flavors.ML_S,
      minInstances: 2,
      maxInstances: 4,
    }),
    createComponent({
      minFlavor: flavors.ML_2XL,
      maxFlavor: flavors.ML_2XL,
      minInstances: 3,
      maxInstances: 6,
    }),
    'Vertical scalability',
    createComponent({
      minFlavor: flavors.ML_XS,
      maxFlavor: flavors.ML_S,
      minInstances: 1,
      maxInstances: 1,
    }),
    createComponent({
      minFlavor: flavors.ML_S,
      maxFlavor: flavors.ML_L,
      minInstances: 2,
      maxInstances: 2,
    }),
    createComponent({
      minFlavor: flavors.ML_2XL,
      maxFlavor: flavors.ML_3XL,
      minInstances: 3,
      maxInstances: 3,
    }),
    'Horizontal & vertical scalability',
    createComponent({
      minFlavor: flavors.ML_XS,
      maxFlavor: flavors.ML_S,
      minInstances: 1,
      maxInstances: 2,
    }),
    createComponent({
      minFlavor: flavors.ML_S,
      maxFlavor: flavors.ML_L,
      minInstances: 2,
      maxInstances: 4,
    }),
    createComponent({
      minFlavor: flavors.ML_2XL,
      maxFlavor: flavors.ML_3XL,
      minInstances: 3,
      maxInstances: 6,
    }),
  ]);
};

export const simulations = () => {
  const errorComponent = createComponent();
  const component = createComponent();

  sequence(async wait => {
    await wait(2000);
    errorComponent.error = true;
    component.scalability = {
      minFlavor: flavors.pico,
      maxFlavor: flavors.XL,
      minInstances: 2,
      maxInstances: 3,
    };
  });

  return createContainer([
    'Loading, then error',
    errorComponent,
    'Loading, then some data',
    component,
  ]);
};

