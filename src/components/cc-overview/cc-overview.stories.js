import './cc-overview.js';
import { createStoryItem, makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';
import { withMap as betaWithMap, withTiles as betaWithTiles } from '../cc-beta/cc-beta.stories.js';
import { defaultStory as headerApp } from '../cc-header-app/cc-header-app.stories.js';
import { defaultStory as headerOrga } from '../cc-header-orga/cc-header-orga.stories.js';
import { defaultStory as logsmap } from '../cc-logsmap/cc-logsmap.stories.js';
import { defaultStory as consumption } from '../cc-tile-consumption/cc-tile-consumption.stories.js';
import { defaultStory as deployments } from '../cc-tile-deployments/cc-tile-deployments.stories.js';
import { defaultStory as instances } from '../cc-tile-instances/cc-tile-instances.stories.js';
import { defaultStory as requests } from '../cc-tile-requests/cc-tile-requests.stories.js';
import { defaultStory as scalability } from '../cc-tile-scalability/cc-tile-scalability.stories.js';
import { defaultStory as statusCodes } from '../cc-tile-status-codes/cc-tile-status-codes.stories.js';

export default {
  title: '🛠 Overview/<cc-overview>',
  component: 'cc-overview',
};

const conf = {
  component: 'cc-overview',
  displayMode: 'blocks',
  // language=CSS
  css: `
    :host {
      max-width: 100% !important;
    }
    cc-overview {
      min-height: 750px;
    }
  `,
};

// language=CSS
const placeholderCss = `
  :host {
    max-width: 100% !important;
  }
  cc-overview * {
    background-color: #eee;
    padding: 1rem;
  }
  cc-overview .main {
    min-height: 200px;
  }
`;

export const defaultStory = makeStory(conf, {
  css: placeholderCss,
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

export const orgaModeWithTwoHeads = makeStory(conf, {
  docs: 'If you place two or more heads in your overview, you\'ll need to specify how many with the CSS custom property: `--cc-overview-head-count: 2`.',
  css: placeholderCss,
  items: [
    {
      mode: 'orga',
      style: '--cc-overview-head-count: 2',
      innerHTML: `
        <div class="head">HEAD A</div>
        <div class="head">HEAD B</div>
        <div>TILE A</div>
        <div>TILE B</div>
        <div class="main">MAIN</div>
      `,
    },
  ],
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

export const appModeWithTwoHeads = makeStory(conf, {
  docs: 'If you place two or more heads in your overview, you\'ll need to specify how many with the CSS custom property: `--cc-overview-head-count: 2`.',
  css: placeholderCss,
  items: [
    {
      mode: 'app',
      style: '--cc-overview-head-count: 2',
      innerHTML: `
        <div class="head">HEAD A</div>
        <div class="head">HEAD B</div>
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

enhanceStoriesNames({ defaultStory, orgaMode, orgaModeWithTwoHeads, appMode, appModeWithBeta, appModeWithTwoHeads });
