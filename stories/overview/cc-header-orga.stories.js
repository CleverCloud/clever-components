import '../../components/overview/cc-header-orga.js';
import notes from '../../.components-docs/cc-header-orga.md';
import { createContainer } from '../lib/dom';
import { sequence } from '../lib/sequence';

function createComponent (orga) {
  const component = document.createElement('cc-header-orga');
  component.orga = orga;
  return component;
}

export default {
  title: '2. Overview|<cc-header-orga>',
  parameters: { notes },
};

export const skeleton = () => {
  return createComponent();
};

export const error = () => {
  const component = createComponent();
  component.error = true;
  return component;
};

export const dataLoaded = () => {
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
};

export const simulation = () => {
  const errorComponent = createComponent();
  const noAvatarComponent = createComponent();
  const component = createComponent();

  sequence(async wait => {
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
};

