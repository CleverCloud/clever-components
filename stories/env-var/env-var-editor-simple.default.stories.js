import '../../components/env-var/env-var-editor-simple.js';
import notes from '../../.components-docs/env-var-editor-simple.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('env-var-editor-simple:change');

export default {
  title: '2. Environment variables|<env-var-editor-simple>/📝️ Default',
  parameters: { notes },
};

export const skeleton = withActions(() => {
  const envVarForm = document.createElement('env-var-editor-simple');
  return envVarForm;
});

export const empty = withActions(() => {
  const envVarForm = document.createElement('env-var-editor-simple');
  envVarForm.variables = [];
  return envVarForm;
});

export const dataLoaded = withActions(() => {
  const envVarForm = document.createElement('env-var-editor-simple');
  envVarForm.variables = [
    { name: 'EMPTY', value: '' },
    { name: 'PRISTINE', value: 'pristine value' },
    { name: 'NEW', value: 'new value', isNew: true },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'EDITED', value: 'edited value', isEdited: true },
    { name: 'DELETED', value: 'deleted value', isDeleted: true },
  ];
  return envVarForm;
});

export const dataLoadedWithDisabled = withActions(() => {
  const envVarForm = document.createElement('env-var-editor-simple');
  envVarForm.setAttribute('disabled', true);
  envVarForm.variables = [
    { name: 'EMPTY', value: '' },
    { name: 'PRISTINE', value: 'pristine value' },
    { name: 'NEW', value: 'new value', isNew: true },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'EDITED', value: 'edited value', isEdited: true },
    { name: 'DELETED', value: 'deleted value', isDeleted: true },
  ];
  return envVarForm;
});

enhanceStoriesNames({ skeleton, empty, dataLoaded, dataLoadedWithDisabled });
