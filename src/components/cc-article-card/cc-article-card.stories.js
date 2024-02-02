import './cc-article-card.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

const DEFAULT_ARTICLE = {
  title: 'Announcing the New Middle East Zone in Jeddah',
  description: 'Today we are officially announcing the opening of a new Clever Cloud zone located in Jeddah, our first in the Middle East region.',
  banner: 'https://cdn.clever-cloud.com/uploads/2022/01/jeddah-zone-en.png',
  date: 'Tue, 22 Mar 2022 08:39:00 +0000',
  link: 'https://www.clever-cloud.com/blog/features/2022/01/27/announcing-the-new-middle-east-zone/',
};
const OTHER_ARTICLE = {
  title: 'Rethinking invoices to empower your accountant',
  description: 'Earlier this week, we released some changes in how we present our invoices. The result: invoices that help you understand what you pay and what to expect next time.',
  banner: 'https://cdn.clever-cloud.com/uploads/2022/02/Refactoring-invoices-2.png',
  date: 'Wed, 16 Feb 2022 08:51:44 +0000',
  link: 'https://www.clever-cloud.com/blog/features/2022/02/16/rethinking-invoices-to-empower-your-accountant/',
};

export default {
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

export const defaultStory = makeStory(conf, {
  items: [
    DEFAULT_ARTICLE,
    OTHER_ARTICLE,
  ],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

// No need to invest time on empty story right now.

export const dataLoaded = makeStory(conf, {
  items: [
    DEFAULT_ARTICLE,
  ],
});

export const simulations = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000, ([component]) => {
      component.title = DEFAULT_ARTICLE.title;
      component.description = DEFAULT_ARTICLE.description;
      component.banner = DEFAULT_ARTICLE.banner;
      component.date = DEFAULT_ARTICLE.date;
      component.link = DEFAULT_ARTICLE.link;
    }),
  ],
});
