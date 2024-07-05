import { html, render } from 'lit';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-product-card.js';

import { generateRandomKeywords } from './generate-random-keywords.js';

const ICON_URL = 'https://placekitten.com/202/202';

function productInMultipleWidth(product) {
  return [
    {
      ...product,
      style: 'max-width: 20em;',
    },
    {
      ...product,
      style: 'max-width: 50em;',
    },
    {
      ...product,
      style: 'max-width: 100em;',
    },
  ];
}

const PRODUCTS_LIST = [
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/elastic.svg',
    name: 'Elasticsearch',
    description:
      'An Elastic database, with Kibana and APM (both in option) with Platinum features provided in partnership from Elastic™.',
    keywords: generateRandomKeywords(3),
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/redis-clever-cloud-pricing.svg',
    name: 'Redis',
    description:
      'Our pricing depends on the size and the number of databases. Compare it with your current pricing on our calculator.',
    keywords: generateRandomKeywords(5),
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/mongodb-3.svg',
    name: 'MongoDB',
    description: 'MongoDB is a noSQL database, fully managed and integrated into Clever Cloud version 4.0.3.',
    keywords: generateRandomKeywords(2),
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/pgsql.svg',
    name: 'PostgreSQL',
    description:
      'Get your PostgreSQL database fully managed, with PGPool II and PG Studio. One click setup, backuped every day, with high availability (leader-follower replicas) in option. Custom backup policies are available too. ',
    keywords: generateRandomKeywords(10),
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/03/mysql-5.svg',
    name: 'MySQL',
    description:
      'Our pricing depends on the size and the number of databases you need. Each instance is billed on a per-second basis.',
    keywords: generateRandomKeywords(3),
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/python.svg',
    name: 'Python',
    description:
      'Deploy your Python and Django applications on Nginx + WSGI with automatic dependency management (via pip) and Celery tasks support.',
    keywords: generateRandomKeywords(3),
  },
  {
    iconUrl: 'https://assets.clever-cloud.com/logos/php.svg',
    name: 'PHP',
    description:
      'Deploy your PHP applications and static sites on Apache2 + PHP-FPM with automatic dependency management (via composer).',
    keywords: generateRandomKeywords(3),
  },
  {
    iconUrl: 'https://assets.clever-cloud.com/logos/ruby.svg',
    name: 'Ruby',
    description:
      'Deploy your Ruby applications on Nginx + Puma with automatic dependency management (via Rake, gem...) and Sidekiq tasks support.',
  },
];

function renderProducts(products) {
  const productsHTML = products.map((product) => {
    return html`
      <cc-product-card
        name="${product.name}"
        description="${product.description}"
        icon-url="${product.iconUrl}"
        .keywords="${product?.keywords ?? []}"
      ></cc-product-card>
    `;
  });

  return html` <div class="wrapper">${productsHTML}</div> `;
}

export default {
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-product-card>',
  component: 'cc-product-card',
};

const conf = {
  component: 'cc-product-card',
};

export const defaultStory = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product',
    description: 'my description',
    keywords: generateRandomKeywords(3),
  }),
});

export const noKeywords = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product',
    description: 'my description',
  }),
});

export const manyKeywords = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product',
    description: 'my description',
    keywords: generateRandomKeywords(10),
  }),
});

export const keywordsWithAllHidden = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product',
    description: 'my description',
    keywords: [
      { value: 'hidden1', hidden: true },
      { value: 'hidden2', hidden: true },
      { value: 'hidden3', hidden: true },
      { value: 'hidden4', hidden: true },
    ],
  }),
});

export const longName = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product with a very very very very very very very long name',
    description: 'my description',
    keywords: generateRandomKeywords(3),
  }),
});

export const longNameWithoutKeywords = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product with a very very very very very very very long name',
    description: 'my description',
  }),
});

export const longNameWithManyKeywords = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product with a very very very very very very very long name',
    description: 'my description',
    keywords: generateRandomKeywords(10),
  }),
});

export const longDescription = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product',
    description: 'my very long very long very long very long very long very long very long very long description',
    keywords: generateRandomKeywords(3),
  }),
});

export const longDescriptionWithManyKeywords = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product',
    description: 'my very long very long very long very long very long very long very long very long description',
    keywords: generateRandomKeywords(10),
  }),
});

export const longDescriptionWithoutKeywords = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product',
    description: 'my very long very long very long very long very long very long very long very long description',
  }),
});

export const longDescriptionAndLongName = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product with a very very very very very very very long name',
    description: 'my very long very long very long very long very long very long very long very long description',
    keywords: generateRandomKeywords(3),
  }),
});

export const longDescriptionAndLongNameWithoutKeywords = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product with a very very very very very very very long name',
    description: 'my very long very long very long very long very long very long very long very long description',
  }),
});

export const longDescriptionAndLongNameWithManyKeywords = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product with a very very very very very very very long name',
    description: 'my very long very long very long very long very long very long very long very long description',
    keywords: generateRandomKeywords(10),
  }),
});

export const fakeProductList = makeStory(conf, {
  // language=CSS
  css: `
    .wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
      gap: 1em;
    }
  `,
  dom: (container) => render(renderProducts(PRODUCTS_LIST), container),
});
