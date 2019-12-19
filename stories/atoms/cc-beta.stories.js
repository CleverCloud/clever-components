import '../../components/atoms/cc-beta.js';
import notes from '../../.components-docs/cc-beta.md';
import { createStoryItem, makeStory } from '../lib/make-story.js';
import { defaultStory as logsmap } from '../maps/cc-logsmap.stories.js';
import { defaultStory as requests } from '../overview/cc-tile-requests.stories.js';
import { defaultStory as statusCodes } from '../overview/cc-tile-status-codes.stories.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '1. Atoms|<cc-beta>',
  component: 'cc-beta',
  parameters: { notes },
};

const conf = {
  component: 'cc-beta',
};

export const defaultStory = makeStory(conf, {
  css: `
    cc-beta {
      display: inline-block;
      margin-bottom: 1rem;
      margin-right: 1rem;
    }
    cc-beta * {
      background-color: #ddd;
      height: 150px;
      line-height: 150px;
      text-align: center;
      width: 200px;
    }
  `,
  items: [
    { position: 'top-left', innerHTML: `<div class="component">top-left</div>` },
    { position: 'bottom-left', innerHTML: `<div class="component">bottom-left</div>` },
    { position: 'top-right', innerHTML: `<div class="component">top-right</div>` },
    { position: 'bottom-right', innerHTML: `<div class="component">bottom-right</div>` },
  ],
});

export const withTiles = makeStory(conf, {
  docs: 'Here we set a size to the `<cc-beta>` container and we enable `fill` to make sure the tiles adapt their size to it.',
  css: `
    cc-beta {
      display: inline-block;
      margin-bottom: 1rem;
      margin-right: 1rem;
      vertical-align: bottom;
      height: 300px;
      width: 300px;
    }
  `,
  items: [
    { position: 'bottom-right', fill: true, children: () => [createStoryItem(requests, { style: '' })] },
    { position: 'bottom-right', fill: true, children: () => [createStoryItem(statusCodes, { style: '' })] },
  ],
});

export const withMap = makeStory(conf, {
  docs: 'Here we set a size to the `<cc-beta>` container and we enable `fill` to make sure the map adapt its size to it.',
  css: `
    cc-beta {
      margin-bottom: 1rem;
      margin-right: 1rem;
      height: 300px;
      width: 400px;
    }
  `,
  items: [
    { position: 'top-right', fill: true, children: () => [createStoryItem(logsmap)] },
  ],
});

enhanceStoriesNames({ defaultStory, withTiles, withMap });
