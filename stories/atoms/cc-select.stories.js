import '../../src/atoms/cc-select.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { allFormControlsStory } from './all-form-controls.js';

const baseOptions = [
  {
    value: 'LENNON',
    label: 'John Lennon',
  },
  {
    value: 'MCCARTNEY',
    label: 'Paul McCartney',
  },
  {
    value: 'HARRISON',
    label: 'George Harrison',
  },
  {
    value: 'GAGA',
    label: 'Lady Gaga',
  },
];

const longContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget tempor leo, eu vulputate lectus. Sed rhoncus rhoncus mi nec tempor. Pellentesque id elit aliquet, laoreet mi nec, cursus metus. Integer iaculis nibh non massa dignissim dictum.';

export default {
  title: '🧬 Atoms/<cc-select>',
  component: 'cc-select',
};

const conf = {
  component: 'cc-select',
  // language=CSS
  css: `cc-select {
    margin-right: 1em;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      options: baseOptions,
    },
    {
      label: 'Favourite artist',
      value: 'GAGA',
      options: baseOptions,
    },
  ],
});

export const required = makeStory(conf, {
  items: [
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      required: true,
      options: baseOptions,
    },
  ],
});

export const helpMessage = makeStory(conf, {
  items: [
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      required: true,
      options: baseOptions,
      innerHTML: '<p slot="help">There can be only one.</p>',
    },
  ],
});

export const errorMessage = makeStory(conf, {
  items: [
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      required: true,
      options: baseOptions,
      innerHTML: '<p slot="error">A value must be selected.</p>',
    },
  ],
});

export const errorMessageWithHelpMessage = makeStory(conf, {
  items: [
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      required: true,
      options: baseOptions,
      innerHTML: `
        <p slot="help">There can be only one.</p>
        <p slot="error">A value must be selected.</p>
      `,
    },
  ],
});

export const disabled = makeStory(conf, {
  items: [
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      disabled: true,
      options: baseOptions,
    },
  ],
});

export const longContentWihFixedWidth = makeStory(
  {
    ...conf,
    // language=CSS
    css: `cc-select {
      margin-right: 1em;
      max-width: 300px;
    }`,
  },
  {
    items: [
      {
        label: longContent,
        placeholder: '-- Select an artist --',
        required: true,
        options: [...baseOptions.map(() => ({ label: longContent }))],
      },
    ],
  },
);

export const allFormControls = allFormControlsStory;

enhanceStoriesNames({
  defaultStory,
  required,
  helpMessage,
  errorMessage,
  errorMessageWithHelpMessage,
  longContentWihFixedWidth,
  allFormControls,
});
