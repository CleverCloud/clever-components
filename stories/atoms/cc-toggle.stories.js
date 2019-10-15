import '../../components/atoms/cc-toggle.js';
import notes from '../../.components-docs/cc-toggle.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('cc-toggle:input');

storiesOf('1. Atoms|<cc-toggle>', module)
  .addParameters({ notes })
  .add('default', withActions(() => {

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="title">Multiple choices:</div>
      <cc-toggle id="ONE" value="PAUL"></cc-toggle>
      
      <div class="title">Classic 2 choices (true/false):</div>
      <cc-toggle id="TWO" value="true"></cc-toggle>
      
      <div class="title">Disabled:</div>
      <cc-toggle id="THREE" value="true" disabled></cc-toggle>
    `;

    wrapper.querySelector('#ONE').choices = [
      { label: 'John', value: 'JOHN' },
      { label: 'Paul', value: 'PAUL' },
      { label: 'George', value: 'GEORGE' },
      { label: 'Ringo', value: 'RINGO' },
    ];

    wrapper.querySelector('#TWO').choices = [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ];

    wrapper.querySelector('#THREE').choices = [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ];

    return wrapper;
  }));
