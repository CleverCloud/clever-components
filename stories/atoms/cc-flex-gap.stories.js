import '../../src/atoms/cc-flex-gap.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-flex-gap>',
  component: 'cc-flex-gap',
};

const conf = {
  component: 'cc-flex-gap',
  // language=CSS
  css: `
    cc-flex-gap {
      background-color: #eee;
    }
    
    cc-flex-gap > * {
      border-radius: 0.25rem;
      border:1px solid #000;
      flex: 1 1 0;
      padding: 0.5rem 1rem;
    }
  `,
};

const flexItemsHtml = Array.from(new Array(15))
  .map((a, i) => `<div>item${'_'.repeat(i + 1)}${i + 1}</div>`)
  .join('');

export const defaultStory = makeStory(conf, {
  items: [{ innerHTML: flexItemsHtml, style: '--cc-gap: 1rem' }],
});

export const noGap = makeStory(conf, {
  items: [{ innerHTML: flexItemsHtml, style: '' }],
});

export const smallGap = makeStory(conf, {
  items: [{ innerHTML: flexItemsHtml, style: '--cc-gap: 0.5rem' }],
});

export const bigGap = makeStory(conf, {
  items: [{ innerHTML: flexItemsHtml, style: '--cc-gap: 2rem' }],
});

export const alignItems = makeStory(conf, {
  items: [
    {
      innerHTML: `
        <div style="height: 1rem">One</div>
        <div style="height: 3rem">Two</div>
        <div style="height: 9rem">Three</div>
      `,
      style: '--cc-gap: 1rem; --cc-align-items: center',
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
  noGap,
  smallGap,
  bigGap,
  alignItems,
});
