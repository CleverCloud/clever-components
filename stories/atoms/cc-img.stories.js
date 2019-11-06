import '../../components/atoms/cc-img.js';
import notes from '../../.components-docs/cc-img.md';
import { storiesOf } from '@storybook/html';
import { sequence } from '../lib/sequence.js';
import { createContainer } from '../lib/dom';

function createComponent (text) {
  const component = document.createElement('cc-img');
  component.style.height = '50px';
  component.style.width = '50px';
  component.style.borderRadius = '5px';
  component.text = text;
  return component;
}

storiesOf('1. Atoms|<cc-img>', module)
  .addParameters({ notes })
  .add('different setups', () => {

    const noSrcComponent = createComponent('OMG');
    const skeletonComponent = createComponent('FOO');
    const squareComponent = createComponent('BAR');
    const coverComponent = createComponent('COV');
    const errorComponent = createComponent('ERR');

    skeletonComponent.skeleton = true;
    squareComponent.skeleton = true;
    coverComponent.skeleton = true;
    errorComponent.skeleton = true;

    sequence(async (wait) => {
      await wait(3000);
      squareComponent.src = 'http://placekitten.com/200/200';
      coverComponent.src = 'http://placekitten.com/200/500';
      errorComponent.src = 'http://placekitten.com/bad/url';

      await wait(3000);
      squareComponent.src = 'http://placekitten.com/300/300';
      coverComponent.src = 'http://placekitten.com/500/200';
    });

    return createContainer([
      'No image (display text)',
      noSrcComponent,
      'Loading (infinite)',
      skeletonComponent,
      'Loading, then a 1:1 ratio cat image, then another',
      squareComponent,
      'Loading, then portrait ratio cat image, then landscape',
      coverComponent,
      'Loading, then error (display text)',
      errorComponent,
    ]);
  });
