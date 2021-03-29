import '../../src/invoices/cc-invoice-list.js';
import { PROCESSING_STATUS } from '../../src/invoices/cc-invoice-table.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { pendingInvoices, processedInvoices, processingInvoices } from './cc-invoice-table.stories.js';

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
  title: '🛠 Invoices/<cc-invoice-list>',
  component: 'cc-invoice-list',
};

const conf = {
  component: 'cc-invoice-list',
  // language=CSS
  css: `cc-invoice-list {
    margin-bottom: 1rem;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [{ invoices: fullInvoicesExample }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const empty = makeStory(conf, {
  items: [{ invoices: [] }],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoaded = makeStory(conf, {
  items: [{ invoices: fullInvoicesExample }],
});

export const dataLoadedWithNoProcessing = makeStory(conf, {
  items: [{ invoices: fullInvoicesExample.filter((i) => i.status !== PROCESSING_STATUS) }],
});

export const dataLoadedWithNoPending = makeStory(conf, {
  items: [{
    invoices: [
      ...processedInvoices('2020'),
      ...processedInvoices('2020').slice(2, 10),
      ...processedInvoices('2018').slice(2, 10),
      ...processedInvoices('2017').slice(3, 11),
      ...processedInvoices('2016').slice(1, 9),
      ...processedInvoices('2015').slice(1, 9),
    ],
  }],
});

export const dataLoadedWithNoProcessed = makeStory(conf, {
  items: [{
    invoices: [
      ...pendingInvoices(2020).slice(0, 4),
    ],
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.invoices = fullInvoicesExample;
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  empty,
  error,
  dataLoaded,
  dataLoadedWithNoProcessing,
  dataLoadedWithNoPending,
  dataLoadedWithNoProcessed,
  simulations,
});
