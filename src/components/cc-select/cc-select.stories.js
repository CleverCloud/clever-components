import './cc-select.js';
import { allFormControlsStory } from '../../stories/all-form-controls.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

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
  displayMode: 'flex-wrap',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
      options: baseOptions,
      innerHTML: `
        <p slot="help">There can be only one.</p>
        <p slot="error">A value must be selected.</p>
      `,
    },
  ],
});

export const inline = makeStory(conf, {
  items: [
    {
      label: 'The label',
      inline: true,
      value: 'LENNON',
      options: baseOptions,
    },
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      inline: true,
      value: '',
      options: baseOptions,
    },
  ],
});

export const inlineWithRequired = makeStory(conf, {
  items: [
    {
      label: 'The label',
      inline: true,
      required: true,
      value: 'LENNON',
      options: baseOptions,
    },
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      inline: true,
      required: true,
      value: '',
      options: baseOptions,
    },
  ],
});

export const inlineWithErrorAndHelpMessages = makeStory(conf, {
  items: [
    {
      label: 'The label',
      inline: true,
      required: true,
      options: baseOptions,
      value: 'LENNON',
      innerHTML: `
        <p slot="help">There can be only one.</p>
        <p slot="error">A value must be selected.</p>
      `,
    },
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      inline: true,
      required: true,
      value: '',
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
      value: 'LENNON',
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
        value: '',
        options: [...baseOptions.map(() => ({ label: longContent }))],
      },
    ],
  },
);

export const allFormControls = allFormControlsStory;

enhanceStoriesNames({
  defaultStory,
  required,
  disabled,
  helpMessage,
  errorMessage,
  errorMessageWithHelpMessage,
  inline,
  inlineWithRequired,
  inlineWithErrorAndHelpMessages,
  longContentWihFixedWidth,
  allFormControls,
});
