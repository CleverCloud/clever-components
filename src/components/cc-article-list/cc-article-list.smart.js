import { ListArticleCommand } from '@clevercloud/client/cc-api-commands/article/list-article-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-article-list.js';

/**
 * @import { CcArticleList } from './cc-article-list.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-article-list',
  params: {
    lang: { type: String },
    limit: { type: Number },
  },
  /**
   * @param {OnContextUpdateArgs<CcArticleList>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    updateComponent('state', { type: 'loading' });

    const { lang, limit = 9 } = context;

    // the blog feed is public: an unauthenticated client is enough, and the command caches feed pages itself
    getCcApiClientWithOAuth()
      .send(new ListArticleCommand({ lang, limit }), { signal })
      .then((articles) => {
        updateComponent('state', { type: 'loaded', articles });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
