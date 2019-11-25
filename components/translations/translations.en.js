import { prepareFormatDate, prepareFormatDistanceToNow } from '../lib/i18n-date.js';

export const lang = 'en';

const formatDistanceToNow = prepareFormatDistanceToNow(lang, (value, unit) => {
  const plural = (value === 1) ? '' : 's';
  return `${value} ${unit}${plural} ago`;
}, 'just now');

const formatDate = prepareFormatDate(lang);

const currencyFormatter = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' });

export const translations = {
  LANGUAGE: '🇬🇧 English',
  // cc-button
  'cc-button.cancel': `Click to cancel`,
  // cc-datetime-relative
  'cc-datetime-relative.distance': ({ date }) => formatDistanceToNow(date),
  'cc-datetime-relative.title': ({ date }) => formatDate(date),
  // cc-info-app
  'cc-info-app.action.cancel-deployment': `Cancel deployment`,
  'cc-info-app.action.restart': `Restart`,
  'cc-info-app.action.restart-last-commit': `Restart last pushed commit`,
  'cc-info-app.action.restart-rebuild': `Re-build and restart`,
  'cc-info-app.action.start': `Start`,
  'cc-info-app.action.start-last-commit': `Start last pushed commit`,
  'cc-info-app.action.start-rebuild': `Re-build and start`,
  'cc-info-app.action.stop': `Stop app`,
  'cc-info-app.disable-buttons': `You are not authorized to perform those actions`,
  'cc-info-app.read-logs': `read logs here`,
  'cc-info-app.commits.no-commits': `no commits yet`,
  'cc-info-app.commits.git': ({ commit }) => `git repo version (HEAD): ${commit}`,
  'cc-info-app.commits.running': ({ commit }) => `running version: ${commit}`,
  'cc-info-app.commits.starting': ({ commit }) => `deploying version: ${commit}`,
  'cc-info-app.state-msg.app-is-restarting': `Your application is restarting...`,
  'cc-info-app.state-msg.app-is-running': `Your application is running!`,
  'cc-info-app.state-msg.app-is-starting': `Your application is starting...`,
  'cc-info-app.state-msg.app-is-stopped': `Your application is currently stopped.`,
  'cc-info-app.state-msg.last-deploy-failed': `The last deployment failed,`,
  'cc-info-app.state-msg.unknown-state': `Unknown state, try to restart the application or contact our support if you have additional questions.`,
  'cc-info-app.user-action-msg.app-will-start': `Your application is about to start...`,
  'cc-info-app.user-action-msg.deploy-will-begin': `A new deployment is about to begin...`,
  'cc-info-app.user-action-msg.deploy-cancelled': `This deployment has been cancelled.`,
  'cc-info-app.user-action-msg.app-will-stop': `Your application is about to stop...`,
  'cc-info-app.error': `Something went wrong while loading app info.`,
  // cc-info-consumption
  'cc-info-consumption.title': `Credits consumption`,
  'cc-info-consumption.yesterday': `Yesterday`,
  'cc-info-consumption.last-30-days': `Last 30 days`,
  'cc-info-consumption.amount': ({ amount }) => currencyFormatter.format(amount),
  'cc-info-consumption.error': `Something went wrong while loading consumption info.`,
  // cc-info-deployments
  'cc-info-deployments.title': `Last deployments`,
  'cc-info-deployments.state.failed': `Failed`,
  'cc-info-deployments.state.started': `Started`,
  'cc-info-deployments.state.cancelled': `Cancelled`,
  'cc-info-deployments.state.stopped': `Stopped`,
  'cc-info-deployments.empty': `No deployments yet.`,
  'cc-info-deployments.error': `Something went wrong while loading deployments info.`,
  // cc-info-instances
  'cc-info-instances.title': `Instances`,
  'cc-info-instances.status.deploying': `Deploying`,
  'cc-info-instances.status.running': `Running`,
  'cc-info-instances.empty': `No instances. Your app is stopped.`,
  'cc-info-instances.error': `Something went wrong while loading instances.`,
  // cc-info-orga
  'cc-info-orga.hotline': `Hotline:`,
  'cc-info-orga.error': `Something went wrong while loading organization info.`,
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
  // cc-input-text
  'cc-input-text.clipboard': `Copy to clipboard`,
  // cc-logsmap
  'cc-logsmap.mode.points': `Realtime`,
  'cc-logsmap.mode.heatmap': `Last 24h`,
  'cc-logsmap.legend.points': ({ orgaName }) => `Realtime map of HTTP requests received by all apps from ${orgaName}.`,
  'cc-logsmap.legend.points.app': ({ appName }) => `Realtime map of HTTP requests received by ${appName}.`,
  'cc-logsmap.legend.heatmap': ({ orgaName }) => `Heatmap of HTTP requests received by all apps from ${orgaName} during the last 24 hours.`,
  'cc-logsmap.legend.heatmap.app': ({ appName }) => `Heatmap of HTTP requests received by ${appName} during the last 24 hours.`,
  // cc-map
  'cc-map.error': `Something went wrong while trying to fetch data for the map.`,
  'cc-map.no-points': `No data to display on the map right now.`,
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
