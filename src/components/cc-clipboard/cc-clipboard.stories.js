import { makeStory } from '../../stories/lib/make-story.js';
import './cc-clipboard.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-clipboard>',
  component: 'cc-clipboard',
};

const conf = {
  component: 'cc-clipboard',
};

export const defaultStory = makeStory(conf, {
  items: [{ value: 'Text to copy' }],
});

export const emptyText = makeStory(conf, {
  items: [{ value: '' }],
});

export const shortText = makeStory(conf, {
  items: [{ value: 'Foo' }],
});

export const skeleton = makeStory(conf, {
  items: [{ value: 'Text to copy', skeleton: true }],
});
