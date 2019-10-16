import '../../components/atoms/cc-datetime-relative.js';
import '../../components/atoms/cc-datetime-relative-fns.js';
import '../../components/atoms/cc-datetime-relative-moment.js';
import { TimeAgoElement } from '@github/time-elements';
import notes from '../../.components-docs/cc-datetime-relative.md';
import { createContainer } from '../lib/dom.js';
import { storiesOf } from '@storybook/html';
import { getLanguage } from '../../components/lib/i18n';

TimeAgoElement;

function label (text) {
  const span = document.createElement('div');
  span.style.display = 'inline-block';
  span.innerHTML = text;
  return span;
}

function createComponent (datetime, elementName) {
  const component = document.createElement(elementName);
  component.setAttribute('datetime', datetime);
  component.setAttribute('lang', getLanguage());
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

  const table = document.createElement('table');
  table.cellSpacing = '12px';

  const ownRow = table.insertRow();
  ownRow.insertCell().innerHTML = 'CC';
  steps.map((s) => {
    ownRow.insertCell().appendChild(createComponent(getDate({ [unit]: s }).toISOString(), 'cc-datetime-relative'));
  });

  const momentRow = table.insertRow();
  momentRow.insertCell().innerHTML = 'moment';
  steps.map((s) => {
    momentRow.insertCell().appendChild(createComponent(getDate({ [unit]: s }).toISOString(), 'cc-datetime-relative-moment'));
  });

  const dateFnsRow = table.insertRow();
  dateFnsRow.insertCell().innerHTML = 'date-fns';
  steps.map((s) => {
    dateFnsRow.insertCell().appendChild(createComponent(getDate({ [unit]: s }).toISOString(), 'cc-datetime-relative-fns'));
  });

  const githubRow = table.insertRow();
  githubRow.insertCell().innerHTML = 'GitHub';
  steps.map((s) => {
    githubRow.insertCell().appendChild(createComponent(getDate({ [unit]: s }).toISOString(), 'time-ago'));
  });

  return [
    `${unit} ago (${steps.join(', ')}):`,
    table,
  ];
}

storiesOf('1. Atoms|<cc-datetime-relative>', module)
  .addParameters({ notes })
  .add('default', () => {

    const table = document.createElement('table');
    table.cellSpacing = '12px';

    const ownRow = table.insertRow();
    ownRow.insertCell().innerHTML = 'CC';
    ownRow.insertCell().appendChild(createComponent(getDate({}).toISOString(), 'cc-datetime-relative'));

    const momentRow = table.insertRow();
    momentRow.insertCell().innerHTML = 'moment';
    momentRow.insertCell().appendChild(createComponent(getDate({}).toISOString(), 'cc-datetime-relative-moment'));

    const dateFnsRow = table.insertRow();
    dateFnsRow.insertCell().innerHTML = 'date-fns';
    dateFnsRow.insertCell().appendChild(createComponent(getDate({}).toISOString(), 'cc-datetime-relative-fns'));

    const githubRow = table.insertRow();
    githubRow.insertCell().innerHTML = 'GitHub';
    githubRow.insertCell().appendChild(createComponent(getDate({}).toISOString(), 'time-ago'));

    return createContainer([
      'Now',
      table,
      ...createComponentSeries('seconds', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('minutes', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('hours', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('days', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('weeks', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('months', [1, 5, 10, 20, 30, 45]),
      ...createComponentSeries('years', [1, 5, 10, 20, 30, 45]),
    ]);
  });
