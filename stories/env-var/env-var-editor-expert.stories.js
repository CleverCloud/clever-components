import '../../components/env-var/env-var-editor-expert.js';
import notes from '../../.components-docs/env-var-editor-expert.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('env-var-editor-expert:change');

storiesOf('2. Environment variables|<env-var-editor-expert>/default', module)
  .addParameters({ notes })
  .add('no data yet (skeleton)', withActions(() => {
    const envVarFormExpert = document.createElement('env-var-editor-expert');
    envVarFormExpert.setAttribute('skeleton', 'true');
    return envVarFormExpert;
  }))
  .add('empty data', withActions(() => {
    const envVarFormExpert = document.createElement('env-var-editor-expert');
    envVarFormExpert.variables = [];
    return envVarFormExpert;
  }))
  .add('with data', withActions(() => {
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
  }))
  .add('with data (disabled)', withActions(() => {
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
  }));

storiesOf('2. Environment variables|<env-var-editor-expert>/readonly', module)
  .addParameters({ notes })
  .add('with data (skeleton)', withActions(() => {
    const envVarFormExpert = document.createElement('env-var-editor-expert');
    envVarFormExpert.setAttribute('readonly', true);
    return envVarFormExpert;
  }))
  .add('empty data', withActions(() => {
    const envVarFormExpert = document.createElement('env-var-editor-expert');
    envVarFormExpert.setAttribute('readonly', true);
    envVarFormExpert.variables = [];
    return envVarFormExpert;
  }))
  .add('with data', withActions(() => {
    const envVarFormExpert = document.createElement('env-var-editor-expert');
    envVarFormExpert.setAttribute('readonly', true);
    envVarFormExpert.variables = [
      { name: 'EMPTY', value: '' },
      { name: 'PRISTINE', value: 'pristine value' },
      { name: 'NEW', value: 'new value', isNew: true },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'EDITED', value: 'edited value', isEdited: true },
      { name: 'DELETED', value: 'deleted value', isDeleted: true },
    ];
    return envVarFormExpert;
  }));
