import { makeStory } from '../../stories/lib/make-story.js';
import './cc-range-selector-option.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-range-selector-option>',
  component: 'cc-range-selector-option',
};

const conf = {
  component: 'cc-range-selector-option',
};

export const defaultStates = makeStory(conf, {
  displayMode: 'flex-wrap',
  items: [
    {
      pointer: true,
      innerHTML: `
        <span>Default</span>
      `,
    },
    {
      disabled: true,
      innerHTML: `
        <span>Disabled</span>
      `,
    },
    {
      readonly: true,
      innerHTML: `
        <span>Readonly</span>
      `,
    },
    {
      error: true,
      pointer: true,
      innerHTML: `
        <span>Error</span>
      `,
    },
  ],
});

export const selectedStates = makeStory(conf, {
  displayMode: 'flex-wrap',
  items: [
    {
      selected: true,
      pointer: true,
      innerHTML: `
        <span>Default</span>
      `,
    },
    {
      disabled: true,
      selected: true,
      innerHTML: `
        <span>Disabled</span>
      `,
    },
    {
      readonly: true,
      selected: true,
      innerHTML: `
        <span>Readonly</span>
      `,
    },
    {
      error: true,
      selected: true,
      innerHTML: `
        <span>Error</span>
      `,
    },
  ],
});

export const draggingStates = makeStory(conf, {
  displayMode: 'flex-wrap',
  items: [
    {
      dragging: true,
      innerHTML: `
        <span>Default</span>
      `,
    },
    {
      dragging: true,
      error: true,
      innerHTML: `
        <span>Error</span>
      `,
    },
  ],
});
