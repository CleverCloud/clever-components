import './cc-input-date.js';
import { allFormControlsStory } from '../../stories/all-form-controls.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const baseItems = [
  { label: 'The Label' },
  { label: 'The Label', value: '2023-07-21T14:23:51.000Z' },
  { label: 'The Label', value: '2023-07-21T14:23:51.000Z', disabled: true },
  { label: 'The Label', value: '2023-07-21T14:23:51.000Z', readonly: true },
  { label: 'The Label', value: '2023-07-21T14:23:51.000Z', skeleton: true },
];

const minMaxItems = [
  { label: 'The Label' },
  { value: '2023-07-21T14:23:51.000Z', min: '2023-07-21T00:00:00.000Z', max: '2023-07-22T00:00:00.000Z', label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00' },
  { value: '2023-07-21T00:00:00.000Z', min: '2023-07-21T00:00:00.000Z', max: '2023-07-22T00:00:00.000Z', label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00' },
  { value: '2023-07-22T00:00:00.000Z', min: '2023-07-21T00:00:00.000Z', max: '2023-07-22T00:00:00.000Z', label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00' },
  { value: '2023-07-25T00:00:00.000Z', min: '2023-07-21T00:00:00.000Z', max: '2023-07-22T00:00:00.000Z', label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00' },
  { value: '2023-07-21T12:00:00.000Z', min: '2023-07-21T00:00:00.000Z', max: '2023-07-22T00:00:00.000Z', label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00', disabled: true },
  { value: '2023-07-22T12:00:00.000Z', min: '2023-07-21T00:00:00.000Z', max: '2023-07-22T00:00:00.000Z', label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00', disabled: true },
  { value: '2023-07-21T00:00:00.000Z', min: '2023-07-21T00:00:00.000Z', max: '2023-07-22T00:00:00.000Z', label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00', readonly: true },
  { value: '2023-07-23T00:00:00.000Z', min: '2023-07-21T00:00:00.000Z', max: '2023-07-22T00:00:00.000Z', label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00', skeleton: true },
];

export default {
  title: '🧬 Atoms/<cc-input-date>',
  component: 'cc-input-date',
};

const conf = {
  component: 'cc-input-date',
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
    innerHTML: '<p slot="help">Must be a date</p>',
  })),
});

export const errorMessage = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    required: true,
    innerHTML: '<p slot="error">You must enter a value</p>',
  })),
});

export const errorMessageWithHelpMessage = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    required: true,
    innerHTML: `
      <p slot="help">Must be a date</p>
      <p slot="error">You must enter a value</p>
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
    innerHTML: `
      <p slot="help">Must be a date</p>
      <p slot="error">You must enter a value</p>
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
  items: minMaxItems.map((p) => (
    {
      ...p,
      label: `${p.label} Step: 10 minutes`,
      step: 600_000,
    }
  )),
});

export const minMaxStepWithControls = makeStory(conf, {
  items: minMaxItems.map((p) => (
    {
      ...p,
      controls: true,
      label: `${p.label} Step: 10 minutes`,
      step: 600_000,
    }
  )),
});

export const step = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, label: 'Step: 10 minutes', step: 10 * 60 * 1000 })),
});

export const stepWithControls = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, label: 'Step: 10 minutes', step: 10 * 60 * 1000, controls: true })),
});

const date = new Date();
export const customWidth = makeStory(conf, {
  css: `
    cc-input-number {
      display: block;
      margin: 0.5em;
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
        value: new Date(date.getTime() + i * 60_000),
      };
    }),
});

export const allFormControls = allFormControlsStory;

export const simulation = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(0, ([component]) => {
      component.innerHTML = `
        <p slot="help">No error slot, no focus</p>
      `;
    }),
    storyWait(2000, ([component]) => {
      component.innerHTML = `
        <p slot="help">With error, no focus</p>
        <p slot="error">This is an error message</p>
      `;
    }),
    storyWait(2000, ([component]) => {
      component.innerHTML = `
        <p slot="help">With error, with focus</p>
        <p slot="error">This is an error message</p>
      `;
      component.focus();
    }),
    storyWait(2000, ([component]) => {
      component.innerHTML = `
        <p slot="help">No error slot, with focus</p>
      `;
      component.focus();
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  required,
  helpMessage,
  errorMessage,
  errorMessageWithHelpMessage,
  inline,
  inlineWithRequired,
  inlineWithErrorAndHelpMessages,
  controls,
  minMax,
  minMaxWithControls,
  minMaxStep,
  minMaxStepWithControls,
  step,
  stepWithControls,
  customWidth,
  allFormControls,
  simulation,
});
