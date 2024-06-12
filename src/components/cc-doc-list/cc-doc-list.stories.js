import './cc-doc-list.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

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
 * @typedef {import('./cc-doc-list.js').CcDocList} CcDocList
 * @typedef {import('./cc-doc-list.types.js').DocListStateLoaded} DocListStateLoaded
 * @typedef {import('./cc-doc-list.types.js').DocListStateLoading} DocListStateLoading
 * @typedef {import('./cc-doc-list.types.js').DocListStateError} DocListStateError
 * @typedef {import('../cc-doc-card/cc-doc-card.types.js').DocCardStateLoaded} DocCardStateLoaded
 * @typedef {import('../cc-doc-card/cc-doc-card.types.js').DocCard} DocCard
 */

/** @type {DocCard[]} */
const DOCS_ITEMS = [
  {
    heading: 'ruby',
    icons: ['https://assets.clever-cloud.com/logos/ruby.svg'],
    description: 'Run your Ruby and Ruby on Rails applications. Compatible with Rake, Sidekiq and Active Storage for Cellar.',
    link: '#',
  },
  {
    heading: 'Java',
    icons: ['https://assets.clever-cloud.com/logos/java-jar.svg', 'https://assets.clever-cloud.com/logos/maven.svg', 'https://assets.clever-cloud.com/logos/play2.svg'],
    description: 'Deploy Java runtimes with your specific process (Jar or War) or build tools (Maven, SBT…).',
    link: '#',
  },
  {
    heading: 'python',
    icons: ['https://assets.clever-cloud.com/logos/python.svg'],
    description: 'Python runtimes, perfect for deploying simple Python services or complex Django applications.',
    link: '#',
  },
  {
    heading: 'php',
    icons: ['https://assets.clever-cloud.com/logos/php.svg'],
    description: 'PHP is deployable with both Git and SFTP in version 7.x and 8.x. Need extensions? Check our already installed extensions or ask the support for it.',
    link: '#',
  },
  {
    heading: 'Go',
    icons: ['https://assets.clever-cloud.com/logos/go.svg'],
    description: 'Deploy Golang applications on Clever Cloud with the support of go modules, go build or go get.',
    link: '#',
  },
  {
    heading: 'JavaScript Runtimes',
    icons: ['https://assets.clever-cloud.com/logos/nodejs.svg', 'https://assets.clever-cloud.com/logos/meteor.svg'],
    description: 'Clever Cloud supports Node.js, Meteor and Deno runtimes in a elegant and performant way. Compatible with statsd for advanced statistics, like counters and timers. ',
    link: '#',
  },
];

export const defaultStory = makeStory(conf, {
  items: [{
    /** @type {DocListStateLoaded} */
    state: {
      type: 'loaded',
      docs: DOCS_ITEMS,
    },
  }],
});

export const loading = makeStory(conf, {
  items: [{
    /** @type {DocListStateLoading} */
    state: { type: 'loading' },
  }],
});

// No need to invest time on empty story right now.

export const error = makeStory(conf, {
  items: [{
    /** @type {DocListStateError} */
    state: { type: 'error' },
  }],
});

export const dataLoaded = makeStory(conf, {
  items: [{
    /** @type {DocListStateLoaded} */
    state: {
      type: 'loaded',
      docs: DOCS_ITEMS,
    },
  }],
});

export const simulationsWithSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000,
      /** @param {[CcDocList]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          docs: DOCS_ITEMS,
        };
      }),
  ],
});

export const simulationsWithFailure = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000,
      /** @param {[CcDocList]} components */
      ([component]) => {
        component.state = { type: 'error' };
      }),
  ],
});
