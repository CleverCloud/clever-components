import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-tile-status-codes.js';
import './cc-tile-status-codes.smart.js';

const DATA = [
  { 200: 47640, 206: 2011, 302: 11045, 303: 457, 304: 12076, 500: 16 },
  { 200: 1000, 201: 10, 302: 100, 401: 150, 404: 300, 500: 200 },
  { 101: 75, 200: 800, 201: 50, 302: 80, 401: 200, 404: 100, 500: 100 },
];

export default {
  tags: ['autodocs'],
  title: '🛠 Overview/<cc-tile-status-codes>',
  component: 'cc-tile-status-codes',
};

const conf = {
  component: 'cc-tile-status-codes',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-tile-status-codes {
      width: 275px;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ state: { type: 'loaded', statusCodes: DATA[0] } }],
});

export const loading = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const empty = makeStory(conf, {
  items: [{ state: { type: 'loaded', statusCodes: [] } }],
});

export const dataLoaded = makeStory(conf, {
  items: [
    { state: { type: 'loaded', statusCodes: DATA[0] } },
    { state: { type: 'loaded', statusCodes: DATA[1] } },
    { state: { type: 'loaded', statusCodes: DATA[2] } },
  ],
});

export const unknownCode = makeStory(conf, {
  items: [
    { state: { type: 'loaded', statusCodes: { ...DATA[0], 600: 5000, 700: 10000 } } },
    { state: { type: 'loaded', statusCodes: { ...DATA[1], 600: 50, 700: 100 } } },
    { state: { type: 'loaded', statusCodes: { ...DATA[2], 600: 50, 700: 100 } } },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.state = { type: 'loaded', statusCodes: DATA[0] };
      componentError.state = { type: 'error' };
    }),
  ],
});
