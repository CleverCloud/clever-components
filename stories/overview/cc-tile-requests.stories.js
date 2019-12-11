import '../../components/overview/cc-tile-requests.js';
import notes from '../../.components-docs/cc-tile-requests.md';
import { createContainer } from '../lib/dom.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { sequence } from '../lib/sequence.js';

function createComponent (data, width = '275px') {
  const component = document.createElement('cc-tile-requests');
  component.style.width = width;
  component.style.display = 'inline-grid';
  component.style.marginBottom = '1rem';
  component.style.marginRight = '1rem';
  if (data != null) {
    component.data = data;
  }
  return component;
}

const REQUESTS_COUNTS_BIG = [
  596600,
  219080,
  165930,
  124350,
  98820,
  89510,
  108320,
  310880,
  97549,
  63093,
  112781,
  120270,
];
const REQUESTS_COUNTS_SMALL = [895, 2, 78, 95, 630, 3966, 2190, 1659, 988, 1127, 1202, 1243];
const REQUESTS_COUNTS_SIMILAR = [
  220024,
  220132,
  220088,
  220248,
  220242,
  220101,
  220092,
  220011,
  220736,
  220521,
  220098,
  220881,
];

const ONE_HOUR = 1000 * 60 * 60;
const HOURS_IN_A_DAY = 24;

function generateData (dataSample) {
  const now = new Date();
  const nowTs = now.getTime();
  const nowRoundedTs = nowTs - (nowTs % ONE_HOUR);
  const startTs = nowRoundedTs - ONE_HOUR * HOURS_IN_A_DAY;

  return Array.from(new Array(HOURS_IN_A_DAY)).map((a, i) => {
    const sampleStartTs = startTs + i * ONE_HOUR;
    const sampleEndTs = startTs + (i + 1) * ONE_HOUR;
    const requestsCount = dataSample[i % dataSample.length];
    return [sampleStartTs, sampleEndTs, requestsCount];
  });
}

export default {
  title: '2. Overview|<cc-tile-requests>',
  parameters: { notes },
};

export const skeleton = () => {
  return createContainer([
    'loading (275px, 380px, 540px)',
    createComponent(null, '275px'),
    createComponent(null, '380px'),
    createComponent(null, '540px'),
  ]);
};

export const error = () => {
  const errorComponent = createComponent();
  errorComponent.error = true;
  return createContainer(['Error', errorComponent]);
};

export const empty = () => {
  return createContainer(['Empty data', createComponent([])]);
};

export const dataLoaded = () => {
  return createContainer([
    'big number of requests (275px, 380px, 540px)',
    createComponent(generateData(REQUESTS_COUNTS_BIG), '275px'),
    createComponent(generateData(REQUESTS_COUNTS_BIG), '380px'),
    createComponent(generateData(REQUESTS_COUNTS_BIG), '540px'),
    'small number of requests (275px, 380px, 540px)',
    createComponent(generateData(REQUESTS_COUNTS_SMALL), '275px'),
    createComponent(generateData(REQUESTS_COUNTS_SMALL), '380px'),
    createComponent(generateData(REQUESTS_COUNTS_SMALL), '540px'),
    'similar number of requests (275px, 380px, 540px)',
    createComponent(generateData(REQUESTS_COUNTS_SIMILAR), '275px'),
    createComponent(generateData(REQUESTS_COUNTS_SIMILAR), '380px'),
    createComponent(generateData(REQUESTS_COUNTS_SIMILAR), '540px'),
  ]);
};

export const simulations = () => {
  const componentSmallError = createComponent(null, '275px');
  const componentMediumError = createComponent(null, '380px');
  const componentBigError = createComponent(null, '540px');
  const componentSmall = createComponent(null, '275px');
  const componentMedium = createComponent(null, '380px');
  const componentBig = createComponent(null, '540px');

  sequence(async wait => {
    await wait(2000);
    componentSmallError.error = true;
    componentMediumError.error = true;
    componentBigError.error = true;
    componentSmall.data = generateData(REQUESTS_COUNTS_BIG);
    componentMedium.data = generateData(REQUESTS_COUNTS_BIG);
    componentBig.data = generateData(REQUESTS_COUNTS_BIG);
  });

  return createContainer([
    'Loading, then error (275px, 380px, 540px)',
    componentSmallError,
    componentMediumError,
    componentBigError,
    'Loading, then some data (275px, 380px, 540px)',
    componentSmall,
    componentMedium,
    componentBig,
  ]);
};

enhanceStoriesNames({ skeleton, error, empty, dataLoaded, simulations });
