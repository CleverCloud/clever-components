import '../../src/atoms/cc-toggle.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const boldSvg = new URL('../assets/bold.svg', import.meta.url);
const centerSvg = new URL('../assets/center.svg', import.meta.url);
const italicSvg = new URL('../assets/italic.svg', import.meta.url);
const justifySvg = new URL('../assets/justify.svg', import.meta.url);
const leftSvg = new URL('../assets/left.svg', import.meta.url);
const rightSvg = new URL('../assets/right.svg', import.meta.url);
const underlineSvg = new URL('../assets/underline.svg', import.meta.url);

export default {
  title: '🧬 Atoms/<cc-toggle>',
  component: 'cc-toggle',
};

const conf = {
  component: 'cc-toggle',
  css: `
    :host {
      display: grid;
      gap: 1rem 0.5rem;
      grid-template-columns: repeat(4, min-content);
    }
  `,
};

const IMAGES = {
  JOHN: 'https://twemoji.maxcdn.com/v/12.1.6/72x72/1f453.png',
  PAUL: 'https://twemoji.maxcdn.com/v/12.1.6/72x72/1f3b9.png',
  GEORGE: 'https://twemoji.maxcdn.com/v/12.1.6/72x72/1f3b8.png',
  RINGO: 'https://twemoji.maxcdn.com/v/12.1.6/72x72/1f941.png',
  LEFT: leftSvg,
  CENTER: centerSvg,
  RIGHT: rightSvg,
  JUSTIFY: justifySvg,
  BOLD: boldSvg,
  ITALIC: italicSvg,
  UNDERLINE: underlineSvg,
};

const falseTrue = {
  value: 'TRUE',
  choices: [
    { label: 'false', value: 'FALSE' },
    { label: 'true', value: 'TRUE' },
  ],
};

const beatles = {
  value: 'PAUL',
  choices: [
    { label: 'John', value: 'JOHN' },
    { label: 'Paul', value: 'PAUL' },
    { label: 'George', value: 'GEORGE' },
    { label: 'Ringo', value: 'RINGO' },
  ],
};

const beatlesChoicesImage = beatles.choices.map((c) => {
  return { ...c, image: IMAGES[c.value] };
});

const alignment = {
  choices: [
    { label: 'Left', value: 'LEFT' },
    { label: 'Center', value: 'CENTER' },
    { label: 'Right', value: 'RIGHT' },
    { label: 'Justify', value: 'JUSTIFY' },
  ],
  value: 'CENTER',
};

const alignmentImage = {
  ...alignment,
  choices: alignment.choices.map((c) => {
    return { ...c, image: IMAGES[c.value] };
  }),
};

const textStyle = {
  choices: [
    { label: 'Bold', value: 'BOLD' },
    { label: 'Italic', value: 'ITALIC' },
    { label: 'Underline', value: 'UNDERLINE' },
  ],
  multipleValues: ['BOLD', 'UNDERLINE'],
};

const textStyleImage = {
  ...textStyle,
  choices: textStyle.choices.map((c) => {
    return { ...c, image: IMAGES[c.value] };
  }),
};

const baseItems = [
  falseTrue,
  beatles,
  { ...beatles, choices: beatlesChoicesImage },
  { ...beatles, choices: beatlesChoicesImage, hideText: true },
];

const normalAndSubtleItems = [
  ...baseItems,
  ...baseItems.map((p) => ({ ...p, subtle: true })),
];

export const defaultStory = makeStory(conf, {
  items: normalAndSubtleItems,
});

export const disabled = makeStory(conf, {
  items: normalAndSubtleItems.map((p) => ({ ...p, disabled: true })),
});

export const legend = makeStory(conf, {
  items: normalAndSubtleItems.map((p) => ({ ...p, legend: 'The legend' })),
});

export const multiple = makeStory(conf, {
  css: conf.css + `
    :host {
      grid-template-columns: repeat(3, min-content);
    }
  `,
  items: [
    { ...beatles, multipleValues: [] },
    { ...beatles, multipleValues: ['PAUL', 'RINGO'] },
    { ...beatles, multipleValues: ['JOHN', 'PAUL', 'GEORGE', 'RINGO'] },
    { ...beatles, multipleValues: [], subtle: true },
    { ...beatles, multipleValues: ['PAUL', 'RINGO'], subtle: true },
    { ...beatles, multipleValues: ['JOHN', 'PAUL', 'GEORGE', 'RINGO'], subtle: true },
  ],
});

