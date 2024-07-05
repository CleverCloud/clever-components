import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-article-list.js';
import './cc-article-list.smart.js';

export default {
  tags: ['autodocs'],
  title: '🛠 homepage/<cc-article-list>',
  component: 'cc-article-list',
};

const conf = {
  component: 'cc-article-list',
  // language=CSS
  css: `
    :host {
      max-width: 92em !important;
    }
  `,
};

/**
 * @typedef {import('./cc-article-list.js').CcArticleList} CcArticleList
 * @typedef {import('./cc-article-list.types.js').ArticleListStateLoaded} ArticleListStateLoaded
 * @typedef {import('./cc-article-list.types.js').ArticleListStateLoading} ArticleListStateLoading
 * @typedef {import('./cc-article-list.types.js').ArticleListStateError} ArticleListStateError
 * @typedef {import('../cc-article-card/cc-article-card.types.js').ArticleCard} ArticleCard
 */

/** @type {ArticleCard[]} */
const ARTICLES = [
  {
    title: 'Announcing the New Middle East Zone in Jeddah',
    description:
      'Today we are officially announcing the opening of a new Clever Cloud zone located in Jeddah, our first in the Middle East region.',
    banner: 'https://cdn.clever-cloud.com/uploads/2022/01/jeddah-zone-en.png',
    date: 'Tue, 22 Mar 2022 08:39:00 +0000',
    link: 'https://www.clever-cloud.com/blog/features/2022/01/27/announcing-the-new-middle-east-zone/',
  },
  {
    title: 'Clever Cloud announces the arrival of Guillaume Champeau as Chief Legal and Public Affairs Officer',
    description:
      'Paris, 25 October 2021 Clever Cloud, a European provider of automation and optimization solutions for hosting websites and applications on the Internet, announces the appointment of Guillaume Champeau as Chief Legal and Public Affairs Officer. Guillaume’s arrival marks the beginning of a new phase in the company’s structuring, enabling Clever Cloud to continue and accelerate […]',
    banner: 'https://cdn.clever-cloud.com/uploads/2021/10/Guillaume-en.jpg',
    date: 'Mon, 21 Mar 2022 08:39:00 +0000',
    link: 'https://www.clever-cloud.com/blog/features/2022/01/27/announcing-the-new-middle-east-zone/',
  },
  {
    title: 'Clever Operator: The best of Kubernetes and Clever Cloud',
    description:
      'Earlier this week, we released some changes in how we present our invoices. The result: invoices that help you understand what you pay and what to expect next time.',
    banner: 'https://cdn.clever-cloud.com/uploads/2022/02/Refactoring-invoices-2.png',
    date: 'Wed, 16 Feb 2022 08:51:44 +0000',
    link: 'https://www.clever-cloud.com/blog/features/2022/02/16/rethinking-invoices-to-empower-your-accountant/',
  },
  {
    title: 'Improving our environment variables editor',
    description:
      'The environment variables editor was proposed with a Simple or Expert mode. We have added a third, using JSON format. You can read/write in it.',
    banner: 'https://cdn.clever-cloud.com/uploads/2022/03/Env-var.png',
    date: 'Mon, 13 Feb 2022 08:51:44 +0000',
    link: 'https://www.clever-cloud.com/blog/fonctionnalites/2022/03/22/improving-our-environment-variables-editor/',
  },
  {
    title: 'Announcing the New Middle East Zone in Jeddah',
    description:
      'Today we are officially announcing the opening of a new Clever Cloud zone located in Jeddah, our first in the Middle East region.',
    banner: 'https://cdn.clever-cloud.com/uploads/2022/01/jeddah-zone-en.png',
    date: 'Tue, 22 Mar 2022 08:39:00 +0000',
    link: 'https://www.clever-cloud.com/blog/features/2022/01/27/announcing-the-new-middle-east-zone/',
  },
  {
    title: 'Clever Operator: The best of Kubernetes and Clever Cloud',
    description:
      'Earlier this week, we released some changes in how we present our invoices. The result: invoices that help you understand what you pay and what to expect next time.',
    banner: 'https://cdn.clever-cloud.com/uploads/2022/02/Refactoring-invoices-2.png',
    date: 'Wed, 16 Feb 2022 08:51:44 +0000',
    link: 'https://www.clever-cloud.com/blog/features/2022/02/16/rethinking-invoices-to-empower-your-accountant/',
  },
];

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {ArticleListStateLoaded} */
      state: {
        type: 'loaded',
        articles: ARTICLES,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {ArticleListStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

// No need to invest time on empty story right now.

export const error = makeStory(conf, {
  items: [
    {
      /** @type {ArticleListStateError} */
      state: { type: 'error' },
    },
  ],
});

export const dataLoaded = makeStory(conf, {
  items: [
    {
      /** @type {ArticleListStateLoaded} */
      state: {
        type: 'loaded',
        articles: ARTICLES,
      },
    },
  ],
});

export const simulationsWithSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(
      2000,
      /** @param {[CcArticleList]} components */
      ([component]) => {
        component.state = { type: 'loaded', articles: ARTICLES };
      },
    ),
  ],
});

export const simulationsWithError = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(
      2000,
      /** @param {[CcArticleList]} components */
      ([componentError]) => {
        componentError.state = { type: 'error' };
      },
    ),
  ],
});
