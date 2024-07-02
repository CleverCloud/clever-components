import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import './cc-block.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Molecules/<cc-new>',
  component: 'cc-block-new',
};

const conf = {
  component: 'cc-block-new',
};

export const defaultStory = makeStory(conf, {
  items: [{
  }],
});
