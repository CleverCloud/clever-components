import '../../src/addon/cc-elasticsearch-info.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Addon/<cc-elasticsearch-info>',
  component: 'cc-elasticsearch-info',
};

const conf = {
  component: 'cc-elasticsearch-info',
  css: `
    cc-elasticsearch-info {
      margin-bottom: 1rem;
    }
  `,
};

const elasticsearchLink = { type: 'elasticsearch', href: 'https://my-elasticsearch.com' };
const kibanaLink = { type: 'kibana', href: 'https://my-kibana.com' };
const apmLink = { type: 'apm', href: 'https://my-apm-link.com' };

export const defaultStory = makeStory(conf, {
  items: [{ links: [elasticsearchLink, kibanaLink, apmLink] }],
});

export const elasticOnly = makeStory(conf, {
  items: [{ links: [elasticsearchLink] }],
});

export const elasticAndKibana = makeStory(conf, {
  items: [{ links: [elasticsearchLink, kibanaLink] }],
});

export const elasticAndApm = makeStory(conf, {
  items: [{ links: [elasticsearchLink, apmLink] }],
});

export const elasticKibanaAndApm = makeStory(conf, {
  items: [{ links: [elasticsearchLink, kibanaLink, apmLink] }],
});

export const noLinks = makeStory(conf, {
  items: [{ links: [] }],
});

export const onlyKibana = makeStory(conf, {
  items: [{ links: [kibanaLink] }],
});

export const onlyApm = makeStory(conf, {
  items: [{ links: [apmLink] }],
});

export const kibanaAndApm = makeStory(conf, {
  items: [{ links: [kibanaLink, apmLink] }],
});

export const skeleton = makeStory(conf, {
  items: [{ links: [{ type: 'elasticsearch' }] }],
});

export const errorStory = makeStory(conf, {
  items: [{ error: true }],
});

export const simulations = makeStory(conf, {
  items: [
    { links: [{ type: 'elasticsearch' }] },
    {},
  ],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.links = [elasticsearchLink, kibanaLink];
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  elasticOnly,
  elasticAndKibana,
  elasticAndApm,
  elasticKibanaAndApm,
  noLinks,
  onlyKibana,
  onlyApm,
  kibanaAndApm,
  skeleton,
  errorStory,
  simulations,
});
