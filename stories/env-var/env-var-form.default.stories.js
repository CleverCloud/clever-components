import '../../components/env-var/env-var-form.js';
import notes from '../../.components-docs/env-var-form.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('env-var-form:submit', 'env-var-form:dismissed-error', 'env-var-form:restart-app');

export default {
  title: '2. Environment variables|<env-var-form>/📝 Default',
  parameters: { notes },
};

export const skeleton = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  return envVarForm;
});

export const empty = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.variables = Promise.resolve([]);
  return envVarForm;
});

export const dataLoaded = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.variables = Promise.resolve([
    { name: 'EMPTY', value: '' },
    { name: 'ONE', value: 'value ONE' },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'TWO', value: 'value TWO' },
  ]);
  return envVarForm;
});

export const dataLoadedWithRestartButton = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.setAttribute('restart-app', 'true');
  envVarForm.variables = Promise.resolve([
    { name: 'EMPTY', value: '' },
    { name: 'ONE', value: 'value ONE' },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'TWO', value: 'value TWO' },
  ]);
  return envVarForm;
});

export const dataLoadedWithHeadingAndDescription = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.setAttribute('heading', 'Environment variables');
  envVarForm.variables = Promise.resolve([
    { name: 'EMPTY', value: '' },
    { name: 'ONE', value: 'value ONE' },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'TWO', value: 'value TWO' },
  ]);
  envVarForm.innerHTML = `
      Environment variables allow you to inject data in your application’s environment.
      <a href="http://doc.clever-cloud.com/admin-console/environment-variables/" target="_blank">Learn more</a>
    `;
  return envVarForm;
});

export const saving = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.variables = Promise.resolve([
    { name: 'EMPTY', value: '' },
    { name: 'ONE', value: 'value ONE' },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'TWO', value: 'value TWO' },
  ]);
  setTimeout(() => {
    envVarForm.variables = new Promise(() => null);
  }, 0);
  return envVarForm;
});

export const errorWithLoading = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  setTimeout(() => {
    envVarForm.variables = Promise.reject(new Error());
  }, 0);
  return envVarForm;
});

export const errorWithSaving = withActions(() => {
  const envVarForm = document.createElement('env-var-form');
  envVarForm.variables = Promise.resolve([
    { name: 'EMPTY', value: '' },
    { name: 'ONE', value: 'value ONE' },
    { name: 'MULTI', value: 'line one\nline two\nline three' },
    { name: 'TWO', value: 'value TWO' },
  ]);
  setTimeout(() => {
    envVarForm.variables = Promise.reject(new Error());
  }, 0);
  return envVarForm;
});

enhanceStoriesNames({
  skeleton,
  empty,
  dataLoaded,
  dataLoadedWithRestartButton,
  dataLoadedWithHeadingAndDescription,
  saving,
  errorWithLoading
});
