import '../../components/maps/cc-logsmap.js';
import fakeHeatmapData from '../assets/24-hours-points.json';
import fakePointsData from '../assets/country-city-points.json';
import notes from '../../.components-docs/cc-logsmap.md';
import { createContainer } from '../lib/dom.js';
import { setIntervalDom, setTimeoutDom } from '../lib/timers.js';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

let fakeDataIndex = 0;

function getFakePointsData () {
  const data = Promise.resolve(fakePointsData[fakeDataIndex]);
  fakeDataIndex = (fakeDataIndex + 1) % fakePointsData.length;
  return data;
}

function createComponent ({ loading = false, error = false }) {
  const component = document.createElement('cc-logsmap');
  component.setAttribute('style', 'width:700px;height:350px;');
  component.setAttribute('view-zoom', '4');
  component.error = error;
  component.loading = loading;
  return component;
}

const withActions = withCustomEventActions('cc-logsmap:mode');

storiesOf('2. Maps|<cc-logsmap>', module)
  .addParameters({ notes })
  .add('empty, different sizes', withActions(() => `
    <div class="title">Small:</div>
    <cc-logsmap style="width:250px;height:150px;"></cc-logsmap>
    <div class="title">Large:</div>
    <cc-logsmap style="width:500px;height:200px;"></cc-logsmap>
    <div class="title">Tall:</div>
    <cc-logsmap style="width:200px;height:300px;"></cc-logsmap>
  `))
  .add('empty, different centers and zooms', withActions(() => `
    <div class="title">New York:</div>
    <cc-logsmap center-lat="40.7" center-lon="-74" view-zoom="2" style="width:400px;height:200px;"></cc-logsmap>
    <div class="title">Hong Kong:</div>
    <cc-logsmap center-lat="22.4" center-lon="114.2" view-zoom="3" style="width:400px;height:200px;"></cc-logsmap>
    <div class="title">Prague:</div>
    <cc-logsmap center-lat="50.1" center-lon="14.4" view-zoom="4" style="width:400px;height:200px;"></cc-logsmap>
  `))
  .add('loading state', withActions(() => {
    return createContainer([
      `Loading state enabled:`,
      createComponent({ loading: true }),
      `Loading state enabled (with legend):`,
      createComponent({ loading: true, legend: 'Map with legend' }),
    ]);
  }))
  .add('error state', withActions(() => {
    return createContainer([
      `Error state enabled:`,
      createComponent({ error: true }),
      `Error state enabled (with legend):`,
      createComponent({ error: true, legend: 'Map with legend' }),
    ]);
  }))
  .add('error+loading state', withActions(() => {
    return createContainer([
      `Error + loading state enabled:`,
      createComponent({ loading: true, error: true }),
      `Error + loading state enabled (with legend):`,
      createComponent({ loading: true, error: true, legend: 'Map with legend' }),
    ]);
  }))
  .add('simulation for realtime and heatmap', withActions(() => {

    const spreadDuration = 5000;
    const delay = spreadDuration + 2000;

    const logsmap = createComponent({});

    logsmap.viewZoom = '2';
    logsmap.heatmapPoints = fakeHeatmapData;

    const fetchData = () => {
      getFakePointsData().then((rawPoints) => {
        const points = rawPoints.map((p) => ({ ...p, tooltip: p.city, delay }));
        logsmap.addPoints(points, { spreadDuration });
      });
    };

    setTimeoutDom(fetchData, 0, logsmap);
    setIntervalDom(fetchData, spreadDuration, logsmap);

    return logsmap;
  }));
