import '../../components/addon/cc-elasticsearch-info.js';
import notes from '../../.components-docs/cc-elasticsearch-info.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory, storyWait } from '../lib/make-story.js';

export default {
  title: '🛠 Addon|<cc-elasticsearch-info>',
  component: 'cc-elasticsearch-info',
  parameters: { notes },
};

const conf = {
  component: 'cc-elasticsearch-info',
  css: `
    cc-elasticsearch-info {
      margin-bottom: 1rem;
    }
  `,
};

const links = {
  elasticsearchLink: 'https://my-elasticsearch.com',
  apmLink: 'https://my-apm-link.com',
  kibanaLink: 'https://my-kibana.com',
};

export const defaultStory = makeStory(conf, {
  items: [links],
});

export const hideElasticsearchLink = makeStory(conf, {
  items: [{
    hideElasticsearchLink: true,
    apmLink: links.apmLink,
    kibanaLink: links.kibanaLink,
  }],
});

export const skeletonStory = makeStory(conf, {
  items: [{}],
});

export const errorStory = makeStory(conf, {
  items: [{ error: true }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.elasticsearchLink = links.elasticsearchLink;
      component.apmLink = links.apmLink;
      component.kibanaLink = links.kibanaLink;
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeletonStory,
  errorStory,
  simulations,
});
