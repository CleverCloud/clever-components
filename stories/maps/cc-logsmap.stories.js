import '../../src/maps/cc-logsmap.js';
import fakeHeatmapData from '../assets/24-hours-points.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { setIntervalDom, setTimeoutDom } from '../lib/timers.js';
import { getFakePointsData } from './fake-map-data.js';

export default {
  title: '🛠 Maps/<cc-logsmap>',
  component: 'cc-logsmap',
};

const conf = {
  component: 'cc-logsmap',
  displayMode: 'flex-wrap',
};

const spreadDuration = 5000;
const delay = spreadDuration + 2000;

export const defaultStory = makeStory(conf, {
  items: [
    { orgaName: 'ACME Corp', innerHTML: 'Live map with blinking dots' },
    { appName: 'My Awesome Java App (PROD)', mode: 'heatmap', innerHTML: 'Heatmap', heatmapPoints: fakeHeatmapData },
  ],
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

export const emptyWithDifferentSizes = makeStory(conf, {
  items: [
    { orgaName: 'ACME Corp', style: 'height:200px; width:300px' },
    { orgaName: 'ACME Corp', style: 'height:300px; width:200px' },
  ],
});

export const emptyWithDifferentCentersAndZooms = makeStory(conf, {
  docs: 'Centered on New York and Hong Kong.',
  items: [
    { orgaName: 'ACME Corp', centerLat: '40.7', centerLon: '-74', viewZoom: '2' },
    { orgaName: 'ACME Corp', centerLat: '22.4', centerLon: '114.2', viewZoom: '4' },
  ],
});

export const emptyWithOrga = makeStory(conf, {
  docs: 'Data for all apps of an orga (name in legend).',
  items: [
    { orgaName: 'ACME Corp' },
    { orgaName: 'ACME Corp' },
  ],
});

export const emptyWithAppOnly = makeStory(conf, {
  docs: 'Data for only one app (name in legend).',
  items: [
    { appName: 'My Awesome Java App (PROD)' },
    { appName: 'My Awesome Java App (PROD)' },
  ],
});

export const loading = makeStory(conf, {
  items: [{ loading: true, orgaName: 'ACME Corp' }],
});

export const error = makeStory(conf, {
  items: [{ error: true, orgaName: 'ACME Corp' }],
});

export const errorWithLoadingIndicator = makeStory(conf, {
  items: [{ loading: true, error: true, orgaName: 'ACME Corp' }],
});

export const simulationWithDotmap = makeStory(conf, {
  items: [{
    viewZoom: '2',
    orgaName: 'ACME Corp',
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

export const simulationWithVeryBusyDotmap = makeStory(conf, {
  items: [{
    viewZoom: '2',
    orgaName: 'ACME Corp',
  }],
  simulations: [
    storyWait(0, ([component]) => {

      const fetchData = () => {
        getFakePointsData(2).then((rawPoints) => {
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
    orgaName: 'ACME Corp',
    mode: 'heatmap',
    heatmapPoints: fakeHeatmapData,
  }],
});

enhanceStoriesNames({
  defaultStory,
  emptyWithDifferentSizes,
  emptyWithDifferentCentersAndZooms,
  emptyWithOrga,
  emptyWithAppOnly,
  loading,
  error,
  errorWithLoadingIndicator,
  simulationWithDotmap,
  simulationWithVeryBusyDotmap,
  simulationWithHeatmap,
});
