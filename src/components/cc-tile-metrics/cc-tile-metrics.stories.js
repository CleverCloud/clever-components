import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-tile-metrics.js';
import './cc-tile-metrics.smart.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Overview/<cc-tile-metrics>',
  component: 'cc-tile-metrics',
};

const conf = {
  component: 'cc-tile-metrics',
  // language=CSS
  css: `
    cc-tile-metrics {
      margin-bottom: 1em;
    }

    cc-tile-metrics:nth-of-type(1) {
      max-width: 23.75em
    }

    cc-tile-metrics:nth-of-type(2) {
      max-width: 33.75em
    }
  `,
};

/**
 * @typedef {import('./cc-tile-metrics.js').CcTileMetrics} CcTileMetrics
 * @typedef {import('./cc-tile-metrics.types.js').TileMetricsMetricsStateLoaded} TileMetricsStateLoaded
 * @typedef {import('./cc-tile-metrics.types.js').Metric} Metric
 */

/** @type {Array<Partial<CcTileMetrics>>} */
const baseItems = [
  {
    grafanaLinkState: {
      type: 'loaded',
      link: 'https://grafana.example.com/small',
    },
    metricsLink: 'https://metrics.example.com',
  },
  {
    grafanaLinkState: {
      type: 'loaded',
      link: 'https://grafana.example.com/medium',
    },
    metricsLink: 'https://metrics.example.com/medium',
  },
  {
    grafanaLinkState: {
      type: 'loaded',
      link: 'https://grafana.example.com/large',
    },
    metricsLink: 'https://metrics.example.com/large',
  },
];

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = ONE_HOUR * 24;

/**
 * @param {number} numberOfPoints
 * @param {number} usedValue
 * @param {boolean} [linearIncrease]
 * @param {boolean} [shift]
 * @returns {{ value: number }[]}
 */
function fakeMetricData(numberOfPoints, usedValue, linearIncrease = false, shift = true) {
  return Array.from({ length: numberOfPoints }).map((_, index) => {
    const randomShift = usedValue !== 0 && shift ? Math.random() * 4 - 2 : 0;
    const increase = linearIncrease ? index * 1.5 : 0;
    return {
      value: Math.min(usedValue + randomShift + increase, 100),
    };
  });
}

/**
 * @param {{ value: number }[]} array
 * @returns {Metric[]}
 */
function addTimestamp(array) {
  const startTs = Date.now() - ONE_DAY;
  return array.map((item, index) => {
    return {
      ...item,
      timestamp: startTs + index * ONE_HOUR,
    };
  });
}

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp(fakeMetricData(24, 25)),
        memMetrics: addTimestamp(fakeMetricData(24, 16)),
      },
    },
  })),
});

export const loading = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: { type: 'loading' },
    grafanaLinkState: { type: 'loading' },
  })),
});

export const empty = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({ ...item, metricsState: { type: 'empty' } })),
});

export const error = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({ ...item, metricsState: { type: 'error' } })),
});

export const dataLoadedWithHighValues = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp([...fakeMetricData(12, 60), ...fakeMetricData(12, 80)]),
        memMetrics: addTimestamp([...fakeMetricData(12, 50), ...fakeMetricData(12, 82)]),
      },
    },
  })),
});

export const peaks = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp(fakeMetricData(24, 25)),
        memMetrics: addTimestamp([
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
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp(fakeMetricData(24, 25, true)),
        memMetrics: addTimestamp(fakeMetricData(24, 10, true)),
      },
    },
  })),
});

export const scaleUp = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp(fakeMetricData(24, 40)),
        memMetrics: addTimestamp([...fakeMetricData(12, 50), ...fakeMetricData(12, 50 / 4)]),
      },
    },
  })),
});

export const scaleDown = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp(fakeMetricData(24, 30)),
        memMetrics: addTimestamp([...fakeMetricData(12, 16), ...fakeMetricData(12, 16 * 2)]),
      },
    },
  })),
});

export const multipleScaleUp = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp(fakeMetricData(24, 60)),
        memMetrics: addTimestamp([
          ...fakeMetricData(8, 80),
          ...fakeMetricData(8, 80 / 2),
          ...fakeMetricData(8, 80 / 4),
        ]),
      },
    },
  })),
});

export const multipleScaleDown = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp([
          ...fakeMetricData(8, 8, false, false),
          ...fakeMetricData(8, 50, false, false),
          ...fakeMetricData(8, 85, false, false),
        ]),
        memMetrics: addTimestamp([
          ...fakeMetricData(8, 80 / 4, false, false),
          ...fakeMetricData(8, 80 / 2, false, false),
          ...fakeMetricData(8, 81, false, false),
        ]),
      },
    },
  })),
});

export const bigScaleUp = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp(fakeMetricData(24, 25)),
        memMetrics: addTimestamp([...fakeMetricData(12, 80), ...fakeMetricData(12, 80 / 8)]),
      },
    },
  })),
});

export const bigScaleDown = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp(fakeMetricData(24, 22.3)),
        memMetrics: addTimestamp([...fakeMetricData(12, 10), ...fakeMetricData(12, 10 * 8)]),
      },
    },
  })),
});

export const appDown = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((item) => ({
    ...item,
    metricsState: {
      type: 'loaded',
      metricsData: {
        cpuMetrics: addTimestamp([...fakeMetricData(6, 22.3), ...fakeMetricData(6, 0), ...fakeMetricData(12, 22.3)]),
        memMetrics: addTimestamp([...fakeMetricData(6, 10), ...fakeMetricData(6, 0), ...fakeMetricData(12, 10 * 8)]),
      },
    },
  })),
});

export const simulationsWithData = makeStory(conf, {
  /** @type {Array<Partial<CcTileMetrics>>} */
  items: baseItems.map((baseItem) => ({
    ...baseItem,
    metricsState: { type: 'loading' },
    grafanaLinkState: { type: 'loading' },
  })),
  simulations: [
    storyWait(
      2000,
      /** @param {CcTileMetrics[]} components */
      ([componentSmall, componentMedium, componentBig]) => {
        /** @type {TileMetricsStateLoaded} */
        const metricsState = {
          type: 'loaded',
          metricsData: {
            cpuMetrics: addTimestamp(fakeMetricData(24, 25)),
            memMetrics: addTimestamp(fakeMetricData(24, 16)),
          },
        };

        componentSmall.metricsState = metricsState;
        componentSmall.grafanaLinkState = baseItems[0].grafanaLinkState;

        componentMedium.metricsState = metricsState;
        componentMedium.grafanaLinkState = baseItems[1].grafanaLinkState;

        componentBig.metricsState = metricsState;
        componentBig.grafanaLinkState = baseItems[2].grafanaLinkState;
      },
    ),
  ],
});

export const simulationsWithError = makeStory(conf, {
  items: baseItems.map((baseItem) => ({
    ...baseItem,
    metricsState: { type: 'loading' },
  })),
  simulations: [
    storyWait(
      2000,
      /** @param {CcTileMetrics[]} components */
      ([componentSmall, componentMedium, componentBig]) => {
        componentSmall.metricsState = { type: 'error' };
        componentMedium.metricsState = { type: 'error' };
        componentBig.metricsState = { type: 'error' };
      },
    ),
  ],
});
