import './cc-env-var-form.js';
// Load smart definition, so we can use it in the Markdown docs
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-env-var-form.smart-config-provider.js';
import './cc-env-var-form.smart-env-var-addon.js';
import './cc-env-var-form.smart-exposed-config.js';

const VARIABLES_FULL = [
  { name: 'EMPTY', value: '' },
  { name: 'ONE', value: 'value ONE' },
  { name: 'MULTI', value: 'line one\nline two\nline three' },
  { name: 'TWO', value: 'value TWO' },
];

export default {
  tags: ['autodocs'],
  title: '🛠 Environment variables/<cc-env-var-form>',
  component: 'cc-env-var-form',
};

const conf = {
  component: 'cc-env-var-form',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'env-var-app',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'env-var-app',
      state: { type: 'loading' },
    },
  ],
});

export const loadingWithReadonly = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'env-var-app',
      readonly: true,
      state: { type: 'loading' },
    },
  ],
});

export const empty = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'env-var-app',
      state: { type: 'loaded', validationMode: 'simple', variables: [] },
    },
  ],
});

export const emptyWithReadonly = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'env-var-app',
      readonly: true,
      state: { type: 'loaded', validationMode: 'simple', variables: [] },
    },
  ],
});

export const dataLoadedWithNoContext = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
});

export const dataLoadedWithContextEnvVarSimple = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      context: 'env-var-simple',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
});

export const dataLoadedWithContextEnvVarAddon = makeStory(conf, {
  items: [
    {
      resourceId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      context: 'env-var-addon',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
});

export const dataLoadedWithContextEnvVarApp = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'env-var-app',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
});

export const dataLoadedWithContextExposedConfig = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'exposed-config',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
});

export const dataLoadedWithContextConfigProvider = makeStory(conf, {
  items: [
    {
      resourceId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      addonName: 'My shared config',
      context: 'config-provider',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
});

export const dataLoadedWithContextLinkedAddon = makeStory(conf, {
  items: [
    {
      resourceId: 'addon_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      context: 'linked-addon',
      readonly: true,
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
});

export const dataLoadedWithContextLinkedApp = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      context: 'linked-app',
      readonly: true,
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
});

export const dataLoadedWithRestartButton = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'env-var-app',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
      restartApp: true,
    },
  ],
});

export const dataLoadedWithCustomHeadingAndReadonly = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      heading: 'Add-on: Awesome PG database',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
      readonly: true,
    },
  ],
});

export const dataLoadedWithCustomHeadingAndDescription = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
      heading: 'Custom heading title',
      innerHTML: `
      Custom <strong>HTML</strong> description!!
    `,
    },
  ],
});

export const dataLoadedWithStrictMode = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python (strict validation mode)',
      context: 'env-var-app',
      state: { type: 'loaded', validationMode: 'strict', variables: VARIABLES_FULL },
    },
  ],
});

export const saving = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'env-var-app',
      state: { type: 'loaded', validationMode: 'simple', variables: VARIABLES_FULL },
    },
  ],
  // The component needs to be loaded with data for it to display this data in saving mode afterward.
  onUpdateComplete: (component) => {
    component.state = { type: 'saving', validationMode: 'simple', variables: VARIABLES_FULL };
  },
});

export const errorWithLoading = makeStory(conf, {
  items: [
    {
      resourceId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      appName: 'Foobar backend python',
      context: 'env-var-app',
      state: { type: 'error' },
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{ context: 'env-var-app' }, { context: 'env-var-app' }],
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
