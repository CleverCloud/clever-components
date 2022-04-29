/**
 * @typedef {import('../homepage/types.js').Article} Article
 */

/**
 * Parse an RSS feed XML document into a list of articles.
 * @param {String} xmlStr - Raw XML document (RSS feed) as a string.
 * @param {Number} limit - Limit the number of articles from the feed.
 * @returns {Article[]}
 */
export function parseRssFeed (xmlStr, limit = 9) {
  const doc = new DOMParser().parseFromString(xmlStr, 'application/xml');
  return Array
    .from(doc.querySelectorAll('item'))
    .map((node) => {
      const title = node.querySelector('title').textContent;
      const link = node.querySelector('link').textContent;
      const dateRaw = node.querySelector('pubDate').textContent;
      const date = new Date(dateRaw).toISOString();
      const descriptionText = node.querySelector('description').childNodes[0].data;
      const descriptionNode = new DOMParser().parseFromString(descriptionText, 'text/html');
      const banner = descriptionNode.body?.querySelector('.featured-image img')?.src ?? null;
      const description = descriptionNode.body.querySelector('p').textContent;
      return { title, link, date, banner, description };
    })
    .slice(0, limit);
}
