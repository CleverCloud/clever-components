import { allFormControlsStory } from '../../stories/all-form-controls.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-input-text.js';

/**
 * @typedef {import('./cc-input-text.js').CcInputText} CcInputText
 */

function widthContent(chars) {
  const rawContents = `_chars`;
  return String(chars) + String(rawContents).padStart(chars - 2, '_');
}

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget tempor leo, eu vulputate lectus. Sed rhoncus rhoncus mi nec tempor. Pellentesque id elit aliquet, laoreet mi nec, cursus metus. Integer iaculis nibh non massa dignissim dictum.
Etiam a condimentum velit. Sed orci nunc, iaculis quis nulla nec, pretium mattis mi. Phasellus auctor sit amet massa at tempus. Sed eu aliquam justo. Nulla tortor neque, porta a elit vitae, accumsan auctor mauris. Vestibulum efficitur urna est, sit amet convallis metus porta tempus.
Etiam vestibulum placerat massa eget lacinia. Aenean bibendum, massa id mattis vehicula, turpis erat rhoncus ante, sed pharetra nulla velit non velit. Aliquam vehicula mauris elit, id elementum nisi malesuada ut. Donec hendrerit rhoncus orci, quis scelerisque quam cursus eget.
Integer posuere tortor sit amet nisl sollicitudin, at tempus ipsum semper.`;

const baseItems = [
  { label: 'The label', placeholder: 'No value yet...' },
  { label: 'The label', placeholder: 'No value yet...', value: 'Simple value' },
  { label: 'The label', placeholder: 'No value yet...', value: 'Disabled value', disabled: true },
  { label: 'The label', placeholder: 'No value yet...', value: 'Readonly value', readonly: true },
  { label: 'The label', placeholder: 'No value yet...', value: 'Skeleton', skeleton: true },
  { label: 'The label', placeholder: 'No value yet...', multi: true },
  { label: 'The label', placeholder: 'No value yet...', multi: true, value: 'Simple value\nOther lines...' },
  {
    label: 'The label',
    placeholder: 'No value yet...',
    multi: true,
    value: 'Disabled value\nOther lines...',
    disabled: true,
  },
  {
    label: 'The label',
    placeholder: 'No value yet...',
    multi: true,
    value: 'Readonly value\nOther lines...',
    readonly: true,
  },
  {
    label: 'The label',
    placeholder: 'No value yet...',
    multi: true,
    value: 'Skeleton\nOther lines...',
    skeleton: true,
  },
];

const tagsItems = [
  {
    label: 'The label',
    placeholder: 'No value yet...',
    tags: [],
  },
  {
    label: 'The label',
    placeholder: 'No value yet...',
    tags: ['simple', 'simple:very-very-very-very-long', 'foo', 'bar', 'simple:foooobar'],
  },
  {
    label: 'The label',
    placeholder: 'No value yet...',
    tags: ['disabled', 'disabled:very-very-very-very-long', 'foo', 'bar', 'disabled:foooobar'],
    disabled: true,
  },
  {
    label: 'The label',
    placeholder: 'No value yet...',
    tags: ['readonly', 'disabled:very-very-very-very-long', 'foo', 'bar', 'readonly:foooobar'],
    readonly: true,
  },
  {
    label: 'The label',
    placeholder: 'No value yet...',
    tags: ['skeleton', 'skeleton:very-very-very-very-long', 'foo', 'bar', 'skeleton:foooobar'],
    skeleton: true,
  },
];

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-input-text>',
  component: 'cc-input-text',
};

const conf = {
  component: 'cc-input-text',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-input-text[multi] {
      /* Necessary because the container is a display:flex */
      width: 100%;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { label: 'The Label', placeholder: 'No value yet...' },
    { label: 'The Label', value: 'Some example text' },
    { label: 'The Label', value: 'Disabled value', disabled: true },
    { label: 'The Label', value: 'Readonly value', readonly: true },
    { label: 'The Label', value: 'Copy to clipboard', clipboard: true },
    { label: 'The Label', value: 'Hidden secret', secret: true },
    { label: 'The Label', value: 'Skeleton', skeleton: true },
    { label: 'The Label', value: 'Line one\nLine two\nLine three', multi: true },
    { label: 'The Label', tags: ['tag1', 'tag2', 'tag-name:tag-value', 'very-very-very-very-long-tag'] },
  ],
});

export const required = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, required: true })),
});

export const helpMessage = makeStory(conf, {
  items: baseItems.map((p) => ({
    ...p,
    required: true,
    innerHTML: '<p slot="help">Must be at least 7 characters long</p>',
  })),
});

export const errorMessage = makeStory(conf, {
  items: [
    {
      ...baseItems[0],
      required: true,
    },
  ],
  /** @param {CcInputText} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
  },
});

export const errorMessageWithHelpMessage = makeStory(conf, {
  items: [
    {
      ...baseItems[0],
      required: true,
      innerHTML: `
      <p slot="help">Must be at least 7 characters long</p>
     `,
    },
  ],
  /** @param {CcInputText} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
  },
});

export const errorMessageWithInvalidEmailFormat = makeStory(conf, {
  items: [
    {
      ...baseItems[0],
      required: true,
      type: 'email',
      value: 'Invalid Email Format',
    },
  ],
  /** @param {CcInputText} component */
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
      required: true,
      inline: true,
      innerHTML: `
      <p slot="help">Must be at least 7 characters long</p>
     `,
    },
  ],
  /** @param {CcInputText} component */
  onUpdateComplete: (component) => {
    component.reportInlineValidity();
  },
});

export const clipboard = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, clipboard: true })),
});

export const clipboardWithAutoAdjust = makeStory(conf, {
  docs: `
