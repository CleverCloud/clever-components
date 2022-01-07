import '../../src/env-var/cc-env-var-editor-expert.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const VARIABLES_FULL = [
  { name: 'EMPTY', value: '' },
  { name: 'PRISTINE', value: 'pristine value' },
  { name: 'NEW', value: 'new value', isNew: true },
  { name: 'MULTI', value: 'line one\nline two\nline three' },
  { name: 'EDITED', value: 'edited value', isEdited: true },
  { name: 'DELETED', value: 'deleted value', isDeleted: true },
];

const VARIABLES_SIMPLE = [
  { name: 'VARIABLE_ONE', value: 'Value one' },
  { name: 'VARIABLE_TWO_TWO', value: 'Value two two' },
  { name: 'VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
];

export default {
  title: '🛠 Environment variables/<cc-env-var-editor-expert>',
  component: 'cc-env-var-editor-expert',
};

const conf = {
  component: 'cc-env-var-editor-expert',
};

export const defaultStory = makeStory(conf, {
  items: [{ variables: VARIABLES_FULL }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const skeletonWithReadonly = makeStory(conf, {
  items: [{ readonly: true }],
});

export const empty = makeStory(conf, {
  items: [{ variables: [] }],
});

export const emptyWithReadonly = makeStory(conf, {
  items: [{ variables: [], readonly: true }],
});

export const dataLoaded = makeStory(conf, {
  items: [{ variables: VARIABLES_FULL }],
});

export const dataLoadedWithDisabled = makeStory(conf, {
  items: [{ variables: VARIABLES_FULL, disabled: true }],
});

export const dataLoadedWithReadonly = makeStory(conf, {
  items: [{ variables: VARIABLES_SIMPLE, readonly: true }],
});

export const dataLoadedWithStrictMode = makeStory(conf, {
  items: [{ variables: VARIABLES_FULL, parserOptions: { mode: 'strict' } }],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  skeletonWithReadonly,
  empty,
  emptyWithReadonly,
  dataLoaded,
  dataLoadedWithDisabled,
  dataLoadedWithReadonly,
  dataLoadedWithStrictMode,
});
