import '../../components/env-var/env-var-form.js';
import notes from '../../.components-docs/env-var-form.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory } from '../lib/make-story.js';

const VARIABLES_FULL = [
  { name: 'EMPTY', value: '' },
  { name: 'ONE', value: 'value ONE' },
  { name: 'MULTI', value: 'line one\nline two\nline three' },
  { name: 'TWO', value: 'value TWO' },
];

export default {
  title: '🛠 Environment variables|<env-var-form>',
  component: 'env-var-form',
  parameters: { notes },
};

const conf = {
  component: 'env-var-form',
  events: ['env-var-form:submit', 'env-var-form:dismissed-error', 'env-var-form:restart-app'],
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

export const dataLoadedWithReadonly = makeStory(conf, {
  items: [{ variables: VARIABLES_FULL, readonly: true }],
});

export const dataLoadedWithRestartButton = makeStory(conf, {
  items: [{ variables: VARIABLES_FULL, restartApp: true }],
});

export const dataLoadedWithHeadingAndDescription = makeStory(conf, {
  items: [{
    variables: VARIABLES_FULL,
    heading: 'Environment variables',
    innerHTML: `
      Environment variables allow you to inject data in your application’s environment.
      <a href="http://doc.clever-cloud.com/admin-console/environment-variables/" target="_blank">Learn more</a>
    `,
  }],
});

export const dataLoadedWithHeadingAndReadonly = makeStory(conf, {
  items: [{
    variables: VARIABLES_FULL,
    heading: 'Add-on: foobar',
    readonly: true,
  }],
});

export const saving = makeStory(conf, {
  items: [{ variables: VARIABLES_FULL, saving: true }],
});

export const errorWithLoading = makeStory(conf, {
  items: [{ error: 'loading' }],
});

export const errorWithSaving = makeStory(conf, {
  items: [{ variables: VARIABLES_FULL, error: 'saving' }],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  skeletonWithReadonly,
  empty,
  emptyWithReadonly,
  dataLoaded,
  dataLoadedWithReadonly,
  dataLoadedWithRestartButton,
  dataLoadedWithHeadingAndDescription,
  dataLoadedWithHeadingAndReadonly,
  saving,
  errorWithLoading,
  errorWithSaving,
});
