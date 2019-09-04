import '../../components/atoms/cc-expand.js';
import notes from '../../.components-docs/cc-expand.md';
import { storiesOf } from '@storybook/html';

storiesOf('atoms', module)
  .add('cc-expand', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        cc-expand {
          border: 3px solid red;
        }
        .button { margin: 1rem 0; }
        .box { background-color: #bbf; margin: 1rem; }
        .box[data-size="small"] { height: 60px }
        .box[data-size="medium"] { height: 120px }
        .box[data-size="big"] { height: 180px }
      </style>
      <div class="title">Change <code>.box</code> blocks (blue background) height here:</div>
      <div class="button"><cc-toggle value="medium"></cc-toggle></div>
      <div class="title">See how <code>cc-expand</code> (red border) adapts its size:</div>
      <cc-expand>
        <div class="box" data-size="medium"></div>
        <div class="box" data-size="medium"></div>
      </cc-expand>
    `;

    container.querySelector('cc-toggle').choices = [
      { label: 'small', value: 'small' },
      { label: 'medium', value: 'medium' },
      { label: 'big', value: 'big' },
    ];

    container.addEventListener('cc-toggle:input', ({ detail: value }) => {
      Array.from(container.querySelectorAll('.box'))
        .forEach((box) => (box.dataset.size = value));
    });

    return container;
  }, { notes });
