import { makeStory } from '../../stories/lib/make-story.js';
import './cc-picker.js';

/**
 * @import { CcPicker } from './cc-picker.js'
 */

const DEFAULT_ITEM = {
  label: 'Find the intruder',
  name: 'name',
  options: [
    { body: 'Lady Gaga', value: 'GAGA' },
    { body: 'John Lennon', value: 'LENNON' },
    { body: 'Paul McCartney', value: 'MCCARTNEY' },
    { body: 'George Harrison', value: 'HARRISON' },
  ],
};

const ONE_OPTION_DISABLED = {
  label: 'Find the intruder',
  name: 'name',
  options: [
    { body: 'Lady Gaga', value: 'GAGA' },
    { body: 'John Lennon', value: 'LENNON' },
    { body: 'Paul McCartney', value: 'MCCARTNEY', disabled: true },
    { body: 'George Harrison', value: 'HARRISON' },
  ],
};

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-picker>',
  component: 'cc-picker',
};

const conf = {
  component: 'cc-picker',
};

export const defaultStory = makeStory(conf, {
  items: [DEFAULT_ITEM],
});

export const required = makeStory(conf, {
  items: [
    {
      ...DEFAULT_ITEM,
      required: true,
    },
  ],
});

export const helpMessage = makeStory(conf, {
  items: [
    {
      ...DEFAULT_ITEM,
      innerHTML: `
        <p slot="help">There can be only one</p>
      `,
    },
  ],
});

export const errorMessage = makeStory(conf, {
  items: [
    {
      ...DEFAULT_ITEM,
      required: true,
    },
  ],
  /** @param {CcPicker} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
    component.focus();
  },
});

export const errorMessageWithWithOneOptionDisabled = makeStory(conf, {
  items: [
    {
      ...ONE_OPTION_DISABLED,
      required: true,
    },
  ],
  /** @param {CcPicker} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
    component.focus();
  },
});

export const errorMessageWithWithHelpMessage = makeStory(conf, {
  items: [
    {
      ...DEFAULT_ITEM,
      innerHTML: `
        <p slot="help">There can be only one</p>
      `,
      required: true,
    },
  ],
  /** @param {CcPicker} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
    component.focus();
  },
});

export const inline = makeStory(conf, {
  items: [
    {
      ...DEFAULT_ITEM,
      inline: true,
      innerHTML: `
        <p slot="help">There can be only one</p>
      `,
      required: true,
    },
  ],
  /** @param {CcPicker} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
    component.focus();
  },
});

export const disabledWithAllOptions = makeStory(conf, {
  items: [
    {
      ...DEFAULT_ITEM,
      disabled: true,
      value: 'GAGA',
    },
  ],
});

export const disabledWithOneOption = makeStory(conf, {
  items: [
    {
      ...ONE_OPTION_DISABLED,
      value: 'GAGA',
    },
  ],
});

export const readonly = makeStory(conf, {
  items: [
    {
      ...DEFAULT_ITEM,
      readonly: true,
      value: 'GAGA',
    },
  ],
});

export const radioSelectionStyle = makeStory(conf, {
  items: [
    {
      ...DEFAULT_ITEM,
      selectionStyle: 'radio',
      value: 'GAGA',
    },
  ],
});

export const customStyle = makeStory(conf, {
  css: `
    cc-picker {
      --cc-input-label-color: #475569;
      --cc-input-label-font-size: 1.2em;
      --cc-input-label-font-weight: bold;
      --cc-form-label-gap: 0.5em;
      --cc-picker-tiles-width: 100%;
    }

    cc-picker::part(tiles) {
      display: grid;
      gap: 0.5em 1em;
      grid-template-columns: repeat(auto-fit, minmax(12.5em, 1fr));
    }
  `,
  items: [
    {
      ...DEFAULT_ITEM,
      inline: true,
      required: true,
      value: 'GAGA',
    },
  ],
});
