import '../../components/info-tiles/cc-info-orga.js';
import notes from '../../.components-docs/cc-info-orga.md';
import { storiesOf } from '@storybook/html';
import { createContainer } from '../lib/dom';
import { sequence } from '../lib/sequence';

function createComponent (orga) {
  const component = document.createElement('cc-info-orga');
  component.orga = orga;
  return component;
}

storiesOf('2. Information tiles|<cc-info-orga>', module)
  .addParameters({ notes })
  .add('empty state (loading)', () => {
    return createComponent();
  })
  .add('error', () => {
    const component = createComponent();
    component.error = true;
    return component;
  })
  .add('different settings', () => {
    return createContainer([
      'Classic client',
      createComponent({
        name: 'ACME startup',
        avatar: 'http://placekitten.com/200/200',
        cleverEnterprise: false,
        emergencyNumber: null,
      }),
      'Classic client (no avatar)',
      createComponent({
        name: 'ACME startup',
        cleverEnterprise: false,
        emergencyNumber: null,
      }),
      'Enterprise client',
      createComponent({
        name: 'ACME corporation digital',
        avatar: 'http://placekitten.com/300/300',
        cleverEnterprise: true,
        emergencyNumber: null,
      }),
      'Enterprise client (with emergency number)',
      createComponent({
        name: 'ACME corporation world',
        avatar: 'http://placekitten.com/350/350',
        cleverEnterprise: true,
        emergencyNumber: '+33 6 00 00 00 00',
      }),
    ]);
  })
  .add('simulations', () => {

    const errorComponent = createComponent();
    const noAvatarComponent = createComponent();
    const component = createComponent();

    sequence(async (wait) => {
      await wait(3000);
      errorComponent.error = true;
      noAvatarComponent.orga = {
        name: 'ACME corporation (no avatar)',
        cleverEnterprise: true,
        emergencyNumber: null,
      };
      component.orga = {
        name: 'ACME corporation digital',
        avatar: 'http://placekitten.com/200/200',
        cleverEnterprise: true,
        emergencyNumber: null,
      };
    });

    return createContainer([
      'Loading, then error',
      errorComponent,
      'Loading, then enterprise orga (no avatar)',
      noAvatarComponent,
      'Loading, then enterprise orga',
      component,
    ]);
  });

