import '../../src/atoms/cc-img.js';
import notes from '../../.components-docs/cc-img.md';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🧬 Atoms|<cc-img>',
  component: 'cc-img',
  parameters: { notes },
};

const conf = {
  component: 'cc-img',
  css: `
    cc-img {
      border-radius: 5px;
      height: 50px;
      margin-right: 1rem;
      width: 50px
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { text: 'OMG' },
    { text: 'OMG', skeleton: true },
    { text: 'OMG', skeleton: true, src: 'http://placekitten.com/200/200' },
  ],
});

export const noImage = makeStory(conf, {
  docs: 'If `src` and `skeleton` are not defined, the `text` is displayed. Please make sure it fits the size you defined for the image.',
  items: [{ text: 'OMG' }],
});

export const loading = makeStory(conf, {
  docs: `
It's up to you to set \`skeleton\` while you're waiting for the URL of the image you want to display.

* The skeleton state will stay after the \`src\` is set, while waiting for the image to load.
* \`skeleton\` will be set back to \`false\` by the component once the image is loaded is loaded (success or error).
`,
  items: [{ text: 'OMG', skeleton: true }],
});

export const simulationWithSquareThenOther = makeStory(conf, {
  docs: `
1. \`skeleton\` with no \`src\`
1. load a square image
1. load another image
`,
  items: [{ text: 'OMG', skeleton: true }],
  simulations: [
    storyWait(3000, ([component]) => {
      component.src = 'http://placekitten.com/200/200';
    }),
    storyWait(3000, ([component]) => {
      component.src = 'http://placekitten.com/300/300';
    }),
  ],
});

export const simulationWithPortraitThenLandscape = makeStory(conf, {
  items: [{ text: 'OMG', skeleton: true }],
  simulations: [
    storyWait(3000, ([component]) => {
      component.src = 'http://placekitten.com/200/500';

    }),
    storyWait(3000, ([component]) => {
      component.src = 'http://placekitten.com/500/200';
    }),
  ],
});

export const simulationWithLoadingThenError = makeStory(conf, {
  items: [{ text: 'ERR', skeleton: true }],
  simulations: [
    storyWait(3000, ([component]) => {
      component.src = 'http://placekitten.com/bad/url';
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  noImage,
  loading,
  simulationWithSquareThenOther,
  simulationWithPortraitThenLandscape,
  simulationWithLoadingThenError,
});
