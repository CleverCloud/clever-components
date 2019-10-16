import { prepareFormatDate, prepareFormatDistanceToNow } from '../lib/i18n-date.js';

export const lang = 'en';

const formatDistanceToNow = prepareFormatDistanceToNow(lang, (value, unit) => {
  const plural = (value === 1) ? '' : 's';
  return `${value} ${unit}${plural} ago`;
}, 'just now');

const formatDate = prepareFormatDate(lang);

export const translations = {
  LANGUAGE: '🇬🇧 English',
  // cc-button
  'cc-button.cancel': `Click to cancel`,
  // cc-datetime-relative
  'cc-datetime-relative.distance': ({ date }) => formatDistanceToNow(date),
  'cc-datetime-relative.title': ({ date }) => formatDate(date),
  // cc-info-deployments
  'cc-info-deployments.title': `Last deployments`,
  'cc-info-deployments.state.failed': `Failed`,
  'cc-info-deployments.state.started': `Started`,
  'cc-info-deployments.state.cancelled': `Cancelled`,
  'cc-info-deployments.state.stopped': `Stopped`,
  'cc-info-deployments.error': `Something went wrong while loading deployments info.`,
  'cc-info-deployments.no-deployments': `No deployments yet.`,
  // cc-info-instances
  'cc-info-instances.title': `Instances`,
  'cc-info-instances.status.deploying': `Deploying`,
  'cc-info-instances.status.running': `Running`,
  'cc-info-instances.no-instances': `No instances. Your app is stopped.`,
  'cc-info-instances.error': `Something went wrong while loading instances.`,
  // cc-info-scalability
  'cc-info-scalability.title': `Scalability`,
  'cc-info-scalability.size': `Size`,
  'cc-info-scalability.number': `Number`,
  'cc-info-scalability.flavor-info': (f) => {
    const cpu = `CPUs: ${f.cpus}`;
    const shared = f.microservice ? ` (shared)` : '';
    const gpu = f.gpus > 0 ? `GPUs: ${f.gpus}` : '';
    const mem = `RAM: ${(f.mem < 1024) ? `${f.mem} MB` : `${f.mem / 1024} GB`}`;
    return [cpu + shared, gpu, mem].filter((a) => a).join('\n');
  },
  'cc-info-scalability.error': `Something went wrong while loading scalability config.`,
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
