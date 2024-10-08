import { makeStory } from '../../stories/lib/make-story.js';
import './cc-kv-hash-input.js';

/**
 * @typedef {import('./cc-kv-hash-input.js').CcKvHashInput} CcKvHashInput
 */

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
  /** @type {Array<Partial<CcKvHashInput>>} */
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
  /** @type {Array<Partial<CcKvHashInput>>} */
  items: [
    {
      value: [],
    },
  ],
});

export const disabled = makeStory(conf, {
  /** @type {Array<Partial<CcKvHashInput>>} */
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
  /** @type {Array<Partial<CcKvHashInput>>} */
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
