import { html, render } from 'lit';
import { iconRemixCpuLine as iconCpu, iconRemixRamLine as iconRam } from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-icon/cc-icon.js';
import './cc-range-selector.js';

/**
 * @import { CcRangeSelector } from './cc-range-selector.js'
 */

const OPTIONS_DEFAULT = [
  { body: `L`, value: 'lun' },
  { body: `M`, value: 'mar' },
  { body: `M`, value: 'mer' },
  { body: `J`, value: 'jeu' },
  { body: `V`, value: 'ven' },
  { body: `S`, value: 'sam' },
  { body: `D`, value: 'dim' },
];

const OPTIONS_WITH_DISABLED = [
  { body: `L`, value: 'lun' },
  { body: `M`, value: 'mar' },
  { body: `M`, value: 'mer', disabled: true },
  { body: `J`, value: 'jeu', disabled: true },
  { body: `V`, value: 'ven' },
  { body: `S`, value: 'sam' },
  { body: `D`, value: 'dim' },
];

const DEFAULT_SELECTOR_RANGE = {
  label: 'Select a range',
  mode: 'range',
  name: 'range-selector',
  options: OPTIONS_DEFAULT,
  selection: {
    startValue: OPTIONS_DEFAULT.at(1).value,
    endValue: OPTIONS_DEFAULT.at(3).value,
  },
};

const DEFAULT_SELECTOR_SINGLE = {
  label: 'Select an option',
  mode: 'single',
  name: 'single-selector',
  options: OPTIONS_DEFAULT,
  value: OPTIONS_DEFAULT.at(3).value,
};

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-range-selector>',
  component: 'cc-range-selector',
};

const conf = {
  component: 'cc-range-selector',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      ...DEFAULT_SELECTOR_RANGE,
      required: true,
      innerHTML: `
        <p slot="help">Required</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_RANGE,
      disabled: true,
      innerHTML: `
        <p slot="help">Disabled</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_RANGE,
      readonly: true,
      innerHTML: `
        <p slot="help">Readonly</p>
      `,
    },
  ],
});

export const multiline = makeStory(conf, {
  css: `cc-range-selector {
    font-family: 'SourceCodePro', 'monaco', monospace;
  }`,
  items: [
    {
      label: 'Select a period',
      mode: 'range',
      name: 'range-selector',
      options: Array.from({ length: 27 }, (_, i) => {
        const body = (i + 1).toString().padStart(2, '0');
        return {
          body: html`&nbsp;${body}&nbsp;`,
          value: (i + 1).toString(),
        };
      }),
      selection: {
        startValue: '5',
        endValue: '9',
      },
    },
  ],
});

