import './cc-article-list.js';
import '../smart/cc-smart-container.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withCache } from '@clevercloud/client/esm/with-cache.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { defineComponent } from '../lib/smart-manager.js';
import { parseRssFeed } from '../lib/xml-parser.js';

const FOUR_HOURS = 1000 * 60 * 60 * 4;

defineComponent({
  selector: 'cc-article-list',
  params: {
    lang: { type: String },
    limit: { type: Number },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const articles_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      articles_lp.error$.subscribe(console.error),
      articles_lp.error$.subscribe(() => (component.error = true)),
      articles_lp.value$.subscribe((articles) => (component.articles = articles)),

      context$.subscribe(({ lang, limit }) => {

        component.error = false;
        component.articles = null;

        // limit has a defaut value
        if (lang != null) {
          articles_lp.push((signal) => fetchArticleList({ signal, lang, limit }));
        }

      }),

    ]);

  },
});

async function fetchArticleList ({ signal, lang, limit = 9 }) {

  const url = (lang === 'fr')
    ? 'https://www.clever-cloud.com/fr/feed/?format=excerpt'
    : 'https://www.clever-cloud.com/feed/?format=excerpt';

  const requestParams = {
    method: 'get',
    url,
    headers: {},
    signal,
  };

  const rssFeed = await withCache(
    requestParams,
    FOUR_HOURS,
    () => request(requestParams));

  const articleList = parseRssFeed(rssFeed, limit);

  return articleList;
}
