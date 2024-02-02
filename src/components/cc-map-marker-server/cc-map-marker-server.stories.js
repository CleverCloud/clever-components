import './cc-map-marker-server.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🛠 Maps/<cc-map-marker-server>',
  component: 'cc-map-marker-server',
};

const conf = {
  component: 'cc-map-marker-server',
  displayMode: 'flex-wrap',
};

export const defaultStory = makeStory(conf, {
  items: [
    { state: 'default' },
    { state: 'hovered' },
    { state: 'selected' },
  ],
});

export const stateWithDefault = makeStory(conf, {
  items: [{ state: 'default' }],
});

export const stateWithHovered = makeStory(conf, {
  items: [{ state: 'hovered' }],
});

export const stateWithSelected = makeStory(conf, {
  items: [{ state: 'selected' }],
});
