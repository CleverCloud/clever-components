import { allFormControlsStory } from '../../stories/all-form-controls.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-input-number.js';

const baseItems = [
  { label: 'The Label' },
  { label: 'The Label', value: 100 },
  { label: 'The Label', value: 200, disabled: true },
  { label: 'The Label', value: 300, readonly: true },
  { label: 'The Label', value: 400, skeleton: true },
];

const minMaxItems = [
  { label: 'The Label' },
  { value: 5, min: 0, max: 10, label: 'Min: 0, Max: 10' },
  { value: 0, min: 0, max: 10, label: 'Min: 0, Max: 10' },
  { value: 10, min: 0, max: 10, label: 'Min: 0, Max: 10' },
  { value: 30, min: 0, max: 10, label: 'Min: 0, Max: 10' },
  { value: 5, min: 0, max: 10, label: 'Min: 0, Max: 10', disabled: true },
  { value: 11, min: 0, max: 10, label: 'Min: 0, Max: 10', disabled: true },
  { value: 10, min: 0, max: 10, label: 'Min 0, Max: 10', readonly: true },
  { value: 25, min: 0, max: 10, label: 'Min 0, Max: 10', skeleton: true },
];

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-input-number>',
  component: 'cc-input-number',
};

const conf = {
  component: 'cc-input-number',
  displayMode: 'flex-wrap',
};

export const defaultStory = makeStory(conf, {
  items: baseItems,
});

export const required = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, required: true })),
});

export const helpMessage = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    required: true,
    innerHTML: '<p slot="help">Must be an integer</p>',
  })),
});

export const errorMessage = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    required: true,
    errorMessage: 'You must enter a value',
  })),
});

export const errorMessageWithHelpMessage = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    required: true,
    errorMessage: 'You must enter a value',
    innerHTML: `
      <p slot="help">Must be an integer</p>
    `,
  })),
});

export const inline = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    inline: true,
  })),
});

export const inlineWithRequired = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    inline: true,
    required: true,
  })),
});

export const inlineWithErrorAndHelpMessages = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    inline: true,
    required: true,
    errorMessage: 'You must enter a value',
    innerHTML: `
      <p slot="help">Must be an integer</p>
    `,
  })),
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
  items: minMaxItems.map((p) => ({
    ...p,
    label: `${p.label} Step: 10`,
    step: 10,
  })),
});

export const minMaxStepWithControls = makeStory(conf, {
  items: minMaxItems.map((p) => ({
    ...p,
    controls: true,
    label: `${p.label} Step: 10`,
    step: 10,
  })),
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
      margin: 0.5em;
    }
  `,
  items: Array.from(new Array(6)).map(($, i) => {
    const width = 20 + i * 50;
    return {
      controls: true,
      label: `width: ${width}px`,
      style: `width: ${width}px`,
      value: i * 20,
    };
  }),
});

const customBaseItems = [
  { label: 'The label', value: 100 },
  { label: 'The label', value: 100, required: true },
  { label: 'The label', value: 100, controls: true },
  { label: 'The label', value: 100, required: true, controls: true },
];

export const customLabelStyle = makeStory(
  { ...conf, displayMode: 'block' },
  {
    // language=CSS
    css: `
    cc-input-number {
      --cc-input-label-color: #475569;
      --cc-input-label-font-size: 1.2em;
      --cc-input-label-font-weight: bold;
      --cc-form-label-gap: 0.5em;
      font-size: 1.25em;
      max-width: 32em;
    }
    cc-input-number[inline] {
      --cc-form-label-gap: 0.75em;
    }
    cc-input-number:nth-of-type(${customBaseItems.length + 'n'}) {
      margin-block-end: 2em;
    }
  `,
    items: [
      ...customBaseItems,
      ...customBaseItems.map((item) => ({
        ...item,
        innerHTML: `<p slot="help">Must be an integer</p>`,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        errorMessage: 'You must enter a value',
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        errorMessage: 'You must enter a value',
        innerHTML: `<p slot="help">Must be an integer</p>`,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
        innerHTML: `<p slot="help">Must be an integer</p>`,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
        errorMessage: 'You must enter a value',
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
        errorMessage: 'You must enter a value',
        innerHTML: `<p slot="help">Must be an integer</p>`,
      })),
    ],
  },
);

export const allFormControls = allFormControlsStory;

export const simulation = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.innerHTML = `
        <p slot="help">No error, no focus</p>
      `;
    }),
    storyWait(2000, ([component]) => {
      component.errorMessage = 'This is an error message';
      component.innerHTML = `
        <p slot="help">With error, no focus</p>
      `;
    }),
    storyWait(2000, ([component]) => {
      component.errorMessage = 'This is an error message';
      component.innerHTML = `
        <p slot="help">With error, with focus</p>
      `;
      component.focus();
    }),
    storyWait(2000, ([component]) => {
      component.errorMessage = null;
      component.innerHTML = `
        <p slot="help">No error, with focus</p>
      `;
      component.focus();
    }),
  ],
});
