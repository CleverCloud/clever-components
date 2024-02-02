import './cc-invoice-list.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

import { PROCESSING_STATUS } from '../cc-invoice-table/cc-invoice-table.js';
import { pendingInvoices, processedInvoices, processingInvoices } from '../cc-invoice-table/cc-invoice-table.stories.js';

const fullInvoicesExample = [
  ...pendingInvoices('2020').slice(0, 4),
  ...processingInvoices('2020'),
  ...processedInvoices('2019'),
  ...processedInvoices('2020').slice(2, 10),
  ...processedInvoices('2018').slice(2, 10),
  ...processedInvoices('2017').slice(3, 10),
  ...processedInvoices('2016').slice(1, 9),
  ...processedInvoices('2015').slice(1, 9),
];

export default {
  tags: ['autodocs'],
  title: '🛠 Invoices/<cc-invoice-list>',
  component: 'cc-invoice-list',
};

const conf = {
  component: 'cc-invoice-list',
};

export const defaultStory = makeStory(conf, {
  items: [{ state: { type: 'loaded', invoices: fullInvoicesExample } }],
});

export const loading = makeStory(conf, {
  items: [{}],
});

export const empty = makeStory(conf, {
  items: [{ state: { type: 'loaded', invoices: [] } }],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const dataLoaded = makeStory(conf, {
  items: [{ state: { type: 'loaded', invoices: fullInvoicesExample } }],
});

export const dataLoadedWithNoProcessing = makeStory(conf, {
  items: [{ state: { type: 'loaded', invoices: fullInvoicesExample.filter((i) => i.status !== PROCESSING_STATUS) } }],
});

export const dataLoadedWithNoPending = makeStory(conf, {
  items: [
    {
      state:
        {
          type: 'loaded',
          invoices: [
            ...processedInvoices('2020'),
            ...processedInvoices('2020').slice(2, 10),
            ...processedInvoices('2018').slice(2, 10),
            ...processedInvoices('2017').slice(3, 11),
            ...processedInvoices('2016').slice(1, 9),
            ...processedInvoices('2015').slice(1, 9),
          ],
        },
    }],
});

export const dataLoadedWithNoProcessed = makeStory(conf, {
  items: [
    {
      state:
        {
          type: 'loaded',
          invoices: [
            ...pendingInvoices(2020).slice(0, 4),
          ],
        },
    }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.state = { type: 'loaded', invoices: fullInvoicesExample };
      componentError.state = { type: 'error' };
    }),
  ],
});
