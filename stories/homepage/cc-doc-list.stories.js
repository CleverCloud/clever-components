import '../../src/homepage/cc-doc-list.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

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

export default {
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

    cc-doc-list {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ docs: DOCS_ITEMS }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

// No need to invest time on empty story right now.

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoaded = makeStory(conf, {
  items: [{ docs: DOCS_ITEMS }],
});

export const simulationsWithSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000, ([component]) => {
      component.docs = DOCS_ITEMS;
    }),
  ],
});

export const simulationsWithFailure = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000, ([component]) => {
      component.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  dataLoaded,
  simulationsWithSuccess,
  simulationsWithFailure,
});
