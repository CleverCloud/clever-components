import { html, render } from 'lit';
import * as cleverIconsModule from '../../assets/cc-clever.icons.js';
import * as remixIconsModule from '../../assets/cc-remix.icons.js';
import {
  iconRemixCloudFill as iconDummy,
  iconRemixCheckLine as iconSuccess,
  iconRemixErrorWarningFill as iconWarning,
} from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-notice/cc-notice.js';
import './cc-icon.js';

// story
export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-icon>',
  component: 'cc-icon',
};

const conf = {
  component: 'cc-icon',
  displayMode: 'flex-wrap',
};

export const defaultStory = makeStory(conf, {
  items: [{ icon: iconDummy }],
});

export const size = makeStory(conf, {
  items: [
    { icon: iconDummy, size: 'xs' },
    { icon: iconDummy, size: 'sm' },
    { icon: iconDummy, size: 'md' },
    { icon: iconDummy, size: 'lg' },
    { icon: iconDummy, size: 'xl' },
    { icon: iconDummy, style: '--cc-icon-size: 64px;' },
  ],
});

export const color = makeStory(conf, {
  items: [
    { icon: iconDummy, size: 'xl', style: '--cc-icon-color: violet;' },
    { icon: iconDummy, size: 'xl', style: '--cc-icon-color: indigo;' },
    { icon: iconDummy, size: 'xl', style: '--cc-icon-color: blue;' },
    { icon: iconDummy, size: 'xl', style: '--cc-icon-color: green;' },
    { icon: iconDummy, size: 'xl', style: '--cc-icon-color: yellow;' },
    { icon: iconDummy, size: 'xl', style: '--cc-icon-color: orange;' },
    { icon: iconDummy, size: 'xl', style: '--cc-icon-color: red;' },
  ],
});

export const accessibleName = makeStory(conf, {
  css: `
    div {
      margin-top: 2em;
      margin-bottom: 0.5em;
    }
  `,
  dom: (container) => {
    const storyOutput = html`
      <p>The accessible name can be checked by using the accessibility inspector of your browser.</p>

      <div>With <code>a11y-name</code> attribute:</div>
      <cc-icon .icon="${iconSuccess}" size="xl" a11y-name="Success"></cc-icon>
      <cc-icon .icon="${iconWarning}" size="xl" a11y-name="Warning"></cc-icon>
    `;
    render(storyOutput, container);
  },
});

export const skeleton = makeStory(conf, {
  items: [
    { icon: iconDummy, skeleton: true, size: 'xs' },
    { icon: iconDummy, skeleton: true, size: 'sm' },
    { icon: iconDummy, skeleton: true, size: 'md' },
    { icon: iconDummy, skeleton: true, size: 'lg' },
    { icon: iconDummy, skeleton: true, size: 'xl' },
    { icon: iconDummy, skeleton: true, style: '--cc-icon-size: 64px;' },
  ],
});

const ICONS_LAYOUT_CSS = `
  .icon-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: center;
  }
  .icon-item {
    align-items: center;
    border: 2px solid #EAEAEA;
    border-radius: 0.5em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 1em 0.5em;
    width: 8em;
  }
  .icon-id {
    font-family: var(--cc-ff-monospace);
    font-size: 0.75em;
    text-align: center;
    word-break: break-word;
  }
`;

const ICONS_LAYOUT_BUILDER = (container, iconsModule) => {
  container.classList.add('icon-list');
  const storyOutput = Object.keys(iconsModule).map(
    (iconKey) => html`
      <div class="icon-item">
        <cc-icon .icon="${iconsModule[iconKey]}" size="xl"></cc-icon>
        <div class="icon-id">${iconKey}</div>
      </div>
    `,
  );
  render(storyOutput, container);
};

export const remixIcons = makeStory(conf, {
  tests: {
    accessibility: {
      enable: false,
    },
    visualRegressions: {
      enable: false,
    },
  },
  css: ICONS_LAYOUT_CSS,
  dom: (container) => {
    ICONS_LAYOUT_BUILDER(container, remixIconsModule);
  },
});

export const cleverIcons = makeStory(conf, {
  tests: {
    accessibility: {
      enable: false,
    },
    visualRegressions: {
      enable: false,
    },
  },
  css: ICONS_LAYOUT_CSS,
  dom: (container) => {
    ICONS_LAYOUT_BUILDER(container, cleverIconsModule);
  },
});
