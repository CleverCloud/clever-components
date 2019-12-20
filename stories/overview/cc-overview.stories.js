import '../../components/overview/cc-overview.js';
import notes from '../../.components-docs/cc-overview.md';
import { createStoryItem, makeStory } from '../lib/make-story.js';
import { defaultStory as consumption } from '../overview/cc-tile-consumption.stories.js';
import { defaultStory as deployments } from '../overview/cc-tile-deployments.stories.js';
import { defaultStory as headerApp } from './cc-header-app.stories.js';
import { defaultStory as headerOrga } from './cc-header-orga.stories';
import { defaultStory as instances } from '../overview/cc-tile-instances.stories.js';
import { defaultStory as logsmap } from '../maps/cc-logsmap.stories.js';
import { defaultStory as requests } from './cc-tile-requests.stories.js';
import { defaultStory as scalability } from '../overview/cc-tile-scalability.stories.js';
import { defaultStory as statusCodes } from './cc-tile-status-codes.stories.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { withMap as betaWithMap, withTiles as betaWithTiles } from '../atoms/cc-beta.stories.js';

export default {
  title: '🛠 Overview|<cc-overview>',
  component: 'cc-overview',
  parameters: { notes },
};

const conf = {
  component: 'cc-overview',
  css: `
    cc-overview {
      min-height: 750px;
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory({
  component: 'cc-overview',
  css: `
    cc-overview {
      margin-bottom: 1rem;
    }
    cc-overview * {
      background-color: #eee;
      padding: 1rem;
    }
    cc-overview .main {
      min-height: 200px;
    }
  `,
  items: [
    {
      mode: 'app',
      innerHTML: `
        <div class="head">HEAD</div>
        <div>TILE A</div>
        <div>TILE B</div>
        <div>TILE C</div>
        <div>TILE D</div>
        <div>TILE E</div>
        <div>TILE F</div>
        <div class="main">MAIN</div>
      `,
    },
  ],
});

export const orgaMode = makeStory(conf, {
  items: [{
    mode: 'orga',
    children: () => [
      createStoryItem(headerOrga, { class: 'head' }),
      createStoryItem(statusCodes),
      createStoryItem(requests, { style: '' }),
      createStoryItem(logsmap, { class: 'main' }),
    ],
  }],
});

export const appMode = makeStory(conf, {
  items: [{
    mode: 'app',
    children: () => [
      createStoryItem(headerApp, { class: 'head' }),
      createStoryItem(instances),
      createStoryItem(scalability),
      createStoryItem(deployments),
      createStoryItem(consumption),
      createStoryItem(statusCodes),
      createStoryItem(requests, { style: '' }),
      createStoryItem(logsmap, { class: 'main' }),
    ],
  }],
});

export const appModeWithBeta = makeStory(conf, {
  items: [{
    mode: 'app',
    children: () => [
      createStoryItem(headerApp, { class: 'head' }),
      createStoryItem(instances),
      createStoryItem(scalability),
      createStoryItem(deployments),
      createStoryItem(consumption),
      createStoryItem(betaWithTiles, {}, 1),
      createStoryItem(betaWithTiles, {}, 0),
      createStoryItem(betaWithMap, { class: 'main' }),
    ],
  }],
});

enhanceStoriesNames({ defaultStory, orgaMode, appMode, appModeWithBeta });
