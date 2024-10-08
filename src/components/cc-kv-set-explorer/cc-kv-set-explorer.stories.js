import { makeStory } from '../../stories/lib/make-story.js';
import './cc-kv-set-explorer.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Kv Explorer/<cc-kv-set-explorer-beta>',
  component: 'cc-kv-set-explorer-beta',
};

const conf = {
  component: 'cc-kv-set-explorer-beta',
  beta: true,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        elements: [
          { type: 'idle', value: 'first value' },
          { type: 'idle', value: 'second value' },
          { type: 'idle', value: 'third value' },
          { type: 'idle', value: 'fourth value' },
          { type: 'idle', value: 'fifth value' },
        ],
        addForm: { type: 'idle' },
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const loadingMore = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loading-more',
        elements: [
          { type: 'idle', value: 'first value' },
          { type: 'idle', value: 'second value' },
        ],
        addForm: { type: 'idle' },
      },
    },
  ],
});

export const disabled = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        elements: [
          { type: 'idle', value: 'first value' },
          { type: 'idle', value: 'second value' },
          { type: 'idle', value: 'third value' },
          { type: 'idle', value: 'fourth value' },
          { type: 'idle', value: 'fifth value' },
        ],
        addForm: { type: 'idle' },
      },
      disabled: true,
    },
  ],
});

export const empty = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        elements: [],
        addForm: { type: 'idle' },
      },
    },
  ],
});

export const adding = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        elements: [
          { type: 'idle', value: 'first value' },
          { type: 'idle', value: 'second value' },
          { type: 'idle', value: 'third value' },
          { type: 'idle', value: 'fourth value' },
          { type: 'idle', value: 'fifth value' },
        ],
        addForm: { type: 'adding' },
      },
    },
  ],
});

export const deleting = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        elements: [
          { type: 'idle', value: 'first value' },
          { type: 'deleting', value: 'second value' },
          { type: 'idle', value: 'third value' },
          { type: 'idle', value: 'fourth value' },
          { type: 'idle', value: 'fifth value' },
        ],
        addForm: { type: 'idle' },
      },
    },
  ],
});
