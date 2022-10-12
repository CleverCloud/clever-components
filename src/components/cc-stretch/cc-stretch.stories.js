import './cc-stretch.js';
import '../cc-toggle/cc-toggle.js';
import { html, render } from 'lit';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-stretch>',
  component: 'cc-stretch',
};

const conf = {
  component: 'cc-stretch',
  // language=CSS
  css: `
    h1 {
      font-size: 1.2em;
    }
    
    .showcase-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1em 2em;
      padding: 1em;
      background-color: var(--cc-color-bg-neutral);
    }
    
    cc-stretch {
      border: 0.2em solid red;
    }
    
    cc-toggle {
      margin-bottom: 1.5em;
      margin-right: 1em;
    }

    code {
      background-color: var(--cc-color-bg-neutral);
      padding-inline: 0.3em;
    }

    p {
      margin: 0;
    }
    
    .showcase-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1em;
      margin-top: 1em;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  dom: (container) => {
    const choices = [
      { label: 'start', value: 'start' },
      { label: 'center (Default)', value: 'center' },
      { label: 'end', value: 'end' },
    ];

    const choicesItemIds = [
      { label: 'item-1', value: 'item-1' },
      { label: 'item-2', value: 'item-2' },
      { label: 'item-3', value: 'item-3' },
    ];

    const choicesStretching = [
      { label: 'enabled', value: 'enabled' },
      { label: 'disabled', value: 'disabled' },
    ];

    let justifyCustomProp = 'center';
    let alignCustomProp = 'center';
    let visibleElementId = 'item-1';
    let stretching = 'enabled';

    const refreshUi = () => render(template({
      visibleElementId,
      justifyCustomProp,
      alignCustomProp,
      stretching,
    }), container);

    const onVisibleElementIdChange = ({ detail: newVisibleElementId }) => {
      visibleElementId = newVisibleElementId;
      refreshUi();
    };

    const onStretchingChange = ({ detail: newStretching }) => {
      stretching = newStretching;
      refreshUi();
    };

    const onJustifyCustomPropChange = ({ detail: newJustifyCustomProp }) => {
      justifyCustomProp = newJustifyCustomProp;
      refreshUi();
    };

    const onAlignCustomPropChange = ({ detail: newAlignCustomProp }) => {
      alignCustomProp = newAlignCustomProp;
      refreshUi();
    };

    function template ({ visibleElementId, justifyCustomProp, alignCustomProp, stretching }) {
      return html`
        <div class="showcase-controls">
          <div>
            <h1>Component Props</h1>
            <cc-toggle 
              legend="Visible element ID"
              .choices=${choicesItemIds}
              value=${visibleElementId}
              @cc-toggle:input=${onVisibleElementIdChange}
            ></cc-toggle>
            <cc-toggle
              legend="Stretching"
              .choices=${choicesStretching}
              value=${stretching}
              @cc-toggle:input=${onStretchingChange}
            ></cc-toggle>
          </div>
        <div>
          <h1>CSS Custom Properties</h1>
          <cc-toggle
            legend="--cc-stretch-justify-items"
            value="${justifyCustomProp}"
            .choices=${choices}
            @cc-toggle:input=${onJustifyCustomPropChange}
          ></cc-toggle>
          <cc-toggle
              legend="--cc-stretch-align-items"
              value="${alignCustomProp}"
              .choices=${choices}
              @cc-toggle:input=${onAlignCustomPropChange}
          ></cc-toggle>
          </div>
          <p>The red border is not part of the component. It is only added in the story to show the actual size of the component.</p>
        </div>
        <div class="showcase-container">
          <cc-stretch
              ?disable-stretching=${stretching === 'disabled'}
              visible-element-id=${visibleElementId}
              style="--cc-stretch-justify-items: ${justifyCustomProp}; --cc-stretch-align-items: ${alignCustomProp};"
          >
            <p id="item-1"><code>id="item-1"</code><br>A short content</p>
            <p id="item-2"><code>id="item-2"</code><br>A longer content ?</p>
            <p id="item-3"><code>id="item-3"</code><br>The very long content the component bases it's <code>width</code> on.<br>It also bases its <code>height</code> on this content.</p>
          </cc-stretch>
        </div>
      `;
    }

    refreshUi();
  },
});

export const simulation = makeStory(conf, {
  items: [{
    visibleElementId: 'item-1',
    innerHTML: `
      <p id="item-1"><code>id="item-1"</code><br>A short content</p>
      <p id="item-2"><code>id="item-2"</code><br>A longer content ?</p>
      <p id="item-3"><code>id="item-3"</code><br>The very long content the component bases it's <code>width</code> on.<br>It also bases its <code>height</code> on this content.</p>
    `,
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
  simulation,
});
