import './cc-env-var-form.js';
// Load smart definition, so we can use it in the Markdown docs
import './cc-env-var-form.smart-config-provider.js';
import './cc-env-var-form.smart-env-var-addon.js';
import './cc-env-var-form.smart-exposed-config.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

const VARIABLES_FULL = [
  { name: 'EMPTY', value: '' },
  { name: 'ONE', value: 'value ONE' },
  { name: 'MULTI', value: 'line one\nline two\nline three' },
  { name: 'TWO', value: 'value TWO' },
];

export default {
  title: '🛠 Environment variables/<cc-env-var-form>',
  component: 'cc-env-var-form',
};

const conf = {
  component: 'cc-env-var-form',
};

export const defaultStory = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL } }],
});

export const loading = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', state: { type: 'loading' } }],
});

export const loadingWithReadonly = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', readonly: true, state: { type: 'loading' } }],
});

export const empty = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', state: { type: 'loaded', validationMode: 'simple', variables: [] } }],
});

export const emptyWithReadonly = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', readonly: true, state: { type: 'loaded', validationMode: 'simple', variables: [] } }],
});

export const dataLoadedWithNoContext = makeStory(conf, {
  items: [{ state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL } }],
});

export const dataLoadedWithContextEnvVarSimple = makeStory(conf, {
  items: [{ context: 'env-var-simple', state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL } }],
});

export const dataLoadedWithContextEnvVarAddon = makeStory(conf, {
  items: [{ context: 'env-var-addon', state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL } }],
});

export const dataLoadedWithContextEnvVar = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL } }],
});

export const dataLoadedWithContextExposedConfig = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'exposed-config', state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL } }],
});

export const dataLoadedWithContextConfigProvider = makeStory(conf, {
  items: [{ addonName: 'My shared config', context: 'config-provider', state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL } }],
});

export const dataLoadedWithRestartButton = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL }, restartApp: true }],
});

export const dataLoadedWithCustomHeadingAndReadonly = makeStory(conf, {
  items: [{ heading: 'Add-on: Awesome PG database', state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL }, readonly: true }],
});

export const dataLoadedWithCustomHeadingAndDescription = makeStory(conf, {
  items: [{
    state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    heading: 'Custom heading title',
    innerHTML: `
      Custom <strong>HTML</strong> description!!
    `,
  }],
});

export const dataLoadedWithStrictMode = makeStory(conf, {
  items: [{ appName: 'Foobar backend python (strict validation mode)', context: 'env-var', state: { type: 'loaded', validationMode: 'strict', variables: VARIABLES_FULL } }],
});

export const saving = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', state: { type: 'saving', validationMode: 'simple', variables: VARIABLES_FULL } }],
});

export const errorWithLoading = makeStory(conf, {
  items: [{ appName: 'Foobar backend python', context: 'env-var', state: { type: 'error' } }],
});

export const simulations = makeStory(conf, {
  items: [{ context: 'env-var' }, { context: 'env-var' }],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.appName = 'Foobar backend python';
      componentError.appName = 'Foobar backend python';
    }),
    storyWait(2000, ([component, componentError]) => {
      component.state = { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL };
      componentError.state = { type: 'error' };
    }),
  ],
});
