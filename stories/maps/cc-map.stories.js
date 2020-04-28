import '../../src/maps/cc-map.js';
import fakeHeatmapData from '../assets/24-hours-points.json';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { setIntervalDom, setTimeoutDom } from '../lib/timers.js';
import { getFakePointsData } from './fake-map-data.js';

const spreadDuration = 5000;
const delay = spreadDuration + 2000;

export default {
  title: '🛠 Maps|<cc-map>',
  component: 'cc-map',
};

const conf = {
  component: 'cc-map',
  // language=CSS
  css: `
    cc-map {
      display: inline-flex;
      margin-bottom: 1rem;
      margin-right: 1rem;
      vertical-align: bottom;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { innerHTML: 'Live map with blinking dots' },
    { mode: 'heatmap', innerHTML: 'Heatmap', heatmapPoints: fakeHeatmapData },
  ],
  simulations: [
    storyWait(0, ([component]) => {
      component.addPoints([
        { lat: 48.8, lon: 2.3, count: 1, delay: 'none' },
        { lat: 50.6, lon: 3.1, count: 10, delay: 'none' },
        { lat: 47.2, lon: -1.6, count: 100, delay: 'none' },
        { lat: 45.7, lon: 4.7, count: 1000, delay: 'none' },
      ]);
    }),
  ],
});

export const emptyWithLegendInSlot = makeStory(conf, {
  items: [{ innerHTML: 'Map with legend' }],
});

export const emptyWithDifferentSizes = makeStory(conf, {
  items: [
    { style: 'height:10rem; width:30rem' },
    { style: 'height:20rem; width:15rem' },
  ],
});

export const emptyWithDifferentCentersAndZooms = makeStory(conf, {
  docs: 'Centered on New York and Hong Kong.',
  items: [
    { centerLat: '40.7', centerLon: '-74', viewZoom: '2' },
    { centerLat: '22.4', centerLon: '114.2', viewZoom: '4' },
  ],
});

export const emptyWithHeatmap = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'heatmap',
    heatmapPoints: [],
    innerHTML: `Heatmap simulation with no data points`,
  }],
});

export const loading = makeStory(conf, {
  docs: 'Without and with legend.',
  items: [
    { loading: true },
    { loading: true, innerHTML: 'Map with legend' },
  ],
});

export const error = makeStory(conf, {
  docs: 'Without and with legend.',
  items: [
    { error: true },
    { error: true, innerHTML: 'Map with legend' },
  ],
});

export const errorWithLoadingIndicator = makeStory(conf, {
  docs: 'Without and with legend.',
  items: [
    { loading: true, error: true },
    { loading: true, error: true, innerHTML: 'Map with legend' },
  ],
});

export const persistentPointsDisplayedAtOnce = makeStory(conf, {
  name: '👍 Persistent points (displayed at once)',
  items: [{ innerHTML: '4 points, persistent (no delay), displayed at once.' }],
  simulations: [
    storyWait(0, ([component]) => {
      component.addPoints([
        { lat: 48.8, lon: 2.3, count: 1, delay: 'none' },
        { lat: 50.6, lon: 3.1, count: 10, delay: 'none' },
        { lat: 47.2, lon: -1.6, count: 100, delay: 'none' },
        { lat: 45.7, lon: 4.7, count: 1000, delay: 'none' },
      ]);
    }),
  ],
});

export const persistentPointsDisplayedAtOnceWithTooltips = makeStory(conf, {
  name: '👍 Persistent points (displayed at once, with tooltips)',
  items: [{ innerHTML: '4 points, persistent (no delay), displayed at once, with tooltips.' }],
  simulations: [
    storyWait(0, ([component]) => {
      component.addPoints([
        { lat: 48.8, lon: 2.3, count: 1, delay: 'none', tooltip: 'Paris' },
        { lat: 50.6, lon: 3.1, count: 10, delay: 'none', tooltip: 'Lille' },
        { lat: 47.2, lon: -1.6, count: 100, delay: 'none', tooltip: 'Nantes' },
        { lat: 45.7, lon: 4.7, count: 1000, delay: 'none', tooltip: 'Lyon' },
      ]);
    }),
  ],
});

export const temporaryPointsBatchDisplayedWithTooltips = makeStory(conf, {
  name: '👍 Temporary points (batch displayed, with tooltips)',
  items: [{ innerHTML: `4 points, ${delay}ms delay, batch displayed displayed over ${spreadDuration}ms, with tooltips.` }],
  simulations: [
    storyWait(0, ([component]) => {
      component.addPoints([
        { lat: 48.8, lon: 2.3, count: 1, delay, tooltip: 'Paris' },
        { lat: 50.6, lon: 3.1, count: 10, delay, tooltip: 'Lille' },
        { lat: 47.2, lon: -1.6, count: 100, delay, tooltip: 'Nantes' },
        { lat: 45.7, lon: 4.7, count: 1000, delay, tooltip: 'Lyon' },
      ], { spreadDuration });
    }),
  ],
});

// TODO: other data sets with knobs
export const simulationWithDotmap = makeStory(conf, {
  items: [{
    viewZoom: '2',
    innerHTML: `Realtime simulation, ${delay}ms delay, batch displayed displayed over ${spreadDuration}ms, with tooltips`,
  }],
  simulations: [
    storyWait(0, ([component]) => {

      const fetchData = () => {
        getFakePointsData(0).then((rawPoints) => {
          const points = rawPoints.map((p) => ({ ...p, tooltip: p.city, delay }));
          component.addPoints(points, { spreadDuration });
        });
      };

      setTimeoutDom(fetchData, 0, component);
      setIntervalDom(fetchData, spreadDuration, component);
    }),
  ],
});

export const simulationWithHeatmap = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'heatmap',
    heatmapPoints: fakeHeatmapData,
    innerHTML: `Heatmap simulation`,
  }],
});

enhanceStoriesNames({
  defaultStory,
  emptyWithLegendInSlot,
  emptyWithDifferentSizes,
  emptyWithDifferentCentersAndZooms,
  emptyWithHeatmap,
  loading,
  error,
  errorWithLoadingIndicator,
  persistentPointsDisplayedAtOnce,
  persistentPointsDisplayedAtOnceWithTooltips,
  temporaryPointsBatchDisplayedWithTooltips,
  simulationWithDotmap,
  simulationWithHeatmap,
});
