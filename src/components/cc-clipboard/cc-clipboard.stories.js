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
