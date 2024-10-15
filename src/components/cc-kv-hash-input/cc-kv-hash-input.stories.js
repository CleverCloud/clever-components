import { makeStory } from '../../stories/lib/make-story.js';
import './cc-kv-hash-input.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Kv Explorer/<cc-kv-hash-input-beta>',
  component: 'cc-kv-hash-input-beta',
};

const conf = {
  component: 'cc-kv-hash-input-beta',
  beta: true,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      value: [
        { field: 'first field', value: 'first field value' },
        { field: 'second field', value: 'second field value' },
        { field: 'third field', value: 'third field value' },
        { field: 'fourth field', value: 'fourth field value' },
      ],
    },
  ],
});

export const withEmptyValue = makeStory(conf, {
  items: [
    {
      value: [],
    },
  ],
});

export const disabled = makeStory(conf, {
  items: [
    {
      value: [
        { field: 'first field', value: 'first field value' },
        { field: 'second field', value: 'second field value' },
        { field: 'third field', value: 'third field value' },
        { field: 'fourth field', value: 'fourth field value' },
      ],
      disabled: true,
    },
  ],
});

export const readonly = makeStory(conf, {
  items: [
    {
      value: [
        { field: 'first field', value: 'first field value' },
        { field: 'second field', value: 'second field value' },
        { field: 'third field', value: 'third field value' },
        { field: 'fourth field', value: 'fourth field value' },
      ],
      readonly: true,
    },
  ],
});
