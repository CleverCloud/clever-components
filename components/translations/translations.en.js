module.exports.en = {
  LANGUAGE: 'English',
  // cc-button
  'cc-button.cancel': `Click to cancel`,
  // cc-info-instances
  'cc-info-instances.title': `Instances`,
  'cc-info-instances.status.deploying': `Deploying`,
  'cc-info-instances.status.running': `Running`,
  'cc-info-instances.no-instances': `No instances. Your app is stopped.`,
  'cc-info-instances.error': `Something went wrong while loading instances.`,
  // env-var-create
  'env-var-create.name.placeholder': `VARIABLE_NAME`,
  'env-var-create.value.placeholder': `variable value`,
  'env-var-create.create-button': `Add`,
  'env-var-create.errors.invalid-name': ({ name }) => `Name ${name} is invalid`,
  'env-var-create.errors.already-defined-name': ({ name }) => `Name ${name} is already defined`,
  // env-var-editor-simple
  'env-var-editor-simple.empty-data': `There are no variables.`,
  // env-var-editor-expert
  'env-var-editor-expert.placeholder': `VARIABLE_NAME="variable value"`,
  'env-var-editor-expert.placeholder-readonly': `There are no variables.`,
  'env-var-editor-expert.errors.unknown': `Unknown Error`,
  'env-var-editor-expert.errors.line': `line`,
  'env-var-editor-expert.errors.invalid-name': ({ name }) => `${name} is not a valid variable name`,
  'env-var-editor-expert.errors.duplicated-name': ({ name }) => `be careful, the name ${name} is already defined`,
  'env-var-editor-expert.errors.invalid-line': `this line is not valid, the correct pattern is: NAME="VALUE"`,
  'env-var-editor-expert.errors.invalid-value': `the value is not valid, if you use quotes, you need to escape them like this: \\" or quote the whole value.`,
  // env-var-form
  'env-var-form.mode.simple': `Simple`,
  'env-var-form.mode.expert': `Expert`,
  'env-var-form.reset': `Reset changes`,
  'env-var-form.restart-app': `Restart the app to apply changes`,
  'env-var-form.update': `Update changes`,
  'env-var-form.error.loading': `Something went wrong while loading environment variables.`,
  'env-var-form.error.saving': `Something went wrong while updating environment variables.`,
  'env-var-form.error.unknown': `Something went wrong...`,
  // env-var-input
  'env-var-input.delete-button': `Remove`,
  'env-var-input.keep-button': `Keep`,
  'env-var-input.value-placeholder': `variable value`,
  // env-var-full
  'env-var-full.heading': `Environment variables`,
  'env-var-full.message': `Environment variables allow you to inject data in your application’s environment.`,
  'env-var-full.link': `Learn more`,
};
