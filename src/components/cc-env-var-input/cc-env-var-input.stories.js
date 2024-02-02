import './cc-env-var-input.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🛠 Environment variables/<cc-env-var-input>',
  component: 'cc-env-var-input',
};

const conf = {
  component: 'cc-env-var-input',
};

export const defaultStory = makeStory(conf, {
  items: [{ name: 'VAR_NAME', value: 'Awesome value' }],
});

export const empty = makeStory(conf, {
  items: [{ name: 'EMPTY', value: '' }],
});

export const pristine = makeStory(conf, {
  items: [{ name: 'PRISTINE', value: 'pristine value' }],
});

export const multiline = makeStory(conf, {
  items: [{ name: 'MULTILINE', value: 'line one\nline two\nline three' }],
});

export const newValue = makeStory(conf, {
  items: [{ name: 'NEW', value: 'new value', new: true }],
});

export const newAndEdited = makeStory(conf, {
  items: [{ name: 'NEW_EDITED', value: 'new value edited', new: true, edited: true }],
});

export const edited = makeStory(conf, {
  items: [{ name: 'EDITED', value: 'edited value', edited: true }],
});

export const deleted = makeStory(conf, {
  items: [{ name: 'DELETED', value: 'deleted value', deleted: true }],
});

export const editedAndDeleted = makeStory(conf, {
  items: [{ name: 'EDITED_DELETED', value: 'edited deleted value', edited: true, deleted: true }],
});

export const longName = makeStory(conf, {
  items: [{
    name: 'VERY_LONG_NAME_THAT_IS_ACTUALLY_TOO_LONG_TOO_DISPLAY_OMG_WHAT_IS_HAPPENING',
    value: 'value for long name',
  }],
});

export const longValue = makeStory(conf, {
  items: [{ name: 'LONG_VALUE', value: 'very long value that is actually too long too display omg what is happening' }],
});

export const skeleton = makeStory(conf, {
  items: [{ name: 'LOADING_VARIABLE', skeleton: true }],
});

export const disabled = makeStory(conf, {
  items: [{ name: 'DISABLED', value: 'disabled value', disabled: true }],
});

export const readonly = makeStory(conf, {
  items: [{ name: 'READONLY', value: 'readonly value', readonly: true }],
});
