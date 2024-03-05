import './cc-beta.js';
import { createStoryItem, makeStory } from '../../stories/lib/make-story.js';

import { defaultStory as logsmap } from '../cc-logsmap/cc-logsmap.stories.js';
import { defaultStory as requests } from '../cc-tile-requests/cc-tile-requests.stories.js';
import { defaultStory as statusCodes } from '../cc-tile-status-codes/cc-tile-status-codes.stories.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-beta>',
  component: 'cc-beta',
};

const conf = {
  component: 'cc-beta',
  displayMode: 'flex-wrap',
};

export const defaultStory = makeStory(conf, {
  // language=CSS
  css: `
    cc-beta * {
      background-color: var(--cc-color-bg-neutral-alt);
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
  // language=CSS
  css: `
    cc-beta {
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
  // language=CSS
  css: `
    cc-beta {
      height: 300px;
      width: 400px;
    }
  `,
  items: [
    { position: 'top-right', fill: true, children: () => [createStoryItem(logsmap)] },
  ],
});