export const errorWithRequired = makeStory(conf, {
  tests: {
    accessibility: {
      enable: false,
    },
  },
  items: [
    {
      ...DEFAULT_SELECTOR_RANGE,
      required: true,
      selection: null,
    },
  ],
  /** @param {CcRangeSelector} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
    component.focus();
  },
});

export const withCustomOption = makeStory(conf, {
  items: [
    {
      ...DEFAULT_SELECTOR_RANGE,
      showCustom: true,
      innerHTML: `
        <p slot="help">With custom option in range mode</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_SINGLE,
      customA11yDesc: 'invent a brand new day of the week',
      showCustom: true,
      innerHTML: `
      <p slot="help">With custom option in single mode</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_RANGE,
      showCustom: true,
      disabled: true,
      innerHTML: `
        <p slot="help">Disabled</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_RANGE,
      showCustom: true,
      readonly: true,
      innerHTML: `
        <p slot="help">Readonly</p>
      `,
    },
  ],
});

export const partiallyDisabled = makeStory(conf, {
  items: [
    {
      ...DEFAULT_SELECTOR_RANGE,
      options: OPTIONS_WITH_DISABLED,
      selection: {
        startValue: 'mar',
        endValue: 'ven',
      },
      innerHTML: `
        <p slot="help">Default value including disabled options</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_RANGE,
      options: OPTIONS_WITH_DISABLED,
      selection: {
        startValue: 'lun',
        endValue: 'mar',
      },
      innerHTML: `
        <p slot="help">Default value ending just before disabled options</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_RANGE,
      options: OPTIONS_WITH_DISABLED,
      selection: {
        startValue: 'ven',
        endValue: 'dim',
      },
      innerHTML: `
        <p slot="help">Default value starting just after disabled options</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_RANGE,
      options: OPTIONS_WITH_DISABLED,
      selection: {
        startValue: 'lun',
        endValue: 'jeu',
      },
      innerHTML: `
        <p slot="help">Default value ending with disabled options (including them)</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_RANGE,
      options: OPTIONS_WITH_DISABLED,
      selection: {
        startValue: 'mer',
        endValue: 'dim',
      },
      innerHTML: `
        <p slot="help">Default value starting with disabled options (including them)</p>
      `,
    },
  ],
});

export const singleMode = makeStory(conf, {
  items: [
    {
      ...DEFAULT_SELECTOR_SINGLE,
      required: true,
      innerHTML: `
        <p slot="help">Required</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_SINGLE,
      disabled: true,
      innerHTML: `
        <p slot="help">Disabled</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_SINGLE,
      options: OPTIONS_WITH_DISABLED,
      value: 'mar',
      innerHTML: `
        <p slot="help">Partially disabled</p>
      `,
    },
    {
      ...DEFAULT_SELECTOR_SINGLE,
      readonly: true,
      innerHTML: `
        <p slot="help">Readonly</p>
      `,
    },
  ],
});

export const inlineLabel = makeStory(conf, {
  items: [
    {
      ...DEFAULT_SELECTOR_RANGE,
      inline: true,
    },
  ],
});

const INSTANCE_SIZES = [
  { value: 'pico', name: 'pico', cpu: 'Shared CPU', ram: '256 MiB RAM' },
  { value: 'nano', name: 'nano', cpu: 'Shared CPU', ram: '512 MiB RAM' },
  { value: 'xs', name: 'extra small', cpu: '1 CPUs', ram: '1 GiB RAM' },
  { value: 'sm', name: 'small', cpu: '2 CPUs', ram: '2 GiB RAM' },
  { value: 'med', name: 'medium', cpu: '4 CPUs', ram: '4 GiB RAM' },
  { value: 'lg', name: 'large', cpu: '6 CPUs', ram: '8 GiB RAM' },
  { value: 'xl', name: 'extra large', cpu: '8 CPUs', ram: '16 GiB RAM' },
  { value: '2xl', name: 'extra large+', cpu: '12 CPUs', ram: '24 GiB RAM' },
  { value: '3xl', name: 'extra large++', cpu: '16 CPUs', ram: '32 GiB RAM' },
];

const INSTANCE_SIZES_OPTIONS = INSTANCE_SIZES.map((option) => {
  const { value, name, cpu, ram } = option;
  return {
    body: html`
      <div style="padding: 0.325em 0.5em;">
        <div style="font-weight: 600; text-transform: capitalize;">${name}</div>
        <div style="font-size: 0.75em; opacity: 0.875; display: flex; align-items: center; column-gap: 0.25em;">
          <cc-icon size="sm" .icon=${iconCpu}></cc-icon>${cpu}
        </div>
        <div style="font-size: 0.75em; opacity: 0.875; display: flex; align-items: center; column-gap: 0.25em;">
          <cc-icon size="sm" .icon=${iconRam}></cc-icon>${ram}
        </div>
      </div>
    `,
    value,
    disabled: value === 'pico',
  };
});

export const customStyle = makeStory(conf, {
  css: `
    cc-range-selector {
      --cc-input-label-color: #475569;
      --cc-input-label-font-size: 1.2em;
      --cc-input-label-font-weight: bold;
      --cc-form-label-gap: 0.5em;
      --cc-range-selector-trailing-arrow-display: block;
      --cc-range-selector-options-width: 100%;
      display: block;
    }

    cc-range-selector::part(options) {
      display: grid;
      gap: 1em 0;
      grid-template-columns: repeat(auto-fit, minmax(10em, 1fr));
    }

    ::part(btn-custom) {
      font-weight: 600;
      padding: 0.575em 1em;
    }
  `,
  dom: (container) => {
    render(
      html`
        <cc-range-selector
          name="range-selector"
          label="Vertical scaling"
          .options=${INSTANCE_SIZES_OPTIONS}
          .selection=${{ startValue: 'nano', endValue: 'xs' }}
          show-custom
        >
          <p slot="help">Drag and Drop the sizes to choose which one will be activated during a scale-up scenario.</p>
        </cc-range-selector>
      `,
      container,
    );
  },
});
