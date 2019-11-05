import fakePointsDataNormal from '../assets/country-city-points-normal-orga';
import fakePointsDataMedium from '../assets/country-city-points-medium-orga';
import fakePointsDataBig from '../assets/country-city-points-big-orga';
import { select } from '@storybook/addon-knobs';

const FAKE_POINTS_DATA = [
  fakePointsDataNormal,
  fakePointsDataMedium,
  fakePointsDataBig,
];

let lastSampleIndex;
let fakeDataIndex = 0;

export function getFakePointsData (sampleIndex) {
  if (sampleIndex !== lastSampleIndex) {
    fakeDataIndex = 0;
    lastSampleIndex = sampleIndex;
  }
  const data = Promise.resolve(FAKE_POINTS_DATA[sampleIndex][fakeDataIndex]);
  fakeDataIndex = (fakeDataIndex + 1) % FAKE_POINTS_DATA[sampleIndex].length;
  return data;
}

export function getDataSampleKnob () {
  return select('Sample', {
    'Normal orga': 0,
    'Medium orga': 1,
    'Really big orga': 2,
  }, 1);
}
