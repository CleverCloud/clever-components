import './cc-doc-card.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

const DEFAULT_CARD = {
  state: {
    type: 'loaded',
    heading: 'ruby',
    icons: ['https://assets.clever-cloud.com/logos/ruby.svg'],
    description: 'Run your Ruby and Ruby on Rails applications. Compatible with Rake, Sidekiq and Active Storage for Cellar.',
    link: '#',
  },
};

const MULTIPLE_ICONS_CARD = {
  state: {
    type: 'loaded',
    icons: ['https://assets.clever-cloud.com/logos/java-jar.svg', 'https://assets.clever-cloud.com/logos/maven.svg', 'https://assets.clever-cloud.com/logos/play2.svg'],
    heading: 'Java',
    description: 'Deploy Java runtimes with your specific process (Jar or War) or build tools (Maven, SBT…).',
    link: '#',
  },
};

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

export const defaultStory = makeStory(conf, {
  items: [DEFAULT_CARD, MULTIPLE_ICONS_CARD],
});

export const skeleton = makeStory(conf, {
  items: [{
    state: {
      type: 'loading',
    },
  }],
});

// No need to invest time on empty story right now.

// The component does not need an error story.

export const dataLoaded = makeStory(conf, {
  items: [DEFAULT_CARD],
});

export const simulations = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = DEFAULT_CARD.state;
    }),
  ],
});
