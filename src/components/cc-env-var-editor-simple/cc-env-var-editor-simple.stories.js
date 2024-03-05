import './cc-env-var-editor-simple.js';
import { makeStory } from '../../stories/lib/make-story.js';

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
  tags: ['autodocs'],
  title: '🛠 Environment variables/<cc-env-var-editor-simple>',
  component: 'cc-env-var-editor-simple',
};

const conf = {
  component: 'cc-env-var-editor-simple',
};

export const defaultStory = makeStory(conf, {
  items: [{ state: { type: 'loaded', variables: VARIABLES_FULL, validationMode: 'simple' } }],
});

export const loading = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
});

export const loadingWithReadonly = makeStory(conf, {
  items: [{ state: { type: 'loading' }, readonly: true }],
});

export const empty = makeStory(conf, {
  items: [{ state: { type: 'loaded', variables: [], validationMode: 'simple' } }],
});

export const emptyWithReadonly = makeStory(conf, {
  items: [{ state: { type: 'loaded', variables: [], validationMode: 'simple' }, readonly: true }],
});

export const dataLoaded = makeStory(conf, {
  items: [{ state: { type: 'loaded', variables: VARIABLES_FULL, validationMode: 'simple' } }],
});

export const dataLoadedWithDisabled = makeStory(conf, {
  items: [{ state: { type: 'loaded', variables: VARIABLES_FULL, validationMode: 'simple' }, disabled: true }],
});

export const dataLoadedWithReadonly = makeStory(conf, {
  items: [{ state: { type: 'loaded', variables: VARIABLES_SIMPLE, validationMode: 'simple' }, readonly: true }],
});

export const dataLoadedWithStrictValidationMode = makeStory(conf, {
  items: [{ state: { type: 'loaded', variables: VARIABLES_FULL, validationMode: 'strict' } }],
});
