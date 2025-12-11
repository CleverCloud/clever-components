import { makeStory } from '../../stories/lib/make-story.js';
import './cc-logs-message-filter.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Logs/<cc-logs-message-filter-beta>',
  component: 'cc-logs-message-filter-beta',
};

/**
 * @import { CcLogsMessageFilter } from './cc-logs-message-filter.js'
 */

const conf = {
  component: 'cc-logs-message-filter-beta',
  beta: true,
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-logs-message-filter-beta {
      margin: 1em;
      width: 25em;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcLogsMessageFilter>>} */
  items: [
    {
      filter: { value: 'foo', mode: 'loose' },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Array<Partial<CcLogsMessageFilter>>} */
  items: [
    {
      filter: { value: '', mode: 'loose' },
    },
  ],
});

export const looseMode = makeStory(conf, {
  /** @type {Array<Partial<CcLogsMessageFilter>>} */
  items: [
    {
      filter: { value: 'foo', mode: 'loose' },
    },
  ],
});

export const strictMode = makeStory(conf, {
  /** @type {Array<Partial<CcLogsMessageFilter>>} */
  items: [
    {
      filter: { value: 'FoO', mode: 'strict' },
    },
  ],
});

export const regexMode = makeStory(conf, {
  /** @type {Array<Partial<CcLogsMessageFilter>>} */
  items: [
    {
      filter: { value: '[Ff]o{1..2}', mode: 'regex' },
    },
  ],
});

export const invalidRegex = makeStory(conf, {
  /** @type {Array<Partial<CcLogsMessageFilter>>} */
  items: [
    {
      filter: { value: '(foo', mode: 'regex' },
    },
  ],
});
