import { getAssetUrl } from '../../lib/assets-url.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-doc-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 homepage/<cc-doc-list>',
  component: 'cc-doc-list',
};

const conf = {
  component: 'cc-doc-list',
  // language=CSS
  css: `
    :host {
      max-width: 92em !important;
    }
  `,
};

/**
 * @import { CcDocList } from './cc-doc-list.js'
 * @import { DocListStateLoaded, DocListStateLoading, DocListStateError } from './cc-doc-list.types.js'
 * @import { DocCardStateLoaded, DocCard } from '../cc-doc-card/cc-doc-card.types.js'
 */

/** @type {DocCard[]} */
const DOCS_ITEMS = [
  {
    heading: 'ruby',
    icons: [getAssetUrl('/logos/ruby.svg')],
    description:
      'Run your Ruby and Ruby on Rails applications. Compatible with Rake, Sidekiq and Active Storage for Cellar.',
    link: '#',
  },
  {
    heading: 'Java',
    icons: [getAssetUrl('/logos/java-jar.svg'), getAssetUrl('/logos/maven.svg'), getAssetUrl('/logos/play2.svg')],
    description: 'Deploy Java runtimes with your specific process (Jar or War) or build tools (Maven, SBT…).',
    link: '#',
  },
  {
    heading: 'python',
    icons: [getAssetUrl('/logos/python.svg')],
    description: 'Python runtimes, perfect for deploying simple Python services or complex Django applications.',
    link: '#',
  },
  {
    heading: 'php',
    icons: [getAssetUrl('/logos/php.svg')],
    description:
      'PHP is deployable with both Git and SFTP in version 7.x and 8.x. Need extensions? Check our already installed extensions or ask the support for it.',
    link: '#',
  },
  {
    heading: 'Go',
    icons: [getAssetUrl('/logos/go.svg')],
    description: 'Deploy Golang applications on Clever Cloud with the support of go modules, go build or go get.',
    link: '#',
  },
  {
    heading: 'JavaScript Runtimes',
    icons: [getAssetUrl('/logos/nodejs.svg'), getAssetUrl('/logos/meteor.svg')],
    description:
      'Clever Cloud supports Node.js, Meteor and Deno runtimes in a elegant and performant way. Compatible with statsd for advanced statistics, like counters and timers. ',
    link: '#',
  },
];

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {DocListStateLoaded} */
      state: {
        type: 'loaded',
        docs: DOCS_ITEMS,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {DocListStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

// No need to invest time on empty story right now.

export const error = makeStory(conf, {
  items: [
    {
      /** @type {DocListStateError} */
      state: { type: 'error' },
    },
  ],
});

export const dataLoaded = makeStory(conf, {
  items: [
    {
      /** @type {DocListStateLoaded} */
      state: {
        type: 'loaded',
        docs: DOCS_ITEMS,
      },
    },
  ],
});

export const simulationsWithSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(
      2000,
      /** @param {[CcDocList]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          docs: DOCS_ITEMS,
        };
      },
    ),
  ],
});

export const simulationsWithFailure = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(
      2000,
      /** @param {[CcDocList]} components */
      ([component]) => {
        component.state = { type: 'error' };
      },
    ),
  ],
});
