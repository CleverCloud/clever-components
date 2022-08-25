import './cc-pricing-product-consumption.smart.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-product-consumption>',
  component: 'cc-pricing-product-consumption',
};

const conf = {
  component: 'cc-pricing-product-consumption',
};

const THIRTY_DAYS_IN_HOURS = 24 * 30;
const ONE_GIGABYTE = 1e9;

const baseCellar = {
  name: 'Cellar',
  icon: 'https://assets.clever-cloud.com/logos/cellar.svg',
  sections: [
    {
      type: 'storage',
      intervals: [
        {
          minRange: 0,
          maxRange: 100 * 1e6,
          price: 0 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
        {
          minRange: 100 * 1e6,
          maxRange: 1e12,
          price: 0.00002844444444444444 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
        {
          minRange: 1e12,
          maxRange: 25 * 1e12,
          price: 0.00002133333333333333 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
        {
          minRange: 25 * 1e12,
          price: 0.00001422222222222222 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
      ],
    },
    {
      type: 'outbound-traffic',
      intervals: [
        {
          minRange: 0,
          maxRange: 10 * 1e12,
          price: 0.09 / ONE_GIGABYTE,
        },
        {
          minRange: 10 * 1e12,
          price: 0.07 / ONE_GIGABYTE,
        },
      ],
    },
  ],
};

const baseFsBucket = {
  name: 'FS Bucket',
  icon: 'https://assets.clever-cloud.com/logos/fsbucket.svg',
  sections: [
    {
      type: 'storage',
      intervals: [
        {
          minRange: 0,
          maxRange: 100 * 1e6,
          price: 0 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
        {
          minRange: 100 * 1e6,
          price: 0.0020833333333333333 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
      ],
    },
  ],
};

const basePulsar = {
  name: 'Pulsar',
  icon: 'https://assets.clever-cloud.com/logos/pulsar.svg',
  sections: [
    {
      type: 'storage',
      intervals: [
        {
          minRange: 0,
          maxRange: 256000000,
          price: 0 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
        {
          minRange: 256000000,
          maxRange: 50000000000,
          price: 0.00027777777777777778 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
        {
          minRange: 50000000000,
          maxRange: 250000000000,
          price: 0.0002083333333333333 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
        {
          minRange: 250000000000,
          maxRange: 1000000000000,
          price: 0.0001666666666666666 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
        {
          minRange: 1000000000000,
          price: 0.00013888888888888889 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
      ],
    },
    {
      type: 'inbound-traffic',
      intervals: [
        {
          minRange: 0,
          maxRange: 500000000,
          price: 0 / ONE_GIGABYTE,
        },
        {
          minRange: 500000000,
          maxRange: 100000000000,
          price: 0.8000000000000000 / ONE_GIGABYTE,
        },
        {
          minRange: 100000000000,
          maxRange: 500000000000,
          price: 0.50000000000000000000 / ONE_GIGABYTE,
        },
        {
          minRange: 500000000000,
          maxRange: 5000000000000,
          price: 0.4000000000000000 / ONE_GIGABYTE,
        },
        {
          minRange: 5000000000000,
          price: 0.3000000000000000 / ONE_GIGABYTE,
        },
      ],
    },
    {
      type: 'outbound-traffic',
      intervals: [
        {
          minRange: 0,
          maxRange: 500000000,
          price: 0 / ONE_GIGABYTE,
        },
        {
          minRange: 500000000,
          maxRange: 100000000000,
          price: 0.8000000000000000 / ONE_GIGABYTE,
        },
        {
          minRange: 100000000000,
          maxRange: 500000000000,
          price: 0.50000000000000000000 / ONE_GIGABYTE,
        },
        {
          minRange: 500000000000,
          maxRange: 5000000000000,
          price: 0.4000000000000000 / ONE_GIGABYTE,
        },
        {
          minRange: 5000000000000,
          price: 0.3000000000000000 / ONE_GIGABYTE,
        },
      ],
    },
  ],
};

const baseHeptapod = {
  name: 'Heptapod',
  icon: 'https://assets.clever-cloud.com/logos/heptapod.svg',
  sections: [
    {
      type: 'storage',
      intervals: [
        {
          minRange: 0,
          maxRange: 1 * 1e9,
          price: 0 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
        {
          minRange: 1 * 1e9,
          price: 0.00002777777777777778 * THIRTY_DAYS_IN_HOURS / ONE_GIGABYTE,
        },
      ],
    },
    {
      type: 'private-users',
      progressive: true,
      intervals: [
        {
          minRange: 0,
          price: 7,
        },
      ],
    },
    {
      type: 'public-users',
      progressive: true,
      secability: 100,
      intervals: [
        {
          minRange: 0,
          maxRange: 101,
          price: 0,
        },
        {
          minRange: 101,
          price: 0.07,
        },
      ],
    },
  ],
};

export const defaultStory = makeStory(conf, {
  items: [baseCellar],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const skeletonWithCellar = makeStory(conf, {
  items: [{
    ...baseCellar,
    sections: baseCellar.sections.map(({ type }) => ({ type })),
  }],
});

export const skeletonWithFsBucket = makeStory(conf, {
  items: [{
    ...baseFsBucket,
    sections: baseFsBucket.sections.map(({ type }) => ({ type })),
  }],
});

export const skeletonWithPulsar = makeStory(conf, {
  items: [{
    ...basePulsar,
    sections: basePulsar.sections.map(({ type }) => ({ type })),
  }],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const errorWithCellar = makeStory(conf, {
  items: [{
    ...baseCellar,
    sections: baseCellar.sections.map(({ type }) => ({ type })),
    error: true,
  }],
});

export const errorWithFsBucket = makeStory(conf, {
  items: [{
    ...baseFsBucket,
    sections: baseFsBucket.sections.map(({ type }) => ({ type })),
    error: true,
  }],
});

export const errorWithPulsar = makeStory(conf, {
  items: [{
    ...basePulsar,
    sections: basePulsar.sections.map(({ type }) => ({ type })),
    error: true,
  }],
});

export const dataLoadedWithFsBucket = makeStory(conf, {
  items: [baseFsBucket],
});

export const dataLoadedWithPulsar = makeStory(conf, {
  items: [basePulsar],
});

export const dataLoadedWithHeptapod = makeStory(conf, {
  items: [baseHeptapod],
});

export const dataLoadedWithCustomHead = makeStory(conf, {
  items: [{
    ...baseCellar,
    innerHTML: `<div slot="head" style="padding: 1rem; background-color: lime;">The whole head section can be overriden with the head slot...</div>`,
  }],
});

export const dataLoadedWithEmptyHead = makeStory(conf, {
  items: [{
    ...baseCellar,
    innerHTML: `<div slot="head"></div>`,
  }],
});

export const dataLoadedWithCustomDescription = makeStory(conf, {
  items: [{
    ...baseCellar,
    innerHTML: 'Description can be overriden with default slot...',
  }],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  // language=CSS
  css: `
    cc-pricing-product-consumption {
      border-radius: 5px;
      box-shadow: 0 0 5px #aaa;
      overflow: hidden;
    }
  `,
  items: [{
    ...baseCellar,
    innerHTML: 'Description can be overriden with default slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris.',
  }],
});

export const dataLoadedWithNoAction = makeStory(conf, {
  items: [{
    ...baseCellar,
    action: 'none',
  }],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [{
    ...baseCellar,
    currency: { code: 'USD', changeRate: 1.25 },
  }],
});

export const simulationsWithCellar = makeStory(conf, {
  items: [{
    innerHTML: 'Cellar is an awesome object storage service!',
  }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.icon = baseCellar.icon;
      component.name = baseCellar.name;
      component.sections = baseCellar.sections.map(({ type }) => ({ type }));
    }),
    storyWait(3000, ([component]) => {
      component.sections = baseCellar.sections;
    }),
  ],
});

export const simulationsWithFsBucket = makeStory(conf, {
  items: [{
    innerHTML: 'FS bucket is an awesome service!',
  }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.icon = baseFsBucket.icon;
      component.name = baseFsBucket.name;
      component.sections = baseFsBucket.sections.map(({ type }) => ({ type }));
    }),
    storyWait(3000, ([component]) => {
      component.sections = baseFsBucket.sections;
    }),
  ],
});

export const simulationsWithPulsar = makeStory(conf, {
  items: [{
    innerHTML: 'Pulsar is an awesome service!',
  }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.icon = basePulsar.icon;
      component.name = basePulsar.name;
      component.sections = basePulsar.sections.map(({ type }) => ({ type }));
    }),
    storyWait(3000, ([component]) => {
      component.sections = basePulsar.sections;
    }),
  ],
});

export const simulationsWithError = makeStory(conf, {
  items: [{
    innerHTML: 'Cellar is an awesome object storage service!',
  }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.icon = baseCellar.icon;
      component.name = baseCellar.name;
      component.sections = baseCellar.sections.map(({ type }) => ({ type }));
    }),
    storyWait(3000, ([component]) => {
      component.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  skeletonWithCellar,
  skeletonWithFsBucket,
  skeletonWithPulsar,
  error,
  errorWithCellar,
  errorWithFsBucket,
  errorWithPulsar,
  dataLoadedWithFsBucket,
  dataLoadedWithPulsar,
  dataLoadedWithHeptapod,
  dataLoadedWithCustomHead,
  dataLoadedWithEmptyHead,
  dataLoadedWithCustomDescription,
  dataLoadedWithCustomStyles,
  dataLoadedWithNoAction,
  dataLoadedWithDollars,
  simulationsWithCellar,
  simulationsWithFsBucket,
  simulationsWithPulsar,
  simulationsWithError,
});
