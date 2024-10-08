import { makeStory } from '../../stories/lib/make-story.js';
import './cc-kv-hash-explorer.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Kv Explorer/<cc-kv-hash-explorer-beta>',
  component: 'cc-kv-hash-explorer-beta',
};

const conf = {
  component: 'cc-kv-hash-explorer-beta',
  beta: true,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        elements: [
          { type: 'idle', field: 'first field', value: 'first field value' },
          { type: 'idle', field: 'second field', value: 'second field value' },
          { type: 'idle', field: 'third field', value: 'third field value' },
          { type: 'idle', field: 'fourth field', value: 'fourth field value' },
          { type: 'idle', field: 'fifth field', value: 'fifth field value' },
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
          { type: 'idle', field: 'first field', value: 'first field value' },
          { type: 'idle', field: 'second field', value: 'second field value' },
        ],
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
          { type: 'idle', field: 'first field', value: 'first field value' },
          { type: 'idle', field: 'second field', value: 'second field value' },
          { type: 'idle', field: 'third field', value: 'third field value' },
          { type: 'idle', field: 'fourth field', value: 'fourth field value' },
          { type: 'idle', field: 'fifth field', value: 'fifth field value' },
        ],
        addForm: { type: 'adding' },
      },
    },
  ],
});

export const editing = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        elements: [
          { type: 'idle', field: 'first field', value: 'first field value' },
          { type: 'editing', field: 'second field', value: 'second field value' },
          { type: 'idle', field: 'third field', value: 'third field value' },
          { type: 'idle', field: 'fourth field', value: 'fourth field value' },
          { type: 'idle', field: 'fifth field', value: 'fifth field value' },
        ],
        addForm: { type: 'idle' },
      },
    },
  ],
});

export const updating = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        elements: [
          { type: 'idle', field: 'first field', value: 'first field value' },
          { type: 'updating', field: 'second field', value: 'second field value' },
          { type: 'idle', field: 'third field', value: 'third field value' },
          { type: 'idle', field: 'fourth field', value: 'fourth field value' },
          { type: 'idle', field: 'fifth field', value: 'fifth field value' },
        ],
        addForm: { type: 'idle' },
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
          { type: 'idle', field: 'first field', value: 'first field value' },
          { type: 'deleting', field: 'second field', value: 'second field value' },
          { type: 'idle', field: 'third field', value: 'third field value' },
          { type: 'idle', field: 'fourth field', value: 'fourth field value' },
          { type: 'idle', field: 'fifth field', value: 'fifth field value' },
        ],
        addForm: { type: 'idle' },
      },
    },
  ],
});
