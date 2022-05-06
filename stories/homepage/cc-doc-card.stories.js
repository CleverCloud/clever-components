import '../../src/homepage/cc-doc-card.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const DEFAULT_CARD = {
  title: 'ruby',
  icons: ['https://assets.clever-cloud.com/logos/ruby.svg'],
  description: 'Run your Ruby and Ruby on Rails applications. Compatible with Rake, Sidekiq and Active Storage for Cellar.',
  link: '#',
};

const MULTIPLE_ICONS_CARD = {
  icons: ['https://assets.clever-cloud.com/logos/java-jar.svg', 'https://assets.clever-cloud.com/logos/maven.svg', 'https://assets.clever-cloud.com/logos/play2.svg'],
  title: 'Java',
  description: 'Deploy Java runtimes with your specific process (Jar or War) or build tools (Maven, SBT…).',
  link: '#',
};

export default {
  title: '🛠 homepage/<cc-doc-card>',
  component: 'cc-doc-card',
};

const conf = {
  component: 'cc-doc-card',
  // language=CSS
  css: `cc-doc-card {
    margin-bottom: 1rem;
    width: 20em;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [DEFAULT_CARD, MULTIPLE_ICONS_CARD],
});

export const skeleton = makeStory(conf, {
  items: [{}],
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
      component.title = DEFAULT_CARD.title;
      component.icons = DEFAULT_CARD.icons;
      component.desc = DEFAULT_CARD.desc;
      component.link = DEFAULT_CARD.link;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  dataLoaded,
  simulations,
});
