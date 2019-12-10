import '../../components/env-var/env-var-editor-simple.js';
import notes from '../../.components-docs/env-var-editor-simple.md';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('env-var-editor-simple:change');

export default {
  title: '2. Environment variables|<env-var-editor-simple>/👀 Readonly',
  parameters: { notes },
};

export const skeleton = withActions(() => {
  const envVarForm = document.createElement('env-var-editor-simple');
  envVarForm.setAttribute('readonly', 'true');
  return envVarForm;
});

export const empty = withActions(() => {
  const envVarForm = document.createElement('env-var-editor-simple');
  envVarForm.setAttribute('readonly', 'true');
  envVarForm.variables = [];
  return envVarForm;
});

export const dataLoaded = withActions(() => {
  const envVarForm = document.createElement('env-var-editor-simple');
  envVarForm.setAttribute('readonly', 'true');
  envVarForm.variables = [
    { name: 'VARIABLE_ONE', value: 'Value one' },
    { name: 'VARIABLE_TWO_TWO', value: 'Value two two' },
    { name: 'VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
  ];
  return envVarForm;
});
