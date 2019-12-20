import '../../components/env-var/env-var-editor-simple.js';
import notes from '../../.components-docs/env-var-editor-simple.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory } from '../lib/make-story.js';

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
  title: '2. Environment variables|<env-var-editor-simple>',
  component: 'env-var-editor-simple',
  parameters: { notes },
};

const conf = {
  component: 'env-var-editor-simple',
  events: ['env-var-editor-simple:change'],
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

enhanceStoriesNames({
  defaultStory,
  skeleton,
  skeletonWithReadonly,
  empty,
  emptyWithReadonly,
  dataLoaded,
  dataLoadedWithDisabled,
  dataLoadedWithReadonly,
});
