import '../../src/atoms/cc-input-number.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const baseItems = [
  {},
  { value: 100 },
  { value: 200, disabled: true },
  { value: 300, readonly: true },
  { value: 400, skeleton: true },
];

const minMaxItems = [
  { label: '' },
  { value: 5, min: 0, max: 10, label: 'Min: 0, Max: 10' },
  { value: 10, min: 0, max: 10, label: 'Min: 0, Max: 10' },
  { value: 30, min: 0, max: 10, label: 'Min: 0, Max: 10' },
  { value: 5, min: 0, max: 10, label: 'Min: 0, Max: 10', disabled: true },
  { value: 11, min: 0, max: 10, label: 'Min: 0, Max: 10', disabled: true },
  { value: 10, min: 0, max: 10, label: 'Min 0, Max: 10', readonly: true },
  { value: 25, min: 0, max: 10, label: '', skeleton: true },
];

export default {
  title: '🧬 Atoms/<cc-input-number>',
  component: 'cc-input-number',
};

const conf = {
  component: 'cc-input-number',
  css: `
    cc-input-number {
      margin: 0.5rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: baseItems,
});

export const label = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, label: 'The label' })),
});

export const controls = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, controls: true })),
});

export const minMax = makeStory(conf, {
  items: minMaxItems,
});

export const minMaxWithControls = makeStory(conf, {
  items: minMaxItems.map((p) => ({ ...p, controls: true })),
});

export const minMaxStep = makeStory(conf, {
  items: minMaxItems.map((p) => (
    {
      ...p,
      label: `${p.label} Step: 10`,
      step: 10,
    }
  )),
});

export const minMaxStepWithControls = makeStory(conf, {
  items: minMaxItems.map((p) => (
    {
      ...p,
      controls: true,
      label: `${p.label} Step: 10`,
      step: 10,
    }
  )),
});

export const step = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, label: 'Step: 10', step: 10 })),
});

export const stepWithControls = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, label: 'Step: 10', step: 10, controls: true })),
});

export const customAlign = makeStory(conf, {
  items: [
    { label: 'Default Align (left)' },
    { value: 100, style: '--cc-input-number-align: left', label: 'Align: left' },
    { value: 100, style: '--cc-input-number-align: center', label: 'Align: center' },
    { value: 100, style: '--cc-input-number-align: right', label: 'Align: right' },
    { value: 100, disabled: true, style: '--cc-input-number-align: left', label: 'Align: left' },
    { value: 100, disabled: true, style: '--cc-input-number-align: center', label: 'Align: center' },
    { value: 100, disabled: true, style: '--cc-input-number-align: right', label: 'Align: right' },
    { value: 100, readonly: true, style: '--cc-input-number-align: left', label: 'Align: left' },
    { value: 100, readonly: true, style: '--cc-input-number-align: center', label: 'Align: center' },
    { value: 100, readonly: true, style: '--cc-input-number-align: right', label: 'Align: right' },
    { value: 100, skeleton: true, style: '--cc-input-number-align: left', label: 'Align: left' },
  ],
});

export const customWidth = makeStory(conf, {
  css: `
    cc-input-number {
      display: block;
      margin: 0.5rem;
    }
  `,
  items: Array
    .from(new Array(6))
    .map(($, i) => {
      const width = 20 + i * 50;
      return {
        controls: true,
        label: `width: ${width}px`,
        style: `width: ${width}px`,
        value: i * 20,
      };
    }),
});

enhanceStoriesNames({
  defaultStory,
  label,
  controls,
  minMax,
  minMaxWithControls,
  minMaxStep,
  minMaxStepWithControls,
  step,
  stepWithControls,
  customAlign,
  customWidth,
});
