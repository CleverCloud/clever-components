import './cc-tile-metrics.js';
import './cc-tile-metrics.smart.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Overview/<cc-tile-metrics>',
  component: 'cc-tile-metrics',
};

const conf = {
  component: 'cc-tile-metrics',
  // language=CSS
  css: `cc-tile-metrics {
    margin-bottom: 1em;
  }`,
};

const baseItems = [
  {
    grafanaLink: 'https://grafana.example.com/small',
    metricsLink: 'https://metrics.example.com/small',
    style: 'max-width: 23.75em',
  },
  {
    grafanaLink: 'https://grafana.example.com/medium',
    metricsLink: 'https://metrics.example.com/medium',
    style: 'max-width: 33.75em',
  },
  {
    grafanaLink: 'https://grafana.example.com/large',
    metricsLink: 'https://metrics.example.com/large',
  },
];

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = ONE_HOUR * 24;

function fakeMetricData (numberOfPoints, usedValue, linearIncrease = false, shift = true) {
  return Array
    .from({ length: numberOfPoints })
    .map((_, index) => {
      const randomShift = (usedValue !== 0 && shift) ? (Math.random() * 4) - 2 : 0;
      const increase = (linearIncrease) ? index * 1.5 : 0;
      return {
        value: Math.min(usedValue + randomShift + increase, 100),
      };
    });
}

function addTimestamp (array) {
  const startTs = Date.now() - ONE_DAY;
  return array.map((item, index) => {
    return {
      ...item,
      timestamp: startTs + index * ONE_HOUR,
    };
  });
}

export const defaultStory = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp(fakeMetricData(24, 25)),
        memData: addTimestamp(fakeMetricData(24, 16)),
      },
    },
  })),
});

export const skeleton = makeStory(conf, {
  items: baseItems.map((item) => ({ ...item, metrics: { state: 'loading' } })),
});

export const empty = makeStory(conf, {
  items: baseItems.map((item) => ({ ...item, metrics: { state: 'empty' } })),
});

export const error = makeStory(conf, {
  items: baseItems.map((item) => ({ ...item, metrics: { state: 'error' } })),
});

export const dataLoadedWithHighValues = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp([
          ...fakeMetricData(12, 60),
          ...fakeMetricData(12, 80),
        ]),
        memData: addTimestamp([
          ...fakeMetricData(12, 50),
          ...fakeMetricData(12, 82),
        ]),
      },
    },
  })),
});

export const peaks = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp(fakeMetricData(24, 25)),
        memData: addTimestamp([
          ...fakeMetricData(10, 25),
          ...fakeMetricData(1, 25 / 4),
          ...fakeMetricData(2, 80),
          ...fakeMetricData(1, 25 / 4),
          ...fakeMetricData(10, 25),
        ]),
      },
    },
  })),
});

export const linearIncrease = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp(fakeMetricData(24, 25, true)),
        memData: addTimestamp(fakeMetricData(24, 10, true)),
      },
    },
  })),
});

export const scaleUp = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp(fakeMetricData(24, 40)),
        memData: addTimestamp([
          ...fakeMetricData(12, 50),
          ...fakeMetricData(12, 50 / 4),
        ]),
      },
    },
  })),
});

export const scaleDown = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp(fakeMetricData(24, 30)),
        memData: addTimestamp([
          ...fakeMetricData(12, 16),
          ...fakeMetricData(12, 16 * 2),
        ]),
      },
    },
  })),
});

export const multipleScaleUp = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp(fakeMetricData(24, 60)),
        memData: addTimestamp([
          ...fakeMetricData(8, 80),
          ...fakeMetricData(8, 80 / 2),
          ...fakeMetricData(8, 80 / 4),
        ]),
      },
    },
  })),
});

export const multipleScaleDown = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp([
          ...fakeMetricData(8, 8, false, false),
          ...fakeMetricData(8, 50, false, false),
          ...fakeMetricData(8, 85, false, false),
        ]),
        memData: addTimestamp([
          ...fakeMetricData(8, 80 / 4, false, false),
          ...fakeMetricData(8, 80 / 2, false, false),
          ...fakeMetricData(8, 81, false, false),
        ]),
      },
    },
  })),
});

export const bigScaleUp = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp(fakeMetricData(24, 25)),
        memData: addTimestamp([
          ...fakeMetricData(12, 80),
          ...fakeMetricData(12, 80 / 8),
        ]),
      },
    },
  })),
});

export const bigScaleDown = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp(fakeMetricData(24, 22.3)),
        memData: addTimestamp([
          ...fakeMetricData(12, 10),
          ...fakeMetricData(12, 10 * 8),
        ]),
      },
    },
  })),
});

export const appDown = makeStory(conf, {
  items: baseItems.map((item) => ({
    ...item,
    metrics: {
      state: 'loaded',
      value: {
        cpuData: addTimestamp([
          ...fakeMetricData(6, 22.3),
          ...fakeMetricData(6, 0),
          ...fakeMetricData(12, 22.3),
        ]),
        memData: addTimestamp([
          ...fakeMetricData(6, 10),
          ...fakeMetricData(6, 0),
          ...fakeMetricData(12, 10 * 8),
        ]),
      },
    },
  })),
});

export const simulationsWithData = makeStory(conf, {
  items: baseItems,
  simulations: [
    storyWait(2000, ([componentSmall, componentMedium, componentBig]) => {
      const value = {
        cpuData: addTimestamp(fakeMetricData(24, 25)),
        memData: addTimestamp(fakeMetricData(24, 16)),
      };

      componentSmall.metrics = {
        state: 'loaded',
        value,
      };

      componentMedium.metrics = {
        state: 'loaded',
        value,
      };

      componentBig.metrics = {
        state: 'loaded',
        value,
      };

    }),
  ],
});

export const simulationsWithError = makeStory(conf, {
  items: baseItems,
  simulations: [
    storyWait(2000, ([componentSmall, componentMedium, componentBig]) => {
      componentSmall.metrics = { state: 'error' };
      componentMedium.metrics = { state: 'error' };
      componentBig.metrics = { state: 'error' };
    }),
  ],
});
