import { allFormControlsStory } from '../../stories/all-form-controls.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-select.js';

/**
 * @typedef {import('./cc-select.js').CcSelect} CcSelect
 */

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

const longContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget tempor leo, eu vulputate lectus. Sed rhoncus rhoncus mi nec tempor. Pellentesque id elit aliquet, laoreet mi nec, cursus metus. Integer iaculis nibh non massa dignissim dictum.';

export default {
  tags: ['autodocs'],
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
      errorMessage: 'A value must be selected.',
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
      errorMessage: 'A value must be selected.',
      innerHTML: `
        <p slot="help">There can be only one.</p>
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
      errorMessage: 'A value must be selected.',
      innerHTML: `
        <p slot="help">There can be only one.</p>
      `,
    },
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      inline: true,
      required: true,
      value: '',
      options: baseOptions,
      errorMessage: 'A value must be selected.',
      innerHTML: `
        <p slot="help">There can be only one.</p>
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

const customBaseItems = [
  { label: 'Favourite artist', value: 'LENNON', options: baseOptions },
  { label: 'Favourite artist', value: 'LENNON', options: baseOptions, required: true },
];

export const customLabelStyle = makeStory(
  { ...conf, displayMode: 'block' },
  {
    // language=CSS
    css: `
    cc-select {
      --cc-select-label-color: #475569;
      --cc-select-label-font-size: 1.2em;
      --cc-select-label-font-weight: bold;
      --cc-form-label-gap: 0.5em;
      font-size: 1.25em;
      max-width: 32em;
    }
    cc-select[inline] {
      --cc-form-label-gap: 0.75em;
    }
    cc-select:nth-of-type(${customBaseItems.length + 'n'}) {
      margin-block-end: 2em;
    }
  `,
    items: [
      ...customBaseItems,
      ...customBaseItems.map((item) => ({
        ...item,
        innerHTML: `<p slot="help">There can be only one.</p>`,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        errorMessage: 'A value must be selected.',
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        errorMessage: 'A value must be selected.',
        innerHTML: `<p slot="help">There can be only one.</p>`,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
        innerHTML: `<p slot="help">There can be only one.</p>`,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
        errorMessage: 'A value must be selected.',
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
        errorMessage: 'A value must be selected.',
        innerHTML: `<p slot="help">There can be only one.</p>`,
      })),
    ],
  },
);

export const allFormControls = allFormControlsStory;

export const simulation = makeStory(conf, {
  items: [
    {
      label: 'Favourite artist',
      placeholder: '-- Select an artist --',
      value: '',
      options: baseOptions,
    },
  ],
  simulations: [
    storyWait(
      0,
      /**
       * @param {Array<CcSelect>} args
       */
      ([component]) => {
        component.innerHTML = `
        <p slot="help">No error, no focus</p>
      `;
      },
    ),
    storyWait(
      2000,
      /**
       * @param {Array<CcSelect>} args
       */
      ([component]) => {
        component.errorMessage = 'This is an error message';
        component.innerHTML = `
        <p slot="help">With error, no focus</p>
      `;
      },
    ),
    storyWait(
      2000,
      /**
       * @param {Array<CcSelect>} args
       */
      ([component]) => {
        component.errorMessage = 'This is an error message';
        component.innerHTML = `
        <p slot="help">With error, with focus</p>
      `;
        component.focus();
      },
    ),
    storyWait(
      2000,
      /**
       * @param {Array<CcSelect>} args
       */
      ([component]) => {
        component.errorMessage = null;
        component.innerHTML = `
        <p slot="help">No error, with focus</p>
      `;
        component.focus();
      },
    ),
  ],
});
