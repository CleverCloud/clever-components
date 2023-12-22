import { promises as fs } from 'fs';
import { API_ADDONS_RAW } from '../api/addons.js';
import { API_APPS_RAW } from '../api/apps.js';

const APP_ID_DELIMITER = '::';

const TYPE_ENUM = {
  app: 'app',
  addon: 'addon',
};

const NESTED_ADDONS = ['mongodb-addon', 'mysql-addon', 'postgresql-addon'];

const CATEGORY_DISPLAYED_FEATURES = {
  category: ['memory', 'cpu'],
  customization: ['disk-size'],
};

const FLAT_DISPLAYED_FEATURES = {
  'es-addon': ['memory', 'cpu', 'disk-size'],
  jenkins: ['memory', 'cpu', 'disk-size'],
  mailpace: [],
  'redis-addon': ['cpu', 'max-db-size', 'databases', 'connection-limit'],
};

const PLAN_CATEGORIES = [
  {
    name: 'DEV',
    prefix: 'dev',
  },
  {
    name: 'XXS',
    prefix: 'xxs',
  },
  {
    name: 'XS',
    prefix: 'xs',
  },
  {
    name: 'S',
    prefix: 's',
  },
  {
    name: 'M',
    prefix: 'm',
  },
  {
    name: 'L',
    prefix: 'l',
  },
  {
    name: 'XL',
    prefix: 'xl',
  },
  {
    name: 'XXL',
    prefix: 'xxl',
  },
  {
    name: 'XXXL',
    prefix: 'xxxl',
  },
];

export async function generateProductsJson () {
  const output = {};
  API_APPS_RAW.forEach((app) => {
    // console.log(app);
    const hasSlugs = app.variant?.slug && API_APPS_RAW.filter((application) => app.type === application.type)?.length > 1;
    const id = `${app.type}${hasSlugs ? APP_ID_DELIMITER + app.variant.slug : ''}`;
    output[id] = {
      id,
      type: TYPE_ENUM.app,
      name: app.variant?.name ?? app.name,
      logoUrl: app.variant?.logo,
      details: {},
    };
  });
  API_ADDONS_RAW.forEach((addon) => {
    // console.log(addon);
    const hasCategories = NESTED_ADDONS.includes(addon.id);
    output[addon.id] = {
      id: addon.id,
      type: TYPE_ENUM.addon,
      name: addon.name,
      logoUrl: addon.logoUrl,
      details: {
        categories: hasCategories ? PLAN_CATEGORIES : null,
        displayedFeatures: hasCategories ? CATEGORY_DISPLAYED_FEATURES : FLAT_DISPLAYED_FEATURES[addon.id],
      },
    };
  });
  await fs.writeFile('./products.json', JSON.stringify(output, null, `  `));
}

generateProductsJson().then(() => {
  console.log('JSON file successfully generated!');
});
