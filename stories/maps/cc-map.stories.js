import '../../components/maps/cc-map.js';
import fakeHeatmapData from '../assets/24-hours-points.json';
import fakePointsData from '../assets/country-city-points.json';
import notes from '../../.components-docs/cc-map.md';
import { createContainer } from '../lib/dom.js';
import { setIntervalDom, setTimeoutDom } from '../lib/timers.js';
import { storiesOf } from '@storybook/html';

let fakeDataIndex = 0;

function getFakePointsData () {
  const data = Promise.resolve(fakePointsData[fakeDataIndex]);
  fakeDataIndex = (fakeDataIndex + 1) % fakePointsData.length;
  return data;
}

function createComponent ({ legend, loading = false, error = false }) {
  const component = document.createElement('cc-map');
  component.setAttribute('style', 'width:700px;height:350px;');
  component.setAttribute('view-zoom', '4');
  if (legend != null) {
    component.innerHTML = legend;
  }
  component.error = error;
  component.loading = loading;
  return component;
}

storiesOf('2. Maps|<cc-map>', module)
  .addParameters({ notes })
  .add('legends with <slot>', () => {
    return createContainer([
      `No legend:`,
      createComponent({}),
      `With legend:`,
      createComponent({ legend: 'Map with legend' }),
    ]);
  })
  .add('empty, different sizes', () => `
    <div class="title">Small:</div>
    <cc-map style="width:250px;height:150px;"></cc-map>
    <div class="title">Large:</div>
    <cc-map style="width:500px;height:200px;"></cc-map>
    <div class="title">Tall:</div>
    <cc-map style="width:200px;height:250px;"></cc-map>
  `)
  .add('empty, different centers and zooms', () => `
    <div class="title">New York:</div>
    <cc-map center-lat="40.7" center-lon="-74" view-zoom="2" style="width:400px;height:200px;"></cc-map>
    <div class="title">Hong Kong:</div>
    <cc-map center-lat="22.4" center-lon="114.2" view-zoom="3" style="width:400px;height:200px;"></cc-map>
    <div class="title">Prague:</div>
    <cc-map center-lat="50.1" center-lon="14.4" view-zoom="4" style="width:400px;height:200px;"></cc-map>
  `)
  .add('loading state', () => {
    return createContainer([
      `Loading state enabled:`,
      createComponent({ loading: true }),
      `Loading state enabled (with legend):`,
      createComponent({ loading: true, legend: 'Map with legend' }),
    ]);
  })
  .add('error state', () => {
    return createContainer([
      `Error state enabled:`,
      createComponent({ error: true }),
      `Error state enabled (with legend):`,
      createComponent({ error: true, legend: 'Map with legend' }),
    ]);
  })
  .add('error+loading state', () => {
    return createContainer([
      `Error + loading state enabled:`,
      createComponent({ loading: true, error: true }),
      `Error + loading state enabled (with legend):`,
      createComponent({ loading: true, error: true, legend: 'Map with legend' }),
    ]);
  })
  .add('persistent points, displayed at once', () => {
    const map = createComponent({ legend: '4 points, persistent (no delay), displayed at once' });
    map.addPoints([
      { lat: 48.8, lon: 2.3, count: 1, delay: 'none' },
      { lat: 50.6, lon: 3.1, count: 10, delay: 'none' },
      { lat: 47.2, lon: -1.6, count: 100, delay: 'none' },
      { lat: 45.7, lon: 4.7, count: 1000, delay: 'none' },
    ]);
    return map;
  })
  .add('persistent points, displayed at once, with tooltips', () => {
    const map = createComponent({ legend: '4 points, persistent (no delay), displayed at once, with tooltips' });
    map.addPoints([
      { lat: 48.8, lon: 2.3, count: 1, delay: 'none', tooltip: 'Paris' },
      { lat: 50.6, lon: 3.1, count: 10, delay: 'none', tooltip: 'Lille' },
      { lat: 47.2, lon: -1.6, count: 100, delay: 'none', tooltip: 'Nantes' },
      { lat: 45.7, lon: 4.7, count: 1000, delay: 'none', tooltip: 'Lyon' },
    ]);
    return map;
  })
  .add('temporary points, batch displayed, with tooltips', () => {

    const spreadDuration = 5000;
    const delay = spreadDuration + 2000;

    const map = createComponent({ legend: `4 points, ${delay}ms delay, batch displayed displayed over ${spreadDuration}ms, with tooltips` });

    map.addPoints([
      { lat: 48.8, lon: 2.3, count: 1, delay, tooltip: 'Paris' },
      { lat: 50.6, lon: 3.1, count: 10, delay, tooltip: 'Lille' },
      { lat: 47.2, lon: -1.6, count: 100, delay, tooltip: 'Nantes' },
      { lat: 45.7, lon: 4.7, count: 1000, delay, tooltip: 'Lyon' },
    ], { spreadDuration });

    return map;
  })
  .add('realtime simulation (with static data)', () => {

    const spreadDuration = 5000;
    const delay = spreadDuration + 2000;

    const map = createComponent({ legend: `Realtime simulation, ${delay}ms delay, batch displayed displayed over ${spreadDuration}ms, with tooltips` });

    map.viewZoom = '2';

    const fetchData = () => {
      getFakePointsData().then((rawPoints) => {
        const points = rawPoints.map((p) => ({ ...p, tooltip: p.city, delay }));
        map.addPoints(points, { spreadDuration });
      });
    };

    setTimeoutDom(fetchData, 0, map);
    setIntervalDom(fetchData, spreadDuration, map);

    return map;
  })
  .add('heatmap simulation', () => {
    const map = createComponent({ legend: `Heatmap simulation` });
    map.viewZoom = '2';
    map.mode = 'heatmap';
    map.heatmapPoints = fakeHeatmapData;
    return map;
  });
