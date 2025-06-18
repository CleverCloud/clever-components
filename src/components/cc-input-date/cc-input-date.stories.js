import { allFormControlsStory } from '../../stories/all-form-controls.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-input-date.js';

/**
 * @typedef {import('./cc-input-date.js').CcInputDate} CcInputDate
 */

const baseItems = [
  { label: 'The Label' },
  { label: 'The Label', value: '2023-07-21T14:23:51.254Z' },
  { label: 'The Label', value: '2023-07-21T14:23:51.000Z', disabled: true },
  { label: 'The Label', value: '2023-07-21T14:23:51.000Z', readonly: true },
  { label: 'The Label', value: '2023-07-21T14:23:51.000Z', skeleton: true },
];

const minMaxItems = [
  { label: 'The Label' },
  {
    value: '2023-07-21T14:23:51.000Z',
    min: '2023-07-21T00:00:00.000Z',
    max: '2023-07-22T00:00:00.000Z',
    label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00',
  },
  {
    value: '2023-07-21T00:00:00.000Z',
    min: '2023-07-21T00:00:00.000Z',
    max: '2023-07-22T00:00:00.000Z',
    label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00',
  },
  {
    value: '2023-07-22T00:00:00.000Z',
    min: '2023-07-21T00:00:00.000Z',
    max: '2023-07-22T00:00:00.000Z',
    label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00',
  },
  {
    value: '2023-07-25T00:00:00.000Z',
    min: '2023-07-21T00:00:00.000Z',
    max: '2023-07-22T00:00:00.000Z',
    label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00',
  },
  {
    value: '2023-07-21T12:00:00.000Z',
    min: '2023-07-21T00:00:00.000Z',
    max: '2023-07-22T00:00:00.000Z',
    label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00',
    disabled: true,
  },
  {
    value: '2023-07-22T12:00:00.000Z',
    min: '2023-07-21T00:00:00.000Z',
    max: '2023-07-22T00:00:00.000Z',
    label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00',
    disabled: true,
  },
  {
    value: '2023-07-21T00:00:00.000Z',
    min: '2023-07-21T00:00:00.000Z',
    max: '2023-07-22T00:00:00.000Z',
    label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00',
    readonly: true,
  },
  {
    value: '2023-07-23T00:00:00.000Z',
    min: '2023-07-21T00:00:00.000Z',
    max: '2023-07-22T00:00:00.000Z',
    label: 'Min: 2023-07-21 00:00:00, Max: 2023-07-22 00:00:00',
    skeleton: true,
  },
];

export default {
  tags: ['autodocs'],
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

export const helpMessageSlotted = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    required: true,
    innerHTML: '<p slot="help">Specify the date using this field</p>',
  })),
});

export const errorMessageEmptyInput = makeStory(conf, {
  items: [
    {
      ...baseItems[0],
      required: true,
    },
  ],
  /** @param {CcInputDate} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
  },
});

export const errorMessageInvalidFormat = makeStory(conf, {
  items: [
    {
      ...baseItems[0],
      value: 'Invalid Format',
      required: true,
    },
  ],
  /** @param {CcInputDate} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
  },
});

export const errorMessageInvalidRangeOverflowAndUnderflow = makeStory(conf, {
  items: [
    {
      ...baseItems[0],
      value: '2023-07-23T00:00:00.000Z',
      min: '2023-07-23T00:00:00.000Z',
      max: '2023-05-22T00:00:00.000Z',
      label: 'Since',
    },
    {
      ...baseItems[0],
      value: '2023-05-22T00:00:00.000Z',
      min: '2023-07-23T00:00:00.000Z',
      max: '2023-09-23T00:00:00.000Z',
      label: 'Until',
    },
  ],
  /** @param {CcInputDate} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
  },
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
  items: [
    {
      ...baseItems[0],
      inline: true,
      required: true,
    },
  ],
  /** @param {CcInputDate} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
  },
});

export const minMax = makeStory(conf, {
  items: minMaxItems,
});

export const timezone = makeStory(conf, {
  items: [
    { label: 'UTC timezone', value: '2023-07-21T14:23:51.254Z', timezone: 'UTC' },
    { label: 'local timezone', value: '2023-07-21T14:23:51.254Z', timezone: 'local' },
  ],
});

const date = new Date();
export const customWidth = makeStory(conf, {
  // language=CSS
  css: `
    cc-input-date {
      display: block;
      margin: 0.5em;
    }
  `,
  items: new Array(6).fill(0).map((_, i) => {
    const width = 20 + i * 50;
    return {
      controls: true,
      label: `width: ${width}px`,
      style: `width: ${width}px`,
      value: new Date(date.getTime() + i * 60_000),
    };
  }),
});

const customBaseItems = [{ label: 'The Label' }, { label: 'The Label', required: true }];

export const customLabelStyle = makeStory(
  { ...conf, displayMode: 'block' },
  {
    // language=CSS
    css: `
        cc-input-date {
            --cc-input-label-color: #475569;
            --cc-input-label-font-size: 1.2em;
            --cc-input-label-font-weight: bold;
            --cc-form-label-gap: 0.5em;
            font-size: 1.25em;
            max-width: 32em;
        }

        cc-input-date[inline] {
            --cc-form-label-gap: 0.75em;
        }

        cc-input-date:nth-of-type(${customBaseItems.length + 'n'}) {
            margin-block-end: 2em;
        }
    `,
    items: [
      ...customBaseItems,
      ...customBaseItems.map((item) => ({
        ...item,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
      })),
      ...customBaseItems.map((item) => ({
        ...item,
        inline: true,
      })),
    ],
    onUpdateComplete: () => {
      /** @type {HTMLElement} */
      const container = document.querySelector('.story-shadow-container');
      /** @type {NodeListOf<CcInputDate>} */
      const allComponents = container.shadowRoot.querySelectorAll('cc-input-date');
      allComponents.forEach((component) => {
        component.reportInlineValidity();
      });
    },
  },
);

export const allFormControls = allFormControlsStory;

export const simulation = makeStory(conf, {
  items: [{ label: 'The Label', required: true }],
  simulations: [
    storyWait(
      0,
      /**
       * @param {Array<CcInputDate>} args
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
       * @param {Array<CcInputDate>} args
       */
      ([component]) => {
        component.reportInlineValidity();
        component.innerHTML = `
        <p slot="help">With error, no focus</p>
      `;
      },
    ),
    storyWait(
      2000,
      /**
       * @param {Array<CcInputDate>} args
       */
      ([component]) => {
        component.reportInlineValidity();
        component.innerHTML = `
        <p slot="help">With error, with focus</p>
      `;
        component.focus();
      },
    ),
    storyWait(
      2000,
      /**
       * @param {Array<CcInputDate>} args
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
