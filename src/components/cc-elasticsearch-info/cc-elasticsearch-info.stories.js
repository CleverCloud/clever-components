import './cc-elasticsearch-info.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-elasticsearch-info>',
  component: 'cc-elasticsearch-info',
};

const conf = {
  component: 'cc-elasticsearch-info',
};

/**
 * @typedef {import('./cc-elasticsearch-info.js').CcElasticsearchInfo} CcElasticsearchInfo
 * @typedef {import('./cc-elasticsearch-info.types.js').ElasticSearchInfoStateLoaded} ElasticSearchInfoStateLoaded
 * @typedef {import('./cc-elasticsearch-info.types.js').ElasticSearchInfoStateLoading} ElasticSearchInfoStateLoading
 * @typedef {import('./cc-elasticsearch-info.types.js').ElasticSearchInfoStateError} ElasticSearchInfoStateError
 * @typedef {import('./cc-elasticsearch-info.types.js').LinkLoaded} LinkLoaded
 */

/** @type {LinkLoaded} */
const elasticsearchLink = { type: 'elasticsearch', href: 'https://my-elasticsearch.com' };
/** @type {LinkLoaded} */
const kibanaLink = { type: 'kibana', href: 'https://my-kibana.com' };
/** @type {LinkLoaded} */
const apmLink = { type: 'apm', href: 'https://my-apm-link.com' };

export const defaultStory = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoaded} */
    state: {
      type: 'loaded',
      links: [elasticsearchLink, kibanaLink, apmLink],
    },
  }],
});

export const elasticOnly = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoaded} */
    state: {
      type: 'loaded',
      links: [elasticsearchLink],
    },
  }],
});

export const elasticAndKibana = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoaded} */
    state: {
      type: 'loaded',
      links: [elasticsearchLink, kibanaLink],
    },
  }],
});

export const elasticAndApm = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoaded} */
    state: {
      type: 'loaded',
      links: [elasticsearchLink, apmLink],
    },
  }],
});

export const elasticKibanaAndApm = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoaded} */
    state: {
      type: 'loaded',
      links: [apmLink, kibanaLink, elasticsearchLink],
    },
  }],
});

export const noLinks = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoaded} */
    state: {
      type: 'loaded',
      links: [],
    },
  }],
});

export const onlyKibana = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoaded} */
    state: {
      type: 'loaded',
      links: [kibanaLink],
    },
  }],
});

export const onlyApm = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoaded} */
    state: {
      type: 'loaded',
      links: [apmLink],
    },
  }],
});

export const kibanaAndApm = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoaded} */
    state: {
      type: 'loaded',
      links: [kibanaLink, apmLink],
    },
  }],
});

export const loading = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateLoading} */
    state: {
      type: 'loading',
      links: [{ type: 'elasticsearch' }, { type: 'apm' }, { type: 'kibana' }],
    },
  }],
});

export const errorStory = makeStory(conf, {
  items: [{
    /** @type {ElasticSearchInfoStateError} */
    state: { type: 'error' },
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000,
      /** @param {CcElasticsearchInfo[]} components */
      ([component, componentError]) => {
        component.state = {
          type: 'loaded',
          links: [elasticsearchLink, kibanaLink, apmLink],
        };

        componentError.state = {
          type: 'error',
        };
      }),
  ],
});