* If you use \`clipboard\` and \`readonly\`, the width of the input will be auto-adjusted to the content.
* This has no effect in \`multi\` mode.
`,
  items: [
    { label: 'The label', value: widthContent(10), clipboard: true, readonly: true },
    { label: 'The label', value: widthContent(20), clipboard: true, readonly: true },
    { label: 'The label', value: widthContent(40), clipboard: true, readonly: true },
    { label: 'The label', value: widthContent(60), clipboard: true, readonly: true },
  ],
});

export const clipboardWithAutoAdjustAndCssOverride = makeStory(conf, {
  docs: `When auto-adjust is triggered (\`clipboard\` and \`readonly\`), you can override/fix the width with CSS.`,
  items: [
    { label: 'The label', value: widthContent(20), clipboard: true, readonly: true, style: 'width: 280px' },
    { label: 'The label', value: widthContent(10), clipboard: true, readonly: true, style: 'width: 280px' },
    { label: 'The label', value: widthContent(40), clipboard: true, readonly: true, style: 'width: 280px' },
    { label: 'The label', value: widthContent(60), clipboard: true, readonly: true, style: 'width: 280px' },
  ],
});

export const secret = makeStory(conf, {
  docs: `The \`secret\` feature does not work with \`multi\` mode, it is ignored.`,
  items: baseItems.map((p) => ({ ...p, secret: true })),
});

export const clipboardAndSecret = makeStory(conf, {
  docs: `
* \`clipboard\` and \`secret\` can be used together.
* The \`secret\` feature does not work with \`multi\` mode, it is ignored`,
  items: baseItems.map((p) => ({ ...p, clipboard: true, secret: true })),
});

export const longValue = makeStory(conf, {
  items: baseItems.filter((p) => p.value != null).map((p) => ({ ...p, value: lorem })),
});

export const tags = makeStory(conf, {
  docs: `When \`tags\` is set to an array of strings (or empty array), tags mode is enabled.

* Space separated values are highlighted with a colored background.
* A \`cc-input-text:tags\` event is fired with the array of tags when the value changes (empty values are filtered out).
* The \`tags\` feature does not work with \`multi\` or \`secret\`.`,
  // language=CSS
  css: `cc-input-text {
    width: 300px;
  }`,
  items: tagsItems,
});

export const tagsWithClipboard = makeStory(conf, {
  // language=CSS
  css: `cc-input-text {
    width: 300px;
  }`,
  items: tagsItems.map((p) => ({ ...p, clipboard: true })),
});

const customBaseItems = [
  { label: 'The label', placeholder: 'No value yet...' },
  { label: 'The label', placeholder: 'No value yet...', required: true },
  { label: 'The label', placeholder: 'No value yet...', multi: true },
  { label: 'The label', placeholder: 'No value yet...', multi: true, required: true },
  { label: 'The label', placeholder: 'No value yet...', multi: true, value: 'Simple value\nOther lines...' },
  {
    label: 'The label',
    placeholder: 'No value yet...',
    multi: true,
    required: true,
    value: '',
  },
];

export const customLabelStyle = makeStory(conf, {
  // language=CSS
  css: `
    cc-input-text {
      --cc-input-label-color: #475569;
      --cc-input-label-font-size: 1.2em;
      --cc-input-label-font-weight: bold;
      --cc-form-label-gap: 0.5em;
      font-size: 1.25em;
    }
    cc-input-text[inline] {
      --cc-form-label-gap: 0.75em;
    }
    cc-input-text:nth-of-type(${customBaseItems.length + 'n'}) {
      margin-block-end: 2em;
    }
    cc-input-text[multi] {
      /* Necessary because the container is a display:flex */
      width: 100%;
    }
  `,
  items: [
    ...customBaseItems,
    ...customBaseItems.map((item) => ({
      ...item,
      innerHTML: `<p slot="help">Must be at least 7 characters long</p>`,
    })),
    ...customBaseItems.map((item) => ({
      ...item,
    })),
    ...customBaseItems.map((item) => ({
      ...item,
      innerHTML: `<p slot="help">Must be at least 7 characters long</p>`,
    })),
    ...customBaseItems.map((item) => ({
      ...item,
      inline: true,
    })),
    ...customBaseItems.map((item) => ({
      ...item,
      inline: true,
      innerHTML: `<p slot="help">Must be at least 7 characters long</p>`,
    })),
    ...customBaseItems.map((item) => ({
      ...item,
      inline: true,
    })),
    ...customBaseItems.map((item) => ({
      ...item,
      inline: true,
      innerHTML: `<p slot="help">Must be at least 7 characters long</p>`,
    })),
  ],

  onUpdateComplete: () => {
    /** @type {HTMLElement} */
    const container = document.querySelector('.story-shadow-container');
    /** @type {NodeListOf<CcInputText>} */
    const allComponents = container.shadowRoot.querySelectorAll('cc-input-text');
    allComponents.forEach((component) => {
      component.reportInlineValidity();
    });
  },
});

export const allFormControls = allFormControlsStory;

export const simulation = makeStory(conf, {
  items: [{ label: 'The Label', required: true }],
  simulations: [
    storyWait(
      0,
      /**
       * @param {Array<CcInputText>} args
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
       * @param {Array<CcInputText>} args
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
       * @param {Array<CcInputText>} args
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
       * @param {Array<CcInputText>} args
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
