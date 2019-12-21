import {
  prepareFormatDate,
  prepareFormatDateOnly,
  prepareFormatDistanceToNow,
  prepareFormatHours,
} from '../lib/i18n-date.js';
import { prepareNumberUnitFormatter } from '../lib/i18n-number.js';

export const lang = 'en';

// We considered Intl.PluralRules but no support in Safari 12 and polyfill does too much for us
function plural (singular, plural = singular + 's') {
  return (count) => {
    return (count === 1) ? singular : plural;
  };
}

const formatDistanceToNow = prepareFormatDistanceToNow(lang, (value, unit) => {
  const pluralUnit = plural(unit)(value);
  return `${value} ${pluralUnit} ago`;
}, 'just now');

const formatDate = prepareFormatDate(lang);
const formatDateOnly = prepareFormatDateOnly(lang);
const formatHours = prepareFormatHours(lang);

const currencyFormatter = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' });
const percentFormatter = new Intl.NumberFormat(lang, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const numberFormatter = new Intl.NumberFormat(lang);
const formatNumberUnit = prepareNumberUnitFormatter(lang);

export const translations = {
  LANGUAGE: '🇬🇧 English',
  // cc-beta
  'cc-beta.label': `beta`,
  // cc-button
  'cc-button.cancel': `Click to cancel`,
  // cc-datetime-relative
  'cc-datetime-relative.distance': ({ date }) => formatDistanceToNow(date),
  'cc-datetime-relative.title': ({ date }) => formatDate(date),
  // cc-header-app
  'cc-header-app.action.cancel-deployment': `Cancel deployment`,
  'cc-header-app.action.restart': `Restart`,
  'cc-header-app.action.restart-last-commit': `Restart last pushed commit`,
  'cc-header-app.action.restart-rebuild': `Re-build and restart`,
  'cc-header-app.action.start': `Start`,
  'cc-header-app.action.start-last-commit': `Start last pushed commit`,
  'cc-header-app.action.start-rebuild': `Re-build and start`,
  'cc-header-app.action.stop': `Stop app`,
  'cc-header-app.disable-buttons': `You are not authorized to perform those actions`,
  'cc-header-app.read-logs': `read logs here`,
  'cc-header-app.commits.no-commits': `no commits yet`,
  'cc-header-app.commits.git': ({ commit }) => `git repo version (HEAD): ${commit}`,
  'cc-header-app.commits.running': ({ commit }) => `running version: ${commit}`,
  'cc-header-app.commits.starting': ({ commit }) => `deploying version: ${commit}`,
  'cc-header-app.state-msg.app-is-restarting': `Your application is restarting...`,
  'cc-header-app.state-msg.app-is-running': `Your application is running!`,
  'cc-header-app.state-msg.app-is-starting': `Your application is starting...`,
  'cc-header-app.state-msg.app-is-stopped': `Your application is currently stopped.`,
  'cc-header-app.state-msg.last-deploy-failed': `The last deployment failed,`,
  'cc-header-app.state-msg.unknown-state': `Unknown state, try to restart the application or contact our support if you have additional questions.`,
  'cc-header-app.user-action-msg.app-will-start': `Your application is about to start...`,
  'cc-header-app.user-action-msg.deploy-will-begin': `A new deployment is about to begin...`,
  'cc-header-app.user-action-msg.deploy-cancelled': `This deployment has been cancelled.`,
  'cc-header-app.user-action-msg.app-will-stop': `Your application is about to stop...`,
  'cc-header-app.error': `Something went wrong while loading app info.`,
  // cc-header-orga
  'cc-header-orga.hotline': `Hotline:`,
  'cc-header-orga.error': `Something went wrong while loading organization info.`,
  // cc-tile-consumption
  'cc-tile-consumption.title': `Credits consumption`,
  'cc-tile-consumption.yesterday': `Yesterday`,
  'cc-tile-consumption.last-30-days': `Last 30 days`,
  'cc-tile-consumption.amount': ({ amount }) => currencyFormatter.format(amount),
  'cc-tile-consumption.error': `Something went wrong while loading consumption info.`,
  // cc-tile-deployments
  'cc-tile-deployments.title': `Last deployments`,
  'cc-tile-deployments.state.failed': `Failed`,
  'cc-tile-deployments.state.started': `Started`,
  'cc-tile-deployments.state.cancelled': `Cancelled`,
  'cc-tile-deployments.state.stopped': `Stopped`,
  'cc-tile-deployments.empty': `No deployments yet.`,
  'cc-tile-deployments.error': `Something went wrong while loading deployments info.`,
  // cc-tile-instances
  'cc-tile-instances.title': `Instances`,
  'cc-tile-instances.status.deploying': `Deploying`,
  'cc-tile-instances.status.running': `Running`,
  'cc-tile-instances.empty': `No instances. Your app is stopped.`,
  'cc-tile-instances.error': `Something went wrong while loading instances.`,
  // cc-tile-requests
  'cc-tile-requests.title': `HTTP requests`,
  'cc-tile-requests.about': `About this chart...`,
  'cc-tile-requests.date-hours': ({ date }) => formatHours(date),
  'cc-tile-requests.date-tooltip': ({ from, to }) => {
    const date = formatDateOnly(from);
    const fromH = formatHours(from);
    const toH = formatHours(to);
    return `${date}: from ${fromH} to ${toH}`;
  },
  'cc-tile-requests.requests-nb': ({ value, windowHours }) => {
    const request = plural('request')(value);
    const hour = plural('hour')(windowHours);
    const formattedValue = numberFormatter.format(value);
    return `${formattedValue} ${request} (in ${windowHours} ${hour})`;
  },
  'cc-tile-requests.requests-nb.total': ({ totalRequests }) => {
    const request = plural('request')(totalRequests);
    const formattedValue = formatNumberUnit(totalRequests);
    return `${formattedValue} ${request} in 24 hours`;
  },
  'cc-tile-requests.requests-count': ({ requestCount }) => formatNumberUnit(requestCount),
  'cc-tile-requests.empty': `No data to display for now.`,
  'cc-tile-requests.error': `Something went wrong while loading HTTP requests.`,
  'cc-tile-requests.docs.msg': ({ windowHours }) => {
    const hour = plural('hour')(windowHours);
    return `HTTP requests received in the last 24 hours. Each bar represents a time window of ${windowHours} ${hour}.`;
  },
  // cc-tile-scalability
  'cc-tile-scalability.title': `Scalability`,
  'cc-tile-scalability.size': `Size`,
  'cc-tile-scalability.number': `Number`,
  'cc-tile-scalability.flavor-info': (f) => {
    const cpu = `CPUs: ${f.cpus}`;
    const shared = f.microservice ? ` (shared)` : '';
    const gpu = f.gpus > 0 ? `GPUs: ${f.gpus}` : '';
    const mem = `RAM: ${(f.mem < 1024) ? `${f.mem} MB` : `${f.mem / 1024} GB`}`;
    return [cpu + shared, gpu, mem].filter((a) => a).join('\n');
  },
  'cc-tile-scalability.error': `Something went wrong while loading scalability config.`,
  // cc-tile-status-codes
  'cc-tile-status-codes.title': `HTTP response codes`,
  'cc-tile-status-codes.about': `About this chart...`,
  'cc-tile-status-codes.tooltip': ({ value, percent }) => {
    const request = plural('request')(value);
    const formattedValue = numberFormatter.format(value);
    return `${formattedValue} ${request} (${percentFormatter.format(percent)})`;
  },
  'cc-tile-status-codes.error': `Something went wrong while loading HTTP response codes.`,
  'cc-tile-status-codes.empty': `No data to display for now.`,
  'cc-tile-status-codes.docs.msg': `Repartition of HTTP response codes returned in the last 24 hours. Click on legend items to show/hide HTTP code categories.`,
  'cc-tile-status-codes.docs.link.href': `https://developer.mozilla.org/en/docs/Web/HTTP/Status`,
  'cc-tile-status-codes.docs.link.title': `HTTP response status codes (MDN)`,
  // cc-input-text
  'cc-input-text.clipboard': `Copy to clipboard`,
  'cc-input-text.secret.show': `Show secret`,
  'cc-input-text.secret.hide': `Hide secret`,
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
