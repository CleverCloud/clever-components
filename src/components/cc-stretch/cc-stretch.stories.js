import { html, render } from 'lit';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import '../cc-toggle/cc-toggle.js';
import './cc-stretch.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-stretch>',
  component: 'cc-stretch',
};

const conf = {
  component: 'cc-stretch',
  tests: {
    accessibility: {
      enable: true,
      ignoredRules: ['duplicate-id'],
    },
  },
  // language=CSS
  css: `
    h1 {
      font-size: 1.2em;
    }

    h2 {
      font-size: 1em;
    }

    .showcase-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1em 2em;
      padding: 1em;
      background-color: var(--cc-color-bg-neutral);
    }

    cc-stretch {
      border: 0.3em solid red;
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

    .test-container {
      border: 0.06em solid blue;
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

    const refreshUi = () =>
      render(
        template({
          visibleElementId,
          justifyCustomProp,
          alignCustomProp,
          stretching,
        }),
        container,
      );

    /**
     * @param {CcSelectEvent} event
     */
    function onVisibleElementIdChange({ detail: newVisibleElementId }) {
      visibleElementId = newVisibleElementId;
      refreshUi();
    }

    /**
     * @param {CcSelectEvent} event
     */
    function onStretchingChange({ detail: newStretching }) {
      stretching = newStretching;
      refreshUi();
    }

    /**
     * @param {CcSelectEvent} event
     */
    function onJustifyCustomPropChange({ detail: newJustifyCustomProp }) {
      justifyCustomProp = newJustifyCustomProp;
      refreshUi();
    }

    /**
     * @param {CcSelectEvent} event
     */
    function onAlignCustomPropChange({ detail: newAlignCustomProp }) {
      alignCustomProp = newAlignCustomProp;
      refreshUi();
    }

    function template({ visibleElementId, justifyCustomProp, alignCustomProp, stretching }) {
      return html`
        <div class="showcase-controls">
          <div>
            <h1>Component Props</h1>
            <cc-toggle
              legend="Visible element ID"
              .choices=${choicesItemIds}
              value=${visibleElementId}
              @cc-select=${onVisibleElementIdChange}
            ></cc-toggle>
            <cc-toggle
              legend="Stretching"
              .choices=${choicesStretching}
              value=${stretching}
              @cc-select=${onStretchingChange}
            ></cc-toggle>
          </div>
          <div>
            <h1>CSS Custom Properties</h1>
            <cc-toggle
              legend="--cc-stretch-justify-items"
              value="${justifyCustomProp}"
              .choices=${choices}
              @cc-select=${onJustifyCustomPropChange}
            ></cc-toggle>
            <cc-toggle
              legend="--cc-stretch-align-items"
              value="${alignCustomProp}"
              .choices=${choices}
              @cc-select=${onAlignCustomPropChange}
            ></cc-toggle>
          </div>
          <p>
            The red border is not part of the component. It is only added in the story to show the actual size of the
            component.
          </p>
        </div>
        <div class="showcase-container">
          <cc-stretch
            ?disable-stretching=${stretching === 'disabled'}
            visible-element-id=${visibleElementId}
            style="--cc-stretch-justify-items: ${justifyCustomProp}; --cc-stretch-align-items: ${alignCustomProp};"
          >
            <p id="item-1"><code>id="item-1"</code><br />A short content</p>
            <p id="item-2"><code>id="item-2"</code><br />A longer content ?</p>
            <p id="item-3">
              <code>id="item-3"</code><br />The very long content the component bases it's
              <code>width</code> on.<br />It also bases its <code>height</code> on this content.
            </p>
          </cc-stretch>
        </div>
      `;
    }

    refreshUi();
  },
});

export const differentLayouts = makeStory(conf, {
  dom: (container) => {
    const displayTypes = [
      {
        heading: 'block',
        styles: 'display: block;',
      },
      {
        heading: 'flex - Row',
        styles: 'display: flex;',
      },
      {
        heading: 'flex - Column',
        styles: 'display: flex; flex-direction: column;',
      },
      {
        heading: 'Grid',
        styles: 'display: grid;',
      },
    ];
    render(
      html`
        <h1>Showing the component in different <code>CSS Display</code> contexts</h1>
        <p>
          All <code>&lt;cc-stretch&gt;</code> (thick red border) should have the size of their content and not their
          container (thin blue border).
        </p>
        ${displayTypes.map(({ heading, styles }) => template({ heading, styles }))}
      `,
      container,
    );

    function template({ heading, styles }) {
      return html`
        <h2>Container set to: ${heading}</h2>
        <div class="test-container" style=${styles}>
          <cc-stretch visible-element-id="item-3">
            <p id="item-1"><code>id="item-1"</code><br />A short content</p>
            <p id="item-2"><code>id="item-2"</code><br />A longer content ?</p>
            <p id="item-3">
              <code>id="item-3"</code><br />The very long content the component bases it's
              <code>width</code> on.<br />It also bases its <code>height</code> on this content.
            </p>
          </cc-stretch>
        </div>
      `;
    }
  },
});

export const simulation = makeStory(conf, {
  items: [
    {
      visibleElementId: 'item-1',
      innerHTML: `
      <p id="item-1"><code>id="item-1"</code><br>A short content</p>
      <p id="item-2"><code>id="item-2"</code><br>A longer content ?</p>
      <p id="item-3"><code>id="item-3"</code><br>The very long content the component bases it's <code>width</code> on.<br>It also bases its <code>height</code> on this content.</p>
    `,
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.visibleElementId = 'item-2';
    }),
    storyWait(1000, ([component]) => {
      component.visibleElementId = 'item-3';
    }),
  ],
});
