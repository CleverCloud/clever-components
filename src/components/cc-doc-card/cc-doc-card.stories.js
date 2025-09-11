import { getAssetUrl } from '../../lib/assets-url.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-doc-card.js';

export default {
  tags: ['autodocs'],
  title: '🛠 homepage/<cc-doc-card>',
  component: 'cc-doc-card',
};

const conf = {
  component: 'cc-doc-card',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `cc-doc-card {
    width: 20em;
  }`,
};

/**
 * @typedef {import('./cc-doc-card.js').CcDocCard} CcDocCard
 * @typedef {import('./cc-doc-card.types.js').DocCardStateLoaded} DocCardStateLoaded
 * @typedef {import('./cc-doc-card.types.js').DocCardStateLoading} DocCardStateLoading
 */

const DEFAULT_CARD = {
  /** @type {DocCardStateLoaded} */
  state: {
    type: 'loaded',
    heading: 'ruby',
    icons: [getAssetUrl('/logos/ruby.svg')],
    description:
      'Run your Ruby and Ruby on Rails applications. Compatible with Rake, Sidekiq and Active Storage for Cellar.',
    link: '#',
  },
};

const MULTIPLE_ICONS_CARD = {
  /** @type {DocCardStateLoaded} */
  state: {
    type: 'loaded',
    icons: [getAssetUrl('/logos/java-jar.svg'), getAssetUrl('/logos/maven.svg'), getAssetUrl('/logos/play2.svg')],
    heading: 'Java',
    description: 'Deploy Java runtimes with your specific process (Jar or War) or build tools (Maven, SBT…).',
    link: '#',
  },
};

export const defaultStory = makeStory(conf, {
  items: [DEFAULT_CARD, MULTIPLE_ICONS_CARD],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {DocCardStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

// No need to invest time on empty story right now.

// The component does not need an error story.

export const dataLoaded = makeStory(conf, {
  items: [DEFAULT_CARD],
});

export const simulations = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(
      2000,
      /** @param {[CcDocCard]} components */
      ([component]) => {
        component.state = DEFAULT_CARD.state;
      },
    ),
  ],
});
