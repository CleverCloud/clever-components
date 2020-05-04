import '../../src/atoms/cc-toggle.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-toggle>',
  component: 'cc-toggle',
};

const conf = {
  component: 'cc-toggle',
  css: `
    cc-toggle {
      margin: 0.5rem;
    }
  `,
};

const choices = [
  { label: 'John', image: 'https://twemoji.maxcdn.com/v/12.1.6/72x72/1f453.png', value: 'JOHN' },
  { label: 'Paul', image: 'https://twemoji.maxcdn.com/v/12.1.6/72x72/1f3b9.png', value: 'PAUL' },
  { label: 'George', image: 'https://twemoji.maxcdn.com/v/12.1.6/72x72/1f3b8.png', value: 'GEORGE' },
  { label: 'Ringo', image: 'https://twemoji.maxcdn.com/v/12.1.6/72x72/1f941.png', value: 'RINGO' },
];

const choicesWithoutImages = choices.map(({ label, value }) => ({ label, value }));

export const defaultStory = makeStory(conf, {
  items: [{
    value: 'PAUL',
    choices: choicesWithoutImages,
  }],
});

export const trueFalse = makeStory(conf, {
  items: [{
    value: 'true',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
  }],
});

export const disabled = makeStory(conf, {
  items: [{
    value: 'true',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    disabled: true,
  }],
});

export const image = makeStory(conf, {
  docs: `If you need toggle options with image + text, define \`choices\` with a \`label\` and an \`image\`.`,
  items: [{
    value: 'PAUL',
    choices,
  }],
});

export const hideText = makeStory(conf, {
  docs: `
If you need toggle options with just image and no text, define \`choices\` with an \`image\` but you still need to define a \`label\`.

Then you can add the \`hide-text\` attribute to hide the text. The \`label\` you set will be used to:
 
* set the \`title\` attribute on the inner \`<label>\`
* set the \`aria-label\` attribute on the inner \`<input>\`

As you can see here, \`hide-text\` can only be used if there is an \`image\`:
  `,
  items: [
    {
      value: 'PAUL',
      choices,
      hideText: true,
    },
    {
      value: 'PAUL',
      choices: choicesWithoutImages,
      hideText: true,
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
  trueFalse,
  disabled,
  image,
  hideText,
});
