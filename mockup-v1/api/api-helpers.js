import * as rawProducts from '../products.json';
import { API_ADDONS_RAW } from './addons.js';
import { API_APPS_RAW } from './apps.js';

export const getRawProductFromProduct = (product) => {
  const matchingTypeProducts = product.type === 'app' ? API_APPS_RAW : API_ADDONS_RAW;
  return matchingTypeProducts.find((p) => product.id === p.id);
};

export const products = rawProducts.default;
