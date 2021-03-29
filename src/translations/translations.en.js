import {
  prepareFormatDate,
  prepareFormatDateOnly,
  prepareFormatDatetime,
  prepareFormatDistanceToNow,
  prepareFormatHours,
} from '../lib/i18n-date.js';
import { prepareCountryName } from '../lib/i18n-display.js';
import { prepareNumberBytesFormatter, prepareNumberUnitFormatter } from '../lib/i18n-number.js';
import { sanitize } from '../lib/i18n-sanitize.js';

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
const formatDatetime = prepareFormatDatetime(lang);
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
const formatBytes = prepareNumberBytesFormatter(lang, 'B', ' ');

const countryName = prepareCountryName(lang);

// Shared logic between translations, is it a good idea?
function formatFlavor (f) {
  const cpu = `CPUs: ${f.cpus}`;
  const shared = f.microservice ? ` (shared)` : '';
  const gpu = f.gpus > 0 ? `GPUs: ${f.gpus}` : '';
  const mem = `RAM: ${formatBytes(f.mem * 1024 * 1024)}`;
  return [cpu + shared, gpu, mem].filter((a) => a).join('\n');
}

export const translations = {
  LANGUAGE: '🇬🇧 English',
  // cc-addon-backups
  'cc-addon-backups.command-password': `This command will ask for your password, here it is:`,
  'cc-addon-backups.close-btn': `Close this panel`,
  'cc-addon-backups.delete': ({ createdAt }) => sanitize`Delete the backup from <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong>`,
  'cc-addon-backups.delete.btn': 'delete...',
  'cc-addon-backups.delete.with-service.title.es-addon': `Delete with Kibana`,
  'cc-addon-backups.delete.with-service.description.es-addon': ({ href }) => sanitize`You can delete this backup using Kibana by going to the <a href="${href}">backup repository</a>.`,
  'cc-addon-backups.delete.manual.title': `Delete manually`,
  'cc-addon-backups.delete.manual.description.es-addon': `You can delete this backup using cURL by executing this command:`,
  'cc-addon-backups.description.es-addon': `Backups are managed by Elasticsearch itself. You can define the retention period and backup frequency through Kibana's UI.`,
  'cc-addon-backups.description.es-addon-old': `Backups are managed by Elasticsearch itself. The version of your Elasticsearch does not allow to define a retention policy. Deleting a backup can be done manually through Elasticsearch's API.`,
  'cc-addon-backups.empty': `There are no backups yet.`,
  'cc-addon-backups.link.es-addon': `open in Kibana`,
  'cc-addon-backups.link.es-addon-old': `open in Elasticsearch`,
  'cc-addon-backups.loading-error': `Something went wrong while loading the backups.`,
  'cc-addon-backups.restore': ({ createdAt }) => sanitize`Restore the backup from <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong>`,
  'cc-addon-backups.restore.btn': 'restore...',
  'cc-addon-backups.restore.with-service.title.es-addon': `Restore with Kibana`,
  'cc-addon-backups.restore.with-service.description.es-addon': ({ href }) => sanitize`You can restore this backup using Kibana by going to the <a href="${href}">backup repository</a>.`,
  'cc-addon-backups.restore.manual.title': `Restore manually`,
  'cc-addon-backups.restore.manual.description.es-addon': `You can restore this backup using cURL by executing this command:`,
  'cc-addon-backups.text': ({ createdAt, expiresAt }) => sanitize`Backup from <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong> (expires on <strong>${formatDateOnly(expiresAt)}</strong>)`,
  'cc-addon-backups.text.user-defined-retention': ({ createdAt }) => sanitize`Backup from <strong title="${formatDate(createdAt)}">${formatDatetime(createdAt)}</strong> (expires after defined retention)`,
  'cc-addon-backups.title': `Backups`,
  // cc-addon-credentials
  'cc-addon-credentials.description.apm': `Use those credentials to connect an APM Server instance to your Elasticsearch cluster.`,
  'cc-addon-credentials.description.elasticsearch': `Use those credentials to connect to your Elasticsearch cluster.`,
  'cc-addon-credentials.description.kibana': `Use those credentials to connect a Kibana instance to your Elasticsearch cluster.`,
  'cc-addon-credentials.description.pulsar': `Use those information to connect your Pulsar add-on.`,
  'cc-addon-credentials.field.auth-token': `Authentication token`,
  'cc-addon-credentials.field.host': `Domain name`,
  'cc-addon-credentials.field.password': `Password`,
  'cc-addon-credentials.field.url': `URL`,
  'cc-addon-credentials.field.user': `User`,
  'cc-addon-credentials.loading-error': `Something went wrong while loading the credentials.`,
  'cc-addon-credentials.title': ({ name }) => `${name} credentials`,
  // cc-addon-elasticsearch-options
  'cc-addon-elasticsearch-options.title': `Options for the Elastic Stack`,
  'cc-addon-elasticsearch-options.description': () => sanitize`This add-on is part of the Elastic Stack offer which includes two options. Both these options will be deployed as applications, managed and updated by Clever Cloud on your behalf. They will appear as regular applications that you can stop, scale up or down automatically like one of your own applications. As such, <strong>enabling these options will result in an increase in credits consumption</strong> as well.`,
  'cc-addon-elasticsearch-options.description.kibana': () => sanitize`Kibana is the admin UI for the Elastic Stack. It lets you visualize your Elasticsearch data and navigate the stack so you can do anything from tracking query load to understanding the way requests flow through your apps. Learn more in the <a href="https://www.elastic.co/guide/en/kibana/master/index.html">official Kibana documentation</a>.`,
  'cc-addon-elasticsearch-options.description.apm': () => sanitize`Elastic APM server is an application performance monitoring system built on the Elastic Stack. Deploying this will allow you to automatically send APM metrics from any applications linked to the Elasticsearch add-on instance, providing you add the Elastic APM agent to the application code. Learn more in the <a href="https://www.elastic.co/guide/en/apm/get-started/current/overview.html">official APM server documentation</a>.`,
  'cc-addon-elasticsearch-options.warning.kibana': `If you enable this option, we'll deploy and manage a Kibana application for you, this will lead to additional costs.`,
  'cc-addon-elasticsearch-options.warning.kibana.details': (flavor) => sanitize`By default, the app will start on a <strong title="${formatFlavor(flavor)}">${flavor.name} instance</strong> which costs around <strong>${currencyFormatter.format(flavor.monthlyCost)} per month</strong>.`,
  'cc-addon-elasticsearch-options.warning.apm': `If you enable this option, we'll deploy and manage an Elastic APM server application for you, this will lead to additional costs.`,
  'cc-addon-elasticsearch-options.warning.apm.details': (flavor) => sanitize`By default, the app will start on a <strong title="${formatFlavor(flavor)}">${flavor.name} instance</strong> which costs around <strong>${currencyFormatter.format(flavor.monthlyCost)} per month</strong>.`,
  // cc-addon-encryption-at-rest-option
  'cc-addon-encryption-at-rest-option.description': () => sanitize`Encryption at rest encrypts the entire data disk of your add-on. It prevents reading the stored data in case of a physical access to the hard drive. More information in our <a href="https://www.clever-cloud.com/doc/administrate/encryption-at-rest/">documentation</a>.`,
  'cc-addon-encryption-at-rest-option.title': `Encryption at rest`,
  'cc-addon-encryption-at-rest-option.warning': ({ percent, price }) => sanitize`This option is currently free. In the future, it will be billed ${percentFormatter.format(percent)} of the plan price, which amounts to <strong>${currencyFormatter.format(price)} per month</strong> here.`,
  // cc-addon-features
  'cc-addon-features.details': `Here's the list of all the features of your add-on. Features may evolve and your add-on would need a migration to match them all.`,
  'cc-addon-features.feature-name.disk': `Disk`,
  'cc-addon-features.feature-name.memory': `Memory`,
  'cc-addon-features.feature-name.nodes': `Nodes`,
  'cc-addon-features.feature-value.dedicated': `Dedicated`,
  'cc-addon-features.feature-value.no': `No`,
  'cc-addon-features.feature-value.yes': `Yes`,
  'cc-addon-features.loading-error': `Something went wrong while loading add-on features.`,
  'cc-addon-features.title': `Features`,
  // cc-addon-jenkins-options
  'cc-addon-jenkins-options.description': `Choose the options you want for your Jenkins add-on.`,
  'cc-addon-jenkins-options.title': `Options for the Jenkins add-on`,
  // cc-addon-linked-apps
  'cc-addon-linked-apps.details': `Here's the list of applications linked to this add-on. The add-on exposes its environment variables to those linked applications.`,
  'cc-addon-linked-apps.loading-error': `Something went wrong while loading linked applications.`,
  'cc-addon-linked-apps.no-linked-applications': `No applications linked yet.`,
  'cc-addon-linked-apps.title': `Linked applications`,
  // cc-addon-mongodb-options
  'cc-addon-mongodb-options.description': `Choose the options you want for your MongoDB add-on.`,
  'cc-addon-mongodb-options.title': `Options for the MongoDB add-on`,
  // cc-addon-mysql-options
  'cc-addon-mysql-options.description': `Choose the options you want for your MySQL add-on.`,
  'cc-addon-mysql-options.title': `Options for the MySQL add-on`,
  // cc-addon-option
  'cc-addon-option.enabled': `Enabled`,
  'cc-addon-option.disabled': `Disabled`,
  // cc-addon-option-form
  'cc-addon-option-form.confirm': `Confirm options`,
  // cc-addon-postgresql-options
  'cc-addon-postgresql-options.description': `Choose the options you want for your PostgreSQL add-on.`,
  'cc-addon-postgresql-options.title': `Options for the PostgreSQL add-on`,
  // cc-addon-redis-options
  'cc-addon-redis-options.description': `Choose the options you want for your Redis add-on.`,
  'cc-addon-redis-options.title': `Options for the Redis add-on`,
  // cc-beta
  'cc-beta.label': `beta`,
  // cc-block
  'cc-block.toggle.open': `Open`,
  'cc-block.toggle.close': `Close`,
  // cc-button
  'cc-button.cancel': `Click to cancel`,
  // cc-datetime-relative
  'cc-datetime-relative.distance': ({ date }) => formatDistanceToNow(date),
  'cc-datetime-relative.title': ({ date }) => formatDate(date),
  // cc-elasticsearch-info
  'cc-elasticsearch-info.error': `Something went wrong while loading add-ons linked to this application.`,
  'cc-elasticsearch-info.info': `Info`,
  'cc-elasticsearch-info.link.apm': `Open APM`,
  'cc-elasticsearch-info.link.doc': `Read the documentation`,
  'cc-elasticsearch-info.link.elasticsearch': `Check out the Elasticsearch add-on`,
  'cc-elasticsearch-info.link.kibana': `Open Kibana`,
  'cc-elasticsearch-info.text': `This add-on is part of the Elastic Stack offer. You can find the documentation and linked services right below.`,
  // cc-error
  'cc-error.ok': `OK`,
  // cc-header-addon
  'cc-header-addon.plan': `Plan`,
  'cc-header-addon.version': `Version`,
  'cc-header-addon.creation-date': `Creation date`,
  'cc-header-addon.creation-date.short': ({ date }) => formatDateOnly(date),
  'cc-header-addon.creation-date.full': ({ date }) => formatDate(date),
  'cc-header-addon.error': `Something went wrong while loading add-on info.`,
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
  // cc-heptapod-info
  'cc-heptapod-info.private-active-users-description': `Private users`,
  'cc-heptapod-info.public-active-users-description': `Public users`,
  'cc-heptapod-info.storage-bytes': ({ storage }) => formatBytes(storage, 1),
  'cc-heptapod-info.storage-description': `Storage size`,
  'cc-heptapod-info.price-value': ({ price }) => `${currencyFormatter.format(price)} / month`,
  'cc-heptapod-info.price-description': `Estimated price`,
  'cc-heptapod-info.not-in-use': `You are not using this Heptapod service.`,
  'cc-heptapod-info.description': () => sanitize`This Heptapod instance hosts mercurial projects. Learn more on <a href="https://about.heptapod.host" rel="noreferrer noopener">https://about.heptapod.host</a>.`,
  'cc-heptapod-info.error-loading': `Something went wrong while loading usage info.`,
  // cc-invoice-list
  'cc-invoice-list.title': `Invoices`,
  'cc-invoice-list.error': `An error occured while loading invoices.`,
  'cc-invoice-list.pending': `Pending invoices`,
  'cc-invoice-list.pending.no-invoices': `No pending invoices at the moment.`,
  'cc-invoice-list.processed': `Paid invoices`,
  'cc-invoice-list.processed.no-invoices': `No paid invoices at the moment.`,
  'cc-invoice-list.processing': `Invoices awaiting payment validation`,
  'cc-invoice-list.year': `Year:`,
  // cc-invoice-table
  'cc-invoice-table.date.payment': `Payment date`,
  'cc-invoice-table.date.value': ({ date }) => `${formatDateOnly(date)}`,
  'cc-invoice-table.number': `Number`,
  'cc-invoice-table.open-pdf': `Download PDF`,
  'cc-invoice-table.pay': `Pay`,
  'cc-invoice-table.total.label': `Total`,
  'cc-invoice-table.total.value': ({ amount }) => `${currencyFormatter.format(amount)}`,
  // cc-addon-admin
  'cc-addon-admin.addon-name': `Add-on name`,
  'cc-addon-admin.admin': `Administration`,
  'cc-addon-admin.delete': `Delete the add-on`,
  'cc-addon-admin.danger-zone': `Danger zone`,
  'cc-addon-admin.delete-description': () => sanitize`Deleting this add-on will make it immediately unavailable.<br>The virtual machine will be stopped in 24 hours.<br>Backups will be kept according to the retention policy.`,
  'cc-addon-admin.error-loading': `Something went wrong while loading add-on info.`,
  'cc-addon-admin.error-saving': `An error occurred when saving your modifications.`,
  'cc-addon-admin.tags': `Tags`,
  'cc-addon-admin.tags-description': `Tags allow you to classify your applications and add-ons to create categories`,
  'cc-addon-admin.tags-empty': `No defined tags`,
  'cc-addon-admin.tags-update': `Update tags`,
  'cc-addon-admin.update': `Update name`,
  // cc-tcp-redirection
  'cc-tcp-redirection.create-button': `Create`,
  'cc-tcp-redirection.delete-button': `Delete`,
  'cc-tcp-redirection.retry-button': `Retry`,
  'cc-tcp-redirection.namespace-additionaldescription-cleverapps': () => sanitize`This namespace is used by all <em>cleverapps.io</em> domains (e.g. <em>my-app.cleverapps.io</em>).`,
  'cc-tcp-redirection.namespace-additionaldescription-default': () => sanitize`This namespace is used by all custom domains (e.g. <em>my-app.com</em>).`,
  'cc-tcp-redirection.namespace-private': `This is your private namespace.`,
  'cc-tcp-redirection.redirection-defined': ({ namespace, sourcePort }) => sanitize`This application has a redirection from port <code>${sourcePort}</code> to port <code>4040</code> in the <strong>${namespace}</strong> namespace.`,
  'cc-tcp-redirection.redirection-not-defined': ({ namespace }) => sanitize`You can create a redirection in the <strong>${namespace}</strong> namespace.`,
  'cc-tcp-redirection.error.redirection-defined': ({ namespace, sourcePort }) => sanitize`An error occurred while deleting the redirection from port <code>${sourcePort}</code> to port <code>4040</code> in the <strong>${namespace}</strong> namespace.`,
  'cc-tcp-redirection.error.redirection-not-defined': ({ namespace }) => sanitize`An error occured while creating a redirection in the <strong>${namespace}</strong> namespace.`,
  // cc-tcp-redirection-form
  'cc-tcp-redirection-form.description': () => sanitize`
    <p>
      A TCP redirection allows you to route external traffic to the <code>4040</code> port of the application via the load balancers.<br>
      You can create one TCP redirection per application for each namespace you have access to.
    </p>
    <p>
      A namespace is a group of load balancers: either the default public ones, cleverapps.io or dedicated ones if you are a Clever Cloud Premium customer.
    </p>
  `,
  'cc-tcp-redirection-form.empty': `You do not have access to any namespaces.`,
  'cc-tcp-redirection-form.error': `An error occured while loading TCP redirections.`,
  'cc-tcp-redirection-form.title': `TCP Redirections`,
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
  'cc-tile-requests.about-btn': `About this chart...`,
  'cc-tile-requests.close-btn': `Display chart`,
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
    return sanitize`HTTP requests received in the last 24 hours. Each bar represents a time window of <strong>${windowHours} ${hour}</strong>.`;
  },
  // cc-tile-scalability
  'cc-tile-scalability.title': `Scalability`,
  'cc-tile-scalability.size': `Size`,
  'cc-tile-scalability.number': `Number`,
  'cc-tile-scalability.flavor-info': (flavor) => formatFlavor(flavor),
  'cc-tile-scalability.error': `Something went wrong while loading scalability config.`,
  // cc-tile-status-codes
  'cc-tile-status-codes.title': `HTTP response codes`,
  'cc-tile-status-codes.about-btn': `About this chart...`,
  'cc-tile-status-codes.close-btn': `Display chart`,
  'cc-tile-status-codes.tooltip': ({ value, percent }) => {
    const request = plural('request')(value);
    const formattedValue = numberFormatter.format(value);
    return `${formattedValue} ${request} (${percentFormatter.format(percent)})`;
  },
  'cc-tile-status-codes.error': `Something went wrong while loading HTTP response codes.`,
  'cc-tile-status-codes.empty': `No data to display for now.`,
  'cc-tile-status-codes.docs.msg': `Repartition of HTTP response codes returned in the last 24 hours. Click on legend items to show/hide HTTP code categories.`,
  'cc-tile-status-codes.docs.link': () => sanitize`<a href="https://developer.mozilla.org/en/docs/Web/HTTP/Status">HTTP response status codes (MDN)</a>`,
  // cc-input-text
  'cc-input-text.clipboard': `Copy to clipboard`,
  'cc-input-text.secret.show': `Show secret`,
  'cc-input-text.secret.hide': `Hide secret`,
  // cc-logsmap
  'cc-logsmap.mode.points': `Realtime`,
  'cc-logsmap.mode.heatmap': `Last 24h`,
  'cc-logsmap.legend.points': ({ orgaName }) => sanitize`Realtime map of HTTP requests received by all apps from <strong>${orgaName}</strong>.`,
  'cc-logsmap.legend.points.app': ({ appName }) => sanitize`Realtime map of HTTP requests received by <strong>${appName}</strong>.`,
  'cc-logsmap.legend.heatmap': ({ orgaName }) => sanitize`Heatmap of HTTP requests received by all apps from <strong>${orgaName}</strong> during the last 24 hours.`,
  'cc-logsmap.legend.heatmap.app': ({ appName }) => sanitize`Heatmap of HTTP requests received by <strong>${appName}</strong> during the last 24 hours.`,
  // cc-map
  'cc-map.error': `Something went wrong while trying to fetch data for the map.`,
  'cc-map.no-points': `No data to display on the map right now.`,
  // env-var-create
  'cc-env-var-create.name.placeholder': `VARIABLE_NAME`,
  'cc-env-var-create.value.placeholder': `variable value`,
  'cc-env-var-create.create-button': `Add`,
  'cc-env-var-create.errors.invalid-name': ({ name }) => sanitize`Name <code>${name}</code> is invalid`,
  'cc-env-var-create.errors.already-defined-name': ({ name }) => sanitize`Name <code>${name}</code> is already defined`,
  // env-var-editor-simple
  'cc-env-var-editor-simple.empty-data': `There are no variables.`,
  // env-var-editor-expert
  'cc-env-var-editor-expert.placeholder': `VARIABLE_NAME="variable value"`,
  'cc-env-var-editor-expert.placeholder-readonly': `There are no variables.`,
  'cc-env-var-editor-expert.errors.unknown': `Unknown Error`,
  'cc-env-var-editor-expert.errors.line': `line`,
  'cc-env-var-editor-expert.errors.invalid-name': ({ name }) => sanitize`<code>${name}</code> is not a valid variable name`,
  'cc-env-var-editor-expert.errors.duplicated-name': ({ name }) => sanitize`be careful, the name <code>${name}</code> is already defined`,
  'cc-env-var-editor-expert.errors.invalid-line': () => sanitize`this line is not valid, the correct pattern is: <code>NAME="VALUE"</code>`,
  'cc-env-var-editor-expert.errors.invalid-value': () => sanitize`the value is not valid, if you use quotes, you need to escape them like this: <code>\\"</code> or quote the whole value.`,
  // env-var-linked-services
  'cc-env-var-linked-services.description.addon': ({ serviceName, appName }) => sanitize`List of variables exposed by the add-on <strong>${serviceName}</strong>.<br>Those variables will be injected as environment variables in the application <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.description.app': ({ serviceName, appName }) => sanitize`Configuration exposed by the application <strong>${serviceName}</strong>.<br>Those variables will be injected as environement variables in the application <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.empty.addon': ({ appName }) => sanitize`No add-ons linked to <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.empty.app': ({ appName }) => sanitize`No applications linked to <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.error.addon': ({ appName }) => sanitize`Something went wrong while loading add-ons linked to <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.error.app': ({ appName }) => sanitize`Something went wrong while loading applications linked to <strong>${appName}</strong>.`,
  'cc-env-var-linked-services.heading.addon': ({ name }) => `Add-on: ${name}`,
  'cc-env-var-linked-services.heading.app': ({ name }) => `Application: ${name}`,
  'cc-env-var-linked-services.loading.addon': ({ appName }) => sanitize`Loading variables exposed by add-ons linked to <strong>${appName}</strong>...`,
  'cc-env-var-linked-services.loading.app': ({ appName }) => sanitize`Loading configuration exposed by applications linked to <strong>${appName}</strong>...`,
  // env-var-form
  'cc-env-var-form.mode.simple': `Simple`,
  'cc-env-var-form.mode.expert': `Expert`,
  'cc-env-var-form.reset': `Reset changes`,
  'cc-env-var-form.restart-app': `Restart the app to apply changes`,
  'cc-env-var-form.update': `Update changes`,
  'cc-env-var-form.error.loading': `Something went wrong while loading variables.`,
  'cc-env-var-form.error.saving': `Something went wrong while updating variables.`,
  'cc-env-var-form.error.unknown': `Something went wrong...`,
  'cc-env-var-form.heading.env-var': `Environment variables`,
  'cc-env-var-form.heading.exposed-config': `Exposed configuration`,
  'cc-env-var-form.description.env-var': ({ appName }) => sanitize`List of environment variables that will be injected in the application <strong>${appName}</strong>. <a href="http://doc.clever-cloud.com/admin-console/environment-variables/">Learn more</a>`,
  'cc-env-var-form.description.exposed-config': ({ appName }) => sanitize`Configuration exposed to dependent applications.<br>Those variables won't be injected in the application <strong>${appName}</strong>, they will be injected as environment variables in applications that have <strong>${appName}</strong> in their service dependencies. <a href="https://www.clever-cloud.com/doc/admin-console/service-dependencies/">Learn more</a>`,
  // env-var-input
  'cc-env-var-input.delete-button': `Remove`,
  'cc-env-var-input.keep-button': `Keep`,
  'cc-env-var-input.value-placeholder': `variable value`,
  // cc-zone
  'cc-zone.country': ({ code, name }) => countryName({ code, name }),
  // cc-zone-input
  'cc-zone-input.error': `Something went wrong while loading zones.`,
  'cc-zone-input.private-map-warning': `Private zones don't appear on the map.`,
};
