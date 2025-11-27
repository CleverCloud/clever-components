/**
 * @typedef {import('../components/cc-article-card/cc-article-card.types.js').ArticleCard} ArticleCard
 */

/**
 * Parse an RSS feed XML document into a list of articles.
 * @param {string} xmlStr - Raw XML document (RSS feed) as a string.
 * @param {Number} limit - Limit the number of articles from the feed.
 * @returns {Array<ArticleCard>}
 */
export function parseRssFeed(xmlStr, limit = 9) {
  if (limit <= 0) {
    return [];
  }

  const xmlStrTrimmed = xmlStr.trim();
  const doc = new DOMParser().parseFromString(xmlStrTrimmed, 'application/xml');
  const error = doc.querySelector('parsererror');

  if (error != null) {
    throw new Error(error.innerHTML);
  }

  return Array.from(doc.documentElement.querySelectorAll('item'))
    .map((node) => {
      const title = node.querySelector('title').textContent;
      const link = node.querySelector('link').textContent;
      const dateRaw = node.querySelector('pubDate').textContent;
      const date = new Date(dateRaw).toISOString();

      // @ts-ignore
      const descriptionText = node.querySelector('description').childNodes[0].data;
      const descriptionNode = new DOMParser().parseFromString(descriptionText, 'text/html');
      // @ts-ignore
      const banner = descriptionNode.body?.querySelector('.wp-post-image')?.src ?? null;
      // TODO: we shouldn't have to do the `??` part here but somehow as of 2023-10-18 an article is causing some trouble. We'll have to keep track of this.
      const description =
        descriptionNode.body?.querySelectorAll('p')?.[1]?.textContent ?? descriptionNode.body.textContent;

      return { title, link, date, banner, description };
    })
    .slice(0, limit);
}
