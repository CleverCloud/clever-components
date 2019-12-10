import '../../components/maps/cc-logsmap.js';
import fakeHeatmapData from '../assets/24-hours-points.json';
import notes from '../../.components-docs/cc-logsmap.md';
import { getDataSampleKnob, getFakePointsData } from './fake-map-data.js';
import { setIntervalDom, setTimeoutDom } from '../lib/timers.js';
import { withCustomEventActions } from '../lib/event-action.js';

function createComponent ({ loading = false, error = false, empty = false }) {
  const component = document.createElement('cc-logsmap');
  component.setAttribute('style', 'width:700px;height:350px;');
  component.setAttribute('view-zoom', '4');
  component.error = error;
  component.loading = loading;
  component.empty = empty;
  component.orgaName = 'ACME Incorporated';
  return component;
}

const withActions = withCustomEventActions('cc-logsmap:mode');

export default {
  title: '2. Maps|<cc-logsmap>',
  parameters: { notes },
};

export const emptyWithDifferentSizes = withActions(() => `
  <div class="title">Small:</div>
  <cc-logsmap style="width:250px;height:150px;"></cc-logsmap>
  <div class="title">Large:</div>
  <cc-logsmap style="width:500px;height:200px;"></cc-logsmap>
  <div class="title">Tall:</div>
  <cc-logsmap style="width:200px;height:300px;"></cc-logsmap>
`);

export const emptyWithDifferentCentersAndZooms = withActions(() => `
  <div class="title">New York:</div>
  <cc-logsmap center-lat="40.7" center-lon="-74" view-zoom="2" style="width:400px;height:200px;"></cc-logsmap>
  <div class="title">Hong Kong:</div>
  <cc-logsmap center-lat="22.4" center-lon="114.2" view-zoom="3" style="width:400px;height:200px;"></cc-logsmap>
  <div class="title">Prague:</div>
  <cc-logsmap center-lat="50.1" center-lon="14.4" view-zoom="4" style="width:400px;height:200px;"></cc-logsmap>
`);

export const emptyWithAllOrgaOrAppOnly = withActions(() => `
  <div class="title">Data for all apps of an orga:</div>
  <cc-logsmap orga-name="ACME Corp" style="width:600px;height:300px;display: inline-block;"></cc-logsmap>
  <cc-logsmap orga-name="ACME Corp" mode="heatmap" style="width:600px;height:300px;display: inline-block;"></cc-logsmap>
  <div class="title">Data for only one app:</div>
  <cc-logsmap app-name="My Awesome Java App (PROD)" style="width:600px;height:300px;display: inline-block;"></cc-logsmap>
  <cc-logsmap app-name="My Awesome Java App (PROD)" mode="heatmap" style="width:600px;height:300px;display: inline-block;"></cc-logsmap>
`);

export const loading = withActions(() => {
  return createComponent({ loading: true });
});

export const error = withActions(() => {
  return createComponent({ error: true });
});

export const errorWithLoadingIndicator = withActions(() => {
  return createComponent({ loading: true, error: true });
});

export const simulationWithRealtimeAndHeatmap = withActions(() => {
  const dataSampleIndex = getDataSampleKnob();

  const spreadDuration = 5000;
  const delay = spreadDuration + 2000;

  const logsmap = createComponent({});

  logsmap.viewZoom = '2';
  logsmap.heatmapPoints = fakeHeatmapData;

  const fetchData = () => {
    getFakePointsData(dataSampleIndex).then(rawPoints => {
      const points = rawPoints.map(p => ({ ...p, tooltip: p.city, delay }));
      logsmap.addPoints(points, { spreadDuration });
    });
  };

  setTimeoutDom(fetchData, 0, logsmap);
  setIntervalDom(fetchData, spreadDuration, logsmap);

  return logsmap;
});

export const emptyWithHeatmap = withActions(() => {
  const map = createComponent({});
  map.viewZoom = '2';
  map.mode = 'heatmap';
  map.heatmapPoints = [];
  return map;
});
