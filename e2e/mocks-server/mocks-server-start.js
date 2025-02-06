// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { createServer } from '@mocks-server/main';
import { collections, routes } from './fixtures.js';

const core = createServer();
core.mock.collections.select('base');

core.start().then(() => {
  const { loadRoutes, loadCollections } = core.mock.createLoaders();
  loadRoutes(routes);
  loadCollections(collections);
});
