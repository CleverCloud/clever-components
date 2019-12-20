import '../../components/env-var/env-var-input.js';
import notes from '../../.components-docs/env-var-input.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory } from '../lib/make-story.js';

export default {
  title: '🛠 Environment variables|<env-var-input>',
  component: 'env-var-input',
  parameters: { notes },
};

const conf = {
  component: 'env-var-input',
  events: ['env-var-input:input', 'env-var-input:delete', 'env-var-input:keep'],
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
  items: [{ name: 'NEW', value: 'new value' }],
});

export const newAndEdited = makeStory(conf, {
  items: [{ name: 'NEW_EDITED', value: 'new value edited' }],
});

export const edited = makeStory(conf, {
  items: [{ name: 'EDITED', value: 'edited value' }],
});

export const deleted = makeStory(conf, {
  items: [{ name: 'DELETED', value: 'deleted value' }],
});

export const editedAndDeleted = makeStory(conf, {
  items: [{ name: 'EDITED_DELETED', value: 'edited deleted value' }],
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
  items: [{ name: 'DISABLED', value: 'disabled value' }],
});

export const readonly = makeStory(conf, {
  items: [{ name: 'READONLY', value: 'readonly value' }],
});

enhanceStoriesNames({
  defaultStory,
  empty,
  pristine,
  multiline,
  newValue,
  newAndEdited,
  edited,
  deleted,
  editedAndDeleted,
  longName,
  longValue,
  skeleton,
  disabled,
  readonly,
});
