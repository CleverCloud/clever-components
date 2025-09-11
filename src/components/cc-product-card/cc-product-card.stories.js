import { html, render } from 'lit';
import { getAssetUrl } from '../../lib/assets-url.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-product-card.js';

const ICON_URL = 'https://placecats.com/202/202';

function productInMultipleWidth(product) {
  return [
    {
      productStatus: 'BETA',
      ...product,
      style: 'max-width: 20em;',
    },
    {
      productStatus: 'BETA',
      ...product,
      style: 'max-width: 50em;',
    },
    {
      productStatus: 'BETA',
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
    productStatus: 'BETA',
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/redis-clever-cloud-pricing.svg',
    name: 'Redis',
    description:
      'Our pricing depends on the size and the number of databases. Compare it with your current pricing on our calculator.',
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/mongodb-3.svg',
    name: 'MongoDB',
    description: 'MongoDB is a noSQL database, fully managed and integrated into Clever Cloud version 4.0.3.',
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/pgsql.svg',
    name: 'PostgreSQL',
    description:
      'Get your PostgreSQL database fully managed, with PGPool II and PG Studio. One click setup, backuped every day, with high availability (leader-follower replicas) in option. Custom backup policies are available too. ',
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/03/mysql-5.svg',
    name: 'MySQL',
    description:
      'Our pricing depends on the size and the number of databases you need. Each instance is billed on a per-second basis.',
  },
  {
    iconUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/python.svg',
    name: 'Python',
    description:
      'Deploy your Python and Django applications on Nginx + WSGI with automatic dependency management (via pip) and Celery tasks support.',
  },
  {
    iconUrl: getAssetUrl('/logos/php.svg'),
    name: 'PHP',
    description:
      'Deploy your PHP applications and static sites on Apache2 + PHP-FPM with automatic dependency management (via composer).',
  },
  {
    iconUrl: getAssetUrl('/logos/ruby.svg'),
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
        product-status="${product.productStatus}"
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
  }),
});

export const noStatus = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product',
    description: 'my description',
    productStatus: null,
  }),
});

export const longName = makeStory(conf, {
  items: productInMultipleWidth({
    iconUrl: ICON_URL,
    name: 'My product with a very very very very very very very long name',
    description: 'my description',
  }),
});

export const longDescription = makeStory(conf, {
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
