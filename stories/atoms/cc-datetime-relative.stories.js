import '../../components/atoms/cc-datetime-relative.js';
import notes from '../../.components-docs/cc-datetime-relative.md';
import { createContainer } from '../lib/dom.js';
import { storiesOf } from '@storybook/html';
import { getLanguage } from '../../components/lib/i18n';

function createComponent (datetime) {
  const component = document.createElement('cc-datetime-relative');
  component.setAttribute('datetime', datetime);
  component.setAttribute('lang', getLanguage());
  component.style.marginRight = '1rem';
  component.style.display = 'inline-block';
  return component;
}

function getDate ({ seconds = 0, minutes = 0, hours = 0, days = 0, weeks = 0, months = 0, years = 0 }) {
  const nowTs = new Date().getTime();
  const targetTs = nowTs
    - seconds * 1000
    - minutes * 1000 * 60
    - hours * 1000 * 60 * 60
    - days * 1000 * 60 * 60 * 24
    - weeks * 1000 * 60 * 60 * 24 * 7
    - months * 1000 * 60 * 60 * 24 * (365.25 / 12)
    - years * 1000 * 60 * 60 * 24 * 365.25;
  return new Date(targetTs);
}

function createComponentSeries (unit, steps, elementName) {
  return [
    `${unit} ago (${steps.join(', ')}):`,
    ...steps.map((s) => createComponent(getDate({ [unit]: s }).toISOString())),
  ];
}

storiesOf('1. Atoms|<cc-datetime-relative>', module)
  .addParameters({ notes })
  .add('default', () => {
    return createContainer([
      'Now',
      createComponent(getDate({}).toISOString()),
      ...createComponentSeries('seconds', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('minutes', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('hours', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('days', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('weeks', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('months', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('years', [1, 5, 10, 20, 30, 45]),
    ]);
  });
