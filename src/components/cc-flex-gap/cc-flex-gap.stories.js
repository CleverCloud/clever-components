import './cc-flex-gap.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

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
      border-radius: 0.25em;
      border: 1px solid #000;
      flex: 1 1 0;
      padding: 0.5em 1em;
    }
  `,
};

const flexItemsHtml = Array.from(new Array(15))
  .map((a, i) => `<div>item${'_'.repeat(i + 1)}${i + 1}</div>`)
  .join('');

export const defaultStory = makeStory(conf, {
  items: [{ innerHTML: flexItemsHtml, style: '--cc-gap: 1em' }],
});

export const noGap = makeStory(conf, {
  items: [{ innerHTML: flexItemsHtml, style: '' }],
});

export const smallGap = makeStory(conf, {
  items: [{ innerHTML: flexItemsHtml, style: '--cc-gap: 0.5em' }],
});

export const bigGap = makeStory(conf, {
  items: [{ innerHTML: flexItemsHtml, style: '--cc-gap: 2em' }],
});

export const alignItems = makeStory(conf, {
  items: [
    {
      innerHTML: `
        <div style="height: 1em">One</div>
        <div style="height: 3em">Two</div>
        <div style="height: 9em">Three</div>
      `,
      style: '--cc-gap: 1em; --cc-align-items: center',
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
