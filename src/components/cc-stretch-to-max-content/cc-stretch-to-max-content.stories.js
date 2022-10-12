// Don't forget to import the component you're presenting!
import './cc-stretch-to-max-content.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-stretch-to-max-content>',
  component: 'cc-stretch-to-max-content',
};

const baseHtml = `
  <p id="item-1">A short content</p>
  <p id="item-2">A longer content ?</p>
  <p id="item-3">The very long content the component bases it's <code>width</code> on.<br>It also bases its <code>height</code> on this content.</p>
`;

const conf = {
  component: 'cc-stretch-to-max-content',
  // language=CSS
  css: `
    cc-stretch-to-max-content {
      border: 0.2em solid red;
    }

    code {
      background-color: var(--cc-color-bg-neutral);
      padding-inline: 0.3em;
    }
    
    p {
      margin: 0;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      visibleElementId: 'item-1',
      innerHTML: baseHtml,
    },
  ],
});

export const centerContentHorizontally = makeStory(conf, {
  items: [
    {
      visibleElementId: 'item-2',
      centerContentHorizontally: true,
      innerHTML: baseHtml,
    },
  ],
});

export const centerContentVertically = makeStory(conf, {
  items: [
    {
      visibleElementId: 'item-2',
      centerContentVertically: true,
      innerHTML: baseHtml,
    },
  ],
});

export const disableStretching = makeStory(conf, {
  items: [
    {
      visibleElementId: 'item-2',
      disableStretching: true,
      innerHTML: baseHtml,
    },
  ],
});

export const simulation = makeStory(conf, {
  items: [{
    visibleElementId: 'item-1',
    innerHTML: baseHtml,
  }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.visibleElementId = 'item-2';
    }),
    storyWait(1000, ([component]) => {
      component.visibleElementId = 'item-3';
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  centerContentHorizontally,
  centerContentVertically,
  disableStretching,
  simulation,
});