export const color = makeStory(conf, {
  docs: `
You can have a bit of control over the main color used by the component with \`--cc-toggle-color\`:

* You can set the color with  \`cc-toggle { --cc-toggle-color: blue }\`
* You can have a different color when a specific value is selected  \`cc-toggle[value="TRUE"] { --cc-toggle-color: green }\`
`,
  css: conf.css + `
    cc-toggle {
      --cc-toggle-color: hsl(213, 55%, 62%);
    }
    cc-toggle[value="TRUE"] {
      --cc-toggle-color: hsl(144, 56%, 43%);
    }
  `,
  items: normalAndSubtleItems,
});

export const textTransform = makeStory(conf, {
  docs: `
You can have a bit of control over the text transformation of the labels used by the component with \`--cc-text-transform\`.:
`,
  css: conf.css + `
    cc-toggle {
      --cc-text-transform: none;
    }
  `,
  items: normalAndSubtleItems,
});

export const hideText = makeStory(conf, {
  docs: `
If you need toggle options with just an image, add the \`hide-text\` attribute and define \`choices\` like this:

* use the \`choices[].label\` property for the text, it will not be displayed but will be used for accessibility purposes
* use the \`choices[].image\` property to set the URL of the image

The \`hide-text\` attribute will hide the text but it will use \`choices[].label\` to set:

* a \`title\` attribute on the inner \`<label>\`
* an \`arial-label\` attribute on the inner \`<input>\`

As you can see here, \`hide-text\` can only be used if \`choices[].image\` is defined:
  `,
  items: [
    { ...beatles, choices: beatlesChoicesImage, hideText: true },
    { ...beatles, hideText: true },
  ],
});

// The images for this story are monochrome and use the exact same color defined below.
// Using CSS filters, we're able to transform this color into gray, or white.
export const toolbar = makeStory(conf, {
  docs: `
As explained in the "when to use section above", this component fits well in toolbars for single or multiple choice toggles.

Here you can see a series of toolbar examples using CSS custom propreties of the component:

* \`--cc-toggle-color\` to change the main color
* \`--cc-toggle-img-filter\` so we can tweak the color of the image from default \`#6999d3\` to gray or white.
* \`--cc-toggle-img-filter-selected\` so we can tweak the color of the image from default \`#6999d3\` to gray or white. 
  `,
  css: conf.css + `
    :host {
      grid-template-columns: repeat(2, min-content);
      justify-items: start;
    }
    cc-toggle {
      --cc-toggle-color: #6999d3;
    }
    cc-toggle:not(.subtle) {
      --cc-toggle-img-filter: grayscale(100%) brightness(0.7);
      --cc-toggle-img-filter-selected: brightness(2);
    }
    cc-toggle.subtle {
      --cc-toggle-img-filter: grayscale(100%) brightness(0.7);
    }
  `,
  items: [
    { ...alignment, legend: 'Alignement (txt)' },
    { ...alignment, legend: 'Alignement (txt) subtle', subtle: true, class: 'subtle' },
    { ...alignmentImage, legend: 'Alignement (img+txt)' },
    { ...alignmentImage, legend: 'Alignement (img+txt) subtle', subtle: true, class: 'subtle' },
    { ...alignmentImage, legend: 'Alignement (img)', hideText: true },
    { ...alignmentImage, legend: 'Alignement (img) subtle', hideText: true, subtle: true, class: 'subtle' },
    { ...textStyle, legend: 'Text style (txt)' },
    { ...textStyle, legend: 'Text style (txt) subtle', subtle: true, class: 'subtle' },
    { ...textStyleImage, legend: 'Text style (img+txt)' },
    { ...textStyleImage, legend: 'Text style (img+txt) subtle', subtle: true, class: 'subtle' },
    { ...textStyleImage, legend: 'Text style (img)', hideText: true },
    { ...textStyleImage, legend: 'Text style (img) subtle', hideText: true, subtle: true, class: 'subtle' },
  ],
});

enhanceStoriesNames({
  defaultStory,
  disabled,
  legend,
  multiple,
  color,
  textTransform,
  hideText,
  toolbar,
});
