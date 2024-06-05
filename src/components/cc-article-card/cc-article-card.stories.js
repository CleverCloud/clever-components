import './cc-article-card.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 homepage/<cc-article-card>',
  component: 'cc-article-card',
};

const conf = {
  component: 'cc-article-card',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-article-card {
      width: 20em;
    }
  `,
};

/**
 * @typedef {import('./cc-article-card.js').CcArticleCard} CcArticleCard
 * @typedef {import('./cc-article-card.types.js').ArticleCardStateLoaded} ArticleCardStateLoaded
 * @typedef {import('./cc-article-card.types.js').ArticleCardStateLoading} ArticleCardStateLoading
 */

/** @type {{ state: ArticleCardStateLoaded }} */
const DEFAULT_ARTICLE = {
  state: {
    type: 'loaded',
    title: 'Announcing the New Middle East Zone in Jeddah',
    description: 'Today we are officially announcing the opening of a new Clever Cloud zone located in Jeddah, our first in the Middle East region.',
    banner: 'https://cdn.clever-cloud.com/uploads/2022/01/jeddah-zone-en.png',
    date: 'Tue, 22 Mar 2022 08:39:00 +0000',
    link: 'https://www.clever-cloud.com/blog/features/2022/01/27/announcing-the-new-middle-east-zone/',
  },
};

/** @type {{ state: ArticleCardStateLoaded }} */
const OTHER_ARTICLE = {
  state: {
    type: 'loaded',
    title: 'Rethinking invoices to empower your accountant',
    description: 'Earlier this week, we released some changes in how we present our invoices. The result: invoices that help you understand what you pay and what to expect next time.',
    banner: 'https://cdn.clever-cloud.com/uploads/2022/02/Refactoring-invoices-2.png',
    date: 'Wed, 16 Feb 2022 08:51:44 +0000',
    link: 'https://www.clever-cloud.com/blog/features/2022/02/16/rethinking-invoices-to-empower-your-accountant/',
  },
};

export const defaultStory = makeStory(conf, {
  items: [DEFAULT_ARTICLE, OTHER_ARTICLE],
});

export const loading = makeStory(conf, {
  items: [{
    /** @type {ArticleCardStateLoading} */
    state: { type: 'loading' },
  }],
});

// No need to invest time on empty story right now.

export const dataLoaded = makeStory(conf, {
  items: [DEFAULT_ARTICLE],
});

export const simulations = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000,
      /** @param {[CcArticleCard]} components */
      ([component]) => {
        component.state = DEFAULT_ARTICLE.state;
      }),
  ],
});
