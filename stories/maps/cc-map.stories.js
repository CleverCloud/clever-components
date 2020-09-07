import '../../src/maps/cc-map.js';
import '../../src/maps/cc-map-marker-server.js';
import '../../src/maps/cc-map-marker-dot.js';
import '../../src/zones/cc-zone.js';
import fakeHeatmapData from '../assets/24-hours-points.json';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const points = [
  { lat: 48.8, lon: 2.3, city: 'Paris', country: 'France', countryCode: 'fr', state: 'default' },
  { lat: 50.6, lon: 3.1, city: 'Lille', country: 'France', countryCode: 'fr', state: 'selected' },
  { lat: 47.2, lon: -1.6, city: 'Nantes', country: 'France', countryCode: 'fr', state: 'default' },
  { lat: 45.7, lon: 4.7, city: 'Lyon', country: 'France', countryCode: 'fr', state: 'default' },
];

const blinkingDots = points.map((p, i) => {
  const { lat, lon, city } = p;
  return {
    lat,
    lon,
    marker: { tag: 'cc-map-marker-dot', count: 10 ** i },
    tooltip: city,
  };
});

const servers = points.map((p) => {
  const { lat, lon, city, country, countryCode, state } = p;
  return {
    lat,
    lon,
    zIndexOffset: (state === 'selected') ? 250 : 0,
    marker: { tag: 'cc-map-marker-server', state },
    tooltip: { tag: 'cc-zone', zone: { city, country, countryCode, tags: [] }, mode: 'small' },
  };
});

export default {
  title: '🛠 Maps/<cc-map>',
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
    { innerHTML: 'Blinking dots', points: blinkingDots },
    { mode: 'heatmap', innerHTML: 'Heatmap', heatmapPoints: fakeHeatmapData },
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

export const pointsWithDots = makeStory(conf, {
  name: '👍 Points (blinking dots with string tooltips)',
  items: [{ points: blinkingDots }],
});

export const pointsWithServers = makeStory(conf, {
  name: '👍 Points (servers)',
  items: [{ points: servers }],
});

export const pointsWithDotsNoTooltips = makeStory(conf, {
  name: '👍 Points (blinking dots without tooltips)',
  items: [{ points: blinkingDots.map((p) => ({ ...p, tooltip: null })) }],
});

export const simulationWithUpdatesOnSameDot = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'points',
    points: [blinkingDots[0]],
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.points[0].marker.count = 5;
      component.points = [component.points[0]];
    }),
    storyWait(2000, ([component]) => {
      component.points[0].marker.count = 20;
      component.points[0].tooltip = 'Paris<br>Cachan';
      component.points = [component.points[0]];
    }),
    storyWait(2000, ([component]) => {
      component.points[0].marker.count = 50;
      component.points[0].tooltip = 'Paris<br>Cachan<br>La défense...';
      component.points = [component.points[0]];
    }),
    storyWait(2000, ([component]) => {
      component.points[0].marker.count = 100;
      component.points[0].tooltip = null;
      component.points = [component.points[0]];
    }),
  ],
});

export const simulationWithDifferentDots = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'points',
    points: [blinkingDots[0]],
  }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.points = [blinkingDots[1]];
    }),
    storyWait(1000, ([component]) => {
      component.points = [blinkingDots[2]];
    }),
    storyWait(1000, ([component]) => {
      component.points = [blinkingDots[3]];
    }),
    storyWait(1000, ([component]) => {
      component.points = [];
    }),
  ],
});

export const simulationWithUpdatesOnSameServer = makeStory(conf, {
  items: [{
    viewZoom: '2',
    mode: 'points',
    points: [servers[0]],
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.points[0].marker.state = 'hovered';
      component.points = [component.points[0]];
    }),
    storyWait(2000, ([component]) => {
      component.points[0].marker.state = 'selected';
      component.points = [component.points[0]];
    }),
    storyWait(2000, ([component]) => {
      component.points[0].marker.state = 'default';
      component.points = [component.points[0]];
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
  pointsWithDots,
  pointsWithServers,
  pointsWithDotsNoTooltips,
  simulationWithUpdatesOnSameDot,
  simulationWithDifferentDots,
  simulationWithUpdatesOnSameServer,
  simulationWithHeatmap,
});
