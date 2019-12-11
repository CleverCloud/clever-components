import '../../components/env-var/env-var-form.js';
import notes from '../../.components-docs/env-var-form.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('env-var-form:submit', 'env-var-form:dismissed-error', 'env-var-form:restart-app');

export default {
  title: '2. Environment variables|<env-var-form>/👀 Readonly',
  parameters: { notes },
};

export const skeleton = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.setAttribute('readonly', 'true');
  return envVarForm;
});

export const empty = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.setAttribute('readonly', 'true');
  envVarForm.variables = Promise.resolve([]);
  return envVarForm;
});

export const dataLoaded = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.setAttribute('readonly', 'true');
  envVarForm.variables = Promise.resolve([
    { name: 'VARIABLE_ONE', value: 'Value one' },
    { name: 'VARIABLE_TWO_TWO', value: 'Value two two' },
    { name: 'VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
  ]);
  return envVarForm;
});

export const dataLoadedWithHeadingAndDescription = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.setAttribute('readonly', 'true');
  envVarForm.setAttribute('heading', 'Addon: foobar');
  envVarForm.variables = Promise.resolve([
    { name: 'VARIABLE_ONE', value: 'Value one' },
    { name: 'VARIABLE_TWO_TWO', value: 'Value two two' },
    { name: 'VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
  ]);
  return envVarForm;
});

enhanceStoriesNames({ skeleton, empty, dataLoaded, dataLoadedWithHeadingAndDescription });
