import { makeStory } from '../../stories/lib/make-story.js';
import './cc-kv-list-input.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Kv Explorer/<cc-kv-list-input-beta>',
  component: 'cc-kv-list-input-beta',
};

const conf = {
  component: 'cc-kv-list-input-beta',
  beta: true,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      value: ['first value', 'second value', 'third value', 'fourth value'],
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
      value: ['first value', 'second value', 'third value', 'fourth value'],
      disabled: true,
    },
  ],
});

export const readonly = makeStory(conf, {
  items: [
    {
      value: ['first value', 'second value', 'third value', 'fourth value'],
      readonly: true,
    },
  ],
});
