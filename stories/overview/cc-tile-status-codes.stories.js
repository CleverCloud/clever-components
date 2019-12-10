import '../../components/overview/cc-tile-status-codes.js';
import notes from '../../.components-docs/cc-tile-status-codes.md';
import { createContainer } from '../lib/dom.js';
import { sequence } from '../lib/sequence';

function createComponent (statusCodes) {
  const component = document.createElement('cc-tile-status-codes');
  component.style.width = '275px';
  component.style.display = 'inline-grid';
  component.style.marginBottom = '1rem';
  component.style.marginRight = '1rem';
  if (statusCodes != null) {
    component.statusCodes = statusCodes;
  }
  return component;
}

export default {
  title: '2. Overview|<cc-tile-status-codes>',
  parameters: { notes },
};

export const skeleton = () => {
  return createComponent();
};

export const error = () => {
  const errorComponent = createComponent();
  errorComponent.error = true;
  return createContainer(['Error', errorComponent]);
};

export const empty = () => {
  return createContainer(['Empty data', createComponent({})]);
};

export const dataLoaded = () => {
  return createContainer([
    'Example 1',
    createComponent({ 200: 47640, 206: 2011, 302: 11045, 303: 457, 304: 12076, 500: 16 }),
    'Example 2',
    createComponent({ 200: 1000, 201: 10, 302: 100, 303: 150, 500: 200 }),
    'Example 3',
    createComponent({ 200: 1000, 201: 10, 302: 100, 401: 150, 404: 300, 500: 200 }),
    'Example 4',
    createComponent({ 101: 75, 200: 800, 201: 50, 302: 80, 401: 200, 404: 100, 500: 100 }),
  ]);
};

export const simulations = () => {
  const errorComponent = createComponent();
  const component = createComponent();

  sequence(async wait => {
    await wait(2000);
    errorComponent.error = true;
    component.statusCodes = { 200: 47640, 206: 2011, 302: 11045, 303: 457, 304: 12076, 500: 16 };
  });

  return createContainer([
    'Loading, then error',
    errorComponent,
    'Loading, then some data',
    component,
  ]);
};

