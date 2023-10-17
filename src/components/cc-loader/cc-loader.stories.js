import './cc-loader.js';
import { html, render } from 'lit';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-loader>',
  component: 'cc-loader',
};

const conf = {
  component: 'cc-loader',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-loader {
      background: #eee;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { style: 'width: 5em; height: 5em' },
    { style: 'width: 5em; height: 5em; --cc-loader-color: red' },
    { style: 'width: 5em; height: 5em; --cc-loader-color: green' },
  ],
});

export const smallContainer = makeStory(conf, {
  items: [{ style: 'width: 1em; height: 1em' }],
});

export const bigContainerWithHorizontallyCentered = makeStory(conf, {
  items: [{ style: 'width: 12em; height: 6em' }],
});

export const bigContainerWithVerticallyCentered = makeStory(conf, {
  items: [{ style: 'width: 6em; height: 10em;' }],
});

export const customColor = makeStory(conf, {
  items: [
    { style: 'width: 12em; height: 6em; --cc-loader-color: red' },
    { style: 'width: 12em; height: 6em; --cc-loader-color: green' },
    { style: 'width: 12em; height: 6em; --cc-loader-color: orange' },
  ],
});

export const accessibleName = makeStory(conf, {
  css: `
    .line {
      display: flex;
      gap: 1em;
      align-items: center;
    }
  `,
  dom: (container) => {
    const storyOutput = html`
        <p>The accessible name can be checked by using the accessibility inspector of your browser.</p>
        
        <div class="line">
          <cc-loader style="width: 5em; height: 5em"></cc-loader>
          <p>With default accessible name</p>
        </div>

        <div class="line">
          <cc-loader a11y-name="Custom accessible name" style="width: 5em; height: 5em"></cc-loader>
          <p>With custom accessible name</p>
        </div>

        <div class="line">
          <cc-loader a11y-name="" style="width: 5em; height: 5em"></cc-loader>
          <p>Force no accessible name</p>
        </div>
        
    `;
    render(storyOutput, container);
  },
});

enhanceStoriesNames({
  defaultStory,
  smallContainer,
  bigContainerWithHorizontallyCentered,
  bigContainerWithVerticallyCentered,
  customColor,
  accessibleName,
});
