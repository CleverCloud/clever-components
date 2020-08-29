import '../../src/maps/cc-map-marker-dot.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Maps/<cc-map-marker-dot>',
  component: 'cc-map-marker-dot',
};

const conf = {
  component: 'cc-map-marker-dot',
  // language=CSS
  css: `
    cc-map-marker-dot {
      --cc-map-marker-dot-size: 12px;
      display: inline-block;
      margin-right: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { count: 1 },
    { count: 2 },
    { count: 3 },
    { count: 5 },
    { count: 10 },
    { count: 15 },
    { count: 25 },
    { count: 50 },
    { count: 75 },
    { count: 100 },
    { count: 150 },
    { count: 500 },
    { count: 1000 },
    { count: 2000 },
    { count: 10000 },
    { count: 100000 },
    { count: 1000000 },
    { count: 10000000 },
    { count: 100000000 },
  ],
});

export const size = makeStory(conf, {
  items: [
    { count: 10, style: '--cc-map-marker-dot-size: 6px' },
    { count: 10, style: '--cc-map-marker-dot-size: 8px' },
    { count: 10, style: '--cc-map-marker-dot-size: 10px' },
    { count: 10, style: '--cc-map-marker-dot-size: 12px' },
    { count: 10, style: '--cc-map-marker-dot-size: 14px' },
    { count: 10, style: '--cc-map-marker-dot-size: 16px' },
    { count: 10, style: '--cc-map-marker-dot-size: 18px' },
    { count: 10, style: '--cc-map-marker-dot-size: 20px' },
  ],
});

enhanceStoriesNames({
  defaultStory,
  size,
});
