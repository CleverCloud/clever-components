import '../../src/env-var/cc-env-var-form.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const VARIABLES_FULL = [
  { name: 'EMPTY', value: '' },
  { name: 'ONE', value: 'value ONE' },
  { name: 'MULTI', value: 'line one\nline two\nline three' },
  { name: 'TWO', value: 'value TWO' },
];

export default {
  title: '🛠 Environment variables|<cc-env-var-form>',
  component: 'cc-env-var-form',
};

const conf = {
  component: 'cc-env-var-form',
  events: ['cc-env-var-form:submit', 'cc-env-var-form:dismissed-error', 'cc-env-var-form:restart-app'],
};

export const defaultStory = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', variables: VARIABLES_FULL }],
});

export const skeleton = makeStory(conf, {
  items: [{ context: 'env-var', appName: 'Foobar backend python' }],
});

export const skeletonWithReadonly = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', readonly: true }],
});

export const empty = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', variables: [] }],
});

export const emptyWithReadonly = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', variables: [], readonly: true }],
});

export const dataLoadedWithNoContext = makeStory(conf, {
  items: [{ variables: VARIABLES_FULL }],
});

export const dataLoadedWithContextEnvVarSimple = makeStory(conf, {
  items: [{ context: 'env-var-simple', variables: VARIABLES_FULL }],
});

export const dataLoadedWithContextEnvVar = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', variables: VARIABLES_FULL }],
});

export const dataLoadedWithContextExposedConfig = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'exposed-config', variables: VARIABLES_FULL }],
});

export const dataLoadedWithRestartButton = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', variables: VARIABLES_FULL, restartApp: true }],
});

export const dataLoadedWithCustomHeadingAndReadonly = makeStory(conf, {
  items: [{ heading: 'Add-on: Awesome PG database', variables: VARIABLES_FULL, readonly: true }],
});

export const dataLoadedWithCustomHeadingAndDescription = makeStory(conf, {
  items: [{
    variables: VARIABLES_FULL,
    heading: 'Custom heading title',
    innerHTML: `
      Custom <strong>HTML</strong> description!!
    `,
  }],
});

export const saving = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', variables: VARIABLES_FULL, saving: true }],
});

export const errorWithLoading = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', error: 'loading' }],
});

export const errorWithLoadingAndReadonly = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', error: 'loading', readonly: true }],
});

export const errorWithSaving = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', variables: VARIABLES_FULL, error: 'saving' }],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  skeletonWithReadonly,
  empty,
  emptyWithReadonly,
  dataLoadedWithNoContext,
  dataLoadedWithContextEnvVarSimple,
  dataLoadedWithContextEnvVar,
  dataLoadedWithContextExposedConfig,
  dataLoadedWithCustomHeadingAndReadonly,
  dataLoadedWithRestartButton,
  dataLoadedWithCustomHeadingAndDescription,
  saving,
  errorWithLoading,
  errorWithLoadingAndReadonly,
  errorWithSaving,
});
