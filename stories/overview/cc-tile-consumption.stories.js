import '../../components/overview/cc-tile-consumption.js';
import notes from '../../.components-docs/cc-tile-consumption.md';
import { createContainer } from '../lib/dom.js';
import { sequence } from '../lib/sequence';
import { storiesOf } from '@storybook/html';

function createComponent (consumption) {
  const component = document.createElement('cc-tile-consumption');
  component.style.width = '275px';
  component.style.display = 'inline-grid';
  component.style.marginBottom = '1rem';
  component.style.marginRight = '1rem';
  component.consumption = consumption;
  return component;
}

storiesOf('2. Overview|<cc-tile-consumption>', module)
  .addParameters({ notes })
  .add('empty state (loading)', () => {
    return createComponent();
  })
  .add('error', () => {
    const component = createComponent();
    component.error = true;
    return component;
  })
  .add('different consumptions history', () => {

    return createContainer([
      'Fresh new app',
      createComponent({ yesterday: 0, last30Days: 0 }),
      'nano app',
      createComponent({ yesterday: 0.30, last30Days: 6.1 }),
      'XS app',
      createComponent({ yesterday: 0.72, last30Days: 14.64 }),
    ]);
  })
  .add('simulations', () => {

    const errorComponent = createComponent();
    const component = createComponent();

    sequence(async (wait) => {
      await wait(2000);
      errorComponent.error = true;
      component.consumption = { yesterday: 0.72, last30Days: 14.64 };
    });

    return createContainer([
      'Loading, then error',
      errorComponent,
      'Loading, then some data',
      component,
    ]);
  });
