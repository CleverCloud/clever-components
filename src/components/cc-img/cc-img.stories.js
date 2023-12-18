import './cc-img.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-img>',
  component: 'cc-img',
};

const conf = {
  component: 'cc-img',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-img {
      border-radius: 5px;
      height: 50px;
      width: 50px
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { a11yName: 'OMG' },
    { a11yName: 'OMG', skeleton: true },
    { a11yName: 'OMG', skeleton: true, src: 'http://placekitten.com/200/200' },
  ],
});

export const noAccessibleName = makeStory(conf, {
  items: [
    { },
    { skeleton: true },
    { skeleton: true, src: 'http://placekitten.com/200/200' },
  ],
});

export const imageFitContain = makeStory(conf, {
  items: [
    { a11yName: 'CC', src: 'https://assets.clever-cloud.com/infra/clever-cloud.svg', style: 'border: 1px solid #000; height: 7em; width: 2em;' },
    { a11yName: 'CC', src: 'https://assets.clever-cloud.com/infra/clever-cloud.svg', style: 'border: 1px solid #000; height: 2em; width: 7em;' },
    { a11yName: 'CC', src: 'https://assets.clever-cloud.com/infra/clever-cloud.svg', style: 'border: 1px solid #000; height: 7em; width: 2em; --cc-img-fit: contain;' },
    { a11yName: 'CC', src: 'https://assets.clever-cloud.com/infra/clever-cloud.svg', style: 'border: 1px solid #000; height: 2em; width: 7em; --cc-img-fit: contain;' },
  ],
});

export const noImage = makeStory(conf, {
  docs: 'If `src` and `skeleton` are not defined, the `a11yName` is displayed. Please make sure it fits the size you defined for the image.',
  items: [{ a11yName: 'OMG' }],
});

export const loading = makeStory(conf, {
  docs: `
It's up to you to set \`skeleton\` while you're waiting for the URL of the image you want to display.

* The skeleton state will stay after the \`src\` is set, while waiting for the image to load.
* \`skeleton\` will be set back to \`false\` by the component once the image is loaded is loaded (success or error).
`,
  items: [{ a11yName: 'OMG', skeleton: true }],
});

export const simulationWithSquareThenOther = makeStory(conf, {
  docs: `
1. \`skeleton\` with no \`src\`
1. load a square image
1. load another image
`,
  items: [{ a11yName: 'OMG', skeleton: true }],
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
  items: [{ a11yName: 'OMG', skeleton: true }],
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
  items: [{ a11yName: 'ERR', skeleton: true }],
  simulations: [
    storyWait(3000, ([component]) => {
      component.src = 'http://placekitten.com/bad/url';
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  noAccessibleName,
  imageFitContain,
  noImage,
  loading,
  simulationWithSquareThenOther,
  simulationWithPortraitThenLandscape,
  simulationWithLoadingThenError,
});
