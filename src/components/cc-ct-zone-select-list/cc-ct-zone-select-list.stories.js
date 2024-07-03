
// Don't forget to import the component you're presenting!
import './cc-ct-zone-select-list.js';
import {
  iconCleverOracle as iconOracle,
  iconCleverCleverCloud as iconCleverCloud,
  iconCleverOvh as iconOvh,
  iconCleverOvhHds as iconOvhHds,
  iconCleverScaleway as iconScaleway,
} from '../../assets/cc-clever.icons.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  // this makes storybook generate a doc from the custom elements manifest
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-ct-zone-select-list>',
  // This component name is used by Storybook's docs page for the API table.
  // It will use `custom-elements.json` documentation file.
  // Run `npm run components:docs-json` to generate this JSON file.
  component: 'cc-ct-zone-select-list',
};

const conf = {
  component: 'cc-ct-zone-select-list',
  // You may need to add some CSS just for your stories.
  // language=CSS
  css: ``,
};

const DEFAULT_ITEMS = [
  {
    name: 'scw',
    city: 'Paris',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="Layer_1" x="0" y="0" version="1.1" viewBox="0 0 40.8 47.9"><style>.st0{fill:#4f0599}</style><path d="M18.7 37.1c-1.6 0-2.9-1.3-2.9-2.9 0-1.6 1.3-2.9 2.9-2.9h3.6c1 0 1.9-.8 1.9-1.9v-7.2c0-1.6 1.3-2.9 2.9-2.9 1.6 0 2.9 1.3 2.9 2.9v11.4c-.1 1.8-1.5 3.3-3.3 3.5h-8z" class="st0"/><path d="M18.7 37h7.9c1.7-.2 3.1-1.6 3.2-3.4V22.2c0-1.5-1.2-2.7-2.8-2.7-1.5 0-2.7 1.2-2.7 2.7v7.2c0 1.1-.9 2-2.1 2h-3.6c-1.5 0-2.7 1.2-2.8 2.7.1 1.7 1.3 2.9 2.9 2.9zm-4.8-8.4c-1.6 0-2.9-1.3-2.9-2.9V14.4c.1-1.8 1.5-3.3 3.3-3.5h8c1.6 0 2.9 1.3 2.9 2.9 0 .8-.3 1.5-.8 2.1-.5.6-1.3.9-2.1.9h-3.6c-1 0-1.9.8-1.9 1.9v7.2c0 1.4-1.3 2.7-2.9 2.7z" class="st0"/><path d="M22.3 11h-7.9c-1.7.2-3.1 1.6-3.2 3.4v11.4c0 1 .5 2 1.3 2.5.9.5 2 .5 2.8 0 .9-.5 1.4-1.5 1.3-2.5v-7.2c0-.5.2-1.1.6-1.4.4-.4.9-.6 1.5-.6h3.6c1.5 0 2.7-1.2 2.8-2.7-.1-1.7-1.3-2.9-2.8-2.9z" class="st0"/><path d="M23.5 5.8c3 0 6 1.2 8.1 3.3 2.1 2.1 3.4 5 3.3 8.1v21.9c-.3 1.5-1.5 2.7-3 2.9H17.3c-3 0-5.9-1.2-8.1-3.3-2.1-2.1-3.4-5-3.4-8.1V9.4c0-2 1.6-3.5 3.5-3.6h14.2zm.1-5.8H9.1C4.1 0 0 4.1 0 9.1v21.7c0 4.5 1.8 8.9 5 12.1 3.2 3.2 7.6 5 12.2 5h15.3c4.3-.3 7.8-3.7 8.3-8V17.1c0-4.5-1.8-8.9-5.1-12.1-3.2-3.2-7.6-5-12.1-5z" class="st0"/></svg>',
    },
    countryCode: 'FR',
    tags: [
      'green',
    ],
  },
  {
    name: 'sgp',
    city: 'Singapore',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny-ps" version="1.2" viewBox="0 0 1505 909"><style/><path id="Layer" fill-rule="evenodd" d="M1407.08 52.27l-160.24 283.35h-168.16L880.85 684.34h168.16l-126.62 223.9h413.47c193.88-243.71 223.55-582.53 71.22-855.97zM592.01 908.24L1116.27.76H673.13L372.42 523.85 99.41 50.29C-54.9 323.73-27.2 664.53 172.61 908.24h419.4z" fill="#000e9c"/></svg>',
    },
    countryCode: 'SG',
    tags: [],
  },
  {
    name: 'par',
    city: 'Paris',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 115"><g fill="none" fill-rule="evenodd"><path fill="#AB2B4A" d="M107.998 28.748v57.5L97.297 72.499 91.335 57.5h-.004l5.662-15.209z"/><path fill="#E87A68" d="M8.004 28.748v57.5l9.46-13.333L24.667 57.5h.004l-7.323-14.625z"/><path fill="#D74D4E" d="M91.331 57.5l-31.515 1.992L24.667 57.5l14.668-28.752L58.001 0l20.296 31.564z"/><path fill="#BD3246" d="M107.998 28.748L91.331 57.5 58.001 0z"/><path fill="#F19175" d="M58.001 0L24.667 57.5 8 28.748z"/><path fill="#CF3942" d="M91.331 57.5L79.94 82.328 58.001 115 35.424 81.23 24.667 57.5z"/><path fill="#E0625B" d="M58.001 115L8 86.248 24.667 57.5z"/><path fill="#9A244F" d="M57.998 115l50-28.752L91.331 57.5z"/></g></svg>',
    },
    countryCode: 'FR',
    tags: [],
  },
  {
    name: 'grahds',
    city: 'Gravelines',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny-ps" version="1.2" viewBox="0 0 1505 909"><style/><path id="Layer" fill-rule="evenodd" d="M1407.08 52.27l-160.24 283.35h-168.16L880.85 684.34h168.16l-126.62 223.9h413.47c193.88-243.71 223.55-582.53 71.22-855.97zM592.01 908.24L1116.27.76H673.13L372.42 523.85 99.41 50.29C-54.9 323.73-27.2 664.53 172.61 908.24h419.4z" fill="#000e9c"/></svg>',
    },
    countryCode: 'FR',
    tags: [],
  },
  {
    name: 'mtl',
    city: 'Montreal',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny-ps" version="1.2" viewBox="0 0 1505 909"><style/><path id="Layer" fill-rule="evenodd" d="M1407.08 52.27l-160.24 283.35h-168.16L880.85 684.34h168.16l-126.62 223.9h413.47c193.88-243.71 223.55-582.53 71.22-855.97zM592.01 908.24L1116.27.76H673.13L372.42 523.85 99.41 50.29C-54.9 323.73-27.2 664.53 172.61 908.24h419.4z" fill="#000e9c"/></svg>',
    },
    countryCode: 'CA',
    tags: [],
  },
  {
    name: 'syd',
    city: 'Sydney',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny-ps" version="1.2" viewBox="0 0 1505 909"><style/><path id="Layer" fill-rule="evenodd" d="M1407.08 52.27l-160.24 283.35h-168.16L880.85 684.34h168.16l-126.62 223.9h413.47c193.88-243.71 223.55-582.53 71.22-855.97zM592.01 908.24L1116.27.76H673.13L372.42 523.85 99.41 50.29C-54.9 323.73-27.2 664.53 172.61 908.24h419.4z" fill="#000e9c"/></svg>',
    },
    countryCode: 'AU',
    tags: [],
  },
  {
    name: 'rbx',
    city: 'Roubaix',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny-ps" version="1.2" viewBox="0 0 1505 909"><style/><path id="Layer" fill-rule="evenodd" d="M1407.08 52.27l-160.24 283.35h-168.16L880.85 684.34h168.16l-126.62 223.9h413.47c193.88-243.71 223.55-582.53 71.22-855.97zM592.01 908.24L1116.27.76H673.13L372.42 523.85 99.41 50.29C-54.9 323.73-27.2 664.53 172.61 908.24h419.4z" fill="#000e9c"/></svg>',
    },
    countryCode: 'FR',
    tags: [],
  },
  {
    name: 'wsw',
    city: 'Warsaw',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny-ps" version="1.2" viewBox="0 0 1505 909"><style/><path id="Layer" fill-rule="evenodd" d="M1407.08 52.27l-160.24 283.35h-168.16L880.85 684.34h168.16l-126.62 223.9h413.47c193.88-243.71 223.55-582.53 71.22-855.97zM592.01 908.24L1116.27.76H673.13L372.42 523.85 99.41 50.29C-54.9 323.73-27.2 664.53 172.61 908.24h419.4z" fill="#000e9c"/></svg>',
    },
    countryCode: 'PL',
    tags: [],
  },
  {
    name: 'rbxhds',
    city: 'Roubaix',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny-ps" version="1.2" viewBox="0 0 1505 909"><style/><path id="Layer" fill-rule="evenodd" d="M1407.08 52.27l-160.24 283.35h-168.16L880.85 684.34h168.16l-126.62 223.9h413.47c193.88-243.71 223.55-582.53 71.22-855.97zM592.01 908.24L1116.27.76H673.13L372.42 523.85 99.41 50.29C-54.9 323.73-27.2 664.53 172.61 908.24h419.4z" fill="#000e9c"/></svg>',
    },
    countryCode: 'FR',
    tags: [],
  },
  {
    name: 'fr-north-hds',
    city: 'North',
    infra: {
      content: '<svg xmlns="http://www.w3.org/2000/svg" baseProfile="tiny-ps" version="1.2" viewBox="0 0 1505 909"><style/><path id="Layer" fill-rule="evenodd" d="M1407.08 52.27l-160.24 283.35h-168.16L880.85 684.34h168.16l-126.62 223.9h413.47c193.88-243.71 223.55-582.53 71.22-855.97zM592.01 908.24L1116.27.76H673.13L372.42 523.85 99.41 50.29C-54.9 323.73-27.2 664.53 172.61 908.24h419.4z" fill="#000e9c"/></svg>',
    },
    countryCode: 'FR',
    tags: [],
  },
];
export const defaultStory = makeStory(conf, {
  items: [{
    state: {
      type: 'loaded',
      zoneItems: DEFAULT_ITEMS,
    },
  }],
});

export const skeleton = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const simulations = makeStory(conf, {
  items: [{ state: { type: 'loading' } }, { state: { type: 'loading' } }],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.state.zoneItems = DEFAULT_ITEMS;
      component.state.type = 'loaded';
      componentError.state.type = 'error';
    }),
  ],
});
