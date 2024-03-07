import './cc-article-list.js';
import '../cc-smart-container/cc-smart-container.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withCache } from '@clevercloud/client/esm/with-cache.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { parseRssFeed } from '../../lib/xml-parser.js';

/**
 * @typedef {import('../cc-article-card/cc-article-card.types.js').ArticleCardStateLoaded} ArticleCardStateLoaded
 */

const FOUR_HOURS = 1000 * 60 * 60 * 4;

defineSmartComponent({
  selector: 'cc-article-list',
  params: {
    lang: { type: String },
    limit: { type: Number },
  },
  onContextUpdate ({ context, updateComponent, signal }) {
    updateComponent('state', { type: 'loading' });

    const { lang, limit } = context;

    fetchArticleList({ signal, lang, limit })
      .then((articles) => {
        updateComponent('state', { type: 'loaded', articles: articles });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
  * @param {Object} params
  * @param {AbortSignal} params.signal
  * @param {'fr'|'en'} params.lang
  * @param {number} [params.limit]
  * @return {Promise<ArticleCardStateLoaded[]>}
  */
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

  const rawArticleListData = parseRssFeed(rssFeed, limit);

  return rawArticleListData.map((rawArticle) => ({
    type: 'loaded',
    ...rawArticle,
  }));
}
