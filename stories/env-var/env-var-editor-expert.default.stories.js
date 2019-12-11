import '../../components/env-var/env-var-editor-expert.js';
import notes from '../../.components-docs/env-var-editor-expert.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('env-var-editor-expert:change');

export default {
  title: '2. Environment variables|<env-var-editor-expert>/📝 Default',
  parameters: { notes },
};

export const skeleton = withActions(() => {
  const envVarFormExpert = document.createElement('env-var-editor-expert');
  envVarFormExpert.setAttribute('skeleton', 'true');
  return envVarFormExpert;
});

export const empty = withActions(() => {
  const envVarFormExpert = document.createElement('env-var-editor-expert');
  envVarFormExpert.variables = [];
  return envVarFormExpert;
});

export const dataLoaded = withActions(() => {
  const envVarFormExpert = document.createElement('env-var-editor-expert');
  envVarFormExpert.variables = [
    { name: 'EMPTY', value: '' },
    { name: 'PRISTINE', value: 'pristine value' },
    { name: 'NEW', value: 'new value', isNew: true },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'EDITED', value: 'edited value', isEdited: true },
    { name: 'DELETED', value: 'deleted value', isDeleted: true },
  ];
  return envVarFormExpert;
});

export const dataLoadedWithDisabled = withActions(() => {
  const envVarFormExpert = document.createElement('env-var-editor-expert');
  envVarFormExpert.variables = [
    { name: 'EMPTY', value: '' },
    { name: 'PRISTINE', value: 'pristine value' },
    { name: 'NEW', value: 'new value', isNew: true },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'EDITED', value: 'edited value', isEdited: true },
    { name: 'DELETED', value: 'deleted value', isDeleted: true },
  ];
  envVarFormExpert.setAttribute('disabled', true);
  return envVarFormExpert;
});

enhanceStoriesNames({ skeleton, empty, dataLoaded, dataLoadedWithDisabled });
