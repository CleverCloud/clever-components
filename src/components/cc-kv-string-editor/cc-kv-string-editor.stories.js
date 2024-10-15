import { makeStory } from '../../stories/lib/make-story.js';
import './cc-kv-string-editor.js';

/**
 *
 */

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Kv Explorer/<cc-kv-string-editor-beta>',
  component: 'cc-kv-string-editor-beta',
};

const conf = {
  component: 'cc-kv-string-editor-beta',
  beta: true,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'idle',
        value: 'an awesome string key value',
      },
    },
  ],
});

export const withMultilineValue = makeStory(conf, {
  items: [
    {
      state: {
        type: 'idle',
        value: 'an awesome\nstring key value\nwith some\n  carriage\n  return',
      },
    },
  ],
});

export const disabled = makeStory(conf, {
  items: [
    {
      state: {
        type: 'idle',
        value: 'an awesome string key value',
      },
      disabled: true,
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      state: { type: 'loading' },
    },
  ],
});

export const saving = makeStory(conf, {
  items: [
    {
      state: {
        type: 'saving',
        value: 'an awesome string key value',
      },
    },
  ],
});
