import '../../components/env-var/env-var-editor-simple.js';
import notes from '../../.components-docs/env-var-editor-simple.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action';

const withActions = withCustomEventActions('env-var-editor-simple:change');

storiesOf('env-var/<env-var-editor-simple>/default', module)
  .add('no data yet (skeleton)', withActions(() => {
    const envVarForm = document.createElement('env-var-editor-simple');
    return envVarForm;
  }), { notes })
  .add('empty data', withActions(() => {
    const envVarForm = document.createElement('env-var-editor-simple');
    envVarForm.variables = [];
    return envVarForm;
  }), { notes })
  .add('with data', withActions(() => {
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
  }), { notes })
  .add('with data (disabled)', withActions(() => {
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
  }), { notes });

storiesOf('env-var/<env-var-editor-simple>/readonly', module)
  .add('no data yet (skeleton)', withActions(() => {
    const envVarForm = document.createElement('env-var-editor-simple');
    envVarForm.setAttribute('readonly', 'true');
    return envVarForm;
  }), { notes })
  .add('empty data', withActions(() => {
    const envVarForm = document.createElement('env-var-editor-simple');
    envVarForm.setAttribute('readonly', 'true');
    envVarForm.variables = [];
    return envVarForm;
  }), { notes })
  .add('with data', withActions(() => {
    const envVarForm = document.createElement('env-var-editor-simple');
    envVarForm.setAttribute('readonly', 'true');
    envVarForm.variables = [
      { name: 'VARIABLE_ONE', value: 'Value one' },
      { name: 'VARIABLE_TWO_TWO', value: 'Value two two' },
      { name: 'VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
    ];
    return envVarForm;
  }), { notes });
